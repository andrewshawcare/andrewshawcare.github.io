import Markdoc, { Schema } from "@markdoc/markdoc";

const schema: Schema = {
    children: ["inline"],
    attributes: {
        speaker: { type: String, required: true },
    },
    transform(node, config) {
        const attributes = node.transformAttributes(config);
        const children = node.transformChildren(config);

        const speakerTag = new Markdoc.Tag("span", { class: "speaker" }, [
            attributes.speaker,
        ]);

        return new Markdoc.Tag("p", {}, [speakerTag, ...children]);
    },
};

export default schema;