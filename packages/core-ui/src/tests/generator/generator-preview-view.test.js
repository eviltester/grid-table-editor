import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createGeneratorPreviewComponent } from '../../../js/gui_components/generator/preview/index.js';

describe('GeneratorPreviewView', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;
  });

  afterEach(() => {
    dom.window.close();
  });

  test('renders preview controls, updates text, and forwards preview data to the grid service', () => {
    const onPreview = jest.fn();
    const setGridFromGenericDataTable = jest.fn();
    const fakeDataTable = {
      getHeaders: () => ['Status'],
      getRows: () => [['active']],
    };

    const component = createGeneratorPreviewComponent({
      root: document.getElementById('root'),
      documentObj: document,
      props: {
        outputPreviewText: 'csv:sync:2',
      },
      services: {
        createRowCountControl: ({ root, props }) => {
          root.innerHTML = `<label>${props.label}<input id="${props.inputId}" max="${props.max}" value="${props.value}" /></label>`;
          return { destroy() {} };
        },
        createPreviewGrid: ({ rootElement }) => {
          rootElement.innerHTML = '<div data-role="fake-preview-grid"></div>';
          return {
            tableApi: { id: 'table' },
            gridApi: { setGridFromGenericDataTable },
          };
        },
        updateHelpHints: jest.fn(),
      },
      callbacks: {
        onPreview,
      },
    });

    expect(document.getElementById('previewRowsCount')).not.toBeNull();
    expect(document.getElementById('previewRowsCount').value).toBe('10');
    expect(document.getElementById('generatorOutputPreview').value).toBe('csv:sync:2');

    component.setOutputPreviewText('json:sync:3');
    expect(document.getElementById('generatorOutputPreview').value).toBe('json:sync:3');

    component.setPreviewDataTable(fakeDataTable);
    expect(setGridFromGenericDataTable).toHaveBeenCalledWith(fakeDataTable);

    document.getElementById('previewDataButton').click();
    expect(onPreview).toHaveBeenCalledTimes(1);
    expect(component.getPreviewTableApi()).toEqual({ id: 'table' });

    component.destroy();
    expect(document.getElementById('root').childElementCount).toBe(0);
  });

  test('can mount from the root ownerDocument without a global document', () => {
    const isolatedDom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    const originalDocument = global.document;
    const originalWindow = global.window;
    delete global.document;
    delete global.window;

    try {
      const component = createGeneratorPreviewComponent({
        root: isolatedDom.window.document.getElementById('root'),
        services: {
          createRowCountControl: ({ root, props }) => {
            root.innerHTML = `<input id="${props.inputId}" value="${props.value}" />`;
            return { destroy() {} };
          },
          createPreviewGrid: () => ({ tableApi: null, gridApi: null }),
          updateHelpHints: jest.fn(),
        },
      });

      expect(isolatedDom.window.document.getElementById('previewRowsCount')).not.toBeNull();
      component.destroy();
    } finally {
      global.document = originalDocument;
      global.window = originalWindow;
      isolatedDom.window.close();
    }
  });

  test('supports two instances in one document with distinct ids', () => {
    const isolatedDom = new JSDOM(
      '<!doctype html><html><body><div id="root-a"></div><div id="root-b"></div></body></html>'
    );
    global.document = isolatedDom.window.document;
    global.window = isolatedDom.window;

    const onPreviewA = jest.fn();
    const onPreviewB = jest.fn();

    const createServices = () => ({
      createRowCountControl: ({ root, props }) => {
        root.innerHTML = `<label>${props.label}<input id="${props.inputId}" value="${props.value}" /></label>`;
        return { destroy() {} };
      },
      createPreviewGrid: ({ rootElement }) => {
        rootElement.innerHTML = '<div data-role="fake-preview-grid"></div>';
        return { tableApi: null, gridApi: null };
      },
      updateHelpHints: jest.fn(),
    });

    const componentA = createGeneratorPreviewComponent({
      root: isolatedDom.window.document.getElementById('root-a'),
      documentObj: isolatedDom.window.document,
      props: {
        outputPreviewText: 'alpha',
        ids: {
          previewButton: 'previewDataButtonA',
          outputPreview: 'generatorOutputPreviewA',
          previewGrid: 'generatorPreviewGridA',
          rowCountInput: 'previewRowsCountA',
        },
      },
      services: createServices(),
      callbacks: { onPreview: onPreviewA },
    });

    const componentB = createGeneratorPreviewComponent({
      root: isolatedDom.window.document.getElementById('root-b'),
      documentObj: isolatedDom.window.document,
      props: {
        outputPreviewText: 'beta',
        ids: {
          previewButton: 'previewDataButtonB',
          outputPreview: 'generatorOutputPreviewB',
          previewGrid: 'generatorPreviewGridB',
          rowCountInput: 'previewRowsCountB',
        },
      },
      services: createServices(),
      callbacks: { onPreview: onPreviewB },
    });

    isolatedDom.window.document.getElementById('previewDataButtonA').click();
    expect(onPreviewA).toHaveBeenCalledTimes(1);
    expect(onPreviewB).not.toHaveBeenCalled();

    componentA.setOutputPreviewText('alpha-next');
    expect(isolatedDom.window.document.getElementById('generatorOutputPreviewA').value).toBe('alpha-next');
    expect(isolatedDom.window.document.getElementById('generatorOutputPreviewB').value).toBe('beta');

    componentA.destroy();
    componentB.destroy();
    isolatedDom.window.close();
  });
});
