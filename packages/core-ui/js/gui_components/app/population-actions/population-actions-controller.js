class PopulationActionsController {
  constructor({ props = {}, callbacks = {} } = {}) {
    this.callbacks = callbacks;
    this.state = {
      pairwiseVisible: props.pairwiseVisible === true,
      generateBusy: props.generateBusy === true,
      generatePairwiseBusy: props.generatePairwiseBusy === true,
      refreshPreviewBusy: props.refreshPreviewBusy === true,
    };
  }

  updateProps(nextProps = {}) {
    this.state = {
      ...this.state,
      pairwiseVisible: nextProps.pairwiseVisible ?? this.state.pairwiseVisible,
      generateBusy: nextProps.generateBusy ?? this.state.generateBusy,
      generatePairwiseBusy: nextProps.generatePairwiseBusy ?? this.state.generatePairwiseBusy,
      refreshPreviewBusy: nextProps.refreshPreviewBusy ?? this.state.refreshPreviewBusy,
    };
  }

  getState() {
    return { ...this.state };
  }

  handleGenerate() {
    this.callbacks.onGenerate?.();
  }

  handleGeneratePairwise() {
    this.callbacks.onGeneratePairwise?.();
  }

  handleRefreshPreview() {
    this.callbacks.onRefreshPreview?.();
  }
}

export { PopulationActionsController };
