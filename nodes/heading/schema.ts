import Markdoc, { Schema } from "@markdoc/markdoc";
import slugify from "slugify";

const schema: Schema = {
  children: ["inline"],
  attributes: {
    id: { type: String },
    level: { type: Number, required: true, default: 1 },
  },
  transform(node, config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);

    const concatenatedChildStrings = children
      .filter((child) => typeof child === "string")
      .join("-");
    const id = slugify(concatenatedChildStrings, { lower: true });

    return new Markdoc.Tag(
      `h${node.attributes["level"]}`,
      { ...attributes, id },
      children,
    );
  },
};

export default schema;
