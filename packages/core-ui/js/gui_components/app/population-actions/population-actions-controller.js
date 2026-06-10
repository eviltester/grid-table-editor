class PopulationActionsController {
  constructor({ props = {}, callbacks = {} } = {}) {
    this.callbacks = callbacks;
    this.state = {
      pairwiseVisible: props.pairwiseVisible === true,
      generateBusy: props.generateBusy === true,
      generatePairwiseBusy: props.generatePairwiseBusy === true,
      generateSchemaBusy: props.generateSchemaBusy === true,
      generateLabel: props.generateLabel || 'Generate',
      generatePairwiseLabel: props.generatePairwiseLabel || 'Generate Pairwise',
      generateSchemaLabel: props.generateSchemaLabel || 'Grid to Enum Schema',
      generateHelpHtml: props.generateHelpHtml || '',
      generatePairwiseHelpHtml: props.generatePairwiseHelpHtml || '',
      generateSchemaHelpHtml: props.generateSchemaHelpHtml || '',
      generateHelpLabel: props.generateHelpLabel || 'Show generate help',
      generatePairwiseHelpLabel: props.generatePairwiseHelpLabel || 'Show pairwise generation help',
      generateSchemaHelpLabel: props.generateSchemaHelpLabel || 'Show grid to schema help',
      statusVisible: props.statusVisible === true,
      roleNames: {
        generateButton: props.roleNames?.generateButton || 'generate-button',
        generatePairwiseButton: props.roleNames?.generatePairwiseButton || 'generate-pairwise-button',
        generatePairwiseWrapper: props.roleNames?.generatePairwiseWrapper || 'generate-pairwise-button-wrapper',
        generateSchemaButton: props.roleNames?.generateSchemaButton || 'generate-schema-button',
        status: props.roleNames?.status || 'population-status',
      },
    };
  }

  updateProps(nextProps = {}) {
    this.state = {
      ...this.state,
      pairwiseVisible: nextProps.pairwiseVisible ?? this.state.pairwiseVisible,
      generateBusy: nextProps.generateBusy ?? this.state.generateBusy,
      generatePairwiseBusy: nextProps.generatePairwiseBusy ?? this.state.generatePairwiseBusy,
      generateSchemaBusy: nextProps.generateSchemaBusy ?? this.state.generateSchemaBusy,
      generateLabel: nextProps.generateLabel ?? this.state.generateLabel,
      generatePairwiseLabel: nextProps.generatePairwiseLabel ?? this.state.generatePairwiseLabel,
      generateSchemaLabel: nextProps.generateSchemaLabel ?? this.state.generateSchemaLabel,
      generateHelpHtml: nextProps.generateHelpHtml ?? this.state.generateHelpHtml,
      generatePairwiseHelpHtml: nextProps.generatePairwiseHelpHtml ?? this.state.generatePairwiseHelpHtml,
      generateSchemaHelpHtml: nextProps.generateSchemaHelpHtml ?? this.state.generateSchemaHelpHtml,
      generateHelpLabel: nextProps.generateHelpLabel ?? this.state.generateHelpLabel,
      generatePairwiseHelpLabel: nextProps.generatePairwiseHelpLabel ?? this.state.generatePairwiseHelpLabel,
      generateSchemaHelpLabel: nextProps.generateSchemaHelpLabel ?? this.state.generateSchemaHelpLabel,
      statusVisible: nextProps.statusVisible ?? this.state.statusVisible,
      roleNames: nextProps.roleNames
        ? {
            ...this.state.roleNames,
            ...nextProps.roleNames,
          }
        : this.state.roleNames,
    };
  }

  getState() {
    return { ...this.state };
  }

  handleGenerate() {
    this.callbacks.onGenerate?.();
  }

  handleGeneratePairwise() {
    this.callbacks.onGeneratePairwise?.();
  }

  handleGenerateSchemaFromGrid() {
    this.callbacks.onGenerateSchemaFromGrid?.();
  }
}

export { PopulationActionsController };
