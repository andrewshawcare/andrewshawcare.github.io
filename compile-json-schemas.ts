import FileSystem from "node:fs";
import Path from "node:path";
import EJS from "ejs";
import { globSync } from "glob";
import { validateTypeUsingSchema } from "./validate-type-using-schema.js";
import { FromSchema, JSONSchema } from "json-schema-to-ts";

export const compileJsonSchemas = async ({
  templatePath,
  schemaPattern,
}: {
  templatePath: string;
  schemaPattern: string;
}) => {
  const partialSchema = {
    type: "object",
    properties: {
      $defs: {
        type: "object",
        required: [],
      },
    },
    required: [],
  } as const satisfies JSONSchema;

  type PartialSchema = FromSchema<typeof partialSchema>;

  const template = FileSystem.readFileSync(templatePath).toString("utf8");

  for (const schemaFile of globSync(schemaPattern)) {
    const parsedSchemaFile = Path.parse(schemaFile);
    const schema = validateTypeUsingSchema<PartialSchema>(
      JSON.parse(FileSystem.readFileSync(schemaFile).toString("utf8")),
      partialSchema,
    );

    if (schema.$defs) {
      for (const [key, value] of Object.entries(schema.$defs)) {
        if (
          value &&
          typeof value === "object" &&
          "$ref" in value &&
          typeof value.$ref === "string"
        ) {
          const { default: referencedSchema } = await import(
            Path.resolve(parsedSchemaFile.dir, value.$ref),
            { assert: { type: "json" } }
          );
          schema.$defs[key] = referencedSchema;
        }
      }
    }

    const compiledTemplate = EJS.compile(template)({
      schema: JSON.stringify(schema, null, 2),
    });

    FileSystem.writeFileSync(`${schemaFile}.ts`, compiledTemplate);
  }
};
