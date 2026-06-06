function createGeneratorSchemaDefinitionProps({
  schemaTextToDataRules,
  dataRulesToSchemaText,
  faker,
  RandExp,
  generatorSchemaDefinitionSupport,
  fakerCommands = [],
  sampleSchemaText = '',
  onRowsChanged,
} = {}) {
  return {
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
  };
}

export { createGeneratorSchemaDefinitionProps };
