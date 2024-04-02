import Markdoc, { Schema } from "@markdoc/markdoc";

const schema: Schema = {
  attributes: {
    name: { type: String, required: true },
    attrs: { type: Object },
  },
  transform(node: Markdoc.Node, config: Markdoc.Config) {
    const { name, attrs } = node.attributes;
    const children = node.transformChildren(config);
    return new Markdoc.Tag(name, attrs, children);
  },
};

export default schema;
