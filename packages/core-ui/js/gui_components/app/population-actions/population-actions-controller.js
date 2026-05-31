class PopulationActionsController {
  constructor({ props = {}, callbacks = {} } = {}) {
    this.callbacks = callbacks;
    this.state = {
      pairwiseVisible: props.pairwiseVisible === true,
    };
  }

  updateProps(nextProps = {}) {
    this.state = {
      ...this.state,
      pairwiseVisible: nextProps.pairwiseVisible === true,
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
