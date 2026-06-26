import { EnumParser } from '@anywaydata/core/data_generation/utils/enumParser.js';

const SOURCE_TYPE_FAKER = 'faker';
const SOURCE_TYPE_DOMAIN = 'domain';
const SOURCE_TYPE_REGEX = 'regex';
const SOURCE_TYPE_LITERAL = 'literal';
const SOURCE_TYPE_ENUM = 'enum';

function normaliseSourceType(sourceType) {
  const normalised = String(sourceType || '')
    .trim()
    .toLowerCase();
  if (
    normalised === SOURCE_TYPE_FAKER ||
    normalised === SOURCE_TYPE_DOMAIN ||
    normalised === SOURCE_TYPE_REGEX ||
    normalised === SOURCE_TYPE_LITERAL ||
    normalised === SOURCE_TYPE_ENUM
  ) {
    return normalised;
  }
  return SOURCE_TYPE_REGEX;
}

function normaliseFakerCommand(commandValue) {
  const command = String(commandValue || '').trim();
  if (command.startsWith('faker.')) {
    return command.replace('faker.', '');
  }
  return command;
}

function normaliseDomainCommand(commandValue) {
  return String(commandValue || '').trim();
}

function normaliseCommandParams(paramsValue, { allowUnwrapped = false } = {}) {
  const params = String(paramsValue ?? '').trim();
  if (params.length === 0) {
    return '';
  }
  if (allowUnwrapped) {
    return params;
  }
  if (params.startsWith('(') && params.endsWith(')')) {
    return params;
  }
  return `(${params})`;
}

function isDomainEnumCommand(commandValue) {
  return /^(?:datatype\.enum|awd\.datatype\.enum)$/i.test(String(commandValue || '').trim());
}

function buildRuleSpecFromSchemaRow(row) {
  const sourceType = normaliseSourceType(row?.sourceType);
  if (sourceType === SOURCE_TYPE_FAKER) {
    const command = normaliseFakerCommand(row?.command);
    const params = normaliseCommandParams(row?.params);
    return `${command}${params}`;
  }
  if (sourceType === SOURCE_TYPE_DOMAIN) {
    const command = normaliseDomainCommand(row?.command);
    const params = normaliseCommandParams(row?.params, {
      allowUnwrapped: isDomainEnumCommand(command),
    });
    if (isDomainEnumCommand(command)) {
      return EnumParser.buildSchemaRuleSpecFromInput(params);
    }
    return `${command}${params}`;
  }
  if (sourceType === SOURCE_TYPE_LITERAL) {
    const literalValue = String(row?.value ?? '');
    const trimmedLiteralValue = literalValue.trim();
    if (trimmedLiteralValue.length === 0) {
      return 'literal("")';
    }
    if (/^(literal|datatype\.literal|awd\.datatype\.literal)\s*\(/i.test(trimmedLiteralValue)) {
      return trimmedLiteralValue;
    }
    return `literal(${literalValue})`;
  }
  if (sourceType === SOURCE_TYPE_REGEX) {
    const regexValue = String(row?.value ?? '');
    const trimmedRegexValue = regexValue.trim();
    if (trimmedRegexValue.length === 0) {
      return '';
    }
    if (/^(regex|datatype\.regex|awd\.datatype\.regex)\s*\(/i.test(trimmedRegexValue)) {
      return trimmedRegexValue;
    }
    return `regex(${regexValue})`;
  }
  if (sourceType === SOURCE_TYPE_ENUM) {
    return EnumParser.buildSchemaRuleSpecFromInput(row?.value);
  }
  return String(row?.value ?? '').trim();
}

function extractEnumValueFromRuleSpec(ruleSpec) {
  return EnumParser.extractEnumDisplayValue(ruleSpec);
}

function extractLiteralValueFromRuleSpec(ruleSpec) {
  const value = String(ruleSpec ?? '');
  const match = value.match(/^(?:literal|datatype\.literal|awd\.datatype\.literal)\s*\(([\s\S]*)\)$/i);
  if (!match) {
    return value;
  }
  const unwrapped = match[1];
  if (unwrapped === '""' || unwrapped === "''") {
    return '';
  }
  return unwrapped;
}

function extractRegexValueFromRuleSpec(ruleSpec) {
  const value = String(ruleSpec ?? '');
  const match = value.match(/^(?:regex|datatype\.regex|awd\.datatype\.regex)\s*\(([\s\S]*)\)$/i);
  if (!match) {
    return value;
  }
  const unwrapped = match[1];
  if (unwrapped === '""' || unwrapped === "''") {
    return '';
  }
  return unwrapped;
}

function buildDataRuleFromSchemaRow(row) {
  const name = String(row?.name ?? '').trim();
  const comments = String(row?.comments ?? '');
  const leadingTextLines = Array.isArray(row?.leadingTextLines)
    ? row.leadingTextLines.map((line) => String(line ?? ''))
    : undefined;
  const ruleSpec = buildRuleSpecFromSchemaRow(row);
  if (name.length === 0 && ruleSpec.length === 0) {
    return null;
  }
  return {
    name,
    ruleSpec,
    comments,
    leadingTextLines,
  };
}

export {
  SOURCE_TYPE_FAKER,
  SOURCE_TYPE_DOMAIN,
  SOURCE_TYPE_REGEX,
  SOURCE_TYPE_LITERAL,
  SOURCE_TYPE_ENUM,
  normaliseSourceType,
  normaliseFakerCommand,
  normaliseDomainCommand,
  normaliseCommandParams,
  buildRuleSpecFromSchemaRow,
  extractLiteralValueFromRuleSpec,
  extractRegexValueFromRuleSpec,
  extractEnumValueFromRuleSpec,
  buildDataRuleFromSchemaRow,
};
