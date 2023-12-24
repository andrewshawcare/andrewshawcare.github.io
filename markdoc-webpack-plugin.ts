import Markdoc from "@markdoc/markdoc";
import yaml from "js-yaml";
import isRelativeUrl from "is-relative-url"
import HtmlWebpackPlugin from "html-webpack-plugin";
import fs from "node:fs"
import path from "node:path";
import { Compiler, WebpackPluginInstance } from "webpack";
import { globSync } from "glob";

const transformRelativeMarkdownLinksIntoRelativeHtmlLinks = (node: Markdoc.Node) => {
    if (
        node.type === "link" &&
        typeof node.attributes.href === "string" &&
        isRelativeUrl(node.attributes.href)
    ) {
        node.attributes.href = node.attributes.href.replace(/\.md$/, ".html");
    }

    node.children.forEach(transformRelativeMarkdownLinksIntoRelativeHtmlLinks);
}

type Frontmatter = {
    layout?: any
};

const resolveFrontmatter = (markdocNode: Markdoc.Node): Frontmatter => {
    return (markdocNode.attributes.frontmatter)
        ? yaml.load(markdocNode.attributes.frontmatter) as Frontmatter
        : {};
}

interface MarkdocWebpackOptions {
    content: {
        dir: string,
        pattern: string
    },
    layout: {
        dir: string
        defaultName: string
        ext: string
    },
    markdocConfig: Markdoc.Config,
    htmlWebpackPluginOptions: HtmlWebpackPlugin.Options
};

export default class MarkdocWebpackPlugin implements WebpackPluginInstance {
    readonly name = "MarkdocWebpackPlugin";
    readonly htmlWebpackPlugins: Array<HtmlWebpackPlugin>;

    constructor(options: MarkdocWebpackOptions) {
        const contentPaths = globSync(options.content.pattern,{ cwd: options.content.dir })
            .map(pathOrString => pathOrString.toString());
        
        this.htmlWebpackPlugins = contentPaths.map(contentPath => {
            const resolvedContentPath = path.resolve(options.content.dir, contentPath)
            const content = fs.readFileSync(resolvedContentPath).toString("utf8");
            const markdocNode = Markdoc.parse(content);

            // TODO: Should this be a loader?
            transformRelativeMarkdownLinksIntoRelativeHtmlLinks(markdocNode);

            const renderableTreeNode = Markdoc.transform(markdocNode, options.markdocConfig);
            const renderedContent = Markdoc.renderers.html(renderableTreeNode);

            const filename = path.format({ ...path.parse(contentPath), base: undefined, ext: ".html" });
            
            const frontmatter = resolveFrontmatter(markdocNode);
            const template = path.format({
                dir: options.layout.dir,
                name: (typeof frontmatter.layout === "string") ? frontmatter.layout : options.layout.defaultName,
                ext: options.layout.ext
            });
            
            return new HtmlWebpackPlugin({
                ...options.htmlWebpackPluginOptions,
                filename,
                template,
                templateParameters: {
                    content: renderedContent
                }
            });
        })
    }
    
    apply(compiler: Compiler): void {
        this.htmlWebpackPlugins.map(
            htmlWebpackPlugin => htmlWebpackPlugin.apply(compiler)
        );
    };
}