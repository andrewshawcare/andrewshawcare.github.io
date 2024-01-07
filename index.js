/**
 * @typedef {import("node:fs").PathLike} PathLike
 */

import fs from "node:fs";
import path from "node:path";
import { default as Markdoc } from "@markdoc/markdoc";
import ejs from "ejs"
import diagram from "./tags/diagram/schema.js";
import { globSync } from "glob";
import isRelativeUrl from "is-relative-url"

const transformConfig = {
    tags: {
        diagram
    }
};

/**
 * @typedef {Object} RenderTemplateParameters
 * @property {PathLike} templatePath
 * @property {string} content
 */


/** @type {(renderTemplateParameters: RenderTemplateParameters) => string} */
const renderTemplate = ({content, templatePath}) => {
    const template = fs.readFileSync(templatePath).toString("utf8");
    return ejs.compile(template)({ content });
};

const distPath = path.resolve("dist");
const staticPath = path.resolve("static");

if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true })
}
fs.mkdirSync(distPath);
fs.cpSync(staticPath, distPath, {recursive: true});

// loop through content
const contentPath = path.resolve("content");
const markdocFilePaths = globSync("**/*.md", {cwd: contentPath});

for (const markdocFilePath of markdocFilePaths) {
    const content = fs.readFileSync(path.resolve(contentPath, markdocFilePath)).toString("utf8");
    const abstractSyntaxTreeNode = Markdoc.parse(content);

    for (const node of abstractSyntaxTreeNode.walk()) {
        if (
            node.type === "link" &&
            typeof node.attributes.href === "string" &&
            isRelativeUrl(node.attributes.href)
        ) {
            node.attributes.href = node.attributes.href.replace(/\.md$/, ".html");
        }
    }

    const renderableTreeNode = Markdoc.transform(abstractSyntaxTreeNode, transformConfig);
    const renderedContent = Markdoc.renderers.html(renderableTreeNode);
    const parsedMarkdocFilePath = path.parse(markdocFilePath)
    const parsedHtmlFilePath = {
        ...parsedMarkdocFilePath,
        dir: path.resolve(distPath, parsedMarkdocFilePath.dir),
        base: undefined,
        ext: ".html"
    };
    
    if (parsedHtmlFilePath.dir.length > 0) {
        fs.mkdirSync(parsedHtmlFilePath.dir, { recursive: true });
    }
    
    fs.writeFileSync(
        path.format(parsedHtmlFilePath),
        renderTemplate({
            content: renderedContent,
            templatePath: path.resolve("templates", "layouts", "default.ejs")
        })
    );
}