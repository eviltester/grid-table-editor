import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { within } from '@testing-library/dom';
import { mountTestDataGenerationPanel } from '../../../../js/gui_components/app/test-data-grid/index.js';

describe('test data schema editor compatibility', () => {
  let dom;

  async function flushUi() {
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  async function waitForCondition(predicate, { timeoutMs = 2000, intervalMs = 25 } = {}) {
    const startedAt = Date.now();
    while (Date.now() - startedAt < timeoutMs) {
      if (predicate()) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
    throw new Error('Timed out waiting for condition');
  }

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="host"></div></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
    global.Event = dom.window.Event;
    global.RandExp = function RandExp() {};
  });

  afterEach(() => {
    dom.window.close();
  });

  function setup(gridExtras = {}) {
    const importer = { setGridFromGenericDataTable: jest.fn(() => Promise.resolve()) };
    const renderer = { renderTextFromGrid: jest.fn(() => Promise.resolve('')) };
    mountTestDataGenerationPanel('host', importer, renderer, {
      getRowCount: jest.fn(() => 0),
      getSelectedRowIndexes: jest.fn(() => []),
      ...gridExtras,
    });
    return { importer, renderer };
  }

  test('renders row-based schema controls when initialized', () => {
    setup();
    const panelRoot = document.querySelector('[data-role="data-population-panel-root"]');
    expect(within(panelRoot).getByRole('button', { name: /^generate$/i })).toBeTruthy();
    expect(document.querySelector('[data-role="schema-rows-region"]')).toBeTruthy();
    expect(document.querySelector('[data-role="schema-textbox"]')).toBeTruthy();
    expect(document.querySelector('[data-role="schema-add-field"]')).toBeTruthy();
    expect(document.querySelector('[data-role="schema-mode-toggle"]')).toBeTruthy();
    expect(document.querySelector('[data-role="schema-mode-help"]')).toBeTruthy();
    expect(document.querySelector('[data-role="schema-error"]').textContent).toBe('');
  });

  test('mode radios update How Many from grid context', () => {
    setup({ getRowCount: jest.fn(() => 12), getSelectedRowIndexes: jest.fn(() => [1, 4, 5]) });
    const countInput = within(document.querySelector('[data-role="data-population-panel-root"]')).getByRole(
      'spinbutton',
      { name: 'How Many?' }
    );
    expect(countInput.value).toBe('1');

    const amendTableRadio = document.querySelector('input[value="amend-table"]');
    amendTableRadio.checked = true;
    amendTableRadio.dispatchEvent(new Event('change', { bubbles: true }));
    expect(countInput.value).toBe('12');

    const amendSelectedRadio = document.querySelector('input[value="amend-selected"]');
    amendSelectedRadio.checked = true;
    amendSelectedRadio.dispatchEvent(new Event('change', { bubbles: true }));
    expect(countInput.value).toBe('3');
  });

  test('refresh text preview button renders text on demand', async () => {
    const { renderer } = setup();
    within(document.querySelector('[data-role="data-population-panel-root"]'))
      .getByRole('button', { name: /refresh text preview/i })
      .click();
    await flushUi();
    expect(renderer.renderTextFromGrid).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[data-role="population-status"]').textContent).toContain('Text preview refreshed');
  });

  test('invalid schema reports validation error', async () => {
    setup();
    document.querySelector('[data-role="schema-textbox"]').value = 'OnlyAHeader';
    within(document.querySelector('[data-role="data-population-panel-root"]'))
      .getByRole('button', {
        name: /^generate$/i,
      })
      .click();
    await flushUi();
    expect(document.querySelector('[data-role="schema-error"]').textContent).toContain(
      'Row 1: column name is required.'
    );
  });

  test('pairwise generation reports error when fewer than two enum columns exist', async () => {
    setup();
    const schemaTextArea = document.querySelector('[data-role="schema-textbox"]');
    schemaTextArea.value = 'OnlyEnum\nenum(a,b)';
    schemaTextArea.dispatchEvent(new Event('input', { bubbles: true }));
    await waitForCondition(() => {
      const nameInput = document.querySelector(
        '[data-role="schema-rows-region"] .shared-schema-row input[data-field="name"]'
      );
      const sourceTypeSelect = document.querySelector(
        '[data-role="schema-rows-region"] .shared-schema-row select[data-field="sourceType"]'
      );
      return String(nameInput?.value || '').trim() === 'OnlyEnum' && String(sourceTypeSelect?.value || '') === 'enum';
    });
    document.querySelector('[data-role="data-population-panel-root"] [data-role="generate-pairwise-button"]').click();
    await flushUi();
    expect(document.querySelector('[data-role="schema-error"]').textContent).toContain(
      'Pairwise generation requires at least 2 enum columns.'
    );
  });
});
