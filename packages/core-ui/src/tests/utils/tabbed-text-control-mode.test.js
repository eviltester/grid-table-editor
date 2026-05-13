import { JSDOM } from 'jsdom';
import { TabbedTextControl } from '../../../js/gui_components/tabbed-text-control.js';

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
    const modeHelpIcon = host.querySelector('#previewEditModeHelpIcon');
    const autoPreviewLabel = host.querySelector('#autoPreviewLabel');
    expect(modeHelpIcon).not.toBeNull();
    expect(autoPreviewLabel).not.toBeNull();
    expect(
      autoPreviewLabel.compareDocumentPosition(modeHelpIcon) & dom.window.Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    modeHelpIcon._tippy = { setContent: jest.fn() };
    tabs._syncPreviewEditButtonLabel();
    expect(modeButton.innerText).toBe('Preview (10)');
    expect(modeHelpIcon.getAttribute('data-help-text')).toContain('sample of the first 10 rows');
    expect(modeHelpIcon.getAttribute('data-help-text')).toContain('switch to Edit mode');
    expect(modeHelpIcon._tippy.setContent).toHaveBeenCalledWith(expect.stringContaining('sample of the first 10 rows'));

    modeButton.click();
    expect(modeButton.innerText).toBe('Edit');
    expect(modeHelpIcon.getAttribute('data-help-text')).toContain('full grid text');
    expect(modeHelpIcon.getAttribute('data-help-text')).toContain('Set Grid From Text');
    expect(modeHelpIcon._tippy.setContent).toHaveBeenLastCalledWith(expect.stringContaining('full grid text'));
  });

  test('selecting Code defaults to C# subtask and exposes language code subtasks', () => {
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
    expect(host.querySelector('.subtask-select.active-type .subtask-select-action').textContent).toBe('C#');
    expect(host.querySelector('li.active-type a').getAttribute('data-type')).toBe('csharp');
    const codeSubtasks = Array.from(host.querySelectorAll('#conversionSubtasks .subtask-select-action')).map((elem) =>
      elem.textContent.trim()
    );
    expect(codeSubtasks).toEqual(['C#', 'Java', 'JavaScript', 'Kotlin', 'Perl', 'PHP', 'Python', 'Ruby', 'TypeScript']);
    expect(controller.renderTextFromGrid).toHaveBeenCalledTimes(1);
    expect(controller.setFileFormatType).toHaveBeenCalledTimes(1);
    expect(controller.setOptionsViewForFormatType).toHaveBeenCalledTimes(1);

    host.querySelector('#type-code-unit-test .type-select-action').click();
    const unitTestSubtasks = Array.from(host.querySelectorAll('#conversionSubtasks .subtask-select-action')).map(
      (elem) => elem.textContent.trim()
    );
    expect(unitTestSubtasks).toEqual([
      'C#',
      'Java',
      'JavaScript',
      'Kotlin',
      'Perl',
      'PHP',
      'Python',
      'Ruby',
      'TypeScript',
    ]);
    expect(host.querySelector('.subtask-select.active-type .subtask-select-action').textContent).toBe('C#');
    expect(host.querySelector('li.active-type a').getAttribute('data-type')).toBe('xunit');

    const typeScriptUnitTestTab = Array.from(host.querySelectorAll('#conversionSubtasks .subtask-select-action')).find(
      (elem) => elem.textContent.trim() === 'TypeScript'
    );
    typeScriptUnitTestTab.click();
    expect(host.querySelector('.subtask-select.active-type .subtask-select-action').textContent).toBe('TypeScript');
    expect(host.querySelector('li.active-type a').getAttribute('data-type')).toBe('jest');
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
        'code-unit-test',
        'gherkin',
        'html',
        'asciitable',
      ])
    );
  });
});
