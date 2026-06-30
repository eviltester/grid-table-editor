class TestDataPopulationToolbarController {
  constructor({ props = {}, callbacks = {} } = {}) {
    this.callbacks = callbacks;
    this.state = {
      selectedMode: props.selectedMode || '',
      pairwiseVisible: props.pairwiseVisible === true,
      modeOptions: Array.isArray(props.modeOptions) ? props.modeOptions : [],
      rowCountProps: { ...(props.rowCountProps || {}) },
      actionIds: { ...(props.actionIds || {}) },
      generateBusy: props.generateBusy === true,
      generatePairwiseBusy: props.generatePairwiseBusy === true,
      generateSchemaBusy: props.generateSchemaBusy === true,
      unsafeFakerExpressions: props.unsafeFakerExpressions === true,
    };
  }

  updateProps(nextProps = {}) {
    this.state = {
      ...this.state,
      selectedMode: nextProps.selectedMode ?? this.state.selectedMode,
      pairwiseVisible: nextProps.pairwiseVisible ?? this.state.pairwiseVisible,
      modeOptions: Array.isArray(nextProps.modeOptions) ? nextProps.modeOptions : this.state.modeOptions,
      actionIds: nextProps.actionIds ? { ...this.state.actionIds, ...nextProps.actionIds } : this.state.actionIds,
      rowCountProps: nextProps.rowCountProps
        ? { ...this.state.rowCountProps, ...nextProps.rowCountProps }
        : this.state.rowCountProps,
      generateBusy: nextProps.generateBusy ?? this.state.generateBusy,
      generatePairwiseBusy: nextProps.generatePairwiseBusy ?? this.state.generatePairwiseBusy,
      generateSchemaBusy: nextProps.generateSchemaBusy ?? this.state.generateSchemaBusy,
      unsafeFakerExpressions: nextProps.unsafeFakerExpressions ?? this.state.unsafeFakerExpressions,
    };
  }

  getState() {
    return {
      ...this.state,
      modeOptions: this.state.modeOptions.map((option) => ({ ...option })),
      actionIds: { ...this.state.actionIds },
      rowCountProps: { ...this.state.rowCountProps },
    };
  }

  handleModeChange(mode) {
    this.state = {
      ...this.state,
      selectedMode: mode,
    };
    this.callbacks.onModeChange?.(mode);
  }

  handleUnsafeFakerExpressionsChange(isEnabled) {
    this.state = {
      ...this.state,
      unsafeFakerExpressions: isEnabled === true,
    };
    this.callbacks.onUnsafeFakerExpressionsChange?.(this.state.unsafeFakerExpressions);
  }
}

export { TestDataPopulationToolbarController };
