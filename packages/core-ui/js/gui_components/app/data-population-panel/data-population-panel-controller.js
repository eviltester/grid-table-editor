class DataPopulationPanelController {
  constructor({ props = {}, callbacks = {} } = {}) {
    this.callbacks = callbacks;
    this.state = {
      selectedMode: props.selectedMode || '',
      pairwiseVisible: props.pairwiseVisible === true,
      modeOptions: Array.isArray(props.modeOptions) ? props.modeOptions : [],
      rowCountProps: { ...(props.rowCountProps || {}) },
      actionIds: { ...(props.actionIds || {}) },
      schemaDefinitionProps: { ...(props.schemaDefinitionProps || {}) },
      storedSchemasEnabled: props.storedSchemasEnabled === true,
      storedSchemasProps: { ...(props.storedSchemasProps || {}) },
      generateSchemaBusy: props.generateSchemaBusy === true,
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
      schemaDefinitionProps: nextProps.schemaDefinitionProps
        ? { ...this.state.schemaDefinitionProps, ...nextProps.schemaDefinitionProps }
        : this.state.schemaDefinitionProps,
      storedSchemasEnabled: nextProps.storedSchemasEnabled ?? this.state.storedSchemasEnabled,
      storedSchemasProps: nextProps.storedSchemasProps
        ? { ...this.state.storedSchemasProps, ...nextProps.storedSchemasProps }
        : this.state.storedSchemasProps,
      generateSchemaBusy: nextProps.generateSchemaBusy ?? this.state.generateSchemaBusy,
    };
  }

  getState() {
    return {
      ...this.state,
      modeOptions: this.state.modeOptions.map((option) => ({ ...option })),
      actionIds: { ...this.state.actionIds },
      rowCountProps: { ...this.state.rowCountProps },
      schemaDefinitionProps: { ...this.state.schemaDefinitionProps },
      storedSchemasProps: { ...this.state.storedSchemasProps },
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
