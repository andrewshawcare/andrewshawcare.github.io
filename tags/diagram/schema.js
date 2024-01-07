import fs from "node:fs";
import path from "node:path";
import { default as Markdoc } from "@markdoc/markdoc";
import * as mermaid from "@mermaid-js/mermaid-cli"
import { randomUUID } from "node:crypto";

const generateSequenceDiagram = async ({ content, cwd }) => {
    const inputMarkup = `sequenceDiagram
    ${content.split("\n").join("\n    ")}
`;

    const name = randomUUID();
    const inputPath = `${name}.mmd`;
    const outputPath = path.format({dir: cwd, name: `${name}.svg`});

    fs.writeFileSync(inputPath, inputMarkup);
    await mermaid.run(inputPath, outputPath);
    fs.rmSync(inputPath);

    return outputPath;
};

export default {
    render: "img",
    attributes: {
        type: {
            type: String,
            default: "sequence",
            matches: ["sequence"]
        },
        title: {
            type: String
        }
    },
    async transform(abstractSyntaxTreeNode, transformConfig) {
        const attributes = abstractSyntaxTreeNode.transformAttributes(transformConfig);
        const content = [];

        for (const childNode of abstractSyntaxTreeNode.walk()) {
            if (childNode.type === "text") {
                content.push(childNode.attributes.content);
            }
        }
        
        const outputPath = await generateSequenceDiagram({
            content: content.join("\n"),
            cwd: transformConfig.variables.cwd
        });
        
        return new Markdoc.Tag(
            "img",
            { src: path.parse(outputPath).base, alt: attributes.title }
        );
    }
};