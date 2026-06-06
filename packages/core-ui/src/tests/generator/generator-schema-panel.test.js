import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import * as generatorSchemaPanelExports from '../../../js/gui_components/generator/schema-panel/index.js';
import { createGeneratorSchemaPanelComponent } from '../../../js/gui_components/generator/schema-panel/index.js';

describe('GeneratorSchemaPanel', () => {
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
    expect(generatorSchemaPanelExports.createGeneratorSchemaPanelComponent).toBe(createGeneratorSchemaPanelComponent);
    expect(generatorSchemaPanelExports.GeneratorSchemaPanelController).toBeUndefined();
    expect(generatorSchemaPanelExports.GeneratorSchemaPanelView).toBeUndefined();
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

    const component = createGeneratorSchemaPanelComponent({
      root: document.getElementById('root'),
      documentObj: document,
      props: {
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
