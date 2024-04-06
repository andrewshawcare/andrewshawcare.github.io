import * as fs from "node:fs";
import * as path from "node:path";
import { default as Markdoc, Node, Config, Schema } from "@markdoc/markdoc";
import * as mermaid from "@mermaid-js/mermaid-cli";
import {
  default as variablesSchema,
  Schema as Variables,
} from "../../schemas/variables.json.js";
import { validateTypeUsingSchema } from "../../validate-type-using-schema.js";
import slugify from "slugify";

const generateSequenceDiagram = async (
  { name, content, dir }: { name: string; content: string; dir: string } = {
    name: "",
    content: "",
    dir: "",
  },
) => {
  const inputMarkup = `sequenceDiagram
    ${content.split("\n").join("\n    ")}
`;
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
      {
        puppeteerConfig: {
          headless: "new",
        },
      },
    );
  } finally {
    fs.rmSync(inputPath);
  }

  return path.format(outputPathObject);
};

const schema: Schema = {
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
  async transform(node: Node, config: Config) {
    const variables = validateTypeUsingSchema<Variables>(
      config.variables,
      variablesSchema,
    );

    const attributes = node.transformAttributes(config);
    const content = [];

    for (const childNode of node.walk()) {
      if (childNode.type === "text") {
        content.push(childNode.attributes.content);
      }
    }

    const destinationPath = await generateSequenceDiagram({
      name: slugify(attributes.title, { lower: true }),
      content: content.join("\n"),
      dir: variables.destinationDirectory,
    });

    return new Markdoc.Tag("img", {
      src: path.parse(destinationPath).base,
      alt: attributes.title,
    });
  },
};

export default schema;
