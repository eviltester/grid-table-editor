import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorPageComponentRuntimeSchemaCallbacks } from '../../../js/gui_components/generator/runtime/create-generator-page-component-runtime-schema-callbacks.js';

describe('createGeneratorPageComponentRuntimeSchemaCallbacks', () => {
  test('maps runtime-owned schema behavior into schema callbacks', () => {
    const showSchemaErrorStatus = jest.fn();
    const clearSchemaErrorStatus = jest.fn();
    const updateAllPairsButtonVisibility = jest.fn();
    const runtime = {
      generatorSchemaRuntime: {
        showSchemaErrorStatus,
        clearSchemaErrorStatus,
      },
      updateAllPairsButtonVisibility,
    };

    const callbacks = createGeneratorPageComponentRuntimeSchemaCallbacks({
      runtime,
    });

    callbacks.onSchemaError('Bad schema');
    callbacks.onSchemaClear();
    callbacks.onRowsChanged();

    expect(showSchemaErrorStatus).toHaveBeenCalledWith('Bad schema');
    expect(clearSchemaErrorStatus).toHaveBeenCalledTimes(1);
    expect(updateAllPairsButtonVisibility).toHaveBeenCalledTimes(1);
  });
});
