import FileSystem from "node:fs";
import Path from "node:path";
import EJS from "ejs";
import { globSync } from "glob";
import { validateTypeUsingSchema } from "./validate-type-using-schema.js";
import { FromSchema, JSONSchema } from "json-schema-to-ts";

const schemaWithDefs = {
  type: "object",
  properties: {
    $defs: {
      type: "object",
      patternProperties: {
        ".": {
          type: "object",
          properties: {
            $ref: { type: "string" },
          },
          required: ["$ref"],
        },
      },
      required: [],
    },
  },
  required: [],
} as const satisfies JSONSchema;

type SchemaWithDefs = FromSchema<typeof schemaWithDefs>;

export const compileJsonSchemas = async ({
  templatePath,
  schemaPattern,
}: {
  templatePath: string;
  schemaPattern: string;
}) => {
  const template = FileSystem.readFileSync(templatePath).toString("utf8");

  for (const schemaFile of globSync(schemaPattern)) {
    const schema = validateTypeUsingSchema<SchemaWithDefs>(
      JSON.parse(FileSystem.readFileSync(schemaFile).toString("utf8")),
      schemaWithDefs,
    );

    if (schema.$defs) {
      const schemaDir = Path.parse(schemaFile).dir;

      for (const [key, value] of Object.entries(schema.$defs)) {
        const refJsonPath = Path.resolve(schemaDir, value.$ref);
        const { default: refJson } = await import(refJsonPath, {
          with: { type: "json" },
        });
        schema.$defs[key] = refJson;
      }
    }

    const compiledTemplate = EJS.compile(template)({
      schema: JSON.stringify(schema, null, 2),
    });

    FileSystem.writeFileSync(`${schemaFile}.ts`, compiledTemplate);
  }
};
