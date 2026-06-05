import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorSchemaStateBridge } from '../../../js/gui_components/generator/runtime/generator-schema-state-bridge.js';

describe('generator schema state bridge', () => {
  test('prefers mounted shared schema definition state and setters when available', () => {
    const schemaDefinition = {
      getState: jest.fn(() => ({ rows: [{ id: 'mounted-row' }], isTextMode: true })),
      setRows: jest.fn(),
      getTokens: jest.fn(() => [{ kind: 'rule' }]),
      setTokens: jest.fn(),
      setTextMode: jest.fn(),
      render: jest.fn(),
    };
    const schemaSession = {
      getRows: jest.fn(() => [{ id: 'session-row' }]),
      setRows: jest.fn(),
      getTokens: jest.fn(() => [{ kind: 'session-token' }]),
      setTokens: jest.fn(),
      getTextMode: jest.fn(() => false),
      setTextMode: jest.fn(),
    };
    const updatePairwiseButtonVisibility = jest.fn();

    const bridge = createGeneratorSchemaStateBridge({
      getSchemaDefinition: () => schemaDefinition,
      getSchemaSession: () => schemaSession,
      updatePairwiseButtonVisibility,
    });

    expect(bridge.getRows()).toEqual([{ id: 'mounted-row' }]);
    expect(bridge.getTokens()).toEqual([{ kind: 'rule' }]);
    expect(bridge.getTextMode()).toBe(true);

    bridge.setRows([{ id: 'next-row' }]);
    bridge.setTokens([{ kind: 'blank' }]);
    bridge.setTextMode(false);
    bridge.renderSchemaRows();

    expect(schemaDefinition.setRows).toHaveBeenCalledWith([{ id: 'next-row' }]);
    expect(schemaDefinition.setTokens).toHaveBeenCalledWith([{ kind: 'blank' }]);
    expect(schemaDefinition.setTextMode).toHaveBeenCalledWith(false);
    expect(schemaDefinition.render).toHaveBeenCalledTimes(1);
    expect(updatePairwiseButtonVisibility).toHaveBeenCalledTimes(1);
    expect(schemaSession.setRows).not.toHaveBeenCalled();
    expect(schemaSession.setTokens).not.toHaveBeenCalled();
    expect(schemaSession.setTextMode).not.toHaveBeenCalled();
  });

  test('falls back to schema session state before the shared schema component is mounted', () => {
    const schemaSession = {
      getRows: jest.fn(() => [{ id: 'session-row' }]),
      setRows: jest.fn(),
      getTokens: jest.fn(() => [{ kind: 'session-token' }]),
      setTokens: jest.fn(),
      getTextMode: jest.fn(() => false),
      setTextMode: jest.fn(),
    };

    const bridge = createGeneratorSchemaStateBridge({
      getSchemaDefinition: () => null,
      getSchemaSession: () => schemaSession,
      updatePairwiseButtonVisibility: jest.fn(),
    });

    expect(bridge.getRows()).toEqual([{ id: 'session-row' }]);
    expect(bridge.getTokens()).toEqual([{ kind: 'session-token' }]);
    expect(bridge.getTextMode()).toBe(false);

    bridge.setRows([{ id: 'draft-row' }]);
    bridge.setTokens([{ kind: 'draft-token' }]);
    bridge.setTextMode(true);

    expect(schemaSession.setRows).toHaveBeenCalledWith([{ id: 'draft-row' }]);
    expect(schemaSession.setTokens).toHaveBeenCalledWith([{ kind: 'draft-token' }]);
    expect(schemaSession.setTextMode).toHaveBeenCalledWith(true);
  });
});
