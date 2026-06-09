/*
 * Responsibilities:
 * - Shared derived-state helpers for pairwise visibility and enum-threshold checks.
 * - Keeps UI enable/show logic deterministic and unit-testable outside page controllers.
 */

import { SOURCE_TYPE_ENUM } from '../../schema-row-rule-mapper.js';
import { countEnumRules } from '../schema/schema-runtime.js';

function hasMinimumEnumColumns(enumCount, { minimum = 2 } = {}) {
  return Number.isFinite(enumCount) && enumCount >= minimum;
}

function countEnumSchemaRows(rows = []) {
  return (Array.isArray(rows) ? rows : []).filter(
    (row) =>
      String(row?.sourceType || '')
        .trim()
        .toLowerCase() === SOURCE_TYPE_ENUM
  ).length;
}

function isNWiseEligibleForSchemaRows(rows = [], options = {}) {
  return hasMinimumEnumColumns(countEnumSchemaRows(rows), options);
}

function isPairwiseEligibleForDataRules(rules = [], options = {}) {
  return hasMinimumEnumColumns(countEnumRules(rules), options);
}

export { hasMinimumEnumColumns, countEnumSchemaRows, isNWiseEligibleForSchemaRows, isPairwiseEligibleForDataRules };
