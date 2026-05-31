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
});
