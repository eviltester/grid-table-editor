class GeneratorPageController {
  constructor({ props = {} } = {}) {
    this.state = {
      controlsProps: props.controlsProps || {},
      previewProps: props.previewProps || {},
      schemaDefinitionProps: props.schemaDefinitionProps || {},
    };
  }

  getState() {
    return {
      controlsProps: { ...this.state.controlsProps },
      previewProps: { ...this.state.previewProps },
      schemaDefinitionProps: { ...this.state.schemaDefinitionProps },
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
  }
}

export { GeneratorPageController };
