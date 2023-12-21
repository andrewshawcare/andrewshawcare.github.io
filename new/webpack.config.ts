import Markdoc from "@markdoc/markdoc";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "node:path";
import fs from "node:fs"
import { Configuration, WebpackPluginInstance } from "webpack";
import yaml from "js-yaml";
import { glob } from "glob";
import markdocConfig from "./markdoc.config.js";

const plugins = new Array<WebpackPluginInstance>();

const defaultHtmlWebpackPluginOptions: HtmlWebpackPlugin.Options = {
    title: "Andrew Shaw Care",
    templateParameters: {
        content: ""
    },
    meta: {
        description: "The personal web site of Andrew Shaw Care",
        viewport: "width=device-width, initial-scale=1"
    },
    scriptLoading: "module",
    xhtml: true
};

const markdocFiles = await glob("**/*.md", { ignore: "node_modules/**" });

markdocFiles.forEach((markdocFile) => {
    const markdocContent = fs.readFileSync(markdocFile).toString("utf8");

    const markdocNode = Markdoc.parse(markdocContent);

    const frontmatter: Record<string, any> = (markdocNode.attributes.frontmatter)
        ? yaml.load(markdocNode.attributes.frontmatter) as Record<string, any>
        : {}
    
    const templateName = (frontmatter.template) ? frontmatter.template : "default";
    const template = `templates/${templateName}.html`;

    const transformedMarkdocNode = Markdoc.transform(markdocNode, markdocConfig);

    const htmlContent = Markdoc.renderers.html(transformedMarkdocNode);

    plugins.push(
        new HtmlWebpackPlugin({
            ...defaultHtmlWebpackPluginOptions,
            template,
            templateParameters: {
                content: htmlContent
            }
        })
    );
})
const configuration: Configuration = {
    mode: "none",
    entry: "./index.ts",
    resolve: {
        extensionAlias: {
            ".js": [".ts", ".js"]
        }
    },
    module: {
        rules: [
            {
                test: /.ts$/,
                use: 'ts-loader',
                exclude: '/node_modules/'
            },
            {
                test: /.css$/,
                use: 'css-loader',
                exclude: '/node_modules/'
            }
        ]
    },
    plugins,
    output: {
        filename: "index.js",
        path: path.resolve("dist")
    }
};

export default configuration;