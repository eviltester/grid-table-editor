import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import * as schemaPanelExports from '../../../js/gui_components/shared/schema-panel/index.js';
import { createSchemaPanelComponent } from '../../../js/gui_components/shared/schema-panel/index.js';

describe('SchemaPanel app host configuration', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;
  });

  afterEach(() => {
    dom.window.close();
    delete global.document;
    delete global.window;
  });

  test('public barrel is component-factory-only', () => {
    expect(schemaPanelExports.createSchemaPanelComponent).toBe(createSchemaPanelComponent);
    expect(schemaPanelExports.SchemaPanelController).toBeUndefined();
    expect(schemaPanelExports.SchemaPanelView).toBeUndefined();
  });

  test('mounts shared schema definition inside the app schema edit zone', () => {
    const schemaDefinition = {
      update: jest.fn(),
      destroy: jest.fn(),
      getState: jest.fn(() => ({ isTextMode: false })),
    };
    const createSharedSchemaDefinitionComponent = jest.fn(({ root }) => {
      root.innerHTML = '<div data-role="shared-schema-mounted">schema</div>';
      return schemaDefinition;
    });

    const component = createSchemaPanelComponent({
      root: document.getElementById('root'),
      props: {
        className: 'test-data-schema-edit-zone shared-schema-section',
        rootDataRole: 'test-data-schema-panel-root',
        schemaDefinitionRootDataRole: 'schema-definition-root',
        ariaLabel: 'Test data schema panel',
        ids: { schemaDefinitionRoot: 'testDataSchemaDefinition' },
        schemaDefinitionProps: {
          headingText: 'Schema Definition',
        },
      },
      services: {
        createSharedSchemaDefinitionComponent,
      },
    });

    const panelRoot = document.querySelector('[data-role="test-data-schema-panel-root"]');
    const schemaRoot = document.querySelector('[data-role="schema-definition-root"]');

    expect(panelRoot).not.toBeNull();
    expect(panelRoot.classList.contains('test-data-schema-edit-zone')).toBe(true);
    expect(schemaRoot.id).toBe('testDataSchemaDefinition');
    expect(document.querySelector('[data-role="shared-schema-mounted"]')).not.toBeNull();
    expect(component.getSchemaDefinition()).toBe(schemaDefinition);

    component.update({
      schemaDefinitionProps: {
        headingText: 'Updated Schema',
      },
    });

    expect(schemaDefinition.update).toHaveBeenLastCalledWith(
      expect.objectContaining({
        headingText: 'Updated Schema',
      })
    );

    component.destroy();
    expect(schemaDefinition.destroy).toHaveBeenCalled();
    expect(document.getElementById('root').childElementCount).toBe(0);
  });
});
