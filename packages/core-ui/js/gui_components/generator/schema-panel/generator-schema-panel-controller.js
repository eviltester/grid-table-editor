class GeneratorSchemaPanelController {
  constructor({ props = {} } = {}) {
    this.state = {
      schemaDefinitionProps: props.schemaDefinitionProps || {},
    };
  }

  updateProps(nextProps = {}) {
    if (Object.prototype.hasOwnProperty.call(nextProps, 'schemaDefinitionProps')) {
      this.state.schemaDefinitionProps = {
        ...this.state.schemaDefinitionProps,
        ...nextProps.schemaDefinitionProps,
      };
    }
  }

  getState() {
    return {
      schemaDefinitionProps: { ...this.state.schemaDefinitionProps },
    };
  }
}

export { GeneratorSchemaPanelController };
