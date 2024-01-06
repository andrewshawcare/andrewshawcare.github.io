import fs, { mkdirSync } from "node:fs";
import path from "node:path";
import { default as Markdoc } from "@markdoc/markdoc";

const content = `
Hello, world!

{% diagram type="sequence" title="Alphabet soup!" %}
a --> b
b --> c

c --> d
{% /diagram %}
`;

const transformConfig = {
    tags: {
        diagram: {
            render: "diagram",
            transform: (abstractSyntaxTreeNode, transformConfig) => {
                const attributes = abstractSyntaxTreeNode.transformAttributes(transformConfig);
                const content = [];
                for (const childNode of abstractSyntaxTreeNode.walk()) {
                    if (childNode.type === "text") {
                        content.push(childNode.attributes.content + "\n");
                    }
                }
                return new Markdoc.Tag("diagram", attributes, content);
            }
        }
    }
};

const abstractSyntaxTreeNode = Markdoc.parse(content);
const renderableTreeNode = Markdoc.transform(abstractSyntaxTreeNode, transformConfig)
const renderedContent = Markdoc.renderers.html(renderableTreeNode);

const template = fs.readFileSync(path.resolve("static", "index.html")).toString("utf8");

if (!fs.existsSync("dist")) {
    fs.mkdirSync("dist");
}

fs.copyFileSync(path.resolve("static", "index.css"), path.resolve("dist", "index.css"));
fs.copyFileSync(path.resolve("static", "index.js"), path.resolve("dist", "index.js"));
fs.writeFileSync(path.resolve("dist", "index.html"), template.replace(/{{ CONTENT }}/, renderedContent));