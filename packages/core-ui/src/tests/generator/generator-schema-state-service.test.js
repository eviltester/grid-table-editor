import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorSchemaStateService } from '../../../js/gui_components/generator/runtime/generator-schema-state-service.js';

describe('createGeneratorSchemaStateService', () => {
  test('prefers the mounted shared schema-definition component when available', () => {
    const schemaDefinition = {
      getState: jest.fn(() => ({ rows: [{ id: 'mounted-row' }], isTextMode: true })),
      getTokens: jest.fn(() => [{ kind: 'rule' }]),
      setRows: jest.fn(),
      setTokens: jest.fn(),
      setTextMode: jest.fn(),
      render: jest.fn(),
    };
    const updatePairwiseButtonVisibility = jest.fn();

    const service = createGeneratorSchemaStateService({
      getSchemaDefinition: () => schemaDefinition,
      getSchemaSession: () => null,
      updatePairwiseButtonVisibility,
    });

    expect(service.getCurrentSchemaState()).toEqual({
      rows: [{ id: 'mounted-row' }],
      errors: [],
      isTextMode: true,
    });
    expect(service.getRows()).toEqual([{ id: 'mounted-row' }]);
    expect(service.getTokens()).toEqual([{ kind: 'rule' }]);
    expect(service.getTextMode()).toBe(true);

    service.setRows([{ id: 'next-row' }]);
    service.setTokens([{ kind: 'blank' }]);
    service.setTextMode(false);
    service.renderSchemaRows();

    expect(schemaDefinition.setRows).toHaveBeenCalledWith([{ id: 'next-row' }]);
    expect(schemaDefinition.setTokens).toHaveBeenCalledWith([{ kind: 'blank' }]);
    expect(schemaDefinition.setTextMode).toHaveBeenCalledWith(false);
    expect(schemaDefinition.render).toHaveBeenCalledTimes(1);
    expect(updatePairwiseButtonVisibility).toHaveBeenCalledTimes(1);
  });

  test('falls back to schema session state when the shared schema-definition component is not mounted', () => {
    const schemaSession = {
      getRows: jest.fn(() => [{ id: 'session-row' }]),
      getTokens: jest.fn(() => [{ kind: 'session-token' }]),
      getTextMode: jest.fn(() => false),
      setRows: jest.fn(),
      setTokens: jest.fn(),
      setTextMode: jest.fn(),
    };

    const service = createGeneratorSchemaStateService({
      getSchemaDefinition: () => null,
      getSchemaSession: () => schemaSession,
      updatePairwiseButtonVisibility: jest.fn(),
    });

    expect(service.getCurrentSchemaState()).toEqual({
      rows: [{ id: 'session-row' }],
      errors: [],
      isTextMode: false,
    });

    service.setRows([{ id: 'next-row' }]);
    service.setTokens([{ kind: 'blank' }]);
    service.setTextMode(true);

    expect(schemaSession.setRows).toHaveBeenCalledWith([{ id: 'next-row' }]);
    expect(schemaSession.setTokens).toHaveBeenCalledWith([{ kind: 'blank' }]);
    expect(schemaSession.setTextMode).toHaveBeenCalledWith(true);
  });
});
