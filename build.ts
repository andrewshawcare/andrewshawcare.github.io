import Path from "node:path";

import { compileStaticAssets } from "./compile-static-assets.js";
import { compileMarkdocDocuments } from "./compile-markdoc-documents.js";
import { TransformProcessor } from "./middleware/transform-processor.js";
import { Tag } from "@markdoc/markdoc";
import isRelativeUrl from "is-relative-url";
import { FilterProcessor } from "./middleware/filter-processor.js";
import { SequentialProcessor } from "./middleware/sequential-processor.js";
import { transformPath } from "./transform-path.js";

const outputPath = Path.resolve("dist");

await compileStaticAssets({
  outputPath,
  staticAssets: [
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
  outputPath,
  contentPath: Path.resolve("content"),
  layoutsPath: Path.resolve("templates", "layouts"),
  layoutsDefault: "default",
  renderMiddleware: [
    new SequentialProcessor<Tag>({
      modules: [
        new FilterProcessor<Tag>({
          predicate: (tag) => tag.name === "a",
        }),
        new TransformProcessor<Tag, any>({
          selector: (tag) => tag.attributes.href,
          transform: (href) =>
            typeof href === "string" &&
            isRelativeUrl(href) &&
            Path.parse(href).ext === ".md"
              ? transformPath({
                  path: href,
                  transform: { ext: ".html" },
                })
              : href,
        }),
      ],
    }),
  ],
});
