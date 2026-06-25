import { MethodPickerDialogController } from '../../../js/gui_components/shared/method-picker-dialog/method-picker-dialog-controller.js';

const OPTIONS = [
  { sourceType: 'enum', command: 'enum', helpModel: { summary: 'Enum values', params: [] } },
  { sourceType: 'literal', command: 'literal', helpModel: { summary: 'Literal value', params: [] } },
  { sourceType: 'regex', command: 'regex', helpModel: { summary: 'Regex value', params: [] } },
  {
    sourceType: 'domain',
    command: 'location.city',
    helpModel: {
      summary: 'Generate city values',
      params: [{ name: 'locale' }],
      usageExamples: [{ functionCall: 'location.city(locale="en")', sampleReturnValue: 'London' }],
    },
  },
  {
    sourceType: 'domain',
    command: 'commerce.price',
    helpModel: { summary: 'Generate prices', params: [] },
  },
  {
    sourceType: 'faker',
    command: 'helpers.arrayElement',
    helpModel: { summary: 'Pick one value', params: [] },
  },
];

describe('method picker dialog controller', () => {
  test('builds tabs from core, domain categories, faker, and recent', () => {
    const controller = new MethodPickerDialogController({ props: { options: OPTIONS } });

    expect(controller.getState().tabSpecs.map((tab) => tab.id)).toEqual([
      'all',
      'core',
      'domain:commerce',
      'domain:location',
      'faker',
      'recent',
    ]);
  });

  test('filters by core, faker, domain category, recent, and search text', () => {
    const controller = new MethodPickerDialogController({
      props: {
        options: OPTIONS,
        recentEntries: ['commerce.price'],
      },
    });

    controller.setActiveTab('core');
    expect(controller.getState().filteredOptions.map((option) => option.command)).toEqual(['enum', 'literal', 'regex']);

    controller.setActiveTab('faker');
    expect(controller.getState().filteredOptions.map((option) => option.command)).toEqual(['helpers.arrayElement']);

    controller.setActiveTab('domain:location');
    expect(controller.getState().filteredOptions.map((option) => option.command)).toEqual(['location.city']);

    controller.setActiveTab('recent');
    expect(controller.getState().filteredOptions.map((option) => option.command)).toEqual(['commerce.price']);

    controller.setActiveTab('all');
    controller.setSearchTerm('locale');
    expect(controller.getState().filteredOptions.map((option) => option.command)).toEqual(['location.city']);
  });

  test('respects initial selection and disables apply for empty options', () => {
    const controller = new MethodPickerDialogController({
      props: {
        options: OPTIONS,
        currentCommand: 'commerce.price',
        initialTab: 'domain:commerce',
      },
    });

    expect(controller.getState().activeTab).toBe('domain:commerce');
    expect(controller.getState().selectedCommand).toBe('commerce.price');
    expect(controller.getState().applyDisabled).toBe(false);

    const emptyController = new MethodPickerDialogController({ props: { options: [] } });
    expect(emptyController.getState().selectedCommand).toBe('');
    expect(emptyController.getState().applyDisabled).toBe(true);
  });

  test('selects first filtered option from search and records recent entries on apply', () => {
    const written = [];
    const controller = new MethodPickerDialogController({
      props: {
        options: OPTIONS,
        recentEntries: ['helpers.arrayElement'],
      },
      services: {
        recentStore: {
          read: () => ['helpers.arrayElement'],
          write: (entries) => written.push(entries),
        },
      },
    });

    controller.setSearchTerm('price');
    controller.selectFirstFilteredOption();

    expect(controller.getState().selectedCommand).toBe('commerce.price');
    expect(controller.applySelection()).toEqual({ sourceType: 'domain', command: 'commerce.price' });
    expect(written).toEqual([['commerce.price', 'helpers.arrayElement']]);
  });
});
