import * as fs from "node:fs";
import * as path from "node:path";
import { default as Markdoc } from "@markdoc/markdoc";
import * as ejs from "ejs";
import diagram from "./tags/diagram/schema.js";
import { globSync } from "glob";
import isRelativeUrl from "is-relative-url";

const transformConfig = {
  tags: {
    diagram,
  },
};

/** @type {(renderTemplateParameters: RenderTemplateParameters) => string} */
const renderTemplate = ({
  content,
  templatePath,
}: {
  content: string;
  templatePath: string;
}) => {
  const template = fs.readFileSync(templatePath).toString("utf8");
  return ejs.compile(template)({ content });
};

const outputPath = path.resolve("dist");
const staticPath = path.resolve("static");

if (fs.existsSync(outputPath)) {
  fs.rmSync(outputPath, { recursive: true, force: true });
}
fs.mkdirSync(outputPath);
fs.cpSync(staticPath, outputPath, { recursive: true });

const contentPath = path.resolve("content");
const markdocFilePaths = globSync("**/*.md", { cwd: contentPath });

for (const markdocFilePath of markdocFilePaths) {
  const content = fs
    .readFileSync(path.resolve(contentPath, markdocFilePath))
    .toString("utf8");
  const abstractSyntaxTreeNode = Markdoc.parse(content);

  for (const node of abstractSyntaxTreeNode.walk()) {
    if (
      node.type === "link" &&
      typeof node.attributes.href === "string" &&
      isRelativeUrl(node.attributes.href)
    ) {
      node.attributes.href = node.attributes.href.replace(/\.md$/, ".html");
    }
  }

  const markdocFileParsedPath = path.parse(markdocFilePath);
  const outputDir = path.resolve(outputPath, markdocFileParsedPath.dir);
  if (outputDir.length > 0) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const renderableTreeNode = await Markdoc.transform(abstractSyntaxTreeNode, {
    ...transformConfig,
    variables: {
      cwd: outputDir,
    },
  });
  const renderedContent = Markdoc.renderers.html(renderableTreeNode);
  const htmlFileParsedPath = {
    ...markdocFileParsedPath,
    dir: outputDir,
    base: undefined,
    ext: ".html",
  };

  fs.writeFileSync(
    path.format(htmlFileParsedPath),
    renderTemplate({
      content: renderedContent,
      templatePath: path.resolve("templates", "layouts", "default.ejs"),
    }),
  );
}
