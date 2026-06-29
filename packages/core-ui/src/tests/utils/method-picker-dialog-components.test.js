import { JSDOM } from 'jsdom';
import { createMethodHelpDisplay } from '../../../js/gui_components/shared/method-picker-dialog/method-help-display.js';
import { createMethodList } from '../../../js/gui_components/shared/method-picker-dialog/method-list.js';
import { createMethodNavigator } from '../../../js/gui_components/shared/method-picker-dialog/method-navigator.js';
import { getReturnExamples } from '../../../js/gui_components/shared/method-picker-dialog/method-picker-dialog-utils.js';

describe('method picker dialog subcomponents', () => {
  let dom;
  let root;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body></body></html>');
    global.document = dom.window.document;
    root = dom.window.document.createElement('section');
    dom.window.document.body.appendChild(root);
  });

  afterEach(() => {
    dom.window.close();
    delete global.document;
  });

  test('navigator renders search and tabs and emits user changes', () => {
    const events = [];
    const component = createMethodNavigator({
      root,
      props: {
        searchTerm: '',
        activeTab: 'all',
        tabSpecs: [
          { id: 'all', label: 'All' },
          { id: 'core', label: 'Core' },
        ],
      },
      callbacks: {
        onSearchTermChange: (value) => events.push(['search', value]),
        onTabChange: (value) => events.push(['tab', value]),
      },
    });

    const search = root.querySelector('[data-role="method-picker-search"]');
    search.value = 'city';
    search.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    root.querySelector('[data-tab="core"]').click();

    expect(events).toEqual([
      ['search', 'city'],
      ['tab', 'core'],
    ]);
    expect(root.querySelector('[data-tab="all"]').classList.contains('is-active')).toBe(true);

    component.update({ activeTab: 'core', searchTerm: 'city' });
    expect(root.querySelector('[data-tab="core"]').classList.contains('is-active')).toBe(true);

    component.destroy();
    expect(root.children).toHaveLength(0);
  });

  test('list renders selected methods, empty state, and selection callbacks', () => {
    const selections = [];
    const component = createMethodList({
      root,
      props: {
        selectedCommand: 'location.city',
        options: [
          { sourceType: 'domain', command: 'location.city', helpModel: { summary: 'City' } },
          { sourceType: 'faker', command: 'helpers.arrayElement', helpModel: { summary: 'Pick' } },
        ],
      },
      callbacks: {
        onSelectCommand: (command) => selections.push(command),
      },
    });

    expect(root.querySelector('[data-command="location.city"]').classList.contains('is-selected')).toBe(true);
    expect(root.getAttribute('role')).toBe('listbox');
    expect(root.getAttribute('aria-orientation')).toBe('vertical');
    expect(root.querySelector('[data-role="method-picker-tile"]').tagName).toBe('DIV');
    expect(root.querySelector('[data-role="method-picker-tile"]').getAttribute('role')).toBe('option');
    root.querySelector('[data-command="helpers.arrayElement"]').click();
    expect(selections).toEqual(['helpers.arrayElement']);

    component.update({ options: [], selectedCommand: '' });
    expect(root.textContent).toContain('No methods match the current filter.');

    component.destroy();
    expect(root.children).toHaveLength(0);
  });

  test('list uses roving tabindex and arrow keys for method navigation', () => {
    let component;
    let selectedCommand = 'location.city';
    const options = [
      { sourceType: 'domain', command: 'location.city', helpModel: { summary: 'City' } },
      { sourceType: 'domain', command: 'location.country', helpModel: { summary: 'Country' } },
      { sourceType: 'faker', command: 'helpers.arrayElement', helpModel: { summary: 'Pick' } },
    ];
    const selectCommand = (command) => {
      selectedCommand = command;
      component.update({ options, selectedCommand });
    };

    component = createMethodList({
      root,
      props: { options, selectedCommand },
      callbacks: { onSelectCommand: selectCommand },
    });

    const cityTile = root.querySelector('[data-command="location.city"]');
    const countryTile = root.querySelector('[data-command="location.country"]');
    const arrayTile = root.querySelector('[data-command="helpers.arrayElement"]');
    expect(cityTile.tabIndex).toBe(0);
    expect(countryTile.tabIndex).toBe(-1);
    expect(arrayTile.tabIndex).toBe(-1);

    cityTile.focus();
    cityTile.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

    const selectedCountryTile = root.querySelector('[data-command="location.country"]');
    expect(selectedCommand).toBe('location.country');
    expect(selectedCountryTile.tabIndex).toBe(0);
    expect(selectedCountryTile.getAttribute('aria-selected')).toBe('true');
    expect(dom.window.document.activeElement).toBe(selectedCountryTile);
    expect(root.querySelector('[data-command="location.city"]').tabIndex).toBe(-1);

    selectedCountryTile.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(selectedCommand).toBe('location.city');
    expect(dom.window.document.activeElement).toBe(root.querySelector('[data-command="location.city"]'));

    root
      .querySelector('[data-command="location.city"]')
      .dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(selectedCommand).toBe('helpers.arrayElement');
    expect(dom.window.document.activeElement).toBe(root.querySelector('[data-command="helpers.arrayElement"]'));
  });

  test('help display renders params, usage examples, return values, and docs links', () => {
    const component = createMethodHelpDisplay({
      root,
      props: {
        selectedOption: {
          sourceType: 'domain',
          command: 'datatype.enum',
          helpModel: {
            heading: 'datatype.enum',
            summary: 'Enum helper',
            docsUrl: 'https://anywaydata.com/docs/category/generating-data',
            params: [{ name: 'csv', type: 'string', optional: true, description: 'CSV values.', example: 'a,b' }],
            usageExamples: [
              {
                functionCall: 'datatype.enum(csv="active,inactive")',
                sampleReturnValue: 'active',
                description: 'Choose one value.',
              },
            ],
          },
        },
      },
    });

    expect(root.textContent).toContain('datatype.enum');
    expect(root.textContent).toContain('Parameter Details');
    expect(root.textContent).toContain('CSV values.');
    expect(root.textContent).toContain('Parameter Types');
    expect(root.textContent).toContain('optional');
    expect(root.textContent).toContain('Params field: csv="active,inactive"');
    expect(root.textContent).toContain('Returns: active');
    expect(root.innerHTML).not.toContain('<h5>Return Examples</h5>');
    expect(root.querySelector('.method-picker-docs-link a').getAttribute('href')).toBe(
      'https://anywaydata.com/docs/category/generating-data'
    );

    component.update({ selectedOption: null });
    expect(root.textContent).toContain('No method selected');
  });

  test('help display omits unsafe docs links and preserves falsy return examples', () => {
    createMethodHelpDisplay({
      root,
      props: {
        selectedOption: {
          sourceType: 'domain',
          command: 'datatype.boolean',
          helpModel: {
            summary: 'Boolean helper',
            docsUrl: 'javascript:alert(1)',
            params: [],
            returnExamples: [0, false, ''],
          },
        },
      },
    });

    expect(root.querySelector('.method-picker-docs-link a')).toBeNull();
    expect(root.textContent).toContain('0');
    expect(root.textContent).toContain('false');
  });

  test('return examples fall back safely for circular values', () => {
    const circular = { label: 'loop' };
    circular.self = circular;

    expect(getReturnExamples({ usageExamples: [{ functionCall: 'demo()', sampleReturnValue: circular }] })).toEqual([
      '[object Object]',
    ]);
  });
});
