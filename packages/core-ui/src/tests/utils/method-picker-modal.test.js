import { JSDOM } from 'jsdom';
import { openMethodPickerModal } from '../../../js/gui_components/shared/test-data/ui/method-picker-modal.js';

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

  test('focuses search with slash and selects the first filtered method with enter', async () => {
    const promise = openMethodPickerModal({
      documentObj: document,
      windowObj: window,
      options: [
        {
          sourceType: 'domain',
          command: 'commerce.price',
          helpModel: { summary: 'Generate prices', params: [], example: '' },
        },
        {
          sourceType: 'domain',
          command: 'location.city',
          helpModel: { summary: 'Generate city values', params: [], example: '' },
        },
      ],
      currentCommand: '',
    });

    getSearchInput().blur();
    getOverlay().dispatchEvent(new window.KeyboardEvent('keydown', { key: '/', bubbles: true }));
    expect(document.activeElement).toBe(getSearchInput());

    const search = getSearchInput();
    search.value = 'city';
    search.dispatchEvent(new window.Event('input', { bubbles: true }));
    search.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(getOverlay().querySelector('[data-role="method-picker-tile"].is-selected').textContent).toContain(
      'location.city'
    );

    getOverlay().querySelector('[data-role="method-picker-apply-button"]').click();
    await expect(promise).resolves.toEqual({ sourceType: 'domain', command: 'location.city' });
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
    expect(getOverlay().querySelector('[data-role="method-picker-list"]')).not.toBeNull();
    expect(getDetail()).not.toBeNull();
    expect(getOverlay().querySelector('[data-role="method-picker-tile"]')).not.toBeNull();
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
});
