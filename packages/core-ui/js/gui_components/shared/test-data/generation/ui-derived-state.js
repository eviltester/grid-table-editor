/*
 * Responsibilities:
 * - Shared derived-state helpers for pairwise visibility and enum-threshold checks.
 * - Keeps UI enable/show logic deterministic and unit-testable outside page controllers.
 */

import { SOURCE_TYPE_DOMAIN, SOURCE_TYPE_ENUM } from '../../schema-row-rule-mapper.js';
import { countEnumRules } from '../schema/schema-runtime.js';

function hasMinimumEnumColumns(enumCount, { minimum = 2 } = {}) {
  return Number.isFinite(enumCount) && enumCount >= minimum;
}

function isEnumLikeSchemaRow(row = {}) {
  const sourceType = String(row?.sourceType || '')
    .trim()
    .toLowerCase();
  const command = String(row?.command || '')
    .trim()
    .toLowerCase();

  return sourceType === SOURCE_TYPE_ENUM || (sourceType === SOURCE_TYPE_DOMAIN && command === 'datatype.enum');
}

function countEnumSchemaRows(rows = []) {
  return (Array.isArray(rows) ? rows : []).filter((row) => isEnumLikeSchemaRow(row)).length;
}

function isNWiseEligibleForSchemaRows(rows = [], options = {}) {
  return hasMinimumEnumColumns(countEnumSchemaRows(rows), options);
}

function isPairwiseEligibleForDataRules(rules = [], options = {}) {
  return hasMinimumEnumColumns(countEnumRules(rules), options);
}

export {
  hasMinimumEnumColumns,
  isEnumLikeSchemaRow,
  countEnumSchemaRows,
  isNWiseEligibleForSchemaRows,
  isPairwiseEligibleForDataRules,
};
