import Path from "node:path";

import { compileJsonSchemas } from "./compile-json-schemas.js";
import { compileStaticAssets } from "./compile-static-assets.js";
import {
  ReplaceAnchorTagHrefRelativeUrlExtensionRenderMiddlewareModule,
  compileMarkdocDocuments,
} from "./compile-markdoc-documents.js";

const outputPath = Path.resolve("dist");

await compileJsonSchemas({
  templatePath: Path.resolve("schemas", "template.ejs"),
  schemaPattern: "schemas/**/*.json",
});

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
    new ReplaceAnchorTagHrefRelativeUrlExtensionRenderMiddlewareModule({
      originalExtension: ".md",
      replacementExtension: ".html",
    }),
  ],
});
