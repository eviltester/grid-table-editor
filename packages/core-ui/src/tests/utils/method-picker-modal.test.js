import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import { openMethodPickerModal } from '../../../js/gui_components/shared/test-data/ui/method-picker-modal.js';

function hexToRgb(hex) {
  const value = String(hex || '').replace('#', '');
  return [0, 2, 4].map((start) => parseInt(value.slice(start, start + 2), 16));
}

function luminanceChannel(channelValue) {
  const normalized = channelValue / 255;
  return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hexColor) {
  const [red, green, blue] = hexToRgb(hexColor).map(luminanceChannel);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function readCssVariable(cssText, variableName) {
  return cssText.match(new RegExp(`${variableName}:\\s*(#[0-9a-fA-F]{6})`))?.[1] || '';
}

describe('method picker modal', () => {
  let dom;
  let getOverlay;
  let getSearchInput;
  let getTabsRoot;
  let getDetail;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body class="theme-light"></body></html>', { url: 'https://example.com' });
    global.document = dom.window.document;
    global.window = dom.window;
    getOverlay = () => document.querySelector('[data-role="method-picker-overlay"]');
    getSearchInput = () => getOverlay()?.querySelector('[data-role="method-picker-search"]');
    getTabsRoot = () => getOverlay()?.querySelector('[data-role="method-picker-tabs"]');
    getDetail = () => getOverlay()?.querySelector('[data-role="method-picker-detail"]');
  });

  afterEach(() => {
    dom.window.close();
  });

  test('filters by summary text and applies selected command', async () => {
    const promise = openMethodPickerModal({
      documentObj: document,
      windowObj: window,
      options: [
        {
          sourceType: 'domain',
          command: 'location.city',
          helpModel: { summary: 'Generate city values', params: [], example: 'London' },
        },
        {
          sourceType: 'faker',
          command: 'helpers.arrayElement',
          helpModel: { summary: 'Pick one value', params: [], example: 'red' },
        },
      ],
      currentCommand: '',
    });

    const search = getSearchInput();
    search.value = 'city';
    search.dispatchEvent(new window.Event('input', { bubbles: true }));

    const firstTile = getOverlay().querySelector('[data-role="method-picker-tile"]');
    firstTile.click();
    getOverlay().querySelector('[data-role="method-picker-apply-button"]').click();

    const result = await promise;
    expect(result).toEqual({ sourceType: 'domain', command: 'location.city' });
  });

  test('cancels on escape', async () => {
    const promise = openMethodPickerModal({
      documentObj: document,
      windowObj: window,
      options: [{ sourceType: 'domain', command: 'number.int', helpModel: { summary: '', params: [], example: '' } }],
      currentCommand: 'number.int',
    });

    const modal = getOverlay();
    modal.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    const result = await promise;
    expect(result).toBeNull();
  });

  test('focuses search with slash and previews then applies the first filtered method with enter', async () => {
    const promise = openMethodPickerModal({
      documentObj: document,
      windowObj: window,
      options: [
        {
          sourceType: 'domain',
          command: 'commerce.price',
          helpModel: { summary: 'Generate values with prices', params: [], example: '' },
        },
        {
          sourceType: 'domain',
          command: 'location.city',
          helpModel: { summary: 'Generate city values', params: [], example: '' },
        },
      ],
      currentCommand: 'location.city',
    });

    getSearchInput().blur();
    getOverlay().dispatchEvent(new window.KeyboardEvent('keydown', { key: '/', bubbles: true }));
    expect(document.activeElement).toBe(getSearchInput());

    const search = getSearchInput();
    search.value = 'Generate';
    search.dispatchEvent(new window.Event('input', { bubbles: true }));
    search.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(getOverlay().querySelector('[data-role="method-picker-tile"].is-selected').textContent).toContain(
      'commerce.price'
    );
    expect(getDetail().textContent).toContain('Generate values with prices');
    expect(getOverlay()).not.toBeNull();

    getSearchInput().dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await expect(promise).resolves.toEqual({ sourceType: 'domain', command: 'commerce.price' });
    expect(getOverlay()).toBeNull();
  });

  test('applies the focused selected method tile with enter', async () => {
    const promise = openMethodPickerModal({
      documentObj: document,
      windowObj: window,
      options: [
        {
          sourceType: 'domain',
          command: 'internet.httpMethod',
          helpModel: { summary: 'Generate HTTP methods', params: [], example: '' },
        },
      ],
      currentCommand: 'internet.httpMethod',
    });

    const tile = getOverlay().querySelector('[data-role="method-picker-tile"]');
    tile.focus();
    tile.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));

    await expect(promise).resolves.toEqual({ sourceType: 'domain', command: 'internet.httpMethod' });
    expect(getOverlay()).toBeNull();
  });

  test('cancels on backdrop click and removes the overlay', async () => {
    const promise = openMethodPickerModal({
      documentObj: document,
      windowObj: window,
      options: [{ sourceType: 'domain', command: 'number.int', helpModel: { summary: '', params: [], example: '' } }],
      currentCommand: 'number.int',
    });

    getOverlay().click();

    await expect(promise).resolves.toBeNull();
    expect(getOverlay()).toBeNull();
  });

  test('restores focus to the trigger after closing with escape', async () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'Select faker command';
    document.body.appendChild(trigger);
    trigger.focus();

    const promise = openMethodPickerModal({
      documentObj: document,
      windowObj: window,
      options: [{ sourceType: 'domain', command: 'number.int', helpModel: { summary: '', params: [], example: '' } }],
      currentCommand: 'number.int',
    });

    expect(document.activeElement).toBe(getSearchInput());
    getOverlay().dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await expect(promise).resolves.toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  test('locks document scrolling while open and restores original overflow on close', async () => {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'scroll';

    const promise = openMethodPickerModal({
      documentObj: document,
      windowObj: window,
      options: [{ sourceType: 'domain', command: 'number.int', helpModel: { summary: '', params: [], example: '' } }],
      currentCommand: 'number.int',
    });

    expect(document.body.style.overflow).toBe('hidden');
    expect(document.documentElement.style.overflow).toBe('hidden');

    getSearchInput().dispatchEvent(new window.KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }));
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.documentElement.style.overflow).toBe('hidden');

    getOverlay().querySelector('[data-role="method-picker-cancel-button"]').click();
    await expect(promise).resolves.toBeNull();
    expect(document.body.style.overflow).toBe('auto');
    expect(document.documentElement.style.overflow).toBe('scroll');
  });

  test('wraps tab focus within the modal dialog', async () => {
    const promise = openMethodPickerModal({
      documentObj: document,
      windowObj: window,
      options: [{ sourceType: 'domain', command: 'number.int', helpModel: { summary: '', params: [], example: '' } }],
      currentCommand: 'number.int',
    });

    const closeButton = getOverlay().querySelector('[data-role="method-picker-close-button"]');
    const applyButton = getOverlay().querySelector('[data-role="method-picker-apply-button"]');

    closeButton.focus();
    closeButton.dispatchEvent(
      new window.KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true })
    );
    expect(document.activeElement).toBe(applyButton);

    applyButton.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(closeButton);

    getOverlay().querySelector('[data-role="method-picker-cancel-button"]').click();
    await promise;
  });

  test('keeps only the active method tile in the tab sequence', async () => {
    const promise = openMethodPickerModal({
      documentObj: document,
      windowObj: window,
      options: [
        { sourceType: 'domain', command: 'number.int', helpModel: { summary: '', params: [], example: '' } },
        { sourceType: 'domain', command: 'location.city', helpModel: { summary: '', params: [], example: '' } },
        { sourceType: 'faker', command: 'helpers.arrayElement', helpModel: { summary: '', params: [], example: '' } },
      ],
      currentCommand: 'number.int',
    });

    const tiles = Array.from(getOverlay().querySelectorAll('[data-role="method-picker-tile"]'));
    expect(tiles.map((tile) => tile.tabIndex)).toEqual([0, -1, -1]);

    tiles[0].focus();
    tiles[0].dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

    const updatedTiles = Array.from(getOverlay().querySelectorAll('[data-role="method-picker-tile"]'));
    expect(updatedTiles.map((tile) => tile.tabIndex)).toEqual([-1, 0, -1]);
    expect(document.activeElement).toBe(updatedTiles[1]);

    getOverlay().querySelector('[data-role="method-picker-cancel-button"]').click();
    await promise;
  });

  test('renders component-owned rooted hooks for overlay, tabs, list, detail, and tiles', async () => {
    const promise = openMethodPickerModal({
      documentObj: document,
      windowObj: window,
      options: [{ sourceType: 'domain', command: 'number.int', helpModel: { summary: '', params: [], example: '' } }],
      currentCommand: 'number.int',
    });

    expect(getOverlay()).not.toBeNull();
    expect(getOverlay().querySelector('[data-role="method-picker-dialog"]')).not.toBeNull();
    expect(getTabsRoot()).not.toBeNull();
    const methodList = getOverlay().querySelector('[data-role="method-picker-list"]');
    expect(methodList).not.toBeNull();
    expect(methodList.tagName).toBe('DIV');
    expect(methodList.getAttribute('role')).toBe('listbox');
    expect(getDetail()).not.toBeNull();
    const methodTile = getOverlay().querySelector('[data-role="method-picker-tile"]');
    expect(methodTile).not.toBeNull();
    expect(methodTile.tagName).toBe('DIV');
    expect(methodTile.getAttribute('role')).toBe('option');
    expect(getOverlay().querySelector('[data-role="method-picker-command"]')).not.toBeNull();
    expect(getOverlay().querySelector('[data-role="method-picker-close-button"]')).not.toBeNull();
    expect(getOverlay().querySelector('[data-role="method-picker-cancel-button"]')).not.toBeNull();
    expect(getOverlay().querySelector('[data-role="method-picker-apply-button"]')).not.toBeNull();

    getOverlay().querySelector('[data-role="method-picker-cancel-button"]').click();
    await promise;
  });

  test('mirrors apply button disabled state to aria-disabled', async () => {
    const emptyPromise = openMethodPickerModal({
      documentObj: document,
      windowObj: window,
      options: [],
      currentCommand: '',
    });

    const emptyApplyButton = getOverlay().querySelector('[data-role="method-picker-apply-button"]');
    expect(emptyApplyButton.disabled).toBe(true);
    expect(emptyApplyButton.getAttribute('aria-disabled')).toBe('true');

    getOverlay().querySelector('[data-role="method-picker-cancel-button"]').click();
    await emptyPromise;

    const populatedPromise = openMethodPickerModal({
      documentObj: document,
      windowObj: window,
      options: [{ sourceType: 'domain', command: 'number.int', helpModel: { summary: '', params: [], example: '' } }],
      currentCommand: 'number.int',
    });

    const populatedApplyButton = getOverlay().querySelector('[data-role="method-picker-apply-button"]');
    expect(populatedApplyButton.disabled).toBe(false);
    expect(populatedApplyButton.getAttribute('aria-disabled')).toBe('false');

    getOverlay().querySelector('[data-role="method-picker-cancel-button"]').click();
    await populatedPromise;
  });

  test('renders parameter details before parameter types with expected columns', async () => {
    const promise = openMethodPickerModal({
      documentObj: document,
      windowObj: window,
      options: [
        {
          sourceType: 'domain',
          command: 'food.ingredient',
          helpModel: {
            summary: 'Ingredient label',
            heading: 'food.ingredient',
            example: 'oregano',
            params: [
              {
                name: 'locale',
                type: 'string',
                optional: true,
                description: 'Locale hint.',
                example: 'en',
              },
            ],
          },
        },
      ],
      currentCommand: 'food.ingredient',
    });

    const headings = Array.from(getDetail().querySelectorAll('h5')).map((el) => el.textContent.trim());
    expect(headings.slice(0, 2)).toEqual(['Parameter Details', 'Parameter Types']);

    const detailsTable = getDetail().querySelector('.method-picker-param-details');
    expect(detailsTable.textContent).toContain('Name');
    expect(detailsTable.textContent).toContain('Details');
    expect(detailsTable.textContent).toContain('Locale hint.');
    expect(detailsTable.textContent).toContain('Example: en');

    const typesTable = getDetail().querySelector('.method-picker-param-types');
    expect(typesTable.textContent).toContain('Name');
    expect(typesTable.textContent).toContain('Type');
    expect(typesTable.textContent).toContain('Req');
    expect(typesTable.textContent).toContain('optional');
    expect(headings).toContain('Return Examples');

    getOverlay().querySelector('[data-role="method-picker-cancel-button"]').click();
    await promise;
  });

  test('renders usage and deduped return examples from structured usageExamples', async () => {
    const promise = openMethodPickerModal({
      documentObj: document,
      windowObj: window,
      options: [
        {
          sourceType: 'domain',
          command: 'datatype.enum',
          helpModel: {
            summary: 'Enum helper',
            heading: 'datatype.enum',
            docsUrl: 'https://anywaydata.com/docs/category/generating-data',
            usageExamples: [
              {
                functionCall: 'enum("active","inactive","pending")',
                sampleReturnValue: 'active',
                description: 'Shows enum helper usage.',
              },
              {
                functionCall: 'datatype.enum(csv="active,inactive,pending")',
                sampleReturnValue: 'inactive',
                description: 'Shows datatype.enum helper usage.',
              },
              {
                functionCall: 'datatype.enum(values=["open","closed"])',
                sampleReturnValue: 'closed',
                description: 'Shows an alternate enum call.',
              },
            ],
            params: [],
          },
        },
      ],
      currentCommand: 'datatype.enum',
    });

    const usageSection = getDetail();
    expect(usageSection.textContent).toContain('enum("active","inactive","pending")');
    expect(usageSection.textContent).toContain('datatype.enum(csv="active,inactive,pending")');
    expect(usageSection.textContent).toContain('Command: datatype.enum');
    expect(usageSection.textContent).toContain('Params field: csv="active,inactive,pending"');
    expect(usageSection.textContent).toContain('Full call: datatype.enum(csv="active,inactive,pending")');
    expect(usageSection.textContent).toContain('Returns: active');
    expect(usageSection.textContent).toContain('Returns: inactive');
    expect(usageSection.textContent).toContain('Returns: closed');
    expect(usageSection.innerHTML).not.toContain('<h5>Return Examples</h5>');

    const docsLink = getDetail().querySelector('.method-picker-docs-link a');
    expect(docsLink).not.toBeNull();
    expect(docsLink.getAttribute('href')).toBe('https://anywaydata.com/docs/category/generating-data');
    expect(docsLink.getAttribute('target')).toBe('_blank');
    expect(docsLink.getAttribute('rel')).toContain('noopener');
    expect(docsLink.getAttribute('rel')).toContain('noreferrer');

    getOverlay().querySelector('[data-role="method-picker-cancel-button"]').click();
    await promise;
  });

  test('renders no params empty state in both parameter sections', async () => {
    const promise = openMethodPickerModal({
      documentObj: document,
      windowObj: window,
      options: [
        {
          sourceType: 'faker',
          command: 'helpers.arrayElement',
          helpModel: {
            summary: 'Pick',
            params: [],
            usageExamples: [
              {
                functionCall: 'helpers.arrayElement(["red","green","blue"])',
                sampleReturnValue: 'red',
                description: 'Picks one array member.',
              },
            ],
          },
        },
      ],
      currentCommand: 'helpers.arrayElement',
    });

    const headings = Array.from(getDetail().querySelectorAll('h5')).map((el) => el.textContent.trim());
    expect(headings).toEqual(['Parameter Details', 'Usage Examples']);
    const emptyStates = Array.from(getDetail().querySelectorAll('.method-picker-table-wrap .method-picker-empty')).map(
      (el) => el.textContent.trim()
    );
    expect(emptyStates).toEqual(['No params']);

    getOverlay().querySelector('[data-role="method-picker-cancel-button"]').click();
    await promise;
  });

  test('renders the authored docs link without runtime localization', async () => {
    const promise = openMethodPickerModal({
      documentObj: document,
      windowObj: window,
      options: [
        {
          sourceType: 'domain',
          command: 'number.int',
          helpModel: {
            summary: 'Integer',
            docsUrl: 'https://anywaydata.com/docs/test-data/domain/number',
            params: [],
          },
        },
      ],
      currentCommand: 'number.int',
    });

    const docsLink = getDetail().querySelector('.method-picker-docs-link a');
    expect(docsLink.getAttribute('href')).toBe('https://anywaydata.com/docs/test-data/domain/number');

    getOverlay().querySelector('[data-role="method-picker-cancel-button"]').click();
    await promise;
  });

  test('shows Core tab immediately after All and filters to enum/literal/regex', async () => {
    const promise = openMethodPickerModal({
      documentObj: document,
      windowObj: window,
      options: [
        { sourceType: 'enum', command: 'enum', helpModel: { summary: 'Enum', params: [], example: 'a,b' } },
        { sourceType: 'literal', command: 'literal', helpModel: { summary: 'Literal', params: [], example: 'fixed' } },
        { sourceType: 'regex', command: 'regex', helpModel: { summary: 'Regex', params: [], example: '[A-Z]{3}' } },
        {
          sourceType: 'domain',
          command: 'location.city',
          helpModel: { summary: 'City', params: [], example: 'London' },
        },
        {
          sourceType: 'faker',
          command: 'helpers.arrayElement',
          helpModel: { summary: 'Pick one', params: [], example: 'red' },
        },
      ],
      currentCommand: 'location.city',
    });

    const tabs = Array.from(getTabsRoot().querySelectorAll('[data-role="method-picker-tab"]')).map((el) =>
      el.textContent.trim()
    );
    expect(tabs[0]).toBe('All');
    expect(tabs[1]).toBe('Core');

    const coreTab = Array.from(getTabsRoot().querySelectorAll('[data-role="method-picker-tab"]')).find(
      (el) => el.textContent.trim() === 'Core'
    );
    coreTab.click();

    const commands = Array.from(getOverlay().querySelectorAll('[data-role="method-picker-command"]')).map((el) =>
      el.textContent.trim()
    );
    expect(commands).toEqual(expect.arrayContaining(['enum', 'literal', 'regex']));
    expect(commands).not.toEqual(expect.arrayContaining(['location.city', 'helpers.arrayElement']));

    const search = getSearchInput();
    search.value = 'literal';
    search.dispatchEvent(new window.Event('input', { bubbles: true }));
    const filtered = Array.from(getOverlay().querySelectorAll('[data-role="method-picker-command"]')).map((el) =>
      el.textContent.trim()
    );
    expect(filtered).toEqual(['literal']);

    getOverlay().querySelector('[data-role="method-picker-cancel-button"]').click();
    await promise;
  });

  test('respects initial tab when provided', async () => {
    const promise = openMethodPickerModal({
      documentObj: document,
      windowObj: window,
      initialTab: 'core',
      options: [
        { sourceType: 'enum', command: 'enum', helpModel: { summary: 'Enum', params: [], example: 'a,b' } },
        {
          sourceType: 'domain',
          command: 'location.city',
          helpModel: { summary: 'City', params: [], example: 'London' },
        },
      ],
      currentCommand: 'location.city',
    });

    const active = getTabsRoot().querySelector('[data-role="method-picker-tab"].is-active');
    expect(active.textContent.trim()).toBe('Core');

    const commands = Array.from(getOverlay().querySelectorAll('[data-role="method-picker-command"]')).map((el) =>
      el.textContent.trim()
    );
    expect(commands).toEqual(['enum']);

    getOverlay().querySelector('[data-role="method-picker-cancel-button"]').click();
    await promise;
  });

  test('returns null without throwing when no document is available', async () => {
    const originalDocument = global.document;
    const originalWindow = global.window;
    delete global.document;
    delete global.window;

    try {
      await expect(openMethodPickerModal()).resolves.toBeNull();
    } finally {
      global.document = originalDocument;
      global.window = originalWindow;
    }
  });

  test('injects critical inline layout styles before the external stylesheet loads', async () => {
    const promise = openMethodPickerModal({
      documentObj: document,
      windowObj: window,
      options: [{ sourceType: 'domain', command: 'number.int', helpModel: { summary: '', params: [], example: '' } }],
      currentCommand: 'number.int',
    });

    const criticalStyle = document.getElementById('method-picker-modal-critical-styles');
    expect(criticalStyle).not.toBeNull();
    expect(criticalStyle.textContent).toContain('.method-picker-overlay');
    expect(criticalStyle.textContent).toContain('.method-picker-content');

    getOverlay().querySelector('[data-role="method-picker-cancel-button"]').click();
    await promise;
  });

  test('light theme active tab colors meet normal text contrast', () => {
    const cssText = readFileSync(
      new URL('../../../js/gui_components/shared/test-data/ui/method-picker-modal.css', import.meta.url),
      'utf8'
    );
    const accent = readCssVariable(cssText, '--mp-accent');
    const accentSoft = readCssVariable(cssText, '--mp-accent-soft');

    expect(accent).toBe('#0b63ce');
    expect(accentSoft).toBe('#e9f1ff');
    expect(contrastRatio(accent, accentSoft)).toBeGreaterThanOrEqual(4.5);
  });
});
