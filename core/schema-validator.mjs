// Zero-dependency JSON Schema (draft 2020-12 subset) validator.
//
// Supported keywords: $ref (relative file references), oneOf, anyOf, const,
// enum, type, required, properties, additionalProperties (boolean or schema),
// items, minItems, maxItems, uniqueItems, minLength, maxLength, pattern,
// format (uri, date, date-time), minimum, maximum. This subset covers every
// schema in the repository; the validator fails loudly on anything else so a
// schema cannot silently stop being enforced.

import fs from "node:fs";
import path from "node:path";

const schemaCache = new Map();

const SUPPORTED = new Set([
  "$schema", "$id", "$ref", "title", "description", "oneOf", "anyOf", "const", "enum",
  "type", "required", "properties", "additionalProperties", "items", "minItems", "maxItems",
  "uniqueItems", "minLength", "maxLength", "pattern", "format", "minimum", "maximum",
  "default", "examples", "$comment"
]);

export const readSchema = (filePath) => {
  const resolved = path.resolve(filePath);
  if (!schemaCache.has(resolved)) {
    schemaCache.set(resolved, JSON.parse(fs.readFileSync(resolved, "utf8")));
  }
  return schemaCache.get(resolved);
};

const equalJson = (left, right) => JSON.stringify(left) === JSON.stringify(right);

const matchesType = (value, type) => {
  if (type === "null") return value === null;
  if (type === "array") return Array.isArray(value);
  if (type === "object") return value !== null && typeof value === "object" && !Array.isArray(value);
  if (type === "integer") return Number.isInteger(value);
  if (type === "number") return typeof value === "number" && Number.isFinite(value);
  return typeof value === type;
};

const displayType = (type) => Array.isArray(type) ? type.join(" or ") : type;

const DATE = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
const DATE_TIME = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(?:\.[0-9]+)?(?:Z|[+-][0-9]{2}:[0-9]{2})$/;

const validateNode = (value, schema, schemaPath, instancePath, errors) => {
  for (const keyword of Object.keys(schema)) {
    if (!SUPPORTED.has(keyword)) {
      errors.push(`${instancePath}: schema keyword ${keyword} is not supported by the validator`);
    }
  }

  if (schema.$ref) {
    if (schema.$ref.includes("#")) {
      errors.push(`${instancePath}: local schema fragments are not supported by the zero-dependency validator`);
      return;
    }
    const referencePath = path.resolve(path.dirname(schemaPath), schema.$ref);
    validateNode(value, readSchema(referencePath), referencePath, instancePath, errors);
  }

  if (schema.oneOf) {
    const alternatives = schema.oneOf.map((alternative) => {
      const alternativeErrors = [];
      validateNode(value, alternative, schemaPath, instancePath, alternativeErrors);
      return alternativeErrors;
    });
    if (alternatives.filter((alternativeErrors) => alternativeErrors.length === 0).length !== 1) {
      errors.push(`${instancePath}: must match exactly one oneOf alternative`);
    }
    return;
  }

  if (schema.anyOf) {
    const alternatives = schema.anyOf.map((alternative) => {
      const alternativeErrors = [];
      validateNode(value, alternative, schemaPath, instancePath, alternativeErrors);
      return alternativeErrors;
    });
    if (!alternatives.some((alternativeErrors) => alternativeErrors.length === 0)) {
      errors.push(`${instancePath}: must match at least one anyOf alternative`);
    }
    return;
  }

  if (Object.hasOwn(schema, "const") && !equalJson(value, schema.const)) {
    errors.push(`${instancePath}: must equal ${JSON.stringify(schema.const)}`);
  }
  if (schema.enum && !schema.enum.some((candidate) => equalJson(value, candidate))) {
    errors.push(`${instancePath}: must be one of ${schema.enum.map((candidate) => JSON.stringify(candidate)).join(", ")}`);
  }

  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!types.some((type) => matchesType(value, type))) {
      errors.push(`${instancePath}: expected ${displayType(schema.type)}`);
      return;
    }
  }

  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    for (const required of schema.required || []) {
      if (!Object.hasOwn(value, required)) errors.push(`${instancePath}: missing required property ${required}`);
    }
    const properties = schema.properties || {};
    for (const key of Object.keys(value)) {
      if (Object.hasOwn(properties, key)) continue;
      if (schema.additionalProperties === false) {
        errors.push(`${instancePath}.${key}: additional property is not allowed`);
      } else if (schema.additionalProperties && typeof schema.additionalProperties === "object") {
        validateNode(value[key], schema.additionalProperties, schemaPath, `${instancePath}.${key}`, errors);
      }
    }
    for (const [key, propertySchema] of Object.entries(properties)) {
      if (Object.hasOwn(value, key)) {
        validateNode(value[key], propertySchema, schemaPath, `${instancePath}.${key}`, errors);
      }
    }
  }

  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      errors.push(`${instancePath}: requires at least ${schema.minItems} item(s)`);
    }
    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      errors.push(`${instancePath}: allows at most ${schema.maxItems} item(s)`);
    }
    if (schema.uniqueItems) {
      const serialized = value.map((item) => JSON.stringify(item));
      if (new Set(serialized).size !== serialized.length) errors.push(`${instancePath}: items must be unique`);
    }
    if (schema.items) {
      value.forEach((item, index) => validateNode(item, schema.items, schemaPath, `${instancePath}[${index}]`, errors));
    }
  }

  if (typeof value === "string") {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push(`${instancePath}: requires at least ${schema.minLength} character(s)`);
    }
    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      errors.push(`${instancePath}: allows at most ${schema.maxLength} character(s)`);
    }
    if (schema.pattern && !(new RegExp(schema.pattern)).test(value)) {
      errors.push(`${instancePath}: does not match ${schema.pattern}`);
    }
    if (schema.format === "uri") {
      try {
        const parsed = new URL(value);
        if (!parsed.protocol) throw new Error("missing protocol");
      } catch {
        errors.push(`${instancePath}: must be an absolute URI`);
      }
    }
    if (schema.format === "date" && !DATE.test(value)) errors.push(`${instancePath}: must be a YYYY-MM-DD date`);
    if (schema.format === "date-time" && !DATE_TIME.test(value)) errors.push(`${instancePath}: must be an ISO 8601 date-time`);
  }

  if (typeof value === "number") {
    if (schema.minimum !== undefined && value < schema.minimum) errors.push(`${instancePath}: must be at least ${schema.minimum}`);
    if (schema.maximum !== undefined && value > schema.maximum) errors.push(`${instancePath}: must be at most ${schema.maximum}`);
  }
};

export const validateAgainstSchema = (value, schemaPath) => {
  const resolved = path.resolve(schemaPath);
  const errors = [];
  validateNode(value, readSchema(resolved), resolved, "$", errors);
  return errors;
};

// Validate against an in-memory schema object; relative $ref values resolve
// against baseDirectory.
export const validateWithSchema = (value, schema, baseDirectory = process.cwd()) => {
  const errors = [];
  validateNode(value, schema, path.join(baseDirectory, "inline.schema.json"), "$", errors);
  return errors;
};
