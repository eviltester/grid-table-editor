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
} = {}) {
  return {
    props: {
      controlsProps: {
        selectedFormat: 'csv',
        currentOptions: undefined,
        pairwiseVisible: false,
      },
      previewProps: {
        outputPreviewText: '',
      },
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
        schemaTextToDataRules: schemaTextToDataRules || (() => ({ dataRules: [], errors: [], schemaTokens: [] })),
        dataRulesToSchemaText: dataRulesToSchemaText || (() => ''),
        faker,
        RandExp,
        createBlankRow: generatorSchemaDefinitionSupport.createBlankRow,
        mapRuleToRow: generatorSchemaDefinitionSupport.mapRuleToRow,
        getMethodPickerOptions: generatorSchemaDefinitionSupport.getMethodPickerOptions,
        getVisibleDomainCommands: generatorSchemaDefinitionSupport.getVisibleDomainCommands,
        fakerCommands,
        sampleSchemaText,
        buildModeHelpHtml: generatorSchemaDefinitionSupport.buildModeHelpHtml,
        validateSchemaRows: generatorSchemaDefinitionSupport.validateSchemaRows,
        updatePairwiseButtonVisibility: () => onRowsChanged?.(),
      },
    },
    services: {
      generatorControlsServices: {
        canExportFormat: (type) => getExporter?.()?.canExport?.(type) !== false,
        getCurrentOptionsForFormat: (type) => getExporter?.()?.getOptionsForType?.(type),
      },
      generatorPreviewServices: {
        TabulatorCtor,
        GridExtensionClass,
      },
    },
    callbacks: {
      generatorControls: {
        onFormatChanged: () => {
          onRenderOutputPreview?.();
        },
        onApplyOptions: ({ sanitized }) => {
          onApplyOptions?.(sanitized);
        },
        onGenerateData: () => {
          onGenerateData?.();
        },
        onGeneratePairwise: () => {
          onGeneratePairwise?.();
        },
      },
      generatorPreview: {
        onPreview: () => onPreview?.(),
      },
      schemaDefinition: {
        onSchemaError: (message) => onSchemaError?.(message),
        onSchemaClear: () => onSchemaClear?.(),
        onRowsChanged: () => onRowsChanged?.(),
      },
    },
  };
}

export { createGeneratorPageComponentConfig };
