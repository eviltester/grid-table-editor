import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { CombinationsTestDataGenerator } from '@anywaydata/core/data_generation/n-wise/combinationsTestDataGenerator.js';
import {
  createConfiguredGeneratorFromSchemaRows,
  schemaRowsToGenerationSpec,
} from '../../shared/test-data/generation/generation-controller.js';
import { createUiGenerationSessionService } from '../../shared/test-data/generation/ui-generation-session-service.js';
import {
  SOURCE_TYPE_FAKER,
  SOURCE_TYPE_DOMAIN,
  SOURCE_TYPE_REGEX,
  SOURCE_TYPE_LITERAL,
  SOURCE_TYPE_ENUM,
  buildRuleSpecFromSchemaRow,
  extractLiteralValueFromRuleSpec,
  extractRegexValueFromRuleSpec,
} from '../../shared/schema-row-rule-mapper.js';

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
  function getValidatedSchemaState(options) {
    const parsed = options?.schemaState ||
      syncSchemaRowsFromTextMode?.({
        showErrors: options?.showErrors === true,
        applySemanticValidation: options?.applySemanticValidation === true,
      }) || { rows: [], errors: [] };

    if (parsed.errors?.length > 0) {
      return { rows: parsed.rows || [], errors: parsed.errors };
    }

    return validateSchemaRows(parsed.rows || []);
  }

  function createConfiguredGenerator(validationOptions) {
    const schemaState = getValidatedSchemaState(validationOptions);
    if (schemaState.errors.length > 0) {
      return { generator: null, errors: schemaState.errors, rows: schemaState.rows };
    }

    return createConfiguredGeneratorFromSchemaRows({
      schemaRows: schemaState.rows,
      validateSchemaRows: () => schemaState,
      schemaRowsToSpec,
      schemaText: getSchemaText?.() || '',
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
    });
  }

  const generationEngine = createUiGenerationSessionService({
    getValidatedSchemaState,
    getSchemaText,
    schemaRowsToSpec,
    schemaRowsToGenerationSpec: (schemaRows) =>
      schemaRowsToGenerationSpec({
        schemaRows,
        buildRuleSpecFromSchemaRow,
        SOURCE_TYPE_REGEX,
      }),
    schemaSource: 'generator-page',
    GenericDataTableClass: GenericDataTable,
    CombinationsTestDataGeneratorClass: CombinationsTestDataGenerator,
    createConfiguredGenerator,
    faker,
    RandExp,
  });

  return {
    createSessionContext(options) {
      return generationEngine.createSessionContext(options);
    },

    getPairwiseVisibility({ getCurrentSchemaState } = {}) {
      return generationEngine.getPairwiseVisibility({
        schemaState: typeof getCurrentSchemaState === 'function' ? getCurrentSchemaState() : undefined,
      });
    },

    getCombinationInput(options) {
      const schemaState = getValidatedSchemaState(options);
      if (schemaState.errors.length > 0) {
        return {
          enumColumnCount: 0,
          enumValueCounts: [],
          errors: schemaState.errors,
          rows: schemaState.rows || [],
        };
      }
      return generationEngine.getCombinationInput({ ...options, schemaState });
    },

    generateRows({ rowCount, options } = {}) {
      return generationEngine.generateRows({ rowCount, validationOptions: options });
    },

    generatePairwise(options) {
      return generationEngine.generatePairwise({ validationOptions: options });
    },

    generateCombinations({ strength, algorithm, options } = {}) {
      return generationEngine.generateCombinations({
        strength,
        algorithm,
        validationOptions: options,
      });
    },
  };
}

export { createGeneratorSchemaGenerationService };
