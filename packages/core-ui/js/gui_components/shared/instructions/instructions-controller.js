class InstructionsController {
  constructor({ props = {} } = {}) {
    this.props = {
      title: 'Instructions',
      helpKey: '',
      helpText: '',
      items: [],
      actions: [],
      footerHtml: '',
      initiallyOpen: false,
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

export { InstructionsController };
