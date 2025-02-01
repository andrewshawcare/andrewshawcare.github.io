import Path from "node:path";
import FileSystem from "node:fs";
import Markdoc, { Tag } from "@markdoc/markdoc";
import JSYAML, { Mark } from "js-yaml";
import { Parser } from "htmlparser2";
import { globSync } from "glob";
import markdocConfig from "../markdoc-config.js";
import {
  default as frontmatterSchema,
  Schema as Frontmatter,
} from "../schemas/frontmatter.json.js";
import { Schema as Variables } from "../schemas/variables.json.js";
import { validateTypeUsingSchema } from "../validate-type-using-schema.js";
import { Processor } from "../middleware/processor.js";
import { transformPath } from "./transform-path.js";
import { Token } from "markdown-it";

// TODO: Figure out different type to use instead of Token[]
function transformNativeHtmlTagsIntoMarkdocHtmlTags(tokens: Token[]) {
  const processedTokens = [];

  const parser = new Parser({
    onopentag(name, attribs) {
      processedTokens.push({
        type: "tag_open",
        nesting: 1,
        meta: {
          tag: "html-tag",
          attributes: [
            { type: "attribute", name: "name", value: name },
            { type: "attribute", name: "attrs", value: attribs },
          ],
        },
      });
    },

    ontext(content) {
      if (typeof content === "string" && content.trim().length > 0) {
        processedTokens.push({
          type: "text",
          content,
        });
      }
    },

    onclosetag() {
      processedTokens.push({
        type: "tag_close",
        nesting: -1,
        meta: { tag: "html-tag" },
      });
    },
  });

  for (const token of tokens) {
    if (token.type.startsWith("html")) {
      parser.write(token.content);
      continue;
    }

    if (token.type === "inline") {
      token.children = transformNativeHtmlTagsIntoMarkdocHtmlTags(
        token.children || [],
      );
    }

    processedTokens.push(token);
  }

  return processedTokens;
}

const parseMarkdocWithHtml = (content: string) => {
  const tokenizer = new Markdoc.Tokenizer({ html: true });
  const tokens = tokenizer.tokenize(content);
  const transformedTokens = transformNativeHtmlTagsIntoMarkdocHtmlTags(tokens);
  const [node] = Markdoc.parse(transformedTokens).children;
  return node;
};

const ensureDirectoryExists = (directory: string) => {
  if (directory.length > 0) {
    FileSystem.mkdirSync(directory, { recursive: true });
  }
};

const getFrontmatter = (node: Markdoc.Node): Frontmatter => {
  const frontmatter = node.attributes.frontmatter || "";
  return validateTypeUsingSchema<Frontmatter>(
    JSYAML.load(frontmatter) || {},
    frontmatterSchema,
  );
};

const walkTag = async function* (
  tag: Markdoc.Tag,
): AsyncGenerator<Markdoc.Tag> {
  for (const childTag of await tag.children) {
    if (Markdoc.Tag.isTag(childTag)) {
      yield childTag;
      yield* walkTag(childTag);
    }
  }
};

type GlobParameters = Parameters<typeof globSync>;
type Glob = {
  pattern: GlobParameters[0];
  options: GlobParameters[1];
};

export const compileMarkdocDocuments = async ({
  destinationDirectory,
  sourceGlobs,
  layoutGlobs,
  partialGlobs,
  defaultLayout,
  renderMiddleware,
}: {
  destinationDirectory: string;
  sourceGlobs: Glob[];
  layoutGlobs: Glob[];
  partialGlobs: Glob[];
  defaultLayout: string;
  renderMiddleware: Processor<Tag>[];
}) => {
  const layouts: Record<string, Markdoc.Node> = {};
  for await (const { pattern, options } of layoutGlobs) {
    const sourceDirectory = options.cwd?.toString() || "";

    await globSync(pattern, options)
      .map(String)
      .forEach(async (relativePath) => {
        const sourcePath = Path.resolve(sourceDirectory, relativePath);

        const content = FileSystem.readFileSync(sourcePath, {
          encoding: "utf8",
        });
        const node = await parseMarkdocWithHtml(content);

        const name = Path.parse(sourcePath).name;
        layouts[name] = node;
      });
  }

  const partials: Record<string, Markdoc.Node> = {};
  for await (const { pattern, options } of partialGlobs) {
    const sourceDirectory = options.cwd?.toString() || "";

    await globSync(pattern, options)
      .map(String)
      .forEach(async (relativePath) => {
        const sourcePath = Path.resolve(sourceDirectory, relativePath);

        const content = FileSystem.readFileSync(sourcePath, {
          encoding: "utf8",
        });
        const node = await parseMarkdocWithHtml(content);

        const name = Path.parse(sourcePath).base;
        partials[name] = node;
      });
  }

  for await (const { pattern, options } of sourceGlobs) {
    const sourceDirectory = options.cwd?.toString() || "";

    const relativePaths = await globSync(pattern, options).map(String);

    for await (const relativePath of relativePaths) {
      const sourcePath = Path.parse(
        Path.resolve(sourceDirectory, relativePath),
      );
      const destinationPath = Path.parse(
        Path.resolve(
          destinationDirectory,
          transformPath({ path: relativePath, transform: { ext: ".html" } }),
        ),
      );
      const content = FileSystem.readFileSync(Path.format(sourcePath), {
        encoding: "utf8",
      });
      const node = Markdoc.parse(content);

      const frontmatter = getFrontmatter(node);

      const variables: Variables = {
        frontmatter,
        sourceDirectory: sourcePath.dir,
        destinationDirectory: destinationPath.dir,
        filename: sourcePath.base,
      };

      ensureDirectoryExists(destinationPath.dir);

      const renderableTreeNode = await Markdoc.transform(node, {
        ...markdocConfig,
        variables,
      });

      if (Markdoc.Tag.isTag(renderableTreeNode)) {
        for await (const tag of walkTag(renderableTreeNode)) {
          for await (const renderMiddlewareModule of renderMiddleware) {
            await renderMiddlewareModule.process(tag);
          }
        }
      }

      const layout = frontmatter.layout || defaultLayout;
      const layoutNode = layouts[layout];

      const layoutRenderableTreeNode = await Markdoc.transform(layoutNode, {
        ...markdocConfig,
        variables: { ...variables, content: renderableTreeNode },
        partials,
      });

      // Hack, brittle, not good. Figure out why this works and never do it again.
      if (Markdoc.Tag.isTag(layoutRenderableTreeNode)) {
        layoutRenderableTreeNode.children =
          await layoutRenderableTreeNode.children;
        for await (const childTag of walkTag(layoutRenderableTreeNode)) {
          if (childTag.children instanceof Promise) {
            childTag.children = await childTag.children;
          }
        }
      }

      const renderedContent = Markdoc.renderers.html(layoutRenderableTreeNode);

      FileSystem.writeFileSync(Path.format(destinationPath), renderedContent);
    }
  }
};
