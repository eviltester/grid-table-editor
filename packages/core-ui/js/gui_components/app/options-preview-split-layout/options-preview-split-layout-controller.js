class OptionsPreviewSplitLayoutController {
  constructor({ props = {} } = {}) {
    this.state = {
      optionsSupported: props.optionsSupported === true,
      currentOptionsPanelWidthPx: null,
      defaultOptionsPanelWidthPx: Number.isFinite(props.defaultOptionsPanelWidthPx)
        ? props.defaultOptionsPanelWidthPx
        : 272,
      minOptionsPanelWidthPx: Number.isFinite(props.minOptionsPanelWidthPx) ? props.minOptionsPanelWidthPx : 180,
      maxOptionsPanelWidthPx: Number.isFinite(props.maxOptionsPanelWidthPx) ? props.maxOptionsPanelWidthPx : 520,
      minPreviewPanelWidthPx: Number.isFinite(props.minPreviewPanelWidthPx) ? props.minPreviewPanelWidthPx : 220,
    };
  }

  getState() {
    return { ...this.state };
  }

  updateProps(nextProps = {}) {
    if (Object.prototype.hasOwnProperty.call(nextProps, 'optionsSupported')) {
      this.state.optionsSupported = nextProps.optionsSupported === true;
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'defaultOptionsPanelWidthPx')) {
      this.state.defaultOptionsPanelWidthPx = Number.isFinite(nextProps.defaultOptionsPanelWidthPx)
        ? nextProps.defaultOptionsPanelWidthPx
        : this.state.defaultOptionsPanelWidthPx;
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'minOptionsPanelWidthPx')) {
      this.state.minOptionsPanelWidthPx = Number.isFinite(nextProps.minOptionsPanelWidthPx)
        ? nextProps.minOptionsPanelWidthPx
        : this.state.minOptionsPanelWidthPx;
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'maxOptionsPanelWidthPx')) {
      this.state.maxOptionsPanelWidthPx = Number.isFinite(nextProps.maxOptionsPanelWidthPx)
        ? nextProps.maxOptionsPanelWidthPx
        : this.state.maxOptionsPanelWidthPx;
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'minPreviewPanelWidthPx')) {
      this.state.minPreviewPanelWidthPx = Number.isFinite(nextProps.minPreviewPanelWidthPx)
        ? nextProps.minPreviewPanelWidthPx
        : this.state.minPreviewPanelWidthPx;
    }
  }

  getInitialOptionsPanelWidthPx() {
    return Number.isFinite(this.state.currentOptionsPanelWidthPx)
      ? this.state.currentOptionsPanelWidthPx
      : this.state.defaultOptionsPanelWidthPx;
  }

  readOptionsPanelWidthPx(styleWidth) {
    const parsed = Number.parseFloat(styleWidth || '');
    return Number.isFinite(parsed) ? parsed : this.getInitialOptionsPanelWidthPx();
  }

  clampOptionsPanelWidth(widthPx, editAreaWidthPx) {
    const maxByContainer =
      editAreaWidthPx > 0
        ? Math.max(this.state.minOptionsPanelWidthPx, editAreaWidthPx - this.state.minPreviewPanelWidthPx)
        : this.state.maxOptionsPanelWidthPx;
    const maxAllowed = Math.min(this.state.maxOptionsPanelWidthPx, maxByContainer);
    return Math.min(Math.max(widthPx, this.state.minOptionsPanelWidthPx), maxAllowed);
  }

  setCurrentOptionsPanelWidthPx(widthPx) {
    this.state.currentOptionsPanelWidthPx = Math.round(widthPx);
  }
}

export { OptionsPreviewSplitLayoutController };
