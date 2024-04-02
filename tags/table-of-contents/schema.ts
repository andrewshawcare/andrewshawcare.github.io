import Markdoc, { RenderableTreeNode, Schema, Tag } from "@markdoc/markdoc";
import FileSystem from "node:fs";
import Path from "node:path";
import JSYAML from "js-yaml";
import { validateTypeUsingSchema } from "../../validate-type-using-schema.js";
import {
  default as variablesSchema,
  Schema as Variables,
} from "../../schemas/variables.json.js";
import {
  default as frontmatterSchema,
  Schema as Frontmatter,
} from "../../schemas/frontmatter.json.js";

type Anchor = {
  href: string;
  title: string;
};

const getDirectories = (path: string) =>
  FileSystem.readdirSync(path, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const walkTag = function* (
  tag: Markdoc.Tag,
): Generator<Markdoc.Tag, void, undefined> {
  for (const childTag of [...tag.children]) {
    if (Markdoc.Tag.isTag(childTag)) {
      yield childTag;
      yield* walkTag(childTag);
    }
  }
};

const schema: Schema = {
  render: "section",
  attributes: {
    type: {
      type: String,
      default: "headings",
      matches: ["anthologies", "articles", "headings"],
    },
  },
  transform(node, config) {
    const variables = validateTypeUsingSchema<Variables>(
      config.variables,
      variablesSchema,
    );

    const { sourceDirectory, filename } = variables;

    const attributes = node.transformAttributes(config);

    const orderedListTag = new Markdoc.Tag("ol");

    switch (attributes.type) {
      case "anthologies":
        const anthologyDirs = getDirectories(sourceDirectory);
        orderedListTag.children = anthologyDirs
          .map((anthologyDir): Anchor => {
            const articleContents = FileSystem.readFileSync(
              Path.resolve(sourceDirectory, anthologyDir, "index.md"),
            ).toString("utf8");

            const articleNode = Markdoc.parse(articleContents);

            const frontmatter = validateTypeUsingSchema<Frontmatter>(
              JSYAML.load(articleNode.attributes.frontmatter),
              frontmatterSchema,
            );

            return {
              href: `${anthologyDir}/index.html`,
              title: frontmatter.title || "",
            };
          })
          .map((anchor): Tag<"li"> => {
            const listItemTag = new Markdoc.Tag("li");

            const anchorTag = new Markdoc.Tag("a");
            anchorTag.attributes.href = anchor.href;
            anchorTag.children.push(anchor.title);
            listItemTag.children.push(anchorTag);

            return listItemTag;
          });
        break;

      case "articles":
        const articleFilenames = FileSystem.readdirSync(sourceDirectory).filter(
          (filename) => filename.match(/^\d+-.*.md$/),
        );

        orderedListTag.children = articleFilenames
          .map((articleFilename): Anchor => {
            const articleContents = FileSystem.readFileSync(
              Path.resolve(sourceDirectory, articleFilename),
            ).toString("utf8");

            const articleNode = Markdoc.parse(articleContents);

            const frontmatter = validateTypeUsingSchema<Frontmatter>(
              JSYAML.load(articleNode.attributes.frontmatter),
              frontmatterSchema,
            );

            return {
              href: articleFilename.replace(/\.md$/, ".html"),
              title: frontmatter.title || "",
            };
          })
          .map((anchor): Tag<"li"> => {
            const listItemTag = new Markdoc.Tag("li");

            const anchorTag = new Markdoc.Tag("a");
            anchorTag.attributes.href = anchor.href;
            anchorTag.children.push(anchor.title);
            listItemTag.children.push(anchorTag);

            return listItemTag;
          });
        break;

      case "headings":
        const articleContents = FileSystem.readFileSync(
          Path.resolve(sourceDirectory, filename),
        ).toString("utf8");

        const articleNode = Markdoc.parse(articleContents);
        const articleRenderableTreeNode: RenderableTreeNode = Markdoc.transform(
          articleNode,
          config,
        );

        if (Markdoc.Tag.isTag(articleRenderableTreeNode)) {
          const anchors: Anchor[] = [];
          for (const tag of walkTag(articleRenderableTreeNode)) {
            if (
              !/h[1-6]/.test(tag.name) ||
              typeof tag.attributes.id !== "string"
            ) {
              continue;
            }

            const title = tag.children.find(
              (child) => typeof child === "string",
            );

            anchors.push({
              href: `#${tag.attributes.id}`,
              title: title?.toString() || "",
            });

            orderedListTag.children = anchors.map((anchor): Tag<"li"> => {
              const listItemTag = new Markdoc.Tag("li");

              const anchorTag = new Markdoc.Tag("a");
              anchorTag.attributes.href = anchor.href;
              anchorTag.children.push(anchor.title);
              listItemTag.children.push(anchorTag);

              return listItemTag;
            });
          }
        }
        break;
    }

    return orderedListTag;
  },
};

export default schema;
