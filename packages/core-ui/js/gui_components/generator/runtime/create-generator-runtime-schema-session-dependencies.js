import { createSchemaEditingSession } from '../../shared/test-data/schema/schema-controller.js';

function createGeneratorRuntimeSchemaSessionDependencies({
  generatorSchemaDefinitionSupport,
  faker,
  RandExp,
  schemaTextToDataRules,
  schemaRowsToSpecWithTokens,
  mapRuleToRow,
} = {}) {
  return {
    schemaSession: createSchemaEditingSession({
      createBlankSchemaRow: generatorSchemaDefinitionSupport?.createBlankRow,
      schemaTextToDataRules,
      faker,
      RandExp,
      mapRuleToRow,
      schemaRowsToSpecWithTokens,
    }),
  };
}

export { createGeneratorRuntimeSchemaSessionDependencies };
