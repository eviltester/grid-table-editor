class ImportExportToolbarController {
  constructor({ props = {} } = {}) {
    this.state = {
      helpDataHelp: props.helpDataHelp || 'import-export-controls',
    };
  }

  getState() {
    return { ...this.state };
  }

  updateProps(nextProps = {}) {
    if (Object.prototype.hasOwnProperty.call(nextProps, 'helpDataHelp')) {
      this.state.helpDataHelp = nextProps.helpDataHelp || 'import-export-controls';
    }
  }
}

export { ImportExportToolbarController };
