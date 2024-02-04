import { Config } from "@markdoc/markdoc";
import diagram from "./tags/diagram/schema.js";
import { tableOfContentsSchema } from "./tags/table-of-contents/schema.js";

export const transformConfig: Config = {
  tags: {
    diagram,
    "table-of-contents": tableOfContentsSchema,
  },
};
