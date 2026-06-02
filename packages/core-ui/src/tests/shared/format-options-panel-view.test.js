import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createFormatOptionsPanel } from '../../../js/gui_components/shared/format-options-panel/index.js';

function createStubPanel(parentElement, fieldName = 'prettyPrint') {
  return {
    addToGui() {
      parentElement.innerHTML = `
        <div class="stub-options">
          <label>${fieldName}<input type="checkbox" name="${fieldName}"></label>
          <div class="apply"><button class="apply-options">Apply</button></div>
        </div>
      `;
    },
    setFromOptions: jest.fn((options) => {
      const input = parentElement.querySelector(`input[name="${fieldName}"]`);
      if (input) {
        input.checked = options?.options?.[fieldName] === true;
      }
    }),
    setApplyCallback(callback) {
      const button = parentElement.querySelector('.apply-options');
      button.onclick = () => callback({ [fieldName]: true });
    },
    getOptionsFromGui: jest.fn(() => ({ [fieldName]: true })),
  };
}

describe('createFormatOptionsPanel', () => {
  let dom;
  let root;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;
    root = document.getElementById('root');
  });

  afterEach(() => {
    dom.window.close();
  });

  test('renders supported panel, tracks dirty state, and applies sanitized options', () => {
    const onApplyOptions = jest.fn();
    const onDirtyStateChanged = jest.fn();
    const updateHelpHints = jest.fn();
    const csvPanel = createStubPanel(root, 'header');
    const component = createFormatOptionsPanel({
      root,
      documentObj: document,
      services: {
        createPanelsForParent: () => ({
          csv: csvPanel,
        }),
        sanitizeOptionsForFormat: jest.fn((format, options) => ({
          outputFormat: format,
          options,
        })),
        updateHelpHints,
      },
      props: {
        selectedFormat: 'csv',
        currentOptions: { outputFormat: 'csv', options: { header: false } },
      },
      callbacks: {
        onApplyOptions,
        onDirtyStateChanged,
      },
    });

    const input = root.querySelector('input[name="header"]');
    const button = root.querySelector('.apply-options');

    expect(button.disabled).toBe(true);
    input.checked = true;
    input.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    expect(button.disabled).toBe(false);
    expect(onDirtyStateChanged).toHaveBeenLastCalledWith(true);

    button.click();

    expect(onApplyOptions).toHaveBeenCalledWith({
      type: 'csv',
      sanitized: {
        outputFormat: 'csv',
        options: { header: true },
      },
      rawOptions: { header: true },
    });
    expect(button.disabled).toBe(true);
    expect(component.getState().dirty).toBe(false);
    expect(updateHelpHints).toHaveBeenCalled();
  });

  test('hides the root when the selected format is unsupported', () => {
    const component = createFormatOptionsPanel({
      root,
      documentObj: document,
      services: {
        createPanelsForParent: () => ({}),
      },
      props: {
        selectedFormat: 'unknown',
      },
    });

    expect(component.isSupported()).toBe(false);
    expect(root.style.display).toBe('none');
  });
});
