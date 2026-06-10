import {
  createConfiguredGeneratorForPage,
  countGeneratorEnumColumns,
  getGeneratorEnumValueCounts,
} from './data-generator-generation-actions.js';
import { updateGeneratorPairwiseButtonVisibility } from './data-generator-generation-actions.js';

function createGeneratorSchemaGenerationService({
  syncSchemaRowsFromTextMode,
  validateSchemaRows,
  schemaRowsToSpec,
  schemaTextToDataRules,
  getSchemaText,
  TestDataGeneratorClass,
  faker,
  RandExp,
} = {}) {
  return {
    createConfiguredGenerator() {
      return createConfiguredGeneratorForPage({
        syncSchemaRowsFromTextMode,
        validateSchemaRows,
        schemaRowsToSpec,
        schemaTextToDataRules,
        getSchemaText,
        TestDataGeneratorClass,
        faker,
        RandExp,
      });
    },

    countEnumColumns() {
      return countGeneratorEnumColumns({
        syncSchemaRowsFromTextMode,
        validateSchemaRows,
      });
    },

    getEnumValueCounts() {
      return getGeneratorEnumValueCounts({
        syncSchemaRowsFromTextMode,
        validateSchemaRows,
      });
    },

    getPairwiseVisibility({ getCurrentSchemaState } = {}) {
      return updateGeneratorPairwiseButtonVisibility({
        syncSchemaRowsFromTextMode,
        getCurrentSchemaState,
        validateSchemaRows,
      });
    },
  };
}

export { createGeneratorSchemaGenerationService };
