/*
 * Responsibilities:
 * - Shared schema text parse helpers for faker/randexp-backed UIs.
 * - Shared counting helpers for generated rule collections.
 */

function isDatatypeEnumRule(rule = {}) {
  return (
    String(rule?.type || '')
      .trim()
      .toLowerCase() === 'domain' &&
    String(rule?.ruleSpec || '')
      .trim()
      .toLowerCase()
      .startsWith('datatype.enum(')
  );
}

function parseSchemaText({ schemaTextToDataRules, schemaText, faker, RandExp }) {
  return schemaTextToDataRules({
    schemaText: String(schemaText ?? ''),
    faker,
    RandExp,
    includeInvalidRules: true,
  });
}

function countEnumRules(rules = []) {
  return (Array.isArray(rules) ? rules : []).filter((rule) => rule?.type === 'enum' || isDatatypeEnumRule(rule)).length;
}

export { parseSchemaText, countEnumRules };
