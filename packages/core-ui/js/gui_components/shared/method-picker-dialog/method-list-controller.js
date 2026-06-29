class MethodListController {
  constructor({ props = {} } = {}) {
    this.props = {
      options: Array.isArray(props.options) ? props.options.slice() : [],
      selectedCommand: String(props.selectedCommand || ''),
    };
  }

  updateProps(nextProps = {}) {
    this.props = {
      ...this.props,
      ...nextProps,
      options: Array.isArray(nextProps.options) ? nextProps.options.slice() : this.props.options.slice(),
      selectedCommand: String(nextProps.selectedCommand ?? this.props.selectedCommand ?? ''),
    };
  }

  getState() {
    return {
      ...this.props,
      options: this.props.options.slice(),
    };
  }
}

export { MethodListController };
