import { createGeneratorPageComponentCallbacks } from './create-generator-page-component-callbacks.js';
import { createGeneratorPageComponentConfigDependencies } from './create-generator-page-component-config-dependencies.js';

function createGeneratorPageComponentConfig({
  schemaTextToDataRules,
  dataRulesToSchemaText,
  faker,
  RandExp,
  generatorSchemaDefinitionSupport,
  fakerCommands = [],
  sampleSchemaText = '',
  getExporter,
  TabulatorCtor,
  GridExtensionClass,
  onApplyOptions,
  onGenerateData,
  onGeneratePairwise,
  onPreview,
  onRenderOutputPreview,
  onSchemaError,
  onSchemaClear,
  onRowsChanged,
  createConfigDependencies = createGeneratorPageComponentConfigDependencies,
  createConfigCallbacks = createGeneratorPageComponentCallbacks,
} = {}) {
  return {
    ...createConfigDependencies({
      schemaTextToDataRules,
      dataRulesToSchemaText,
      faker,
      RandExp,
      generatorSchemaDefinitionSupport,
      fakerCommands,
      sampleSchemaText,
      getExporter,
      TabulatorCtor,
      GridExtensionClass,
      onRowsChanged,
    }),
    callbacks: createConfigCallbacks({
      onApplyOptions,
      onGenerateData,
      onGeneratePairwise,
      onPreview,
      onRenderOutputPreview,
      onSchemaError,
      onSchemaClear,
      onRowsChanged,
    }),
  };
}

export { createGeneratorPageComponentConfig };
