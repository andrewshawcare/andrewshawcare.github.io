import Path from "node:path";
import FileSystem from "node:fs";
import Markdoc, { Tag } from "@markdoc/markdoc";
import EJS from "ejs";
import JSYAML from "js-yaml";

import { globSync } from "glob";
import { transformConfig } from "./markdoc-config.js";
import {
  default as frontmatterSchema,
  Schema as Frontmatter,
} from "./schemas/frontmatter.json.js";
import { Schema as Variables } from "./schemas/variables.json.js";
import { validateTypeUsingSchema } from "./validate-type-using-schema.js";
import { Module } from "./middleware/module.js";
import { transformPath } from "./transform-path.js";

const getFrontmatter = (node: Markdoc.Node): Frontmatter => {
  const frontmatter = node.attributes.frontmatter || "";
  return validateTypeUsingSchema<Frontmatter>(
    JSYAML.load(frontmatter) || {},
    frontmatterSchema,
  );
};

const ensureDirectoryExists = (directory: string) => {
  if (directory.length > 0) {
    FileSystem.mkdirSync(directory, { recursive: true });
  }
};

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

export const compileMarkdocDocuments = async ({
  outputPath,
  contentPath,
  layoutsPath,
  layoutsDefault,
  renderMiddleware,
}: {
  outputPath: string;
  contentPath: string;
  layoutsPath: string;
  layoutsDefault: string;
  renderMiddleware: Module<Tag>[];
}) => {
  for (const markdocRelativeFilePath of globSync("**/*.md", {
    cwd: contentPath,
  })) {
    const markdocFilePath = Path.resolve(contentPath, markdocRelativeFilePath);
    const content = FileSystem.readFileSync(markdocFilePath).toString("utf8");
    const node = Markdoc.parse(content);

    const frontmatter = getFrontmatter(node);
    const markdocRelativeDir = Path.parse(markdocRelativeFilePath).dir;
    const contentDir = Path.resolve(contentPath, markdocRelativeDir);
    const outputDir = Path.resolve(outputPath, markdocRelativeDir);

    ensureDirectoryExists(outputDir);

    const renderNode = await Markdoc.transform(node, {
      ...transformConfig,
      variables: {
        frontmatter,
        contentDir,
        outputDir,
      } satisfies Variables,
    });

    if (Markdoc.Tag.isTag(renderNode)) {
      for (const tag of walkTag(renderNode)) {
        for (const renderMiddlewareModule of renderMiddleware) {
          await renderMiddlewareModule.process(tag);
        }
      }
    }

    const renderedContent = Markdoc.renderers.html(renderNode);

    const htmlFilePath = transformPath({
      path: markdocRelativeFilePath,
      transform: { dir: outputDir, ext: ".html" },
    });

    const layout = frontmatter.layout || layoutsDefault;
    const template = FileSystem.readFileSync(
      Path.resolve(layoutsPath, `${layout}.ejs`),
    ).toString("utf8");

    FileSystem.writeFileSync(
      htmlFilePath,
      EJS.compile(template)({ content: renderedContent }),
    );
  }
};
