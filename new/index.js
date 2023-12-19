import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import Markdoc from "@markdoc/markdoc";

const content = "# Hello, world?";
const node = Markdoc.parse(content);
const transformedNode = Markdoc.transform(node);
const html = Markdoc.renderers.html(transformedNode);

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildPath = path.join(__dirname, "build")

fs.mkdirSync(buildPath, { recursive: true });
fs.writeFileSync(path.join(buildPath, "index.html"), html);
