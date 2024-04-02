import Path from "node:path";
import { compileJsonSchemas } from "../compile-json-schemas.js";

await compileJsonSchemas({
  templatePath: Path.resolve("schemas", "template.ejs"),
  schemaPattern: "schemas/**/*.json",
});
