import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorRuntimeShellConfig } from '../../../js/gui_components/generator/runtime/create-generator-runtime-shell-config.js';

describe('createGeneratorRuntimeShellConfig', () => {
  test('builds shell config that preserves base state and exposes composed runtime factories', () => {
    const baseState = { parentElement: { id: 'root' } };
    const schemaTextToDataRules = jest.fn();
    const schemaRowsToSpec = jest.fn();
    const schemaRowsToSpecWithTokens = jest.fn();
    const validateSchemaRows = jest.fn();
    const dataRulesToSchemaText = jest.fn();
    const sampleSchemaText = 'Name\nenum(a,b)';

    const shellConfig = createGeneratorRuntimeShellConfig({
      baseState,
      schemaTextToDataRules,
      schemaRowsToSpec,
      schemaRowsToSpecWithTokens,
      validateSchemaRows,
      dataRulesToSchemaText,
      sampleSchemaText,
    });

    expect(shellConfig.baseState).toBe(baseState);
    expect(typeof shellConfig.createPageRuntimeMount).toBe('function');
    expect(typeof shellConfig.createRuntimeDependencies).toBe('function');
  });
});
