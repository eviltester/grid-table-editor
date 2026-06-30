import { schemaTextToDataRules, dataRulesToSchemaText } from '@anywaydata/core/data_generation/schema-rules-adapter.js';
import { GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT } from '../../shared/test-data/schema/schema-examples.js';
import {
  schemaRowsToSpec as schemaRowsToSpecHelper,
  schemaRowsToSpecWithTokens as schemaRowsToSpecWithTokensHelper,
  validateSchemaRows as validateSchemaRowsHelper,
} from './generator-schema-rule-helpers.js';

function createGeneratorPageDefaults() {
  return {
    schemaTextToDataRules,
    schemaRowsToSpec(schemaRows) {
      return schemaRowsToSpecHelper({ schemaRows, dataRulesToSchemaText });
    },
    schemaRowsToSpecWithTokens(schemaRows, schemaTokens) {
      return schemaRowsToSpecWithTokensHelper({
        schemaRows,
        schemaTokens,
        dataRulesToSchemaText,
      });
    },
    validateSchemaRows(schemaRows, validationOptions = {}) {
      return validateSchemaRowsHelper({
        schemaRows,
        unsafeFakerExpressions: validationOptions.unsafeFakerExpressions === true,
      });
    },
    dataRulesToSchemaText,
    sampleSchemaText: GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT,
  };
}

export { createGeneratorPageDefaults };
