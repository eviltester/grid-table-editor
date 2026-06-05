import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorPageComponentConfig } from '../../../js/gui_components/generator/runtime/create-generator-page-component-config.js';

describe('createGeneratorPageComponentConfig', () => {
  test('builds page props, services, and callbacks that delegate through injected boundaries', () => {
    const onApplyOptions = jest.fn();
    const onGenerateData = jest.fn();
    const onGeneratePairwise = jest.fn();
    const onPreview = jest.fn();
    const onRenderOutputPreview = jest.fn();
    const onSchemaError = jest.fn();
    const onSchemaClear = jest.fn();
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

    const config = createGeneratorPageComponentConfig({
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
      onApplyOptions,
      onGenerateData,
      onGeneratePairwise,
      onPreview,
      onRenderOutputPreview,
      onSchemaError,
      onSchemaClear,
      onRowsChanged,
    });

    expect(config.props.controlsProps.selectedFormat).toBe('csv');
    expect(config.props.previewProps.outputPreviewText).toBe('');
    expect(config.props.schemaDefinitionProps.createBlankRow).toBe(generatorSchemaDefinitionSupport.createBlankRow);
    expect(config.props.schemaDefinitionProps.fakerCommands).toEqual(['helpers.arrayElement']);
    expect(config.props.schemaDefinitionProps.sampleSchemaText).toBe('Name\nliteral(Alice)');
    expect(config.props.schemaDefinitionProps.sectionClassName).toBe(
      'shared-schema-definition-shell shared-schema-section'
    );
    expect(config.props.schemaDefinitionProps.headingClassName).toBe('shared-schema-heading');
    expect(config.props.schemaDefinitionProps.errorClassName).toBe('shared-schema-error');
    expect(config.props.schemaDefinitionProps.helpGroupClassName).toBe('shared-schema-button-with-help');
    expect(config.props.schemaDefinitionProps.rowsClassName).toBe('shared-schema-rows');
    expect(config.props.schemaDefinitionProps.textContainerClassName).toBe('shared-schema-text');
    expect(config.props.schemaDefinitionProps.footerClassName).toBe('shared-schema-footer');
    expect(config.props.schemaDefinitionProps.ids).toBeUndefined();

    expect(config.services.generatorControlsServices.canExportFormat('json')).toBe(true);
    expect(config.services.generatorControlsServices.getCurrentOptionsForFormat('json')).toEqual({
      options: { prettyPrint: true },
    });

    config.callbacks.generatorControls.onFormatChanged();
    config.callbacks.generatorControls.onApplyOptions({ sanitized: { outputFormat: 'json' } });
    config.callbacks.generatorControls.onGenerateData();
    config.callbacks.generatorControls.onGeneratePairwise();
    config.callbacks.generatorPreview.onPreview();
    config.callbacks.schemaDefinition.onSchemaError('Bad schema');
    config.callbacks.schemaDefinition.onSchemaClear();
    config.callbacks.schemaDefinition.onRowsChanged();
    config.props.schemaDefinitionProps.updatePairwiseButtonVisibility();

    expect(onRenderOutputPreview).toHaveBeenCalledTimes(1);
    expect(onApplyOptions).toHaveBeenCalledWith({ outputFormat: 'json' });
    expect(onGenerateData).toHaveBeenCalledTimes(1);
    expect(onGeneratePairwise).toHaveBeenCalledTimes(1);
    expect(onPreview).toHaveBeenCalledTimes(1);
    expect(onSchemaError).toHaveBeenCalledWith('Bad schema');
    expect(onSchemaClear).toHaveBeenCalledTimes(1);
    expect(onRowsChanged).toHaveBeenCalledTimes(2);
  });
});
