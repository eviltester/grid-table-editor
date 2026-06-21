import { parseSchemaText, renderSchemaText } from './schema-conversion.js';
import { SchemaParsingErrors } from './schema-parsing-errors.js';

const SOURCE_TYPE_FAKER = 'faker';
const SOURCE_TYPE_DOMAIN = 'domain';
const SOURCE_TYPE_REGEX = 'regex';
const SOURCE_TYPE_LITERAL = 'literal';
const SOURCE_TYPE_ENUM = 'enum';

function isBlankSchemaRow(row) {
  return (
    String(row?.name ?? '').trim().length === 0 &&
    String(row?.command ?? '').trim().length === 0 &&
    String(row?.params ?? '').trim().length === 0 &&
    String(row?.value ?? '').trim().length === 0 &&
    String(row?.comments ?? '').trim().length === 0
  );
}

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

function isDomainHelpersCommand(commandValue) {
  const command = String(commandValue || '').trim();
  if (!command) {
    return false;
  }
  return (
    command.startsWith('helpers.') || command.startsWith('domain.helpers.') || command.startsWith('awd.domain.helpers.')
  );
}

function buildRuleSpecFromRow(row) {
  const sourceType = normaliseSourceType(row?.sourceType);
  if (sourceType === SOURCE_TYPE_FAKER || sourceType === SOURCE_TYPE_DOMAIN) {
    const command = normaliseFakerCommand(row?.command);
    const params = String(row?.params ?? '').trim();
    return `${command}${params}`;
  }
  if (sourceType === SOURCE_TYPE_LITERAL) {
    const value = String(row?.value ?? '');
    const trimmedValue = value.trim();
    if (trimmedValue.length === 0) {
      return 'literal("")';
    }
    if (/^(literal|datatype\.literal|awd\.datatype\.literal)\s*\(/i.test(trimmedValue)) {
      return trimmedValue;
    }
    return `literal(${value})`;
  }
  if (sourceType === SOURCE_TYPE_REGEX) {
    const value = String(row?.value ?? '');
    const trimmedValue = value.trim();
    if (trimmedValue.length === 0) {
      return '';
    }
    if (/^(regex|datatype\.regex|awd\.datatype\.regex)\s*\(/i.test(trimmedValue)) {
      return trimmedValue;
    }
    return value;
  }
  return String(row?.value ?? '').trim();
}

export function schemaTextToDataRules({
  schemaText,
  faker,
  RandExp,
  options = {},
  TestDataGeneratorClass,
  includeInvalidRules = false,
} = {}) {
  const parseResult = parseSchemaText({
    schemaText,
    faker,
    RandExp,
    options,
    TestDataGeneratorClass,
  });

  return {
    dataRules: parseResult.ok || includeInvalidRules ? parseResult.rules : [],
    errors: parseResult.errors,
    schemaTokens: parseResult.tokens,
    constraints: parseResult.constraints || [],
    compilationReport: parseResult.report,
  };
}

export function dataRulesToSchemaText({ dataRules, schemaTokens = [], constraints = [] } = {}) {
  const renderResult = renderSchemaText({ rules: dataRules, constraints, tokens: schemaTokens });
  return { text: renderResult.text, errors: renderResult.errors };
}

export function schemaRowsToDataRules({ schemaRows = [] } = {}) {
  const errors = [];
  const normalisedRows = (schemaRows || []).map((row, index) => {
    return {
      id: row?.id ?? `row-${index + 1}`,
      line: index + 1,
      name: String(row?.name ?? '').trim(),
      sourceType: normaliseSourceType(row?.sourceType),
      command: normaliseFakerCommand(row?.command),
      params: String(row?.params ?? '').trim(),
      value: String(row?.value ?? ''),
      comments: String(row?.comments ?? ''),
      order: index,
    };
  });
  const hasNonBlankRows = normalisedRows.some((row) => !isBlankSchemaRow(row));
  const effectiveRows = hasNonBlankRows ? normalisedRows.filter((row) => !isBlankSchemaRow(row)) : normalisedRows;

  if (effectiveRows.length === 0) {
    return { dataRules: [], errors: [SchemaParsingErrors.missingSchemaRows()], rows: effectiveRows };
  }

  effectiveRows.forEach((row) => {
    if (row.name.length === 0) {
      errors.push(SchemaParsingErrors.missingColumnName(row.line));
    }
    if (row.sourceType === SOURCE_TYPE_FAKER && row.command.length === 0) {
      errors.push(SchemaParsingErrors.missingFakerCommand(row.line));
    }
    if (row.sourceType === SOURCE_TYPE_DOMAIN && row.command.length === 0) {
      errors.push(SchemaParsingErrors.missingDomainCommand(row.line));
    }
    if (row.sourceType === SOURCE_TYPE_REGEX && String(row.value ?? '').trim().length === 0) {
      errors.push(SchemaParsingErrors.missingRegexValue(row.line));
    }
    if (row.sourceType === SOURCE_TYPE_DOMAIN && isDomainHelpersCommand(row.command)) {
      errors.push(SchemaParsingErrors.helpersNotSupportedInDomain(row.line));
    }
  });

  if (errors.length > 0) {
    return { dataRules: [], errors, rows: effectiveRows };
  }

  const dataRules = [];
  effectiveRows.forEach((row) => {
    const ruleSpec = buildRuleSpecFromRow(row);
    if (row.name.length === 0 && ruleSpec.length === 0) {
      return;
    }
    dataRules.push({
      name: row.name,
      ruleSpec,
      comments: row.comments,
      type: row.sourceType,
    });
  });

  return { dataRules, errors: [], rows: effectiveRows };
}
