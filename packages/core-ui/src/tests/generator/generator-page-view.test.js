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
    const component = createGeneratorPageComponent({
      root: document.getElementById('root'),
      documentObj: document,
      props: {
        controlsProps: { selectedFormat: 'csv' },
        previewProps: { outputPreviewText: 'csv:sync:2' },
        schemaDefinitionProps: { headingText: 'Schema' },
      },
      services: {
        createTimedStatusPresenter: () => ({
          show() {},
          clear() {},
        }),
        createGeneratorControlsComponent: ({ root }) => {
          root.innerHTML = '<div id="generatorControlsMounted">controls</div>';
          return {
            update() {},
            destroy() {},
            getFormatOptionsPanel() {
              return null;
            },
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
          return { update() {}, destroy() {} };
        },
      },
    });

    expect(document.querySelector('.generator-page')).not.toBeNull();
    expect(document.getElementById('generatorControlsMounted')).not.toBeNull();
    expect(document.getElementById('generatorPreviewMounted')).not.toBeNull();
    expect(document.getElementById('generatorSchemaMounted')).not.toBeNull();

    component.destroy();
    expect(document.getElementById('root').childElementCount).toBe(0);
  });
});
