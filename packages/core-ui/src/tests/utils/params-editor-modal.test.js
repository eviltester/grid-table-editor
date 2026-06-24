import { JSDOM } from 'jsdom';
import { fireEvent, within } from '@testing-library/dom';
import { jest } from '@jest/globals';
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
    global.tippy = jest.fn();
    dom.window.tippy = global.tippy;
    getOverlay = () => document.querySelector('[data-role="params-editor-overlay"]');
  });

  afterEach(() => {
    dom.window.close();
    delete global.document;
    delete global.window;
    delete global.navigator;
    delete global.tippy;
    delete dom.window.tippy;
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

  test('prefills explicit default values when there are no existing params', () => {
    const parsed = parseInitialParamEntries({
      params: [
        { name: 'start', type: 'integer', optional: true, defaultValue: '1' },
        { name: 'step', type: 'integer', optional: true, defaultValue: '1' },
        { name: 'zeropadding', type: 'integer', optional: true, defaultValue: '0' },
      ],
      initialParams: '',
    });

    expect(parsed.error).toBe('');
    expect(parsed.entries).toEqual([
      expect.objectContaining({ name: 'start', value: '1', defaultValue: '1' }),
      expect.objectContaining({ name: 'step', value: '1', defaultValue: '1' }),
      expect.objectContaining({ name: 'zeropadding', value: '0', defaultValue: '0' }),
    ]);
  });

  test('parses variadic documented params as a single editable list value', () => {
    const parsed = parseInitialParamEntries({
      params: [{ name: 'values', type: 'comma-separated list', optional: false, variadic: true }],
      initialParams: '(active,inactive,pending)',
    });

    expect(parsed.error).toBe('');
    expect(parsed.entries).toEqual([
      expect.objectContaining({ name: 'values', value: 'active,inactive,pending', mode: 'raw' }),
    ]);
  });

  test('maps named params to matching documented fields instead of positional slots', () => {
    const parsed = parseInitialParamEntries({
      params: [
        { name: 'start', type: 'string|number', optional: true },
        { name: 'step', type: 'number', optional: true, defaultValue: '1' },
        { name: 'type', type: 'string', optional: true },
        { name: 'outputFormat', type: 'string', optional: true },
        { name: 'inputFormat', type: 'string', optional: true },
      ],
      initialParams: '(step=10,outputFormat="YYYY-MM-DD")',
    });

    expect(parsed.error).toBe('');
    expect(parsed.entries).toEqual([
      expect.objectContaining({ name: 'start', value: '' }),
      expect.objectContaining({ name: 'step', value: '10' }),
      expect.objectContaining({ name: 'type', value: '' }),
      expect.objectContaining({ name: 'outputFormat', value: 'YYYY-MM-DD' }),
      expect.objectContaining({ name: 'inputFormat', value: '' }),
    ]);
  });

  test('supports mixed positional and named params in the same invocation', () => {
    const parsed = parseInitialParamEntries({
      params: [
        { name: 'start', type: 'string|number', optional: true },
        { name: 'step', type: 'number', optional: true },
        { name: 'type', type: 'string', optional: true },
        { name: 'outputFormat', type: 'string', optional: true },
      ],
      initialParams: '("2026-06-12T12:39:23Z",step=15,outputFormat="yyyy-MM-dd")',
    });

    expect(parsed.error).toBe('');
    expect(parsed.entries).toEqual([
      expect.objectContaining({ name: 'start', value: '2026-06-12T12:39:23Z' }),
      expect.objectContaining({ name: 'step', value: '15' }),
      expect.objectContaining({ name: 'type', value: '' }),
      expect.objectContaining({ name: 'outputFormat', value: 'yyyy-MM-dd' }),
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
      paramsText: '(locale="en-GB",items=["Ada","Bob"])',
      errors: [],
    });
  });

  test('builds positional-only params without named assignment for faker object arguments', () => {
    const result = buildParamsTextFromEditorEntries({
      entries: [
        {
          name: 'numberOrRange',
          type: 'number | { min: number; max: number; }',
          value: '{ min: 1, max: 9 }',
          mode: 'raw',
          optional: false,
          positionalOnly: true,
        },
      ],
    });

    expect(result).toEqual({
      paramsText: '({ min: 1, max: 9 })',
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

    expect(result.paramsText).toBe('(second="later")');
    expect(result.errors).toEqual(['Param first must be filled before later params can be used.']);
  });

  test('surfaces semantic validation errors from the injected validator', () => {
    const result = buildParamsTextFromEditorEntries({
      entries: [{ name: 'style', type: 'string', value: 'style=13', mode: 'raw', optional: false }],
      validateParams: () => ['Row 1: invalid domain params - unsupported option.'],
    });

    expect(result).toEqual({
      paramsText: '(style=style=13)',
      errors: ['Row 1: invalid domain params - unsupported option.'],
    });
  });

  test('auto quotes string values even when the editor input includes surrounding quotes', () => {
    const result = buildParamsTextFromEditorEntries({
      entries: [{ name: 'prefix', type: 'string', value: '"filename"', mode: 'text', optional: true }],
    });

    expect(result).toEqual({
      paramsText: '(prefix="filename")',
      errors: [],
    });
  });

  test('switches to named params when later values skip optional gaps', () => {
    const result = buildParamsTextFromEditorEntries({
      entries: [
        { name: 'start', type: 'integer', value: '1', mode: 'auto', optional: true },
        { name: 'step', type: 'integer', value: '1', mode: 'auto', optional: true },
        { name: 'prefix', type: 'string', value: 'filename', mode: 'auto', optional: true },
        { name: 'suffix', type: 'string', value: '', mode: 'auto', optional: true },
        { name: 'zeropadding', type: 'integer', value: '0', mode: 'auto', optional: true },
      ],
    });

    expect(result).toEqual({
      paramsText: '(start=1,step=1,prefix="filename",zeropadding=0)',
      errors: [],
    });
  });

  test('disables apply and shows validation until a required value is entered', async () => {
    const promise = openParamsEditorModal({
      documentObj: document,
      windowObj: window,
      commandLabel: 'datatype.enum',
      helpModel: {
        summary: 'Enum helper',
        params: [
          {
            name: 'values',
            type: 'comma-separated list',
            optional: false,
            variadic: true,
            example: 'active,inactive',
          },
        ],
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
    expect(error.hidden).toBe(false);
    expect(preview.textContent).toBe('()');

    input.value = 'active,inactive,pending';
    fireEvent.input(input);

    expect(applyButton.disabled).toBe(false);
    expect(error.textContent).toBe('');
    expect(error.hidden).toBe(true);
    expect(
      within(dialog).getByText('(active,inactive,pending)', {
        selector: '[data-role="params-editor-preview"]',
      })
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
    const error = dialog.querySelector('[data-role="params-editor-error"]');
    const applyButton = within(dialog).getByRole('button', { name: /^apply$/i });

    expect(warning.textContent).toContain('documented fields');
    expect(error.textContent).toBe('');
    expect(error.hidden).toBe(true);
    expect(applyButton.disabled).toBe(true);

    fireEvent.click(within(dialog).getByRole('button', { name: /^cancel$/i }));
    await expect(promise).resolves.toBeNull();
  });

  test('opens enum params with an existing unbounded list without showing an overflow warning', async () => {
    const promise = openParamsEditorModal({
      documentObj: document,
      windowObj: window,
      commandLabel: 'datatype.enum',
      helpModel: {
        summary: 'Enum helper',
        params: [{ name: 'values', type: 'comma-separated list', optional: false, variadic: true }],
      },
      initialParams: '(active,inactive,pending)',
    });

    const dialog = within(getOverlay()).getByRole('dialog', { name: /edit params for datatype\.enum/i });
    const warning = dialog.querySelector('[data-role="params-editor-warning"]');
    const input = within(dialog).getByRole('textbox', { name: /values value/i });

    expect(warning).toBeNull();
    expect(input.value).toBe('active,inactive,pending');

    fireEvent.click(within(dialog).getByRole('button', { name: /^cancel$/i }));
    await expect(promise).resolves.toBeNull();
  });

  test('renders checkbox-based req state and omits the format selector for auto increment defaults', async () => {
    const promise = openParamsEditorModal({
      documentObj: document,
      windowObj: window,
      commandLabel: 'autoIncrement.sequence',
      helpModel: {
        summary: 'Sequence helper',
        params: [
          { name: 'start', type: 'integer', optional: true, defaultValue: '1' },
          { name: 'step', type: 'integer', optional: true, defaultValue: '1' },
          { name: 'prefix', type: 'string', optional: true, defaultValue: '' },
          { name: 'suffix', type: 'string', optional: true, defaultValue: '' },
          { name: 'zeropadding', type: 'integer', optional: true, defaultValue: '0' },
        ],
      },
      initialParams: '',
    });

    const dialog = within(getOverlay()).getByRole('dialog', { name: /edit params for autoincrement\.sequence/i });
    const headerCells = Array.from(dialog.querySelectorAll('th')).map((cell) => cell.textContent.trim());
    expect(headerCells).toEqual(['Name', 'Type', 'Req', 'Value']);
    expect(dialog.querySelector('[data-role="params-editor-mode"]')).toBeNull();

    const reqBoxes = Array.from(dialog.querySelectorAll('[data-role="params-editor-required"]'));
    expect(reqBoxes).toHaveLength(5);
    expect(reqBoxes.every((box) => box.checked === false)).toBe(true);

    const startInput = within(dialog).getByRole('textbox', { name: /start value/i });
    const zeroPaddingInput = within(dialog).getByRole('textbox', { name: /zeropadding value/i });
    expect(startInput.value).toBe('1');
    expect(zeroPaddingInput.value).toBe('0');
    expect(dialog.textContent).toContain('Default: 1');
    expect(dialog.textContent).toContain('Default: 0');

    fireEvent.click(within(dialog).getByRole('button', { name: /^cancel$/i }));
    await expect(promise).resolves.toBeNull();
  });

  test('binds per-param tooltip help with descriptions, examples, and derived rules', async () => {
    const promise = openParamsEditorModal({
      documentObj: document,
      windowObj: window,
      commandLabel: 'number.int',
      helpModel: {
        summary: 'Integer helper',
        params: [
          {
            name: 'min',
            type: 'integer',
            optional: false,
            description: 'Lower bound for the generated integer.',
            example: '1',
          },
          {
            name: 'max',
            type: 'integer',
            optional: true,
            defaultValue: '10',
            description: 'Upper bound for the generated integer.',
            examples: ['10', '100'],
          },
        ],
      },
      initialParams: '(1,10)',
    });

    const dialog = within(getOverlay()).getByRole('dialog', { name: /edit params for number\.int/i });
    const helpIcons = dialog.querySelectorAll('[data-role="params-editor-param-help"]');
    expect(helpIcons).toHaveLength(2);
    expect(global.tippy).toHaveBeenCalled();

    expect(helpIcons[0].getAttribute('data-help-text')).toContain('<strong>min</strong>');
    expect(helpIcons[0].getAttribute('data-help-text')).toContain('Lower bound for the generated integer.');
    expect(helpIcons[0].getAttribute('data-help-text')).toContain('<strong>Examples:</strong>');
    expect(helpIcons[0].getAttribute('data-help-text')).toContain('<strong>Rules:</strong>');
    expect(helpIcons[0].getAttribute('data-help-text')).toContain('Required.');

    expect(helpIcons[1].getAttribute('data-help-text')).toContain('Optional.');
    expect(helpIcons[1].getAttribute('data-help-text')).toContain('Default: 10');
    expect(helpIcons[1].getAttribute('data-help-text')).toContain('<code>100</code>');

    fireEvent.click(within(dialog).getByRole('button', { name: /^cancel$/i }));
    await expect(promise).resolves.toBeNull();
  });

  test('adds command-level tooltip help next to the command label', async () => {
    const promise = openParamsEditorModal({
      documentObj: document,
      windowObj: window,
      commandLabel: 'number.int',
      helpModel: {
        heading: 'faker.number.int',
        summary: 'Generates an integer within the configured range.',
        docsUrl: 'https://example.com/docs/number-int',
        params: [{ name: 'min', type: 'integer', optional: true }],
      },
      initialParams: '',
    });

    const dialog = within(getOverlay()).getByRole('dialog', { name: /edit params for number\.int/i });
    const commandHelpIcon = dialog.querySelector('[data-role="params-editor-command-help"]');

    expect(commandHelpIcon).toBeTruthy();
    expect(commandHelpIcon.getAttribute('data-help-text')).toContain('<strong>faker.number.int</strong>');
    expect(commandHelpIcon.getAttribute('data-help-text')).toContain(
      'Generates an integer within the configured range.'
    );
    expect(commandHelpIcon.getAttribute('data-help-text')).toContain('https://example.com/docs/number-int');

    fireEvent.click(within(dialog).getByRole('button', { name: /^cancel$/i }));
    await expect(promise).resolves.toBeNull();
  });

  test('renders boolean params as radios instead of a text input and applies false', async () => {
    const promise = openParamsEditorModal({
      documentObj: document,
      windowObj: window,
      commandLabel: 'awd.domain.location.direction',
      helpModel: {
        summary: 'Returns a random direction.',
        params: [{ name: 'abbreviated', type: 'boolean', optional: true }],
      },
      initialParams: '',
    });

    const dialog = within(getOverlay()).getByRole('dialog', {
      name: /edit params for awd\.domain\.location\.direction/i,
    });

    expect(within(dialog).queryByRole('textbox', { name: /abbreviated value/i })).toBeNull();

    const unsetRadio = within(dialog).getByRole('radio', { name: /unset/i });
    const trueRadio = within(dialog).getByRole('radio', { name: /true/i });
    const falseRadio = within(dialog).getByRole('radio', { name: /false/i });

    expect(unsetRadio.checked).toBe(true);
    expect(trueRadio.checked).toBe(false);
    expect(falseRadio.checked).toBe(false);

    fireEvent.click(falseRadio);

    expect(
      within(dialog).getByText('(abbreviated=false)', {
        selector: '[data-role="params-editor-preview"]',
      })
    ).toBeTruthy();

    fireEvent.click(within(dialog).getByRole('button', { name: /^apply$/i }));
    await expect(promise).resolves.toBe('(abbreviated=false)');
  });

  test('prefills required boolean params from existing values', async () => {
    const promise = openParamsEditorModal({
      documentObj: document,
      windowObj: window,
      commandLabel: 'datatype.boolean',
      helpModel: {
        summary: 'Boolean helper',
        params: [{ name: 'strict', type: 'boolean', optional: false }],
      },
      initialParams: '(true)',
    });

    const dialog = within(getOverlay()).getByRole('dialog', { name: /edit params for datatype\.boolean/i });
    const trueRadio = within(dialog).getByRole('radio', { name: /true/i });
    const falseRadio = within(dialog).getByRole('radio', { name: /false/i });

    expect(trueRadio.checked).toBe(true);
    expect(falseRadio.checked).toBe(false);

    fireEvent.click(within(dialog).getByRole('button', { name: /^cancel$/i }));
    await expect(promise).resolves.toBeNull();
  });
});
