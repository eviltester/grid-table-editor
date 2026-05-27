import { JSDOM } from 'jsdom';
import { openMethodPickerModal } from '../../../js/gui_components/shared/test-data/ui/method-picker-modal.js';

describe('method picker modal', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body class="theme-light"></body></html>', { url: 'https://example.com' });
    global.document = dom.window.document;
    global.window = dom.window;
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

    const search = document.querySelector('.method-picker-search');
    search.value = 'city';
    search.dispatchEvent(new window.Event('input', { bubbles: true }));

    const firstTile = document.querySelector('.method-picker-tile');
    firstTile.click();
    document.querySelector('[data-action="apply"]').click();

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

    const modal = document.querySelector('.method-picker-overlay');
    modal.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    const result = await promise;
    expect(result).toBeNull();
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

    const headings = Array.from(document.querySelectorAll('.method-picker-detail h5')).map((el) =>
      el.textContent.trim()
    );
    expect(headings).toEqual(['Parameter Details', 'Parameter Types', 'Example']);

    const detailsTable = document.querySelector('.method-picker-param-details');
    expect(detailsTable.textContent).toContain('Name');
    expect(detailsTable.textContent).toContain('Details');
    expect(detailsTable.textContent).toContain('Locale hint.');
    expect(detailsTable.textContent).toContain('Example: en');

    const typesTable = document.querySelector('.method-picker-param-types');
    expect(typesTable.textContent).toContain('Name');
    expect(typesTable.textContent).toContain('Type');
    expect(typesTable.textContent).toContain('Req');
    expect(typesTable.textContent).toContain('optional');

    document.querySelector('[data-action="cancel"]').click();
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
          helpModel: { summary: 'Pick', params: [], example: 'red' },
        },
      ],
      currentCommand: 'helpers.arrayElement',
    });

    const emptyStates = Array.from(document.querySelectorAll('.method-picker-table-wrap .method-picker-empty')).map(
      (el) => el.textContent.trim()
    );
    expect(emptyStates).toEqual(['No params', 'No params']);

    document.querySelector('[data-action="cancel"]').click();
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

    const tabs = Array.from(document.querySelectorAll('.method-picker-tabs button')).map((el) => el.textContent.trim());
    expect(tabs[0]).toBe('All');
    expect(tabs[1]).toBe('Core');

    const coreTab = Array.from(document.querySelectorAll('.method-picker-tabs button')).find(
      (el) => el.textContent.trim() === 'Core'
    );
    coreTab.click();

    const commands = Array.from(document.querySelectorAll('.method-picker-tile .method-picker-tile-command')).map(
      (el) => el.textContent.trim()
    );
    expect(commands).toEqual(expect.arrayContaining(['enum', 'literal', 'regex']));
    expect(commands).not.toEqual(expect.arrayContaining(['location.city', 'helpers.arrayElement']));

    const search = document.querySelector('.method-picker-search');
    search.value = 'literal';
    search.dispatchEvent(new window.Event('input', { bubbles: true }));
    const filtered = Array.from(document.querySelectorAll('.method-picker-tile .method-picker-tile-command')).map(
      (el) => el.textContent.trim()
    );
    expect(filtered).toEqual(['literal']);

    document.querySelector('[data-action="cancel"]').click();
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

    const active = document.querySelector('.method-picker-tabs button.is-active');
    expect(active.textContent.trim()).toBe('Core');

    const commands = Array.from(document.querySelectorAll('.method-picker-tile .method-picker-tile-command')).map(
      (el) => el.textContent.trim()
    );
    expect(commands).toEqual(['enum']);

    document.querySelector('[data-action="cancel"]').click();
    await promise;
  });
});
