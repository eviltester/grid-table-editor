/*
 * Responsibilities:
 * - Maps parsed schema rules into grid editor rows.
 * - Maps grid editor rows back into schema-row payloads for rule building.
 * - Encapsulates command/type normalization logic used by the app grid controller.
 */

import {
  SOURCE_TYPE_FAKER,
  SOURCE_TYPE_DOMAIN,
  SOURCE_TYPE_REGEX,
  SOURCE_TYPE_LITERAL,
  SOURCE_TYPE_ENUM,
  extractLiteralValueFromRuleSpec,
  extractRegexValueFromRuleSpec,
  normaliseDomainCommand,
  normaliseFakerCommand,
} from '../../shared/schema-row-rule-mapper.js';
import { getKnownFakerCommandsLongestFirst } from '../../shared/faker-commands.js';
import { getKnownDomainCommandsLongestFirst, getDomainKeywordByCommand } from '../../shared/domain-commands.js';
import {
  extractFakerCommandAndParams,
  extractDomainCommandAndParams,
} from '../../shared/test-data/command-spec-parser.js';

const FAKER_COMMANDS_LONGEST_FIRST = getKnownFakerCommandsLongestFirst();
const DOMAIN_COMMANDS_LONGEST_FIRST = getKnownDomainCommandsLongestFirst();

function mapDataRuleToGridRow(rule, leadingTextLines = []) {
  const data = {
    columnName: String(rule?.name ?? ''),
    comments: String(rule?.comments ?? ''),
    leadingTextLines: Array.isArray(leadingTextLines) ? leadingTextLines.slice() : [],
    type: '',
    value: '',
  };
  if (rule?.type === SOURCE_TYPE_FAKER) {
    const fakerParts = extractFakerCommandAndParams(rule?.ruleSpec, {
      normaliseFakerCommand,
      fakerCommandsLongestFirst: FAKER_COMMANDS_LONGEST_FIRST,
    });
    if (!fakerParts.command) {
      data.type = '';
      data.value = String(rule?.ruleSpec ?? '').trim();
      return data;
    }
    data.type = fakerParts.command;
    data.value = fakerParts.params;
    return data;
  }
  if (rule?.type === SOURCE_TYPE_DOMAIN) {
    const domainParts = extractDomainCommandAndParams(rule.ruleSpec, {
      normaliseDomainCommand,
      getDomainKeywordByCommand,
      domainCommandsLongestFirst: DOMAIN_COMMANDS_LONGEST_FIRST,
    });
    if (!domainParts.command) {
      data.type = '';
      data.value = String(rule?.ruleSpec ?? '').trim();
      return data;
    }
    data.type = domainParts.command;
    data.value = domainParts.params;
    return data;
  }
  if (rule?.type === SOURCE_TYPE_ENUM) {
    data.type = SOURCE_TYPE_ENUM;
    data.value = String(rule?.ruleSpec ?? '');
    return data;
  }
  if (rule?.type === SOURCE_TYPE_LITERAL) {
    data.type = SOURCE_TYPE_LITERAL;
    data.value = extractLiteralValueFromRuleSpec(rule?.ruleSpec);
    return data;
  }
  data.type = SOURCE_TYPE_REGEX;
  data.value = extractRegexValueFromRuleSpec(rule?.ruleSpec);
  return data;
}

function mapGridRowToSchemaRow(
  rowData,
  { FAKER_SECTION_VALUE, DOMAIN_SECTION_VALUE, FAKER_COMMANDS, DOMAIN_COMMANDS }
) {
  const resolvedType = String(rowData?.type || '').trim();
  const lowerType = resolvedType.toLowerCase();
  if (lowerType === SOURCE_TYPE_REGEX) {
    return {
      name: String(rowData?.columnName || ''),
      sourceType: SOURCE_TYPE_REGEX,
      value: String(rowData?.value ?? ''),
    };
  }
  if (lowerType === SOURCE_TYPE_ENUM) {
    return {
      name: String(rowData?.columnName || ''),
      sourceType: SOURCE_TYPE_ENUM,
      value: String(rowData?.value ?? ''),
    };
  }
  if (lowerType === SOURCE_TYPE_LITERAL) {
    return {
      name: String(rowData?.columnName || ''),
      sourceType: SOURCE_TYPE_LITERAL,
      value: String(rowData?.value ?? ''),
    };
  }
  if (lowerType === FAKER_SECTION_VALUE || lowerType === DOMAIN_SECTION_VALUE) {
    return { name: String(rowData?.columnName || ''), sourceType: SOURCE_TYPE_REGEX, value: '' };
  }

  let dataType = resolvedType;
  if (dataType.startsWith('faker.')) {
    dataType = dataType.replace('faker.', '');
  }

  if (DOMAIN_COMMANDS.includes(dataType)) {
    return {
      name: String(rowData?.columnName || ''),
      sourceType: SOURCE_TYPE_DOMAIN,
      command: dataType,
      params: String(rowData?.value ?? ''),
    };
  }
  if (FAKER_COMMANDS.includes(dataType)) {
    return {
      name: String(rowData?.columnName || ''),
      sourceType: SOURCE_TYPE_FAKER,
      command: dataType,
      params: String(rowData?.value ?? ''),
    };
  }
  if (lowerType === SOURCE_TYPE_FAKER) {
    return { name: String(rowData?.columnName || ''), sourceType: SOURCE_TYPE_FAKER, command: '', params: '' };
  }
  return { name: String(rowData?.columnName || ''), sourceType: SOURCE_TYPE_REGEX, value: '' };
}

export { mapDataRuleToGridRow, mapGridRowToSchemaRow };
