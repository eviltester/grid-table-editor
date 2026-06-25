class MethodHelpDisplayController {
  constructor({ props = {} } = {}) {
    this.props = {
      selectedOption: props.selectedOption || null,
    };
  }

  updateProps(nextProps = {}) {
    this.props = {
      ...this.props,
      ...nextProps,
    };
  }

  getState() {
    return { ...this.props };
  }
}

export { MethodHelpDisplayController };
