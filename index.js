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
const html = Markdoc.renderers.html(renderableTreeNode);

mkdirSync("dist");
fs.writeFileSync(path.resolve("dist", "index.html"), html);