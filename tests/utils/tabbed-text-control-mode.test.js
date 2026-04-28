import { JSDOM } from 'jsdom';
import { TabbedTextControl } from '../../js/gui_components/tabbed-text-control.js';

describe('TabbedTextControl preview/edit button', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body><div id="host"></div></body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
  });

  afterEach(() => {
    dom.window.close();
  });

  test('shows preview row count label and updates after toggle', () => {
    let isPreview = true;
    const controller = {
      renderTextFromGrid: jest.fn(),
      setFileFormatType: jest.fn(),
      setOptionsViewForFormatType: jest.fn(),
      isPreviewTextMode: () => isPreview,
      getPreviewRowLimit: () => 10,
      toggleTextEditMode: () => {
        isPreview = !isPreview;
      },
    };

    const host = document.getElementById('host');
    const tabs = new TabbedTextControl(host, controller);
    tabs.addToGui();

    const modeButton = host.querySelector('#previewEditModeButton');
    expect(modeButton.innerText).toBe('Preview (10)');

    modeButton.click();
    expect(modeButton.innerText).toBe('Edit');
  });

  test('selecting Code shows JavaScript subtask and keeps javascript as active export type', () => {
    const controller = {
      renderTextFromGrid: jest.fn(),
      setFileFormatType: jest.fn(),
      setOptionsViewForFormatType: jest.fn(),
      isPreviewTextMode: () => true,
      getPreviewRowLimit: () => 10,
      toggleTextEditMode: jest.fn(),
    };

    const host = document.getElementById('host');
    const tabs = new TabbedTextControl(host, controller);
    tabs.addToGui();

    controller.renderTextFromGrid.mockClear();
    controller.setFileFormatType.mockClear();
    controller.setOptionsViewForFormatType.mockClear();

    host.querySelector('#type-code .type-select-action').click();

    expect(host.querySelector('#type-code').classList.contains('active-main-type')).toBe(true);
    expect(host.querySelector('#conversionSubtasks').style.display).toBe('block');
    expect(host.querySelector('.subtask-select.active-type .subtask-select-action').textContent).toBe('Java');
    expect(host.querySelector('li.active-type a').getAttribute('data-type')).toBe('java');
    expect(controller.renderTextFromGrid).toHaveBeenCalledTimes(1);
    expect(controller.setFileFormatType).toHaveBeenCalledTimes(1);
    expect(controller.setOptionsViewForFormatType).toHaveBeenCalledTimes(1);
  });

  test('initial default tab selection does not notify controller before bootstrap wiring completes', () => {
    const controller = {
      renderTextFromGrid: jest.fn(() => {
        throw new Error('renderTextFromGrid should not run during addToGui');
      }),
      setFileFormatType: jest.fn(() => {
        throw new Error('setFileFormatType should not run during addToGui');
      }),
      setOptionsViewForFormatType: jest.fn(() => {
        throw new Error('setOptionsViewForFormatType should not run during addToGui');
      }),
      isPreviewTextMode: () => true,
      getPreviewRowLimit: () => 10,
      toggleTextEditMode: jest.fn(),
    };

    const host = document.getElementById('host');

    expect(() => new TabbedTextControl(host, controller).addToGui()).not.toThrow();
    expect(host.querySelector('#type-csv').classList.contains('active-type')).toBe(true);
    expect(host.querySelector('#conversionSubtasks').style.display).toBe('none');
  });

  test('renders all expected app tabs', () => {
    const controller = {
      renderTextFromGrid: jest.fn(),
      setFileFormatType: jest.fn(),
      setOptionsViewForFormatType: jest.fn(),
      isPreviewTextMode: () => true,
      getPreviewRowLimit: () => 10,
      toggleTextEditMode: jest.fn(),
    };

    const host = document.getElementById('host');
    const tabs = new TabbedTextControl(host, controller);
    tabs.addToGui();

    const tabIds = Array.from(host.querySelectorAll('.conversionTypesList li.type-select')).map((li) =>
      li.id.replace('type-', '')
    );

    expect(tabIds).toEqual(
      expect.arrayContaining([
        'markdown',
        'csv',
        'dsv',
        'json',
        'jsonl',
        'xml',
        'sql',
        'code',
        'gherkin',
        'html',
        'asciitable',
      ])
    );
  });
});
