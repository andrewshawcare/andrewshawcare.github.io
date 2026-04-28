import Markdoc, { Schema } from "@markdoc/markdoc";

const schema: Schema = {
    render: "div",
    attributes: {
        class: { type: String, default: "dialogue" },
    },
    transform(node, config) {
        const attributes = node.transformAttributes(config);
        const children = node.transformChildren(config);

        return new Markdoc.Tag("div", { class: attributes.class }, children);
    },
};

export default schema;