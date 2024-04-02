import Markdoc, {
  RenderableTreeNode,
  Schema,
  SchemaAttribute,
} from "@markdoc/markdoc";

const generateId = (
  children: RenderableTreeNode[],
  attributes: Record<string, SchemaAttribute>,
) => {
  if (attributes.id && typeof attributes.id === "string") {
    return attributes.id;
  }

  return children
    .filter((child) => typeof child === "string")
    .join(" ")
    .replace(/[?]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
};

const schema: Schema = {
  children: ["inline"],
  attributes: {
    id: { type: String },
    level: { type: Number, required: true, default: 1 },
  },
  transform(node, config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);

    const id = generateId(children, attributes);

    return new Markdoc.Tag(
      `h${node.attributes["level"]}`,
      { ...attributes, id },
      children,
    );
  },
};

export default schema;
