import { createGeneratorPageComponentCallbacks } from './create-generator-page-component-callbacks.js';
import { createGeneratorPageComponentProps } from './create-generator-page-component-props.js';
import { createGeneratorPageComponentServices } from './create-generator-page-component-services.js';

function createGeneratorPageRuntimeConfig({ runtime } = {}) {
  const handleRowsChanged = () => runtime.updateAllPairsButtonVisibility?.();
  const props = createGeneratorPageComponentProps({
    schemaTextToDataRules: runtime.schemaTextToDataRules,
    dataRulesToSchemaText: runtime.dataRulesToSchemaText,
    faker: runtime.faker,
    RandExp: runtime.RandExp,
    generatorSchemaDefinitionSupport: runtime.generatorSchemaDefinitionSupport,
    fakerCommands: runtime.fakerCommands,
    sampleSchemaText: runtime.sampleSchemaText,
    onRowsChanged: handleRowsChanged,
  });
  const selectedFormat = props.controlsProps?.selectedFormat || 'csv';
  props.controlsProps = {
    ...props.controlsProps,
    currentOptions: runtime.exporter?.getOptionsForType?.(selectedFormat),
  };

  return {
    props,
    services: createGeneratorPageComponentServices({
      getExporter: () => runtime.exporter,
      TabulatorCtor: runtime.TabulatorCtor,
      GridExtensionClass: runtime.GridExtensionClass,
    }),
    callbacks: createGeneratorPageComponentCallbacks({
      onApplyOptions: (sanitized) => runtime.applyCurrentTypeOptions(sanitized),
      onGenerateData: () => {
        void runtime.generateDataFile();
      },
      onGeneratePairwise: () => {
        void runtime.generateAllPairsDataFile();
      },
      onPreview: () => runtime.previewData(),
      onRenderOutputPreview: () => runtime.generatorViewState.renderOutputPreviewForCurrentSelection(),
      onSchemaError: (message) => runtime.generatorSchemaRuntime?.showSchemaErrorStatus(message),
      onSchemaClear: () => runtime.generatorSchemaRuntime?.clearSchemaErrorStatus(),
      onRowsChanged: handleRowsChanged,
    }),
  };
}

export { createGeneratorPageRuntimeConfig };
