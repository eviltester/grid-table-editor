/*
 * Responsibilities:
 * - Shared generator orchestration for schema-text and schema-row based test-data flows.
 * - Centralizes generator creation, compile/validate steps, and preview/pairwise table building.
 */

import { parseSchemaText } from '../schema/schema-runtime.js';
import { createTableFromGenerator, createPairwiseTableFromGenerator } from './generation-runtime.js';

function createGeneratorFromDataRules({ dataRules = [], TestDataGeneratorClass, faker, RandExp }) {
  const generator = new TestDataGeneratorClass(faker, RandExp);
  generator.rulesParser.testDataRules.rules = dataRules.map((rule) => ({ ...rule }));
  return generator;
}

function createConfiguredGeneratorFromSchemaText({
  schemaTextToDataRules,
  schemaText,
  TestDataGeneratorClass,
  faker,
  RandExp,
}) {
  const parseResult = parseSchemaText({ schemaTextToDataRules, schemaText, faker, RandExp });
  if (parseResult.errors.length > 0) {
    return { generator: null, errors: parseResult.errors, dataRules: [], tokens: parseResult.schemaTokens || [] };
  }

  return {
    generator: createGeneratorFromDataRules({
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
  const { errors, rows } = validateSchemaRows(schemaRows);
  if (errors.length > 0) {
    return { generator: null, errors, rows: [] };
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
      rule.type = row.sourceType;
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

export {
  createGeneratorFromDataRules,
  createConfiguredGeneratorFromSchemaText,
  createConfiguredGeneratorFromSchemaRows,
  createPreviewDataTable,
  createPairwiseDataTable,
};
