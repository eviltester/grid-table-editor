import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorPageRuntimeConfig } from '../../../js/gui_components/generator/runtime/create-generator-page-runtime-config.js';

describe('createGeneratorPageRuntimeConfig', () => {
  test('builds page props, services, and callbacks directly from the runtime', async () => {
    const applyCurrentTypeOptions = jest.fn(() => ({ applied: true }));
    const generateDataFile = jest.fn(async () => 'generated');
    const generateAllPairsDataFile = jest.fn(async () => 'pairwise');
    const previewData = jest.fn(() => 'previewed');
    const renderOutputPreviewForCurrentSelection = jest.fn();
    const showSchemaErrorStatus = jest.fn();
    const clearSchemaErrorStatus = jest.fn();
    const updateAllPairsButtonVisibility = jest.fn();
    const exporter = {
      id: 'exporter',
      getOptionsForType: jest.fn((type) => ({ type })),
    };
    const runtime = {
      schemaTextToDataRules: jest.fn(),
      dataRulesToSchemaText: jest.fn(),
      faker: { word: { noun: () => 'x' } },
      RandExp: function RandExp() {},
      generatorSchemaDefinitionSupport: {
        createBlankRow: jest.fn(() => ({ name: '', sourceType: 'faker', value: '' })),
        mapRuleToRow: jest.fn(),
        getMethodPickerOptions: jest.fn(() => []),
        getVisibleDomainCommands: jest.fn(() => []),
        buildModeHelpHtml: jest.fn(() => '<p>help</p>'),
        validateSchemaRows: jest.fn((rows) => ({ rows, errors: [] })),
      },
      fakerCommands: ['helpers.arrayElement'],
      sampleSchemaText: 'Name\nliteral(x)',
      exporter,
      TabulatorCtor: class FakeTabulator {},
      GridExtensionClass: class FakeGridExtension {},
      applyCurrentTypeOptions,
      generateDataFile,
      generateAllPairsDataFile,
      previewData,
      updateAllPairsButtonVisibility,
      generatorViewState: {
        renderOutputPreviewForCurrentSelection,
      },
      generatorSchemaRuntime: {
        showSchemaErrorStatus,
        clearSchemaErrorStatus,
      },
    };

    const config = createGeneratorPageRuntimeConfig({
      runtime,
    });

    expect(config.props.controlsProps).toBeDefined();
    expect(config.props.previewProps).toBeDefined();
    expect(config.props.schemaDefinitionProps.fakerCommands).toEqual(['helpers.arrayElement']);
    expect(config.props.schemaDefinitionProps.headingText).toBe('Schema');
    expect(config.services.generatorControlsServices.getCurrentOptionsForFormat('csv')).toEqual({ type: 'csv' });
    expect(config.services.generatorPreviewServices.TabulatorCtor).toBe(runtime.TabulatorCtor);
    expect(config.services.generatorPreviewServices.GridExtensionClass).toBe(runtime.GridExtensionClass);

    config.callbacks.generatorControls.onApplyOptions({ sanitized: { outputFormat: 'json' } });
    config.callbacks.generatorControls.onGenerateData();
    config.callbacks.generatorControls.onGeneratePairwise();
    expect(config.callbacks.generatorPreview.onPreview()).toBe('previewed');
    config.callbacks.generatorControls.onFormatChanged();
    config.callbacks.schemaDefinition.onSchemaError('bad schema');
    config.callbacks.schemaDefinition.onSchemaClear();
    config.callbacks.schemaDefinition.onRowsChanged();

    expect(applyCurrentTypeOptions).toHaveBeenCalledWith({ outputFormat: 'json' });
    expect(generateDataFile).toHaveBeenCalledTimes(1);
    expect(generateAllPairsDataFile).toHaveBeenCalledTimes(1);
    expect(previewData).toHaveBeenCalledTimes(1);
    expect(renderOutputPreviewForCurrentSelection).toHaveBeenCalledTimes(1);
    expect(showSchemaErrorStatus).toHaveBeenCalledWith('bad schema');
    expect(clearSchemaErrorStatus).toHaveBeenCalledTimes(1);
    expect(updateAllPairsButtonVisibility).toHaveBeenCalledTimes(1);
  });
});
