class PopulationActionsController {
  constructor({ props = {}, callbacks = {} } = {}) {
    this.callbacks = callbacks;
    this.state = {
      pairwiseVisible: props.pairwiseVisible === true,
      generateBusy: props.generateBusy === true,
      generatePairwiseBusy: props.generatePairwiseBusy === true,
      generateLabel: props.generateLabel || 'Generate',
      generatePairwiseLabel: props.generatePairwiseLabel || 'Generate Pairwise',
      generateHelpHtml: props.generateHelpHtml || '',
      generatePairwiseHelpHtml: props.generatePairwiseHelpHtml || '',
      generateHelpLabel: props.generateHelpLabel || 'Show generate help',
      generatePairwiseHelpLabel: props.generatePairwiseHelpLabel || 'Show pairwise generation help',
      statusVisible: props.statusVisible === true,
      roleNames: {
        generateButton: props.roleNames?.generateButton || 'generate-button',
        generatePairwiseButton: props.roleNames?.generatePairwiseButton || 'generate-pairwise-button',
        generatePairwiseWrapper: props.roleNames?.generatePairwiseWrapper || 'generate-pairwise-button-wrapper',
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
      generateLabel: nextProps.generateLabel ?? this.state.generateLabel,
      generatePairwiseLabel: nextProps.generatePairwiseLabel ?? this.state.generatePairwiseLabel,
      generateHelpHtml: nextProps.generateHelpHtml ?? this.state.generateHelpHtml,
      generatePairwiseHelpHtml: nextProps.generatePairwiseHelpHtml ?? this.state.generatePairwiseHelpHtml,
      generateHelpLabel: nextProps.generateHelpLabel ?? this.state.generateHelpLabel,
      generatePairwiseHelpLabel: nextProps.generatePairwiseHelpLabel ?? this.state.generatePairwiseHelpLabel,
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
}

export { PopulationActionsController };
