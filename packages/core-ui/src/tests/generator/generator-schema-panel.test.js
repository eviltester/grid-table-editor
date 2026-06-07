import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import * as schemaPanelExports from '../../../js/gui_components/shared/schema-panel/index.js';
import { createSchemaPanelComponent } from '../../../js/gui_components/shared/schema-panel/index.js';

describe('SchemaPanel generator host configuration', () => {
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

  test('renders generator schema wrapper and injects schema error display into the shared schema definition', () => {
    const createTimedStatusPresenter = jest.fn(() => ({
      show: jest.fn(),
      clear: jest.fn(),
      destroy: jest.fn(),
    }));
    const schemaDefinition = {
      update: jest.fn(),
      destroy: jest.fn(),
    };

    const component = createSchemaPanelComponent({
      root: document.getElementById('root'),
      documentObj: document,
      props: {
        className: 'generator-schema',
        sectionId: 'generatorSchemaSection',
        sectionOrder: '2',
        ariaLabelledBy: 'generatorSchemaHeading',
        rootDataRole: 'generator-schema-panel-root',
        schemaDefinitionRootDataRole: 'generator-schema-definition-root',
        useTimedSchemaErrorDisplay: true,
        schemaErrorTimeoutMs: 5000,
        schemaDefinitionProps: {
          headingText: 'Schema',
        },
      },
      services: {
        createTimedStatusPresenter,
        createSharedSchemaDefinitionComponent: ({ root }) => {
          root.innerHTML = '<div id="generatorSchemaMounted"><div data-role="schema-error"></div></div>';
          return schemaDefinition;
        },
      },
    });

    expect(document.querySelector('.generator-schema')).not.toBeNull();
    expect(document.querySelector('[data-role="generator-schema-definition-root"]')).not.toBeNull();
    expect(document.getElementById('generatorSchemaMounted')).not.toBeNull();
    expect(createTimedStatusPresenter).toHaveBeenCalledWith(
      expect.objectContaining({
        documentObj: document,
        timeoutMs: 5000,
        resolveElement: expect.any(Function),
      })
    );
    expect(schemaDefinition.update).toHaveBeenCalledWith(
      expect.objectContaining({
        headingText: 'Schema',
        schemaErrorDisplay: expect.any(Object),
      })
    );

    component.destroy();
    expect(schemaDefinition.destroy).toHaveBeenCalled();
    expect(document.getElementById('root').childElementCount).toBe(0);
  });
});
