import fs from "node:fs";
import path from "node:path";

const schemaCache = new Map();

const readSchema = (filePath) => {
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

const validateNode = (value, schema, schemaPath, instancePath, errors) => {
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
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!Object.hasOwn(properties, key)) errors.push(`${instancePath}.${key}: additional property is not allowed`);
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
  }

  if (typeof value === "number" && schema.minimum !== undefined && value < schema.minimum) {
    errors.push(`${instancePath}: must be at least ${schema.minimum}`);
  }
};

export const validateAgainstSchema = (value, schemaPath) => {
  const resolved = path.resolve(schemaPath);
  const errors = [];
  validateNode(value, readSchema(resolved), resolved, "$", errors);
  return errors;
};
