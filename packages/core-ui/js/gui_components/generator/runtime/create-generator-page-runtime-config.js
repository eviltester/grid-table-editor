function createGeneratorPageRuntimeConfig({ runtime } = {}) {
  const handleRowsChanged = () => runtime.updateAllPairsButtonVisibility?.();
  const selectedFormat = 'csv';

  return {
    props: {
      controlsProps: {
        selectedFormat,
        currentOptions: runtime.exporter?.getOptionsForType?.(selectedFormat),
        pairwiseVisible: false,
        exportEncodingSettings: runtime.defaultExportEncodingSettings,
      },
      previewProps: {
        outputPreviewText: '',
      },
      storedSchemasProps: {},
      schemaDefinitionProps: {
        headingText: 'Schema',
        sectionClassName: 'shared-schema-definition-shell shared-schema-section',
        headingClassName: 'shared-schema-heading',
        errorClassName: 'shared-schema-error',
        helpGroupClassName: 'shared-schema-button-with-help',
        rowsClassName: 'shared-schema-rows',
        textContainerClassName: 'shared-schema-text',
        footerClassName: 'shared-schema-footer',
        helpIconDataHelp: 'shared-schema-mode-help',
        schemaTextToDataRules:
          runtime.schemaTextToDataRules || (() => ({ dataRules: [], errors: [], schemaTokens: [] })),
        dataRulesToSchemaText: runtime.dataRulesToSchemaText || (() => ''),
        faker: runtime.faker,
        RandExp: runtime.RandExp,
        createBlankRow: runtime.generatorSchemaDefinitionSupport.createBlankRow,
        mapRuleToRow: runtime.generatorSchemaDefinitionSupport.mapRuleToRow,
        getMethodPickerOptions: runtime.generatorSchemaDefinitionSupport.getMethodPickerOptions,
        getVisibleDomainCommands: runtime.generatorSchemaDefinitionSupport.getVisibleDomainCommands,
        fakerCommands: runtime.fakerCommands,
        sampleSchemaText: runtime.sampleSchemaText,
        buildModeHelpHtml: runtime.generatorSchemaDefinitionSupport.buildModeHelpHtml,
        validateSchemaRows: runtime.generatorSchemaDefinitionSupport.validateSchemaRows,
        updatePairwiseButtonVisibility: handleRowsChanged,
      },
    },
    services: {
      generatorControlsServices: {
        canExportFormat: (type) => runtime.exporter?.canExport?.(type) !== false,
        getCurrentOptionsForFormat: (type) => runtime.exporter?.getOptionsForType?.(type),
      },
      generatorPreviewServices: {
        TabulatorCtor: runtime.TabulatorCtor,
        GridExtensionClass: runtime.GridExtensionClass,
      },
    },
    callbacks: {
      generatorControls: {
        onFormatChanged: () => {
          runtime.generatorViewState.renderOutputPreviewForCurrentSelection();
        },
        onApplyOptions: ({ sanitized }) => {
          runtime.applyCurrentTypeOptions(sanitized);
        },
        onGenerateData: () => {
          void runtime.generateDataFile();
        },
        onGeneratePairwise: () => {
          runtime.openGenerateCombinationsDialog();
        },
      },
      generatorPreview: {
        onPreview: () => runtime.previewData(),
      },
      schemaDefinition: {
        onSchemaError: (message) => runtime.generatorSchemaRuntime?.showSchemaErrorStatus(message),
        onSchemaClear: () => runtime.generatorSchemaRuntime?.clearSchemaErrorStatus(),
        onRowsChanged: handleRowsChanged,
      },
      storedSchemas: {
        onStatus: (message, options) => runtime.generatorViewState?.setGenerationStatus?.(message, options),
      },
    },
  };
}

export { createGeneratorPageRuntimeConfig };
