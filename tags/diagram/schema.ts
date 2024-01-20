import * as fs from "node:fs";
import * as path from "node:path";
import { default as Markdoc, Node, Config } from "@markdoc/markdoc";
import * as mermaid from "@mermaid-js/mermaid-cli";
import { randomUUID } from "node:crypto";

const generateSequenceDiagram = async (
  { content, dir }: { content: string; dir: string } = { content: "", dir: "" },
) => {
  const inputMarkup = `sequenceDiagram
    ${content.split("\n").join("\n    ")}
`;

  const name = randomUUID();
  const inputPath = `${name}.mmd`;
  const outputPathObject = {
    dir,
    name,
    ext: ".svg",
  } as const satisfies path.FormatInputPathObject;

  fs.writeFileSync(inputPath, inputMarkup);

  try {
    await mermaid.run(
      inputPath,
      `${outputPathObject.dir}${path.sep}${outputPathObject.name}${outputPathObject.ext}`,
    );
  } finally {
    fs.rmSync(inputPath);
  }

  return path.format(outputPathObject);
};

export default {
  render: "img",
  attributes: {
    type: {
      type: String,
      default: "sequence",
      matches: ["sequence"],
    },
    title: {
      type: String,
    },
  },
  async transform(abstractSyntaxTreeNode: Node, transformConfig: Config) {
    const attributes =
      abstractSyntaxTreeNode.transformAttributes(transformConfig);
    const content = [];

    for (const childNode of abstractSyntaxTreeNode.walk()) {
      if (childNode.type === "text") {
        content.push(childNode.attributes.content);
      }
    }

    const outputPath = await generateSequenceDiagram({
      content: content.join("\n"),
      dir: transformConfig.variables?.outputDir || "",
    });

    return new Markdoc.Tag("img", {
      src: path.parse(outputPath).base,
      alt: attributes.title,
    });
  },
};
