import * as fs from "node:fs"
import * as path from "node:path";
import * as url from "node:url";
import Markdoc from "@markdoc/markdoc";
import callout from "./components/callout/schema.js"

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const template = fs.readFileSync(path.join(__dirname, "template.html")).toString("utf8");
const content = fs.readFileSync(path.join(__dirname, "index.md")).toString("utf8");
const node = Markdoc.parse(content);
const transformedNode = Markdoc.transform(node, { tags: { callout }});
const html = Markdoc.renderers.html(transformedNode);

const buildPath = path.join(__dirname, "dist")

fs.mkdirSync(buildPath, { recursive: true });
fs.writeFileSync(path.join(buildPath, "index.html"), template.replace(/{{CONTENT}}/, html));
