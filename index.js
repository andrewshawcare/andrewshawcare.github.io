import fs from "node:fs";
import path from "node:path";
import { default as Markdoc } from "@markdoc/markdoc";
import ejs from "ejs"

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

const template = fs.readFileSync(path.resolve("templates", "layouts", "default.ejs")).toString("utf8");
const compiledTemplate = ejs.compile(template);

if (!fs.existsSync("dist")) {
    fs.mkdirSync("dist");
}

fs.cpSync(path.resolve("static"), path.resolve("dist"), {recursive: true});

// loop through content
const content = `
Hello, world!

{% diagram type="sequence" title="Alphabet soup!" %}
a --> b
b --> c

c --> d
{% /diagram %}
`;
const abstractSyntaxTreeNode = Markdoc.parse(content);
const renderableTreeNode = Markdoc.transform(abstractSyntaxTreeNode, transformConfig)
const renderedContent = Markdoc.renderers.html(renderableTreeNode);
fs.writeFileSync(path.resolve("dist", "index.html"), compiledTemplate({content: renderedContent}));