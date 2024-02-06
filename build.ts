import Path from "node:path";

import { compileStaticAssets } from "./compile-static-assets.js";
import { compileMarkdocDocuments } from "./compile-markdoc-documents.js";
import { TransformModule } from "./middleware/transform-module.js";
import { Tag } from "@markdoc/markdoc";
import isRelativeUrl from "is-relative-url";
import { FilterModule } from "./middleware/filter-module.js";
import { SequentialModule } from "./middleware/sequential-module.js";
import { transformPath } from "./transform-path.js";

const outputPath = Path.resolve("dist");

await compileStaticAssets({
  outputPath,
  staticAssetsPath: Path.resolve("static"),
});

await compileMarkdocDocuments({
  outputPath,
  contentPath: Path.resolve("content"),
  layoutsPath: Path.resolve("templates", "layouts"),
  layoutsDefault: "default",
  renderMiddleware: [
    new SequentialModule<Tag>({
      modules: [
        new FilterModule<Tag>({
          predicate: (tag) => tag.name === "a",
        }),
        new TransformModule<Tag, any>({
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
