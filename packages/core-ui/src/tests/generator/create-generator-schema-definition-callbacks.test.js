import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorSchemaDefinitionCallbacks } from '../../../js/gui_components/generator/runtime/create-generator-schema-definition-callbacks.js';

describe('createGeneratorSchemaDefinitionCallbacks', () => {
  test('builds schema-definition callbacks that delegate through injected runtime boundaries', () => {
    const onSchemaError = jest.fn();
    const onSchemaClear = jest.fn();
    const onRowsChanged = jest.fn();

    const callbacks = createGeneratorSchemaDefinitionCallbacks({
      onSchemaError,
      onSchemaClear,
      onRowsChanged,
    });

    callbacks.onSchemaError('Bad schema');
    callbacks.onSchemaClear();
    callbacks.onRowsChanged();

    expect(onSchemaError).toHaveBeenCalledWith('Bad schema');
    expect(onSchemaClear).toHaveBeenCalledTimes(1);
    expect(onRowsChanged).toHaveBeenCalledTimes(1);
  });
});
