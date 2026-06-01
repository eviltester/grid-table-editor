class GeneratorPageShellController {
  constructor({ props = {} } = {}) {
    this.props = {
      ...props,
    };
  }

  updateProps(nextProps = {}) {
    this.props = {
      ...this.props,
      ...nextProps,
    };
  }

  getState() {
    return this.props;
  }
}

export { GeneratorPageShellController };
