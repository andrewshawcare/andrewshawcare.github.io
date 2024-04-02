import Path from "node:path";
import FileSystem from "node:fs";
import Markdoc, { Tag } from "@markdoc/markdoc";
import JSYAML, { Mark } from "js-yaml";
import { Parser } from "htmlparser2";
import { globSync } from "glob";
import { transformConfig } from "../markdoc-config.js";
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

const parseMarkdocWithHtml = (content: string): Markdoc.Node => {
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
  layoutGlobs.forEach(({ pattern, options }) => {
    const sourceDirectory = options.cwd?.toString() || "";

    globSync(pattern, options)
      .map(String)
      .forEach((relativePath) => {
        const sourcePath = Path.resolve(sourceDirectory, relativePath);

        const content = FileSystem.readFileSync(sourcePath, {
          encoding: "utf8",
        });
        const node = parseMarkdocWithHtml(content);

        const name = Path.parse(sourcePath).name;
        layouts[name] = node;
      });
  });

  const partials: Record<string, Markdoc.Node> = {};
  partialGlobs.forEach(({ pattern, options }) => {
    const sourceDirectory = options.cwd?.toString() || "";

    globSync(pattern, options)
      .map(String)
      .forEach((relativePath) => {
        const sourcePath = Path.resolve(sourceDirectory, relativePath);

        const content = FileSystem.readFileSync(sourcePath, {
          encoding: "utf8",
        });
        const node = parseMarkdocWithHtml(content);

        const name = Path.parse(sourcePath).name;
        partials[name] = node;
      });
  });

  sourceGlobs.forEach(({ pattern, options }) => {
    const sourceDirectory = options.cwd?.toString() || "";

    globSync(pattern, options)
      .map(String)
      .forEach(async (relativePath) => {
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
          destinationDirectory,
          filename: sourcePath.base,
        };

        const renderableTreeNode = Markdoc.transform(node, {
          ...transformConfig,
          variables,
        });

        if (Markdoc.Tag.isTag(renderableTreeNode)) {
          for (const tag of walkTag(renderableTreeNode)) {
            for (const renderMiddlewareModule of renderMiddleware) {
              await renderMiddlewareModule.process(tag);
            }
          }
        }

        const layout = frontmatter.layout || defaultLayout;
        const layoutRenderableTreeNode = Markdoc.transform(layouts[layout], {
          ...transformConfig,
          variables: {
            ...variables,
            content: renderableTreeNode,
          },
          partials,
        });

        const renderedContent = Markdoc.renderers.html(
          layoutRenderableTreeNode,
        );

        ensureDirectoryExists(destinationPath.dir);

        FileSystem.writeFileSync(Path.format(destinationPath), renderedContent);
      });
  });
};
