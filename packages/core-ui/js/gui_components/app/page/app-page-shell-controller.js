class AppPageShellController {
  constructor({ props = {} } = {}) {
    this.props = {
      showTestDataOpen: false,
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

export { AppPageShellController };
