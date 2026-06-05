import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createGeneratorPageComponent } from '../../../js/gui_components/generator/page/index.js';

describe('GeneratorPageView', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;
  });

  afterEach(() => {
    dom.window.close();
  });

  test('renders generator page roots and mounts child feature components', () => {
    const createTimedStatusPresenter = jest.fn(() => ({
      show() {},
      clear() {},
    }));
    const schemaComponent = {
      update() {},
      destroy() {},
    };
    const component = createGeneratorPageComponent({
      root: document.getElementById('root'),
      documentObj: document,
      props: {
        controlsProps: { selectedFormat: 'csv' },
        previewProps: { outputPreviewText: 'csv:sync:2' },
        schemaDefinitionProps: { headingText: 'Schema' },
      },
      services: {
        createTimedStatusPresenter,
        createGeneratorControlsComponent: ({ root }) => {
          root.innerHTML = '<div id="generatorControlsMounted">controls</div>';
          return {
            update() {},
            destroy() {},
          };
        },
        createGeneratorPreviewComponent: ({ root }) => {
          root.innerHTML = '<div id="generatorPreviewMounted">preview</div>';
          return {
            update() {},
            destroy() {},
            getPreviewGrid() {
              return { setGridFromGenericDataTable() {} };
            },
            getPreviewTableApi() {
              return { id: 'table' };
            },
          };
        },
        createSharedSchemaDefinitionComponent: ({ root }) => {
          root.innerHTML = '<div id="generatorSchemaMounted">schema</div>';
          return schemaComponent;
        },
      },
    });

    expect(document.querySelector('.shared-generator-page')).not.toBeNull();
    expect(document.querySelector('.generator-page')).not.toBeNull();
    expect(document.querySelector('[data-role="generator-controls-root"]')).not.toBeNull();
    expect(document.querySelector('[data-role="generator-preview-root"]')).not.toBeNull();
    expect(document.querySelector('[data-role="generator-schema-definition-root"]')).not.toBeNull();
    expect(document.getElementById('generatorControlsMounted')).not.toBeNull();
    expect(document.getElementById('generatorPreviewMounted')).not.toBeNull();
    expect(document.getElementById('generatorSchemaMounted')).not.toBeNull();
    expect(createTimedStatusPresenter).toHaveBeenCalledWith(
      expect.objectContaining({
        documentObj: document,
        timeoutMs: 5000,
        resolveElement: expect.any(Function),
      })
    );

    component.destroy();
    expect(document.getElementById('root').childElementCount).toBe(0);
  });
});
