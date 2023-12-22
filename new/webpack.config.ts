import Markdoc from "@markdoc/markdoc";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "node:path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import fs from "node:fs"
import { Configuration, WebpackPluginInstance } from "webpack";
import yaml from "js-yaml";
import { glob } from "glob";
import markdocConfig from "./markdoc.config.js";

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

const buildMarkdocPlugin = (markdocFile: string) => {
    const markdocContent = fs.readFileSync(markdocFile).toString("utf8");
    const markdocNode = Markdoc.parse(markdocContent);
    const renderableTreeNode = Markdoc.transform(markdocNode, markdocConfig);
    const htmlContent = Markdoc.renderers.html(renderableTreeNode);

    const frontmatter: Record<string, any> = (markdocNode.attributes.frontmatter)
        ? yaml.load(markdocNode.attributes.frontmatter) as Record<string, any>
        : {};

    const defaultTemplateName = "default";
    const templateName = (typeof frontmatter.layout === "string") ? frontmatter.layout : defaultTemplateName;
    const templateExtension = "html";
    const templateFile = `${templateName}.${templateExtension}`;
    const templatePath = path.join("templates", "layouts");
    const template = path.join(templatePath, templateFile);
    
    return new HtmlWebpackPlugin({
        ...defaultHtmlWebpackPluginOptions,
        template,
        templateParameters: {
            content: htmlContent
        }
    });
}

const markdocFiles = await glob("**/*.md", { ignore: "node_modules/**" });

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
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
                exclude: '/node_modules/'
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin(),
        ...markdocFiles.map(buildMarkdocPlugin)
    ],
    output: {
        filename: "index.js",
        path: path.resolve("dist")
    }
};

export default configuration;