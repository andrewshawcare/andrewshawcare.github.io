import { default as Markdoc } from "@markdoc/markdoc";

export default {
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
};