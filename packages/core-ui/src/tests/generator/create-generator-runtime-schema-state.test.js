import { describe, expect, jest, test } from '@jest/globals';
import { defineGeneratorPageSchemaState } from '../../../js/gui_components/generator/runtime/define-generator-page-schema-state.js';

describe('defineGeneratorPageSchemaState', () => {
  test('bridges schema state properties onto the page service', () => {
    const generatorSchemaState = {
      getRows: jest.fn(() => [{ id: 'row-1' }]),
      setRows: jest.fn(),
      getTokens: jest.fn(() => [{ kind: 'rule' }]),
      setTokens: jest.fn(),
      getTextMode: jest.fn(() => true),
      setTextMode: jest.fn(),
    };
    const runtime = { generatorSchemaState };

    defineGeneratorPageSchemaState(runtime, {
      getPageService: () => runtime,
    });

    expect(runtime.schemaRows).toEqual([{ id: 'row-1' }]);
    expect(runtime.schemaTextTokens).toEqual([{ kind: 'rule' }]);
    expect(runtime.isTextMode).toBe(true);

    runtime.schemaRows = [{ id: 'row-2' }];
    runtime.schemaTextTokens = [{ kind: 'blank' }];
    runtime.isTextMode = false;

    expect(generatorSchemaState.setRows).toHaveBeenCalledWith([{ id: 'row-2' }]);
    expect(generatorSchemaState.setTokens).toHaveBeenCalledWith([{ kind: 'blank' }]);
    expect(generatorSchemaState.setTextMode).toHaveBeenCalledWith(false);
  });
});
