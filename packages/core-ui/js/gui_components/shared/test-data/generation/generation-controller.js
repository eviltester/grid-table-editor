/*
 * Responsibilities:
 * - Shared generator orchestration for schema-text and schema-row based test-data flows.
 * - Centralizes generator creation, compile/validate steps, and preview/pairwise table building.
 */

import { parseSchemaText } from '../schema/schema-runtime.js';
import {
  createTableFromGenerator,
  createPairwiseTableFromGenerator,
  createCombinationsTableFromGenerator,
} from './generation-runtime.js';

function createGeneratorFromDataRules({ dataRules = [], TestDataGeneratorClass, faker, RandExp }) {
  const generator = new TestDataGeneratorClass(faker, RandExp);
  generator.rulesParser.testDataRules.rules = dataRules.map((rule) => ({ ...rule }));
  return generator;
}

function buildGenerationRuleSpecFromSchemaRow({ row, buildRuleSpecFromSchemaRow, SOURCE_TYPE_REGEX }) {
  const ruleSpec = String(buildRuleSpecFromSchemaRow(row) || '');
  if (String(row?.sourceType || '').toLowerCase() !== SOURCE_TYPE_REGEX) {
    return ruleSpec;
  }

  const trimmedRuleSpec = ruleSpec.trim();
  if (trimmedRuleSpec.length === 0) {
    return '';
  }

  if (/^(regex|datatype\.regex|awd\.datatype\.regex)\s*\(/i.test(trimmedRuleSpec)) {
    return ruleSpec;
  }

  return `regex(${String(row?.value ?? '')})`;
}

function schemaRowsToGenerationSpec({ schemaRows = [], buildRuleSpecFromSchemaRow, SOURCE_TYPE_REGEX }) {
  return (Array.isArray(schemaRows) ? schemaRows : [])
    .map((row) => {
      const name = String(row?.name ?? '').trim();
      const ruleSpec = buildGenerationRuleSpecFromSchemaRow({
        row,
        buildRuleSpecFromSchemaRow,
        SOURCE_TYPE_REGEX,
      });

      if (name.length === 0 && ruleSpec.length === 0) {
        return '';
      }

      return `${name}\n${ruleSpec}`;
    })
    .filter((entry) => entry.length > 0)
    .join('\n');
}

function createConfiguredGeneratorFromSchemaText({
  schemaTextToDataRules,
  schemaText,
  TestDataGeneratorClass,
  faker,
  RandExp,
}) {
  const generator = new TestDataGeneratorClass(faker, RandExp);
  if (typeof generator.importSpec === 'function' && typeof generator.compile === 'function') {
    generator.importSpec(String(schemaText ?? ''));
    generator.compile();

    if (typeof generator.isValid === 'function' && !generator.isValid()) {
      return {
        generator: null,
        errors: typeof generator.errors === 'function' ? generator.errors() : [],
        dataRules: [],
        tokens:
          typeof generator.rulesParser?.getSchemaTokens === 'function' ? generator.rulesParser.getSchemaTokens() : [],
      };
    }

    return {
      generator,
      errors: [],
      dataRules: typeof generator.testDataRules === 'function' ? generator.testDataRules() : [],
      tokens:
        typeof generator.rulesParser?.getSchemaTokens === 'function' ? generator.rulesParser.getSchemaTokens() : [],
    };
  }

  const parseResult = parseSchemaText({ schemaTextToDataRules, schemaText, faker, RandExp });
  if (parseResult.errors.length > 0) {
    return { generator: null, errors: parseResult.errors, dataRules: [], tokens: parseResult.schemaTokens || [] };
  }

  return {
    generator:
      parseResult.generator ||
      createGeneratorFromDataRules({
        dataRules: parseResult.dataRules,
        TestDataGeneratorClass,
        faker,
        RandExp,
      }),
    errors: [],
    dataRules: parseResult.dataRules,
    tokens: parseResult.schemaTokens || [],
  };
}

function createConfiguredGeneratorFromSchemaRows({
  schemaRows = [],
  validateSchemaRows,
  schemaRowsToSpec,
  schemaText = '',
  schemaTextToDataRules,
  TestDataGeneratorClass,
  faker,
  RandExp,
  buildRuleSpecFromSchemaRow,
  extractLiteralValueFromRuleSpec,
  extractRegexValueFromRuleSpec,
  SOURCE_TYPE_FAKER,
  SOURCE_TYPE_DOMAIN,
  SOURCE_TYPE_LITERAL,
  SOURCE_TYPE_ENUM,
  SOURCE_TYPE_REGEX,
}) {
  const isDatatypeEnumDomainRow = (row) =>
    String(row?.sourceType || '').toLowerCase() === SOURCE_TYPE_DOMAIN &&
    String(row?.command || '')
      .trim()
      .toLowerCase() === 'datatype.enum';

  const { errors, rows } = validateSchemaRows(schemaRows);
  if (errors.length > 0) {
    return { generator: null, errors, rows: [] };
  }

  const resolvedSchemaText = String(schemaText || '').trim();
  if (resolvedSchemaText.length > 0) {
    return createConfiguredGeneratorFromSchemaText({
      schemaTextToDataRules,
      schemaText: resolvedSchemaText,
      TestDataGeneratorClass,
      faker,
      RandExp,
    });
  }

  const generator = new TestDataGeneratorClass(faker, RandExp);
  generator.importSpec(schemaRowsToSpec(rows));
  generator.compile();

  const rules = generator.testDataRules();
  rows.forEach((row, index) => {
    const rule = rules[index];
    if (!rule) {
      return;
    }
    if (row.sourceType === SOURCE_TYPE_FAKER || row.sourceType === SOURCE_TYPE_DOMAIN) {
      rule.type = isDatatypeEnumDomainRow(row) ? SOURCE_TYPE_ENUM : row.sourceType;
      rule.ruleSpec = buildRuleSpecFromSchemaRow(row);
      return;
    }
    if (row.sourceType === SOURCE_TYPE_LITERAL) {
      rule.type = SOURCE_TYPE_LITERAL;
      rule.ruleSpec = extractLiteralValueFromRuleSpec(buildRuleSpecFromSchemaRow(row));
      return;
    }
    if (row.sourceType === SOURCE_TYPE_ENUM) {
      rule.type = SOURCE_TYPE_ENUM;
      rule.ruleSpec = buildRuleSpecFromSchemaRow(row);
      return;
    }
    rule.type = SOURCE_TYPE_REGEX;
    rule.ruleSpec = extractRegexValueFromRuleSpec(buildRuleSpecFromSchemaRow(row));
  });

  generator.compiler.validate();
  if (!generator.isValid()) {
    return { generator: null, errors: generator.errors(), rows };
  }

  return { generator, errors: [], rows };
}

function createPreviewDataTable({ rowCount, generator, GenericDataTableClass }) {
  return createTableFromGenerator({ rowCount, generator, GenericDataTableClass });
}

function createPairwiseDataTable({ generator, PairwiseTestDataGeneratorClass, GenericDataTableClass, faker, RandExp }) {
  return createPairwiseTableFromGenerator({
    generator,
    PairwiseTestDataGeneratorClass,
    GenericDataTableClass,
    faker,
    RandExp,
  });
}

function createCombinationsDataTable({
  generator,
  CombinationsTestDataGeneratorClass,
  GenericDataTableClass,
  faker,
  RandExp,
  options,
}) {
  return createCombinationsTableFromGenerator({
    generator,
    CombinationsTestDataGeneratorClass,
    GenericDataTableClass,
    faker,
    RandExp,
    options,
  });
}

export {
  createGeneratorFromDataRules,
  buildGenerationRuleSpecFromSchemaRow,
  schemaRowsToGenerationSpec,
  createConfiguredGeneratorFromSchemaText,
  createConfiguredGeneratorFromSchemaRows,
  createPreviewDataTable,
  createPairwiseDataTable,
  createCombinationsDataTable,
};
