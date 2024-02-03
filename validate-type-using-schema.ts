import Ajv, { Schema } from "ajv";

export const validateTypeUsingSchema = <Value>(
  value: any,
  schema: Schema,
): Value => {
  const ajv = new Ajv.default({ strict: true });
  const validate = ajv.compile<Value>(schema);

  if (validate(value)) {
    return value;
  } else {
    throw new Error(JSON.stringify({ value, errors: validate.errors }));
  }
};
