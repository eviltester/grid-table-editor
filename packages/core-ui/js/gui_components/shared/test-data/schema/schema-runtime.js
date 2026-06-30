/*
 * Responsibilities:
 * - Shared schema text parse helpers for faker/randexp-backed UIs.
 * - Shared counting helpers for generated rule collections.
 */

import { EnumParser } from '@anywaydata/core/data_generation/utils/enumParser.js';

function parseSchemaText({ schemaTextToDataRules, schemaText, faker, RandExp, unsafeFakerExpressions = false }) {
  return schemaTextToDataRules({
    schemaText: String(schemaText ?? ''),
    faker,
    RandExp,
    options: {
      unsafeFakerExpressions: unsafeFakerExpressions === true,
    },
    includeInvalidRules: true,
  });
}

function countEnumRules(rules = []) {
  return (Array.isArray(rules) ? rules : []).filter((rule) => EnumParser.isEnumLikeRule(rule)).length;
}

export { parseSchemaText, countEnumRules };
