import Markdoc, { Schema } from "@markdoc/markdoc";
import fs from "node:fs";
import path from "node:path";
import JsYaml from "js-yaml";

const tableOfContentsSchema: Schema = {
  render: "ol",
  attributes: {
    type: {
      type: String,
      default: "articles",
      matches: ["anthologies", "articles", "sections", "headings"],
    },
  },
  transform(node, config) {
    const attributes = node.transformAttributes(config);
    const orderedListTag = new Markdoc.Tag("ol");

    // TODO: Make this a schema validation
    if (typeof config.variables?.contentDir !== "string") {
      return orderedListTag;
    }

    switch (attributes.type) {
      case "anthologies":
        break;
      case "articles":
        break;
      case "sections":
        break;
      case "headings":
        break;
    }

    const contentDir = config.variables.contentDir;

    const articleFilenames = fs
      .readdirSync(contentDir)
      .filter((filename) => filename.match(/^\d+-.*.md$/));

    orderedListTag.children = articleFilenames.map((articleFilename) => {
      const listItemTag = new Markdoc.Tag("li");

      const anchorTag = new Markdoc.Tag("a");
      anchorTag.attributes["href"] = articleFilename.replace(/\.md$/, ".html");

      const articleContents = fs
        .readFileSync(path.resolve(contentDir, articleFilename))
        .toString("utf8");
      const articleNode = Markdoc.parse(articleContents);

      const frontmatter = JsYaml.load(articleNode.attributes.frontmatter);
      // TODO: Make a type guard function using schema
      if (
        typeof frontmatter === "object" &&
        frontmatter !== null &&
        "title" in frontmatter &&
        typeof frontmatter.title === "string"
      ) {
        anchorTag.children.push(frontmatter.title || articleFilename);
      }

      listItemTag.children.push(anchorTag);

      return listItemTag;
    });

    return orderedListTag;
  },
};

export { tableOfContentsSchema };
