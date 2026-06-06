import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorRuntimeFactories } from '../../../js/gui_components/generator/runtime/create-generator-runtime-factories.js';

describe('createGeneratorRuntimeFactories', () => {
  test('builds mount and dependency factories for the runtime shell', () => {
    const schemaTextToDataRules = jest.fn();
    const schemaRowsToSpec = jest.fn();
    const schemaRowsToSpecWithTokens = jest.fn();
    const validateSchemaRows = jest.fn();
    const dataRulesToSchemaText = jest.fn();
    const sampleSchemaText = 'Name\nenum(a,b)';

    const factories = createGeneratorRuntimeFactories({
      schemaTextToDataRules,
      schemaRowsToSpec,
      schemaRowsToSpecWithTokens,
      validateSchemaRows,
      dataRulesToSchemaText,
      sampleSchemaText,
    });

    expect(typeof factories.createPageRuntimeMount).toBe('function');
    expect(typeof factories.createRuntimeDependencies).toBe('function');
  });
});
