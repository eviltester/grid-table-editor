import { JSDOM } from 'jsdom';
import { createGeneratorPageComponent } from '../../../js/gui_components/generator/page/create-generator-page-component.js';

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
    const component = createGeneratorPageComponent({
      root: document.getElementById('root'),
      documentObj: document,
      props: {
        controlsProps: { selectedFormat: 'csv' },
        previewProps: { outputPreviewText: 'csv:sync:2' },
        schemaDefinitionProps: { headingText: 'Schema' },
      },
      services: {
        createSchemaPanelComponent: ({ root }) => {
          root.innerHTML = '<div id="generatorSchemaPanelMounted">schema-panel</div>';
          return {
            update() {},
            destroy() {},
            getSchemaDefinition() {
              return { id: 'schema' };
            },
            getSchemaErrorDisplay() {
              return { id: 'schema-error' };
            },
          };
        },
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
      },
    });

    expect(document.querySelector('.shared-generator-page')).not.toBeNull();
    expect(document.querySelector('.generator-page')).not.toBeNull();
    expect(document.querySelector('[data-role="generator-schema-panel-root"]')).not.toBeNull();
    expect(document.querySelector('[data-role="generator-controls-root"]')).not.toBeNull();
    expect(document.querySelector('[data-role="generator-preview-root"]')).not.toBeNull();
    expect(document.getElementById('generatorSchemaPanelMounted')).not.toBeNull();
    expect(document.getElementById('generatorControlsMounted')).not.toBeNull();
    expect(document.getElementById('generatorPreviewMounted')).not.toBeNull();
    expect(component.getSchemaDefinition()).toEqual({ id: 'schema' });
    expect(component.getSchemaErrorDisplay()).toEqual({ id: 'schema-error' });

    component.destroy();
    expect(document.getElementById('root').childElementCount).toBe(0);
  });
});
