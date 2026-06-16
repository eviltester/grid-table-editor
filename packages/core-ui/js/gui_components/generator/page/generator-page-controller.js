class GeneratorPageController {
  constructor({ props = {} } = {}) {
    this.state = {
      controlsProps: props.controlsProps || {},
      previewProps: props.previewProps || {},
      schemaDefinitionProps: props.schemaDefinitionProps || {},
      storedSchemasProps: props.storedSchemasProps || {},
    };
  }

  getState() {
    return {
      controlsProps: { ...this.state.controlsProps },
      previewProps: { ...this.state.previewProps },
      schemaDefinitionProps: { ...this.state.schemaDefinitionProps },
      storedSchemasProps: { ...this.state.storedSchemasProps },
    };
  }

  updateProps(nextProps = {}) {
    if (Object.prototype.hasOwnProperty.call(nextProps, 'controlsProps')) {
      this.state.controlsProps = {
        ...this.state.controlsProps,
        ...nextProps.controlsProps,
      };
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'previewProps')) {
      this.state.previewProps = {
        ...this.state.previewProps,
        ...nextProps.previewProps,
      };
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'schemaDefinitionProps')) {
      this.state.schemaDefinitionProps = {
        ...this.state.schemaDefinitionProps,
        ...nextProps.schemaDefinitionProps,
      };
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'storedSchemasProps')) {
      this.state.storedSchemasProps = {
        ...this.state.storedSchemasProps,
        ...nextProps.storedSchemasProps,
      };
    }
  }
}

export { GeneratorPageController };
