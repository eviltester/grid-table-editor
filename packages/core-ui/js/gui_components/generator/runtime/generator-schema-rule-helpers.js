import { schemaRowsToDataRules } from '@anywaydata/core/data_generation/schema-rules-adapter.js';
import {
  schemaRowsToSpec as schemaRowsToSpecCore,
  schemaRowsToSpecWithTokens as schemaRowsToSpecWithTokensCore,
  validateSchemaRows as validateSchemaRowsCore,
} from '../../shared/test-data/schema/schema-editor-core.js';
import {
  buildRuleSpecFromSchemaRow,
  extractLiteralValueFromRuleSpec,
  extractRegexValueFromRuleSpec,
  buildDataRuleFromSchemaRow,
  normaliseFakerCommand,
} from '../../shared/schema-row-rule-mapper.js';

function schemaRowsToSpec({ schemaRows, dataRulesToSchemaText }) {
  return schemaRowsToSpecCore({
    schemaRows,
    schemaRowsToDataRules,
    dataRulesToSchemaText,
  });
}

function schemaRowsToSpecWithTokens({ schemaRows, schemaTokens, dataRulesToSchemaText }) {
  return schemaRowsToSpecWithTokensCore({
    schemaRows,
    schemaTokens,
    buildDataRuleFromSchemaRow,
    dataRulesToSchemaText,
  });
}

function validateSchemaRows({ schemaRows }) {
  return validateSchemaRowsCore({
    schemaRows,
    schemaRowsToDataRules,
  });
}

export {
  buildRuleSpecFromSchemaRow,
  extractLiteralValueFromRuleSpec,
  extractRegexValueFromRuleSpec,
  normaliseFakerCommand,
  schemaRowsToSpec,
  schemaRowsToSpecWithTokens,
  validateSchemaRows,
};
