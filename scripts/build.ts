import Path from "node:path";

import { compileStaticAssets } from "./compile-static-assets.js";
import { compileMarkdocDocuments } from "./compile-markdoc-documents.js";
import { TransformProcessor } from "../middleware/transform-processor.js";
import { Tag } from "@markdoc/markdoc";
import isRelativeUrl from "is-relative-url";
import { FilterProcessor } from "../middleware/filter-processor.js";
import { SequentialProcessor } from "../middleware/sequential-processor.js";

const destinationDirectory = Path.resolve("dist");
const contentDirectory = Path.resolve("content");

await compileStaticAssets({
  destinationDirectory,
  sourceGlobs: [
    {
      pattern: "**/*",
      options: { cwd: "static" },
    },
    {
      pattern: "**/*.png",
      options: { cwd: "content" },
    },
  ],
});

await compileMarkdocDocuments({
  destinationDirectory,
  contentDirectory,
  sourceGlobs: [
    {
      pattern: "**/*.md",
      options: { cwd: "content" },
    },
  ],
  layoutGlobs: [
    {
      pattern: "**/*.md",
      options: { cwd: "templates/layouts" },
    },
  ],
  partialGlobs: [
    {
      pattern: "**/*.md",
      options: { cwd: "templates/partials" },
    },
  ],
  defaultLayout: "default",
  renderMiddleware: [
    new SequentialProcessor<Tag>({
      modules: [
        new FilterProcessor<Tag>({
          predicate: (tag) => tag.name === "a",
        }),
        new TransformProcessor<Tag, any>({
          selector: (tag) => tag.attributes,
          transform: (attributes) => {
            if (
              typeof attributes.href === "string" &&
              isRelativeUrl(attributes.href) &&
              attributes.href.includes(".md")
            ) {
              attributes.href = attributes.href.replace(".md", ".html");
            }

            return attributes;
          },
        }),
      ],
    }),
  ],
});
