import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorPageComponentConfig } from '../../../js/gui_components/generator/runtime/create-generator-page-component-config.js';

describe('createGeneratorPageComponentConfig', () => {
  test('composes page config dependencies with page config callbacks', () => {
    const dependencies = {
      props: { controlsProps: { selectedFormat: 'csv' } },
      services: { generatorControlsServices: { canExportFormat: jest.fn() } },
    };
    const callbacks = {
      generatorControls: { onGenerateData: jest.fn() },
    };
    const createConfigDependencies = jest.fn(() => dependencies);
    const createConfigCallbacks = jest.fn(() => callbacks);

    const config = createGeneratorPageComponentConfig({
      schemaTextToDataRules: 'schemaTextToDataRules',
      dataRulesToSchemaText: 'dataRulesToSchemaText',
      faker: 'faker',
      RandExp: 'RandExp',
      generatorSchemaDefinitionSupport: 'generatorSchemaDefinitionSupport',
      fakerCommands: ['helpers.arrayElement'],
      sampleSchemaText: 'Name\nliteral(Alice)',
      getExporter: 'getExporter',
      TabulatorCtor: 'TabulatorCtor',
      GridExtensionClass: 'GridExtensionClass',
      onApplyOptions: 'onApplyOptions',
      onGenerateData: 'onGenerateData',
      onGeneratePairwise: 'onGeneratePairwise',
      onPreview: 'onPreview',
      onRenderOutputPreview: 'onRenderOutputPreview',
      onSchemaError: 'onSchemaError',
      onSchemaClear: 'onSchemaClear',
      onRowsChanged: 'onRowsChanged',
      createConfigDependencies,
      createConfigCallbacks,
    });

    expect(createConfigDependencies).toHaveBeenCalledWith({
      schemaTextToDataRules: 'schemaTextToDataRules',
      dataRulesToSchemaText: 'dataRulesToSchemaText',
      faker: 'faker',
      RandExp: 'RandExp',
      generatorSchemaDefinitionSupport: 'generatorSchemaDefinitionSupport',
      fakerCommands: ['helpers.arrayElement'],
      sampleSchemaText: 'Name\nliteral(Alice)',
      getExporter: 'getExporter',
      TabulatorCtor: 'TabulatorCtor',
      GridExtensionClass: 'GridExtensionClass',
      onRowsChanged: 'onRowsChanged',
    });
    expect(createConfigCallbacks).toHaveBeenCalledWith({
      onApplyOptions: 'onApplyOptions',
      onGenerateData: 'onGenerateData',
      onGeneratePairwise: 'onGeneratePairwise',
      onPreview: 'onPreview',
      onRenderOutputPreview: 'onRenderOutputPreview',
      onSchemaError: 'onSchemaError',
      onSchemaClear: 'onSchemaClear',
      onRowsChanged: 'onRowsChanged',
    });
    expect(config).toEqual({
      ...dependencies,
      callbacks,
    });
  });
});
