import { createConfiguredGeneratorForPage, countGeneratorEnumColumns } from './data-generator-generation-actions.js';
import { updateGeneratorPairwiseButtonVisibility } from './data-generator-generation-actions.js';

function createGeneratorSchemaGenerationService({
  syncSchemaRowsFromTextMode,
  validateSchemaRows,
  schemaRowsToSpec,
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
