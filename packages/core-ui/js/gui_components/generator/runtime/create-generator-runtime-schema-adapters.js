import {
  schemaRowsToSpec as schemaRowsToSpecHelper,
  schemaRowsToSpecWithTokens as schemaRowsToSpecWithTokensHelper,
  validateSchemaRows as validateSchemaRowsHelper,
} from './generator-schema-rule-helpers.js';

function createGeneratorRuntimeSchemaAdapters({ dataRulesToSchemaText } = {}) {
  return {
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

    validateSchemaRows(schemaRows) {
      return validateSchemaRowsHelper({ schemaRows });
    },
  };
}

export { createGeneratorRuntimeSchemaAdapters };
