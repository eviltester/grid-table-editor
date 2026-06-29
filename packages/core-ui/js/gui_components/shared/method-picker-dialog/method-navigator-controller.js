class MethodNavigatorController {
  constructor({ props = {} } = {}) {
    this.props = {
      searchTerm: String(props.searchTerm || ''),
      activeTab: props.activeTab || 'all',
      tabSpecs: Array.isArray(props.tabSpecs) ? props.tabSpecs.slice() : [],
    };
  }

  updateProps(nextProps = {}) {
    this.props = {
      ...this.props,
      ...nextProps,
      searchTerm: String(nextProps.searchTerm ?? this.props.searchTerm ?? ''),
      tabSpecs: Array.isArray(nextProps.tabSpecs) ? nextProps.tabSpecs.slice() : this.props.tabSpecs.slice(),
    };
  }

  getState() {
    return {
      ...this.props,
      tabSpecs: this.props.tabSpecs.slice(),
    };
  }
}

export { MethodNavigatorController };
