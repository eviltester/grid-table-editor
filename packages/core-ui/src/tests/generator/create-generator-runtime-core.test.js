import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorRuntimeCore } from '../../../js/gui_components/generator/runtime/create-generator-runtime-core.js';

describe('createGeneratorRuntimeCore', () => {
  test('adds schema-state bridging on top of the lifecycle-backed runtime facade', () => {
    const generatorSchemaState = {
      getRows: jest.fn(() => [{ id: 'row-1' }]),
      setRows: jest.fn(),
      getTokens: jest.fn(() => [{ kind: 'rule' }]),
      setTokens: jest.fn(),
      getTextMode: jest.fn(() => true),
      setTextMode: jest.fn(),
    };

    const runtime = createGeneratorRuntimeCore({
      baseState: {
        parentElement: { id: 'root' },
        TabulatorCtor: function FakeTabulator() {},
        generatorViewState: {},
        generatorRuntimeActions: {},
        generatorSchemaState,
      },
      createPageRuntimeMount: jest.fn(),
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

  test('guards init when required runtime prerequisites are missing', () => {
    const createPageRuntimeMount = jest.fn();

    const missingParentRuntime = createGeneratorRuntimeCore({
      baseState: {
        parentElement: null,
        TabulatorCtor: function FakeTabulator() {},
        generatorViewState: {},
        generatorRuntimeActions: {},
        generatorSchemaState: {
          getRows: () => [],
          setRows: () => undefined,
          getTokens: () => [],
          setTokens: () => undefined,
          getTextMode: () => false,
          setTextMode: () => undefined,
        },
      },
      createPageRuntimeMount,
    });
    expect(() => missingParentRuntime.init()).toThrow('Generator page runtime requires a parentElement');

    const missingTabulatorRuntime = createGeneratorRuntimeCore({
      baseState: {
        parentElement: { id: 'root' },
        TabulatorCtor: null,
        generatorViewState: {},
        generatorRuntimeActions: {},
        generatorSchemaState: {
          getRows: () => [],
          setRows: () => undefined,
          getTokens: () => [],
          setTokens: () => undefined,
          getTextMode: () => false,
          setTextMode: () => undefined,
        },
      },
      createPageRuntimeMount,
    });
    expect(() => missingTabulatorRuntime.init()).toThrow('Tabulator library is not available');
    expect(createPageRuntimeMount).not.toHaveBeenCalled();
  });
});
