import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createGeneratorPreviewComponent } from '../../../js/gui_components/generator/preview/index.js';

describe('GeneratorPreviewView', () => {
  let dom;

  function getOutputPreviewTextArea() {
    return document.querySelector('[data-role="generator-output-preview"]');
  }

  function getPreviewButton() {
    return document.querySelector('[data-role="generator-preview-button"]');
  }

  function getPreviewRowsInput() {
    return document.querySelector('[data-role="preview-rows-count-control"] input');
  }

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
    const rowCountControl = {
      destroy: jest.fn(),
      getParsedValue: jest.fn(() => ({
        value: 10,
        valid: true,
        errors: [],
      })),
    };
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
          root.innerHTML = `<label>${props.label}<input${props.inputId ? ` id="${props.inputId}"` : ''} max="${props.max}" value="${props.value}" /></label>`;
          return rowCountControl;
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

    expect(getPreviewRowsInput()).not.toBeNull();
    expect(getPreviewRowsInput().value).toBe('10');
    expect(getOutputPreviewTextArea().value).toBe('csv:sync:2');
    expect(document.querySelector('.shared-generator-preview')).not.toBeNull();
    expect(document.querySelector('.shared-generator-preview-head')).not.toBeNull();
    expect(document.querySelector('.shared-generator-preview-controls')).not.toBeNull();
    expect(document.querySelector('.shared-generator-output-preview')).not.toBeNull();
    expect(document.querySelector('.shared-generator-data-table-preview')).not.toBeNull();
    expect(document.querySelector('[data-role="generator-preview-button"]')).not.toBeNull();
    expect(document.querySelector('[data-role="generator-output-preview"]')).not.toBeNull();
    expect(document.querySelector('[data-role="generator-preview-grid"]')).not.toBeNull();
    const previewHelpIcon = document.querySelector('.shared-button-with-help [data-help-role="help-icon"]');
    expect(previewHelpIcon?.getAttribute('data-help')).toBe('shared-generator-preview-help');
    expect(previewHelpIcon?.hasAttribute('data-help-text')).toBe(false);
    expect(getPreviewRowsInput().id).toBe('');
    expect(getPreviewButton().id).toBe('');
    expect(getOutputPreviewTextArea().id).toBe('');
    expect(document.querySelector('[data-role="generator-preview-grid"]').id).toBe('');

    component.setOutputPreviewText('json:sync:3');
    expect(getOutputPreviewTextArea().value).toBe('json:sync:3');

    component.setPreviewDataTable(fakeDataTable);
    expect(setGridFromGenericDataTable).toHaveBeenCalledWith(fakeDataTable);
    expect(component.getPreviewDataTable()).toBe(fakeDataTable);
    component.renderOutputPreview('json', {
      canExport: jest.fn(() => true),
      getDataTableAs: jest.fn(() => 'json:sync:1'),
    });
    expect(getOutputPreviewTextArea().value).toBe('json:sync:1');
    expect(component.getPreviewRowCount()).toEqual({
      value: 10,
      valid: true,
      errors: [],
    });
    expect(rowCountControl.getParsedValue).toHaveBeenCalledTimes(1);

    getPreviewButton().click();
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
            root.innerHTML = `<input${props.inputId ? ` id="${props.inputId}"` : ''} value="${props.value}" />`;
            return { destroy() {} };
          },
          createPreviewGrid: () => ({ tableApi: null, gridApi: null }),
          updateHelpHints: jest.fn(),
        },
      });

      expect(
        isolatedDom.window.document.querySelector('[data-role="preview-rows-count-control"] input')
      ).not.toBeNull();
      expect(isolatedDom.window.document.querySelector('[data-role="generator-preview-button"]').id).toBe('');
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
        root.innerHTML = `<label>${props.label}<input${props.inputId ? ` id="${props.inputId}"` : ''} value="${props.value}" /></label>`;
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

  test('exposes parsed preview row count through the component API', () => {
    const component = createGeneratorPreviewComponent({
      root: document.getElementById('root'),
      documentObj: document,
      services: {
        createPreviewGrid: () => ({ tableApi: null, gridApi: null }),
        updateHelpHints: jest.fn(),
      },
    });

    const rowCountInput = getPreviewRowsInput();
    rowCountInput.value = '99';
    rowCountInput.dispatchEvent(new dom.window.Event('input', { bubbles: true }));

    expect(component.getPreviewRowCount()).toEqual({
      value: 50,
      valid: false,
      errors: ['Preview Items Count must be less than or equal to 50.'],
    });

    component.destroy();
  });

  test('reads preview row count only through the mounted row-count component API', () => {
    const rowCountControl = {
      destroy: jest.fn(),
      getParsedValue: jest.fn(() => ({
        value: 7,
        valid: true,
        errors: [],
      })),
    };

    const component = createGeneratorPreviewComponent({
      root: document.getElementById('root'),
      documentObj: document,
      services: {
        createRowCountControl: jest.fn(() => rowCountControl),
        createPreviewGrid: () => ({ tableApi: null, gridApi: null }),
        updateHelpHints: jest.fn(),
      },
    });

    expect(component.getPreviewRowCount()).toEqual({
      value: 7,
      valid: true,
      errors: [],
    });
    expect(rowCountControl.getParsedValue).toHaveBeenCalledTimes(1);
    expect(getPreviewRowsInput()).toBeNull();

    component.destroy();
  });
});
