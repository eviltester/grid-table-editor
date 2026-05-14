import { parseSchemaText, renderSchemaText } from './schema-conversion.js';
import { SchemaParsingErrors } from './schema-parsing-errors.js';

const SOURCE_TYPE_FAKER = 'faker';
const SOURCE_TYPE_REGEX = 'regex';
const SOURCE_TYPE_LITERAL = 'literal';
const SOURCE_TYPE_ENUM = 'enum';

function normaliseSourceType(sourceType) {
  const normalised = String(sourceType || '')
    .trim()
    .toLowerCase();
  if (
    normalised === SOURCE_TYPE_FAKER ||
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

function buildRuleSpecFromRow(row) {
  const sourceType = normaliseSourceType(row?.sourceType);
  if (sourceType === SOURCE_TYPE_FAKER) {
    const command = normaliseFakerCommand(row?.command);
    const params = String(row?.params ?? '').trim();
    return `${command}${params}`;
  }
  if (sourceType === SOURCE_TYPE_LITERAL) {
    const value = String(row?.value ?? '');
    return value.trim().length === 0 ? 'literal()' : value.trim();
  }
  return String(row?.value ?? '').trim();
}

export function schemaTextToDataRules({ schemaText, faker, RandExp, options = {}, TestDataGeneratorClass } = {}) {
  const parseResult = parseSchemaText({
    schemaText,
    faker,
    RandExp,
    options,
    TestDataGeneratorClass,
  });

  return {
    dataRules: parseResult.rules,
    errors: parseResult.errors,
    schemaTokens: parseResult.tokens,
    compilationReport: parseResult.report,
  };
}

export function dataRulesToSchemaText({ dataRules, schemaTokens = [] } = {}) {
  const renderResult = renderSchemaText({ rules: dataRules, tokens: schemaTokens });
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
      value: String(row?.value ?? '').trim(),
      comments: String(row?.comments ?? ''),
      order: index,
    };
  });

  if (normalisedRows.length === 0) {
    return { dataRules: [], errors: [SchemaParsingErrors.missingSchemaRows()], rows: normalisedRows };
  }

  normalisedRows.forEach((row) => {
    if (row.name.length === 0) {
      errors.push(SchemaParsingErrors.missingColumnName(row.line));
    }
    if (row.sourceType === SOURCE_TYPE_FAKER && row.command.length === 0) {
      errors.push(SchemaParsingErrors.missingFakerCommand(row.line));
    }
  });

  if (errors.length > 0) {
    return { dataRules: [], errors, rows: normalisedRows };
  }

  const dataRules = [];
  normalisedRows.forEach((row) => {
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

  return { dataRules, errors: [], rows: normalisedRows };
}
