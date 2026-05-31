class DataPopulationPanelController {
  constructor({ props = {}, callbacks = {} } = {}) {
    this.callbacks = callbacks;
    this.state = {
      selectedMode: props.selectedMode || '',
      pairwiseVisible: props.pairwiseVisible === true,
      modeOptions: Array.isArray(props.modeOptions) ? props.modeOptions : [],
      rowCountProps: { ...(props.rowCountProps || {}) },
      schemaDefinitionProps: { ...(props.schemaDefinitionProps || {}) },
    };
  }

  updateProps(nextProps = {}) {
    this.state = {
      ...this.state,
      selectedMode: nextProps.selectedMode ?? this.state.selectedMode,
      pairwiseVisible: nextProps.pairwiseVisible ?? this.state.pairwiseVisible,
      modeOptions: Array.isArray(nextProps.modeOptions) ? nextProps.modeOptions : this.state.modeOptions,
      rowCountProps: nextProps.rowCountProps
        ? { ...this.state.rowCountProps, ...nextProps.rowCountProps }
        : this.state.rowCountProps,
      schemaDefinitionProps: nextProps.schemaDefinitionProps
        ? { ...this.state.schemaDefinitionProps, ...nextProps.schemaDefinitionProps }
        : this.state.schemaDefinitionProps,
    };
  }

  getState() {
    return {
      ...this.state,
      modeOptions: this.state.modeOptions.map((option) => ({ ...option })),
      rowCountProps: { ...this.state.rowCountProps },
      schemaDefinitionProps: { ...this.state.schemaDefinitionProps },
    };
  }

  handleModeChange(mode) {
    this.state = {
      ...this.state,
      selectedMode: mode,
    };
    this.callbacks.onModeChange?.(mode);
  }
}

export { DataPopulationPanelController };
