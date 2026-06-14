import { JSDOM } from 'jsdom';
import { fireEvent, within } from '@testing-library/dom';
import {
  splitTopLevelCommaSeparated,
  parseInitialParamEntries,
  buildParamsTextFromEditorEntries,
  openParamsEditorModal,
} from '../../../js/gui_components/shared/test-data/ui/params-editor-modal.js';

describe('params editor modal', () => {
  let dom;
  let getOverlay;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body class="theme-light"></body></html>', { url: 'https://example.com' });
    global.document = dom.window.document;
    global.window = dom.window;
    global.navigator = dom.window.navigator;
    getOverlay = () => document.querySelector('[data-role="params-editor-overlay"]');
  });

  afterEach(() => {
    dom.window.close();
    delete global.document;
    delete global.window;
    delete global.navigator;
  });

  test('splits top-level comma values while preserving nested arrays and quoted commas', () => {
    expect(splitTopLevelCommaSeparated('"Ada, Lovelace",["Bob","Cara"],style=13')).toEqual({
      values: ['"Ada, Lovelace"', '["Bob","Cara"]', 'style=13'],
      error: '',
    });
  });

  test('parses existing params into documented fields and infers editor modes', () => {
    const parsed = parseInitialParamEntries({
      params: [
        { name: 'locale', type: 'string', optional: true },
        { name: 'list', type: 'array', optional: false },
      ],
      initialParams: '("en-GB",["Ada","Bob"])',
    });

    expect(parsed.error).toBe('');
    expect(parsed.entries).toEqual([
      expect.objectContaining({ name: 'locale', value: 'en-GB', mode: 'text' }),
      expect.objectContaining({ name: 'list', value: '["Ada","Bob"]', mode: 'raw' }),
    ]);
  });

  test('builds params text using auto quoting and raw array preservation', () => {
    const result = buildParamsTextFromEditorEntries({
      entries: [
        { name: 'locale', type: 'string', value: 'en-GB', mode: 'auto', optional: false },
        { name: 'items', type: 'array', value: '["Ada","Bob"]', mode: 'auto', optional: false },
      ],
    });

    expect(result).toEqual({
      paramsText: '("en-GB",["Ada","Bob"])',
      errors: [],
    });
  });

  test('reports missing earlier params before later params are used', () => {
    const result = buildParamsTextFromEditorEntries({
      entries: [
        { name: 'first', type: 'string', value: '', mode: 'auto', optional: false },
        { name: 'second', type: 'string', value: 'later', mode: 'auto', optional: true },
      ],
    });

    expect(result.paramsText).toBe('("later")');
    expect(result.errors).toEqual(['Param first must be filled before later params can be used.']);
  });

  test('surfaces semantic validation errors from the injected validator', () => {
    const result = buildParamsTextFromEditorEntries({
      entries: [{ name: 'style', type: 'string', value: 'style=13', mode: 'raw', optional: false }],
      validateParams: () => ['Row 1: invalid domain params - unsupported option.'],
    });

    expect(result).toEqual({
      paramsText: '(style=13)',
      errors: ['Row 1: invalid domain params - unsupported option.'],
    });
  });

  test('disables apply and shows validation until a required value is entered', async () => {
    const promise = openParamsEditorModal({
      documentObj: document,
      windowObj: window,
      commandLabel: 'datatype.enum',
      helpModel: {
        summary: 'Enum helper',
        params: [{ name: 'values', type: 'comma-separated list', optional: false, example: 'active,inactive' }],
      },
      initialParams: '',
    });

    const dialog = within(getOverlay()).getByRole('dialog', { name: /edit params for datatype\.enum/i });
    const applyButton = within(dialog).getByRole('button', { name: /^apply$/i });
    const error = dialog.querySelector('[data-role="params-editor-error"]');
    const input = within(dialog).getByRole('textbox', { name: /values value/i });
    const preview = within(dialog).getByText('()', { selector: '[data-role="params-editor-preview"]' });

    expect(applyButton.disabled).toBe(true);
    expect(error.textContent).toContain('required');
    expect(preview.textContent).toBe('()');

    input.value = 'active,inactive,pending';
    fireEvent.input(input);

    expect(applyButton.disabled).toBe(false);
    expect(error.textContent).toBe('');
    expect(
      within(dialog).getByText('(active,inactive,pending)', { selector: '[data-role="params-editor-preview"]' })
    ).toBeTruthy();

    fireEvent.click(applyButton);
    await expect(promise).resolves.toBe('(active,inactive,pending)');
  });

  test('shows a warning when existing params cannot be mapped to the documented fields', async () => {
    const promise = openParamsEditorModal({
      documentObj: document,
      windowObj: window,
      commandLabel: 'food.ingredient',
      helpModel: {
        summary: 'Ingredient label',
        params: [{ name: 'locale', type: 'string', optional: true }],
      },
      initialParams: '("en","extra")',
    });

    const dialog = within(getOverlay()).getByRole('dialog', { name: /edit params for food\.ingredient/i });
    const warning = dialog.querySelector('[data-role="params-editor-warning"]');
    const applyButton = within(dialog).getByRole('button', { name: /^apply$/i });

    expect(warning.textContent).toContain('documented fields');
    expect(applyButton.disabled).toBe(true);

    fireEvent.click(within(dialog).getByRole('button', { name: /^cancel$/i }));
    await expect(promise).resolves.toBeNull();
  });
});
