import Markdoc, { Schema, Tag } from "@markdoc/markdoc";
import FileSystem from "node:fs";
import Path from "node:path";
import JSYAML from "js-yaml";
import { validateTypeUsingSchema } from "../../validate-type-using-schema.js";
import {
  default as variablesSchema,
  Schema as Variables,
} from "../../schemas/variables.json.js";
import { getDirectories } from "../../file-system-utilities.js";

const addAnthologies = ({
  variables,
  orderedListTag,
}: {
  variables: Variables;
  orderedListTag: Tag;
}) => {
  const anthologyDirs = getDirectories(variables.contentDir);

  orderedListTag.children = anthologyDirs.map((anthologyDir) => {
    const listItemTag = new Markdoc.Tag("li");

    const anchorTag = new Markdoc.Tag("a");
    anchorTag.attributes["href"] = anthologyDir;

    const articleContents = FileSystem.readFileSync(
      Path.resolve(variables.contentDir, anthologyDir, "index.md"),
    ).toString("utf8");
    const articleNode = Markdoc.parse(articleContents);

    const frontmatter = JSYAML.load(articleNode.attributes.frontmatter);
    // TODO: Make a type guard function using schema
    if (
      typeof frontmatter === "object" &&
      frontmatter !== null &&
      "title" in frontmatter &&
      typeof frontmatter.title === "string"
    ) {
      anchorTag.children.push(frontmatter.title || anthologyDir);
    }

    listItemTag.children.push(anchorTag);

    return listItemTag;
  });
};

const addArticles = ({
  variables,
  orderedListTag,
}: {
  variables: Variables;
  orderedListTag: Tag;
}) => {
  const articleFilenames = FileSystem.readdirSync(variables.contentDir).filter(
    (filename) => filename.match(/^\d+-.*.md$/),
  );

  orderedListTag.children = articleFilenames.map((articleFilename) => {
    const listItemTag = new Markdoc.Tag("li");

    const anchorTag = new Markdoc.Tag("a");
    anchorTag.attributes["href"] = articleFilename.replace(/\.md$/, ".html");

    const articleContents = FileSystem.readFileSync(
      Path.resolve(variables.contentDir, articleFilename),
    ).toString("utf8");
    const articleNode = Markdoc.parse(articleContents);

    const frontmatter = JSYAML.load(articleNode.attributes.frontmatter);
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
};

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
    // TODO: Add the guard to the code-generated type
    const variables = validateTypeUsingSchema<Variables>(
      config.variables,
      variablesSchema,
    );

    const attributes = node.transformAttributes(config);

    const orderedListTag = new Markdoc.Tag("ol");

    switch (attributes.type) {
      case "anthologies":
        addAnthologies({ variables, orderedListTag });
        break;
      case "articles":
        addArticles({ variables, orderedListTag });
        break;
      case "sections":
        break;
      case "headings":
        break;
    }

    return orderedListTag;
  },
};

export { tableOfContentsSchema };
