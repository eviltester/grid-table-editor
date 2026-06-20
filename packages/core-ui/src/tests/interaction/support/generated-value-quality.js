import { getFakerCommandHelp } from '@anywaydata/core/faker/faker-helper-keyword-definitions.js';
import { getDomainCommandHelp } from '../../../../js/gui_components/shared/domain-command-help-metadata.js';
import {
  SOURCE_TYPE_DOMAIN,
  SOURCE_TYPE_ENUM,
  SOURCE_TYPE_FAKER,
  SOURCE_TYPE_LITERAL,
  SOURCE_TYPE_REGEX,
} from '../../../../js/gui_components/shared/schema-row-rule-mapper.js';

const ERROR_PATTERNS = [
  /\*\*ERROR\*\*/i,
  /Invalid Faker API Call/i,
  /Could not find Faker API Command/i,
  /Unsafe faker rule syntax/i,
  /\bException\b/i,
];
const STANDALONE_INVALID_VALUE_PATTERNS = [/(^|[^\w])undefined([^\w]|$)/, /(^|[^\w])NaN([^\w]|$)/];
const PRIMITIVE_TYPE_TOKENS = new Set([
  'string',
  'number',
  'integer',
  'boolean',
  'array',
  'object',
  'date',
  'regexp',
  'unknown',
  'bigint',
  'comma-separated list',
]);

function toSearchableText(value) {
  if (typeof value === 'string') return value;
  if (typeof value === 'bigint') return value.toString();
  if (typeof value === 'undefined') return '';
  try {
    const json = JSON.stringify(value);
    if (typeof json === 'string') {
      return json;
    }
  } catch {
    // Fall back to String(value) for values such as BigInt-containing objects.
  }
  return String(value);
}

function inferTypeAndConfidence(value) {
  if (value === null || typeof value === 'undefined') {
    return { type: 'unknown', confidence: 'low' };
  }

  if (Array.isArray(value)) {
    return { type: 'array', confidence: 'high' };
  }

  if (typeof value === 'boolean') {
    return { type: 'boolean', confidence: 'high' };
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? { type: 'number', confidence: 'high' } : { type: 'unknown', confidence: 'low' };
  }

  if (typeof value === 'object') {
    return { type: 'object', confidence: 'high' };
  }

  const text = String(value).trim();
  if (text.length === 0) return { type: 'unknown', confidence: 'low' };
  if (text === 'true' || text === 'false') return { type: 'boolean', confidence: 'high' };
  if (text.startsWith('[') && text.endsWith(']')) return { type: 'array', confidence: 'high' };
  if (text.startsWith('{') && text.endsWith('}')) return { type: 'object', confidence: 'high' };
  if (/^"?\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z"?$/.test(text)) {
    return { type: 'date', confidence: 'high' };
  }
  if (/^[+-]?\d+(\.\d+)?$/.test(text)) return { type: 'number', confidence: 'low' };
  return { type: 'string', confidence: 'high' };
}

function getAllowedTypesForRow(row) {
  const normaliseTypes = (types) => types.map((entry) => (entry === 'integer' ? 'number' : entry)).filter(Boolean);

  switch (row?.sourceType) {
    case SOURCE_TYPE_FAKER:
      return normaliseTypes(
        String(getFakerCommandHelp(row.command)?.returnType || 'string')
          .split('|')
          .map((entry) => entry.trim())
      );
    case SOURCE_TYPE_DOMAIN:
      return normaliseTypes(
        String(getDomainCommandHelp(row.command)?.returnType || 'string')
          .split('|')
          .map((entry) => entry.trim())
      );
    case SOURCE_TYPE_ENUM:
    case SOURCE_TYPE_REGEX:
      return ['string'];
    case SOURCE_TYPE_LITERAL:
      return ['string', 'number', 'boolean'];
    default:
      return ['string'];
  }
}

function parseLiteralTypeToken(token) {
  const trimmed = String(token || '').trim();
  if (!trimmed) {
    return undefined;
  }
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  if (/^[+-]?\d+(\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }
  return trimmed;
}

function getLiteralUnionValues(allowedTypes) {
  if (!Array.isArray(allowedTypes) || allowedTypes.length === 0) {
    return [];
  }

  const literalValues = [];
  for (const typeToken of allowedTypes) {
    const trimmed = String(typeToken || '').trim();
    if (!trimmed || PRIMITIVE_TYPE_TOKENS.has(trimmed)) {
      return [];
    }
    const literalValue = parseLiteralTypeToken(trimmed);
    if (typeof literalValue === 'undefined') {
      return [];
    }
    literalValues.push(literalValue);
  }

  return literalValues;
}

function hasPermissiveAllowedType(allowedTypes) {
  return allowedTypes.includes('string') || allowedTypes.includes('unknown');
}

function assertNoErrorIndicators(value, _contextLabel = 'value') {
  const text = toSearchableText(value);
  ERROR_PATTERNS.forEach((pattern) => {
    expect(text).not.toMatch(pattern);
  });

  if (typeof value !== 'undefined') {
    STANDALONE_INVALID_VALUE_PATTERNS.forEach((pattern) => {
      expect(String(value)).not.toMatch(pattern);
    });
  }
}

function assertDataTableHasNoErrorIndicators(dataTable, contextLabel = 'dataTable') {
  if (!dataTable || typeof dataTable.getRowCount !== 'function' || typeof dataTable.getColumnCount !== 'function') {
    return;
  }

  for (let rowIndex = 0; rowIndex < dataTable.getRowCount(); rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < dataTable.getColumnCount(); columnIndex += 1) {
      assertNoErrorIndicators(dataTable.getCell(rowIndex, columnIndex), `${contextLabel} r${rowIndex}c${columnIndex}`);
    }
  }
}

function assertRowValueMatchesScenario(row, value, contextLabel) {
  assertNoErrorIndicators(value, contextLabel);

  if (row?.sourceType === SOURCE_TYPE_ENUM) {
    const allowedValues = String(row?.value || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    expect(allowedValues).toContain(String(value));
    return;
  }

  if (row?.sourceType === SOURCE_TYPE_REGEX && String(row?.value || '').length > 0) {
    const regex = new RegExp(String(row.value));
    expect(String(value)).toMatch(regex);
    return;
  }

  if (row?.sourceType === SOURCE_TYPE_LITERAL && String(row?.value || '').length > 0) {
    expect(String(value)).toBe(String(row.value));
    return;
  }

  if (row?.sourceType === SOURCE_TYPE_DOMAIN && row?.command === 'string.counterString') {
    expect(typeof value === 'string' || value instanceof String).toBe(true);
    expect(String(value).length).toBeGreaterThan(0);
    return;
  }

  const allowedTypes = getAllowedTypesForRow(row);
  const literalUnionValues = getLiteralUnionValues(allowedTypes);
  if (literalUnionValues.length > 0) {
    expect(literalUnionValues.map((item) => String(item))).toContain(String(value));
    return;
  }

  const inferred = inferTypeAndConfidence(value);
  if (inferred.confidence === 'high' && !hasPermissiveAllowedType(allowedTypes)) {
    expect(allowedTypes).toContain(inferred.type);
  }
}

function assertScenarioDataQuality({ scenario, dataTable, exportedText = '', outputPreviewText = '' }) {
  assertNoErrorIndicators(exportedText, `${scenario.id} exportedText`);
  if (outputPreviewText) {
    assertNoErrorIndicators(outputPreviewText, `${scenario.id} outputPreviewText`);
  }
  assertDataTableHasNoErrorIndicators(dataTable, scenario.id);

  scenario.rows.forEach((row, columnIndex) => {
    const value = dataTable.getCell(0, columnIndex);
    assertRowValueMatchesScenario(row, value, `${scenario.id} column ${columnIndex}`);
  });
}

export {
  assertNoErrorIndicators,
  assertDataTableHasNoErrorIndicators,
  assertScenarioDataQuality,
  hasPermissiveAllowedType,
};
