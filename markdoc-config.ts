import { Config } from "@markdoc/markdoc";
import HeadingNode from "./nodes/heading/schema.js";
import DiagramTag from "./tags/diagram/schema.js";
import TableOfContentsTag from "./tags/table-of-contents/schema.js";
import HtmlTagTag from "./tags/html-tag/schema.js";
import BreadCrumbNavigationTag from "./tags/breadcrumb-navigation/schema.js";

const config: Config = {
  nodes: {
    heading: HeadingNode,
  },
  tags: {
    diagram: DiagramTag,
    "table-of-contents": TableOfContentsTag,
    "html-tag": HtmlTagTag,
    "breadcrumb-navigation": BreadCrumbNavigationTag,
  },
};

export default config;
