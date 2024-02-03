import * as fs from "node:fs";
import * as Path from "node:path";
import { default as Markdoc } from "@markdoc/markdoc";
import * as ejs from "ejs";
import { transformConfig } from "./markdocConfig.js";
import { globSync } from "glob";
import isRelativeUrl from "is-relative-url";
import jsYaml from "js-yaml";
import { FormatInputPathObject } from "node:path";
import {
  default as frontmatterSchema,
  Schema as Frontmatter,
} from "./schemas/frontmatter.json.js";
import { Schema as Variables } from "./schemas/variables.json.js";
import { validateTypeUsingSchema } from "./validate-type-using-schema.js";

const getFrontmatter = (node: Markdoc.Node): Frontmatter => {
  const frontmatter = node.attributes.frontmatter || "";
  return validateTypeUsingSchema<Frontmatter>(
    jsYaml.load(frontmatter) || {},
    frontmatterSchema,
  );
};

const overwriteDirectory = ({
  srcDir,
  destDir,
}: {
  srcDir: string;
  destDir: string;
}) => {
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
  }
  fs.mkdirSync(outputPath);
  fs.cpSync(srcDir, destDir, { recursive: true });
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

const transformPath = ({
  path,
  transform,
}: {
  path: string;
  transform: FormatInputPathObject;
}) => {
  const parsedPath = Path.parse(path);
  return Path.format({ ...parsedPath, ...{ base: undefined }, ...transform });
};

const replaceAnchorTagHrefRelativeUrlExtension = ({
  tag,
  originalExtension,
  replacementExtension,
}: {
  tag: Markdoc.Tag;
  originalExtension: string;
  replacementExtension: string;
}) => {
  if (
    tag.name === "a" &&
    typeof tag.attributes.href === "string" &&
    isRelativeUrl(tag.attributes.href) &&
    Path.parse(tag.attributes.href).ext === originalExtension
  ) {
    tag.attributes.href = transformPath({
      path: tag.attributes.href,
      transform: { base: undefined, ext: replacementExtension },
    });
  }
};

const ensureDirectoryExists = (directory: string) => {
  if (directory.length > 0) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

const renderMiddleware = [];

const outputPath = Path.resolve("dist");
const staticPath = Path.resolve("static");
const contentPath = Path.resolve("content");
const layoutsPath = Path.resolve("templates", "layouts");

overwriteDirectory({ srcDir: staticPath, destDir: outputPath });

for (const markdocRelativeFilePath of globSync("**/*.md", {
  cwd: contentPath,
})) {
  const markdocFilePath = Path.resolve(contentPath, markdocRelativeFilePath);
  const content = fs.readFileSync(markdocFilePath).toString("utf8");
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

  // TODO: Make render plugin middleware
  if (Markdoc.Tag.isTag(renderNode)) {
    for (const visitingTag of walkTag(renderNode)) {
      replaceAnchorTagHrefRelativeUrlExtension({
        tag: visitingTag,
        originalExtension: ".md",
        replacementExtension: ".html",
      });
    }
  }

  const renderedContent = Markdoc.renderers.html(renderNode);

  const htmlFilePath = transformPath({
    path: markdocRelativeFilePath,
    transform: {
      dir: outputDir,
      ext: ".html",
    },
  });

  const layout = frontmatter.layout || "default";
  const template = fs
    .readFileSync(Path.resolve(layoutsPath, `${layout}.ejs`))
    .toString("utf8");

  fs.writeFileSync(
    htmlFilePath,
    ejs.compile(template)({ content: renderedContent }),
  );
}
