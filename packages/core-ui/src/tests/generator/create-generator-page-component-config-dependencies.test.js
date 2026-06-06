import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorPageComponentConfigDependencies } from '../../../js/gui_components/generator/runtime/create-generator-page-component-config-dependencies.js';

describe('createGeneratorPageComponentConfigDependencies', () => {
  test('builds page props and services that delegate through injected boundaries', () => {
    const onRowsChanged = jest.fn();
    const exporter = {
      canExport: jest.fn(() => true),
      getOptionsForType: jest.fn(() => ({ options: { prettyPrint: true } })),
    };
    const generatorSchemaDefinitionSupport = {
      createBlankRow: jest.fn(() => ({ id: 'row-1' })),
      mapRuleToRow: jest.fn(),
      getMethodPickerOptions: jest.fn(() => []),
      getVisibleDomainCommands: jest.fn(() => []),
      buildModeHelpHtml: jest.fn(() => '<p>schema mode</p>'),
      validateSchemaRows: jest.fn((rows) => ({ rows, errors: [] })),
    };

    const dependencies = createGeneratorPageComponentConfigDependencies({
      schemaTextToDataRules: jest.fn(),
      dataRulesToSchemaText: jest.fn(),
      faker: {},
      RandExp: function RandExp() {},
      generatorSchemaDefinitionSupport,
      fakerCommands: ['helpers.arrayElement'],
      sampleSchemaText: 'Name\nliteral(Alice)',
      getExporter: () => exporter,
      TabulatorCtor: function FakeTabulator() {},
      GridExtensionClass: function FakeGridExtension() {},
      onRowsChanged,
    });

    expect(dependencies.props.controlsProps.selectedFormat).toBe('csv');
    expect(dependencies.props.previewProps.outputPreviewText).toBe('');
    expect(dependencies.props.schemaDefinitionProps.createBlankRow).toBe(
      generatorSchemaDefinitionSupport.createBlankRow
    );
    expect(dependencies.props.schemaDefinitionProps.fakerCommands).toEqual(['helpers.arrayElement']);
    expect(dependencies.props.schemaDefinitionProps.sampleSchemaText).toBe('Name\nliteral(Alice)');

    expect(dependencies.services.generatorControlsServices.canExportFormat('json')).toBe(true);
    expect(dependencies.services.generatorControlsServices.getCurrentOptionsForFormat('json')).toEqual({
      options: { prettyPrint: true },
    });

    dependencies.props.schemaDefinitionProps.updatePairwiseButtonVisibility();

    expect(onRowsChanged).toHaveBeenCalledTimes(1);
  });
});
