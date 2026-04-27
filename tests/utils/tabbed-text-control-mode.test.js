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
    expect(host.querySelector("a.type-select-action[data-type='xml']")).toBeTruthy();

    const modeButton = host.querySelector('#previewEditModeButton');
    expect(modeButton.innerText).toBe('Preview (10)');

    modeButton.click();
    expect(modeButton.innerText).toBe('Edit');
  });
});
