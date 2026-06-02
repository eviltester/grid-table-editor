class PopulationModeSelectorController {
  constructor({ props = {}, callbacks = {} } = {}) {
    this.callbacks = callbacks;
    this.props = {
      name: props.name || 'testDataGenerationMode',
      options: Array.isArray(props.options) ? props.options : [],
      selectedMode: props.selectedMode || '',
    };
    this.state = { ...this.props };
  }

  updateProps(nextProps = {}) {
    this.props = {
      ...this.props,
      ...nextProps,
      options: Array.isArray(nextProps.options) ? nextProps.options : this.props.options,
    };
    this.state = { ...this.props };
  }

  getState() {
    return {
      ...this.state,
      options: this.state.options.map((option) => ({ ...option })),
    };
  }

  handleModeChange(mode) {
    this.state = {
      ...this.state,
      selectedMode: mode,
    };
    this.callbacks.onChange?.(mode);
    return this.getState();
  }
}

export { PopulationModeSelectorController };
