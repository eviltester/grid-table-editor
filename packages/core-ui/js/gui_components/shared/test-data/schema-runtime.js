/*
 * Responsibilities:
 * - Shared schema text parse helpers for faker/randexp-backed UIs.
 * - Shared counting helpers for generated rule collections.
 */

function parseSchemaText({ schemaTextToDataRules, schemaText, faker, RandExp }) {
  return schemaTextToDataRules({
    schemaText: String(schemaText ?? ''),
    faker,
    RandExp,
  });
}

function countEnumRules(rules = []) {
  return (Array.isArray(rules) ? rules : []).filter((rule) => rule?.type === 'enum').length;
}

export { parseSchemaText, countEnumRules };
