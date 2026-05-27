/*
 * Responsibilities:
 * - Shared mapping between parsed data rules, generator-page schema rows, and app-grid rows.
 * - Centralizes faker/domain command extraction so both UIs interpret rule specs identically.
 * - Keeps row/rule conversion behavior unit-testable outside browser-driven UI flows.
 */

import {
  SOURCE_TYPE_FAKER,
  SOURCE_TYPE_DOMAIN,
  SOURCE_TYPE_REGEX,
  SOURCE_TYPE_LITERAL,
  SOURCE_TYPE_ENUM,
  extractLiteralValueFromRuleSpec,
  extractRegexValueFromRuleSpec,
  extractEnumValueFromRuleSpec,
  normaliseDomainCommand,
  normaliseFakerCommand,
} from '../../schema-row-rule-mapper.js';
import { getKnownFakerCommandsLongestFirst } from '../../faker-commands.js';
import { getKnownDomainCommandsLongestFirst, getDomainKeywordByCommand } from '../../domain-commands.js';
import { extractFakerCommandAndParams, extractDomainCommandAndParams } from './command-spec-parser.js';

const FAKER_COMMANDS_LONGEST_FIRST = getKnownFakerCommandsLongestFirst();
const DOMAIN_COMMANDS_LONGEST_FIRST = getKnownDomainCommandsLongestFirst();

function createDefaultSchemaRow() {
  return {
    name: '',
    comments: '',
    leadingTextLines: [],
    sourceType: SOURCE_TYPE_REGEX,
    command: '',
    params: '',
    value: '',
  };
}

function mapDataRuleToSchemaRow(rule, { createBlankSchemaRow = createDefaultSchemaRow } = {}) {
  const row = createBlankSchemaRow();
  row.name = String(rule?.name ?? '');
  row.comments = String(rule?.comments ?? '');
  row.leadingTextLines = Array.isArray(rule?.leadingTextLines)
    ? rule.leadingTextLines.map((line) => String(line ?? ''))
    : [];
  row.sourceType =
    String(rule?.type || SOURCE_TYPE_REGEX)
      .trim()
      .toLowerCase() || SOURCE_TYPE_REGEX;

  if (row.sourceType === SOURCE_TYPE_FAKER) {
    const parts = extractFakerCommandAndParams(rule?.ruleSpec, {
      normaliseFakerCommand,
      fakerCommandsLongestFirst: FAKER_COMMANDS_LONGEST_FIRST,
    });
    row.command = parts.command;
    row.params = parts.params;
    row.value = '';
    return row;
  }

  if (row.sourceType === SOURCE_TYPE_DOMAIN) {
    const parts = extractDomainCommandAndParams(rule?.ruleSpec, {
      normaliseDomainCommand,
      getDomainKeywordByCommand,
      domainCommandsLongestFirst: DOMAIN_COMMANDS_LONGEST_FIRST,
    });
    row.command = parts.command;
    row.params = parts.params;
    row.value = '';
    return row;
  }

  row.command = '';
  row.params = '';
  if (row.sourceType === SOURCE_TYPE_LITERAL) {
    row.value = extractLiteralValueFromRuleSpec(rule?.ruleSpec);
    return row;
  }
  if (row.sourceType === SOURCE_TYPE_REGEX) {
    row.value = extractRegexValueFromRuleSpec(rule?.ruleSpec);
    return row;
  }
  if (row.sourceType === SOURCE_TYPE_ENUM) {
    row.value = extractEnumValueFromRuleSpec(rule?.ruleSpec);
    return row;
  }
  row.value = String(rule?.ruleSpec ?? '');
  return row;
}

function mapDataRuleToGridRow(rule, leadingTextLines = []) {
  const schemaRow = mapDataRuleToSchemaRow(rule);
  if (Array.isArray(leadingTextLines) && leadingTextLines.length > 0) {
    schemaRow.leadingTextLines = leadingTextLines.slice();
  }

  if (schemaRow.sourceType === SOURCE_TYPE_FAKER || schemaRow.sourceType === SOURCE_TYPE_DOMAIN) {
    return {
      columnName: schemaRow.name,
      comments: schemaRow.comments,
      leadingTextLines: schemaRow.leadingTextLines,
      type: schemaRow.command,
      value: schemaRow.params,
    };
  }

  return {
    columnName: schemaRow.name,
    comments: schemaRow.comments,
    leadingTextLines: schemaRow.leadingTextLines,
    type: schemaRow.sourceType,
    value: schemaRow.value,
  };
}

function mapGridRowToSchemaRow(
  rowData,
  { FAKER_SECTION_VALUE, DOMAIN_SECTION_VALUE, FAKER_COMMANDS = [], DOMAIN_COMMANDS = [] }
) {
  const resolvedType = String(rowData?.type || '').trim();
  const lowerType = resolvedType.toLowerCase();
  const name = String(rowData?.columnName || '');

  if (lowerType === SOURCE_TYPE_REGEX) {
    return { name, sourceType: SOURCE_TYPE_REGEX, value: String(rowData?.value ?? '') };
  }
  if (lowerType === SOURCE_TYPE_ENUM) {
    return { name, sourceType: SOURCE_TYPE_ENUM, value: String(rowData?.value ?? '') };
  }
  if (lowerType === SOURCE_TYPE_LITERAL) {
    return { name, sourceType: SOURCE_TYPE_LITERAL, value: String(rowData?.value ?? '') };
  }
  if (lowerType === FAKER_SECTION_VALUE || lowerType === DOMAIN_SECTION_VALUE) {
    return { name, sourceType: SOURCE_TYPE_REGEX, value: '' };
  }

  let dataType = resolvedType;
  if (dataType.startsWith('faker.')) {
    dataType = dataType.replace('faker.', '');
  }

  if (DOMAIN_COMMANDS.includes(dataType)) {
    return { name, sourceType: SOURCE_TYPE_DOMAIN, command: dataType, params: String(rowData?.value ?? '') };
  }
  if (FAKER_COMMANDS.includes(dataType)) {
    return { name, sourceType: SOURCE_TYPE_FAKER, command: dataType, params: String(rowData?.value ?? '') };
  }
  if (lowerType === SOURCE_TYPE_FAKER) {
    return { name, sourceType: SOURCE_TYPE_FAKER, command: '', params: '' };
  }
  return { name, sourceType: SOURCE_TYPE_REGEX, value: '' };
}

export { mapDataRuleToSchemaRow, mapDataRuleToGridRow, mapGridRowToSchemaRow };
