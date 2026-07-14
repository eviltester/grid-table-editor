import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import { fireEvent, within } from '@testing-library/dom';
import { jest } from '@jest/globals';
import {
  splitTopLevelCommaSeparated,
  parseInitialParamEntries,
  inferEnumChoicesFromType,
  resolveEnumChoices,
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

  test('derives enum choices from explicit enum value arrays before pipe-delimited types', () => {
    expect(
      resolveEnumChoices({
        type: 'alpha-2|alpha-3|numeric',
        allowedValues: ['svg-uri', 'svg-base64'],
        choices: ['ignored'],
        enumValues: ['also-ignored'],
      })
    ).toEqual(['svg-uri', 'svg-base64']);
    expect(resolveEnumChoices({ type: 'enum', enumValues: ['alpha-2', 'alpha-3', 'numeric'] })).toEqual([
      'alpha-2',
      'alpha-3',
      'numeric',
    ]);
    expect(resolveEnumChoices({ type: 'alpha-2|alpha-3|numeric' })).toEqual(['alpha-2', 'alpha-3', 'numeric']);
    expect(resolveEnumChoices({ type: 'female|generic|male' })).toEqual(['female', 'generic', 'male']);
  });

  test('does not derive enum choices from broad type unions', () => {
    expect(inferEnumChoicesFromType('string|number|date')).toEqual([]);
    expect(inferEnumChoicesFromType('comma-separated list|array')).toEqual([]);
    expect(inferEnumChoicesFromType('number | { min: number; max: number; }')).toEqual([]);
    expect(inferEnumChoicesFromType('array | () => unknown')).toEqual([]);
  });

  test('parses explicit enum metadata into enum editor entries', () => {
    const parsed = parseInitialParamEntries({
      params: [
        { name: 'sex', type: 'enum', enumValues: ['female', 'male'], optional: true },
        { name: 'refDate', type: 'string|number|date', optional: true },
      ],
      initialParams: '',
    });

    expect(parsed.error).toBe('');
    expect(parsed.entries).toEqual([
      expect.objectContaining({ name: 'sex', enumChoices: ['female', 'male'], mode: 'enum' }),
      expect.objectContaining({ name: 'refDate', enumChoices: [], mode: 'auto' }),
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

  test('auto quotes non-numeric values for string-capable union params', () => {
    expect(
      buildParamsTextFromEditorEntries({
        entries: [
          { name: 'refDate', type: 'string|number|date', value: '2026-06-18T00:00:00.000Z', mode: 'auto' },
          { name: 'start', type: 'string|number', value: '2026-06-12T12:39:23Z', mode: 'auto' },
        ],
      })
    ).toEqual({
      paramsText: '(refDate="2026-06-18T00:00:00.000Z",start="2026-06-12T12:39:23Z")',
      errors: [],
    });
  });

  test('keeps parser-valid numeric values raw for string-capable union params', () => {
    expect(
      buildParamsTextFromEditorEntries({
        entries: [
          { name: 'integer', type: 'string|number', value: '123', mode: 'auto' },
          { name: 'decimal', type: 'string|number', value: '12.5', mode: 'auto' },
          { name: 'negative', type: 'string|number', value: '-12', mode: 'auto' },
          { name: 'leadingZeros', type: 'string|number', value: '001', mode: 'auto' },
        ],
      })
    ).toEqual({
      paramsText: '(integer=123,decimal=12.5,negative=-12,leadingZeros=001)',
      errors: [],
    });
  });

  test('quotes number-like text that the domain parser does not treat as numeric', () => {
    expect(
      buildParamsTextFromEditorEntries({
        entries: [
          { name: 'plus', type: 'string|number', value: '+12', mode: 'auto' },
          { name: 'exponent', type: 'string|number', value: '1e3', mode: 'auto' },
          { name: 'infinity', type: 'string|number', value: 'Infinity', mode: 'auto' },
          { name: 'notNumber', type: 'string|number', value: 'NaN', mode: 'auto' },
        ],
      })
    ).toEqual({
      paramsText: '(plus="+12",exponent="1e3",infinity="Infinity",notNumber="NaN")',
      errors: [],
    });
  });

  test('preserves raw structured values when string-capable union params allow them', () => {
    expect(
      buildParamsTextFromEditorEntries({
        entries: [
          { name: 'arrayValue', type: 'string|array', value: '["Ada","Bob"]', mode: 'auto' },
          { name: 'objectValue', type: 'string|object', value: '{ name: "Ada" }', mode: 'auto' },
        ],
      })
    ).toEqual({
      paramsText: '(arrayValue=["Ada","Bob"],objectValue={ name: "Ada" })',
      errors: [],
    });
  });

  test('builds enum params with string choices quoted and numeric choices raw', () => {
    expect(
      buildParamsTextFromEditorEntries({
        entries: [
          { name: 'variant', type: 'enum', value: 'alpha-3', mode: 'enum', optional: true },
          { name: 'version', type: 'enum', value: '7', mode: 'enum', optional: true },
        ],
      })
    ).toEqual({
      paramsText: '(variant="alpha-3",version=7)',
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

  test('surfaces warning validation issues without blocking params text construction', () => {
    const result = buildParamsTextFromEditorEntries({
      entries: [{ name: 'array', type: 'array', value: '["free","pro"]', mode: 'raw', optional: false }],
      validateParams: () => [
        {
          message:
            'Row 1: invalid faker params - Invalid Faker API Call Unsafe faker rule syntax detected: requires complex argument parsing',
          severity: 'warning',
        },
      ],
    });

    expect(result).toEqual({
      paramsText: '(array=["free","pro"])',
      errors: [],
      warnings: [
        'Row 1: invalid faker params - Invalid Faker API Call Unsafe faker rule syntax detected: requires complex argument parsing',
      ],
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

  test('auto quotes string-capable union params without double quoting existing quoted input', () => {
    const result = buildParamsTextFromEditorEntries({
      entries: [{ name: 'refDate', type: 'string|number|date', value: '"2026-06-18T00:00:00.000Z"', mode: 'auto' }],
    });

    expect(result).toEqual({
      paramsText: '(refDate="2026-06-18T00:00:00.000Z")',
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

  test('renders required enum params as a select and requires a choice', async () => {
    const promise = openParamsEditorModal({
      documentObj: document,
      windowObj: window,
      commandLabel: 'location.countryCode',
      helpModel: {
        summary: 'Country code helper',
        params: [{ name: 'variant', type: 'enum', enumValues: ['alpha-2', 'alpha-3', 'numeric'], optional: false }],
      },
      initialParams: '',
    });

    const dialog = within(getOverlay()).getByRole('dialog', { name: /edit params for location\.countrycode/i });
    const applyButton = within(dialog).getByRole('button', { name: /^apply$/i });
    const variantSelect = within(dialog).getByRole('combobox', { name: /variant value/i });

    expect(within(dialog).queryByRole('textbox', { name: /variant value/i })).toBeNull();
    expect(variantSelect.options[0].selected).toBe(true);
    expect(variantSelect.options[0].textContent).toBe('Select...');
    expect(applyButton.disabled).toBe(true);
    expect(dialog.querySelector('[data-role="params-editor-error"]').textContent).toContain('required');

    variantSelect.value = 'alpha-3';
    fireEvent.change(variantSelect);

    expect(applyButton.disabled).toBe(false);
    expect(
      within(dialog).getByText('(variant="alpha-3")', {
        selector: '[data-role="params-editor-preview"]',
      })
    ).toBeTruthy();

    fireEvent.click(applyButton);
    await expect(promise).resolves.toBe('(variant="alpha-3")');
  });

  test('renders param row cell labels used by the stacked mobile layout', async () => {
    const promise = openParamsEditorModal({
      documentObj: document,
      windowObj: window,
      commandLabel: 'location.countryCode',
      helpModel: {
        summary: 'Country code helper',
        params: [{ name: 'variant', type: 'enum', enumValues: ['alpha-2', 'alpha-3', 'numeric'], optional: false }],
      },
      initialParams: '',
    });

    const dialog = within(getOverlay()).getByRole('dialog', { name: /edit params for location\.countrycode/i });
    const cells = Array.from(dialog.querySelectorAll('.params-editor-table tbody tr:first-child td')).map((cell) =>
      cell.getAttribute('data-label')
    );
    const variantSelect = within(dialog).getByRole('combobox', { name: /variant value/i });

    expect(cells).toEqual(['Name', 'Type', 'Req', 'Value']);
    expect(variantSelect.closest('td')?.getAttribute('data-label')).toBe('Value');

    fireEvent.click(within(dialog).getByRole('button', { name: /^cancel$/i }));
    await expect(promise).resolves.toBeNull();
  });

  test('renders optional explicit enum choices with an unset option', async () => {
    const promise = openParamsEditorModal({
      documentObj: document,
      windowObj: window,
      commandLabel: 'image.dataUri',
      helpModel: {
        summary: 'Image data URI helper',
        params: [{ name: 'type', type: 'string', optional: true, allowedValues: ['svg-uri', 'svg-base64'] }],
      },
      initialParams: '',
    });

    const dialog = within(getOverlay()).getByRole('dialog', { name: /edit params for image\.datauri/i });
    const typeSelect = within(dialog).getByRole('combobox', { name: /type value/i });
    const applyButton = within(dialog).getByRole('button', { name: /^apply$/i });

    expect(typeSelect.options[0].selected).toBe(true);
    expect(typeSelect.options[0].textContent).toBe('Unset');
    expect(applyButton.disabled).toBe(false);

    typeSelect.value = 'svg-base64';
    fireEvent.change(typeSelect);

    expect(
      within(dialog).getByText('(type="svg-base64")', {
        selector: '[data-role="params-editor-preview"]',
      })
    ).toBeTruthy();

    fireEvent.click(applyButton);
    await expect(promise).resolves.toBe('(type="svg-base64")');
  });

  test('serializes explicit empty string enum choices separately from optional unset', async () => {
    const promise = openParamsEditorModal({
      documentObj: document,
      windowObj: window,
      commandLabel: 'internet.mac',
      helpModel: {
        summary: 'MAC helper',
        params: [{ name: 'separator', type: 'enum', optional: true, enumValues: [':', '-', ''] }],
      },
      initialParams: '',
    });

    const dialog = within(getOverlay()).getByRole('dialog', { name: /edit params for internet\.mac/i });
    const separatorSelect = within(dialog).getByRole('combobox', { name: /separator value/i });
    const emptyStringOption = Array.from(separatorSelect.options).find((option) => option.textContent === '""');

    expect(separatorSelect.options[0].textContent).toBe('Unset');
    expect(emptyStringOption).toBeDefined();

    separatorSelect.value = emptyStringOption.value;
    fireEvent.change(separatorSelect);

    expect(
      within(dialog).getByText('(separator="")', {
        selector: '[data-role="params-editor-preview"]',
      })
    ).toBeTruthy();

    fireEvent.click(within(dialog).getByRole('button', { name: /^apply$/i }));
    await expect(promise).resolves.toBe('(separator="")');
  });

  test('prefills enum selects from existing params and numeric defaults', async () => {
    const promise = openParamsEditorModal({
      documentObj: document,
      windowObj: window,
      commandLabel: 'string.uuid',
      helpModel: {
        summary: 'UUID helper',
        params: [
          { name: 'version', type: 'enum', enumValues: ['4', '7'], optional: true, defaultValue: '7' },
          { name: 'refDate', type: 'string|number|date', optional: true },
        ],
      },
      initialParams: '(version=4)',
    });

    const dialog = within(getOverlay()).getByRole('dialog', { name: /edit params for string\.uuid/i });
    const versionSelect = within(dialog).getByRole('combobox', { name: /version value/i });

    expect(versionSelect.value).toBe('4');
    expect(within(dialog).queryByRole('combobox', { name: /refdate value/i })).toBeNull();
    expect(within(dialog).getByRole('textbox', { name: /refdate value/i })).toBeTruthy();
    expect(
      within(dialog).getByText('(version=4)', {
        selector: '[data-role="params-editor-preview"]',
      })
    ).toBeTruthy();

    fireEvent.click(within(dialog).getByRole('button', { name: /^cancel$/i }));
    await expect(promise).resolves.toBeNull();
  });

  test('auto quotes string.uuid refDate values entered without raw schema quotes', async () => {
    const promise = openParamsEditorModal({
      documentObj: document,
      windowObj: window,
      commandLabel: 'string.uuid',
      helpModel: {
        summary: 'UUID helper',
        params: [
          { name: 'version', type: 'enum', enumValues: ['4', '7'], optional: true },
          { name: 'refDate', type: 'string|number|date', optional: true },
        ],
      },
      initialParams: '',
    });

    const dialog = within(getOverlay()).getByRole('dialog', { name: /edit params for string\.uuid/i });
    const versionSelect = within(dialog).getByRole('combobox', { name: /version value/i });
    const refDateInput = within(dialog).getByRole('textbox', { name: /refdate value/i });
    const applyButton = within(dialog).getByRole('button', { name: /^apply$/i });

    versionSelect.value = '7';
    fireEvent.change(versionSelect);
    refDateInput.value = '2026-06-18T00:00:00.000Z';
    fireEvent.input(refDateInput);

    expect(applyButton.disabled).toBe(false);
    expect(
      within(dialog).getByText('(version=7,refDate="2026-06-18T00:00:00.000Z")', {
        selector: '[data-role="params-editor-preview"]',
      })
    ).toBeTruthy();

    fireEvent.click(applyButton);
    await expect(promise).resolves.toBe('(version=7,refDate="2026-06-18T00:00:00.000Z")');
  });

  test('auto quotes autoIncrement timestamp start and enum type while keeping numeric step raw', async () => {
    const promise = openParamsEditorModal({
      documentObj: document,
      windowObj: window,
      commandLabel: 'autoIncrement.timestamp',
      helpModel: {
        summary: 'Timestamp helper',
        params: [
          { name: 'start', type: 'string|number', optional: true },
          { name: 'step', type: 'number', optional: true, defaultValue: '1' },
          { name: 'type', type: 'enum', enumValues: ['seconds', 'minutes', 'hours', 'days'], optional: true },
        ],
      },
      initialParams: '',
    });

    const dialog = within(getOverlay()).getByRole('dialog', { name: /edit params for autoincrement\.timestamp/i });
    const startInput = within(dialog).getByRole('textbox', { name: /start value/i });
    const stepInput = within(dialog).getByRole('textbox', { name: /step value/i });
    const typeSelect = within(dialog).getByRole('combobox', { name: /type value/i });
    const applyButton = within(dialog).getByRole('button', { name: /^apply$/i });

    startInput.value = '2026-06-12T12:39:23Z';
    fireEvent.input(startInput);
    stepInput.value = '15';
    fireEvent.input(stepInput);
    typeSelect.value = 'minutes';
    fireEvent.change(typeSelect);

    expect(applyButton.disabled).toBe(false);
    expect(
      within(dialog).getByText('(start="2026-06-12T12:39:23Z",step=15,type="minutes")', {
        selector: '[data-role="params-editor-preview"]',
      })
    ).toBeTruthy();

    fireEvent.click(applyButton);
    await expect(promise).resolves.toBe('(start="2026-06-12T12:39:23Z",step=15,type="minutes")');
  });

  test('focuses the first editor control in rendered order when enum precedes text params', async () => {
    const promise = openParamsEditorModal({
      documentObj: document,
      windowObj: window,
      commandLabel: 'location.countryCode',
      helpModel: {
        summary: 'Country code helper',
        params: [
          { name: 'variant', type: 'enum', enumValues: ['alpha-2', 'alpha-3', 'numeric'], optional: true },
          { name: 'locale', type: 'string', optional: true },
        ],
      },
      initialParams: '',
    });

    const dialog = within(getOverlay()).getByRole('dialog', { name: /edit params for location\.countrycode/i });
    const variantSelect = within(dialog).getByRole('combobox', { name: /variant value/i });

    await new Promise((resolve) => window.setTimeout(resolve, 0));

    expect(document.activeElement).toBe(variantSelect);

    fireEvent.click(within(dialog).getByRole('button', { name: /^cancel$/i }));
    await expect(promise).resolves.toBeNull();
  });

  test('keeps apply enabled when semantic validation returns a warning', async () => {
    const promise = openParamsEditorModal({
      documentObj: document,
      windowObj: window,
      commandLabel: 'helpers.arrayElement',
      helpModel: {
        summary: 'Selects an array member',
        params: [{ name: 'array', type: 'array', optional: false }],
      },
      initialParams: '',
      validateParams: () => [
        {
          message:
            'Row 1: invalid faker params - Invalid Faker API Call Unsafe faker rule syntax detected: requires complex argument parsing',
          severity: 'warning',
        },
      ],
    });

    const dialog = within(getOverlay()).getByRole('dialog', { name: /edit params for helpers\.arrayelement/i });
    const applyButton = within(dialog).getByRole('button', { name: /^apply$/i });
    const input = within(dialog).getByRole('textbox', { name: /array value/i });

    input.value = '["free","pro"]';
    fireEvent.input(input);

    expect(applyButton.disabled).toBe(false);
    expect(dialog.querySelector('[data-role="params-editor-error"]').hidden).toBe(true);
    expect(dialog.querySelector('[data-role="params-editor-validation-warning"]').textContent).toContain(
      'Unsafe faker rule syntax detected'
    );

    fireEvent.click(applyButton);
    await expect(promise).resolves.toBe('(array=["free","pro"])');
  });

  test('keeps keyboard focus inside the params editor dialog when tabbing past the edges', async () => {
    const promise = openParamsEditorModal({
      documentObj: document,
      windowObj: window,
      commandLabel: 'faker.helpers.rangeToNumber',
      helpModel: {
        summary: 'Range helper',
        params: [
          {
            name: 'numberOrRange',
            type: 'number | { min: number; max: number; }',
            optional: false,
            positionalOnly: true,
            example: '{ min: 1, max: 9 }',
          },
        ],
      },
      initialParams: '',
    });

    const dialog = within(getOverlay()).getByRole('dialog', {
      name: /edit params for faker\.helpers\.rangetonumber/i,
    });
    const input = within(dialog).getByRole('textbox', { name: /numberorrange value/i });
    const cancelButton = within(dialog).getByRole('button', { name: /^cancel$/i });

    cancelButton.focus();
    expect(fireEvent.keyDown(cancelButton, { key: 'Tab' })).toBe(false);
    const firstWrappedElement = document.activeElement;
    expect(dialog.contains(firstWrappedElement)).toBe(true);
    expect(firstWrappedElement).not.toBe(cancelButton);

    firstWrappedElement.focus();
    expect(fireEvent.keyDown(firstWrappedElement, { key: 'Tab', shiftKey: true })).toBe(false);
    expect(document.activeElement).toBe(cancelButton);

    input.focus();
    expect(fireEvent.keyDown(input, { key: 'Tab' })).toBe(true);
    expect(document.activeElement).toBe(input);

    fireEvent.click(cancelButton);
    await expect(promise).resolves.toBeNull();
  });

  test('restores focus to the trigger after closing with escape', async () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'Edit params';
    document.body.appendChild(trigger);
    trigger.focus();

    const promise = openParamsEditorModal({
      documentObj: document,
      windowObj: window,
      commandLabel: 'number.int',
      helpModel: {
        summary: 'Integer helper',
        params: [{ name: 'min', type: 'integer', optional: true }],
      },
      initialParams: '',
    });

    const dialog = within(getOverlay()).getByRole('dialog', { name: /edit params for number\.int/i });
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    expect(dialog.contains(document.activeElement)).toBe(true);
    fireEvent.keyDown(dialog, { key: 'Escape' });
    await expect(promise).resolves.toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  test('params editor stylesheet stacks table rows on narrow screens instead of forcing horizontal scroll', () => {
    const css = readFileSync(
      new URL('../../../js/gui_components/shared/test-data/ui/params-editor-modal.css', import.meta.url),
      'utf8'
    );

    expect(css).toContain('@media (max-width: 560px)');
    expect(css).toContain('content: attr(data-label)');
    expect(css).not.toContain('min-width: 720px');
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
    expect(within(dialog).getByRole('checkbox', { name: 'Optional start' })).toBeTruthy();
    expect(within(dialog).getByRole('checkbox', { name: 'Optional zeropadding' })).toBeTruthy();
    expect(within(dialog).queryByRole('checkbox', { name: 'Required start' })).toBeNull();

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
    expect(within(dialog).getByRole('checkbox', { name: 'Required min' }).checked).toBe(true);
    expect(within(dialog).getByRole('checkbox', { name: 'Optional max' }).checked).toBe(false);
    expect(within(dialog).queryByRole('checkbox', { name: 'Required max' })).toBeNull();

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

  test('leaves optional boolean unset without shifting later required params', async () => {
    const promise = openParamsEditorModal({
      documentObj: document,
      windowObj: window,
      commandLabel: 'internet.email',
      helpModel: {
        summary: 'Returns an email address.',
        params: [
          { name: 'commonOnly', type: 'boolean', optional: true },
          { name: 'provider', type: 'string', optional: false },
        ],
      },
      initialParams: '',
    });

    const dialog = within(getOverlay()).getByRole('dialog', { name: /edit params for internet\.email/i });
    const unsetRadio = within(dialog).getByRole('radio', { name: /unset/i });
    const providerInput = within(dialog).getByRole('textbox', { name: /provider value/i });
    const applyButton = within(dialog).getByRole('button', { name: /^apply$/i });

    expect(unsetRadio.checked).toBe(true);
    expect(
      within(dialog).getByText('()', {
        selector: '[data-role="params-editor-preview"]',
      })
    ).toBeTruthy();
    expect(applyButton.disabled).toBe(true);

    fireEvent.input(providerInput, { target: { value: 'example.com' } });

    expect(
      within(dialog).getByText('(provider="example.com")', {
        selector: '[data-role="params-editor-preview"]',
      })
    ).toBeTruthy();

    fireEvent.click(applyButton);
    await expect(promise).resolves.toBe('(provider="example.com")');
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
