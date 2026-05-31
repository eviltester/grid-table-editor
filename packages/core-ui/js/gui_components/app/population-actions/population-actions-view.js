class PopulationActionsView {
  constructor({ root, controller, documentObj = document } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = documentObj;
    this.handleGenerate = () => this.controller.handleGenerate();
    this.handleGeneratePairwise = () => this.controller.handleGeneratePairwise();
    this.handleRefreshPreview = () => this.controller.handleRefreshPreview();
  }

  mount() {
    if (!this.root) {
      throw new Error('PopulationActionsView requires a root element');
    }

    this.root.innerHTML = `
      <button id="generatedata">Generate</button>
      <button id="generateallpairs" style="display:none;">Generate Pairwise</button>
      <button id="refreshtestdatapreview">Refresh Text Preview</button>
      <span id="testdata-status" class="import-progress-status" style="display:none;" aria-live="polite"></span>
    `;

    this.generateButton = this.root.querySelector('#generatedata');
    this.generatePairwiseButton = this.root.querySelector('#generateallpairs');
    this.refreshPreviewButton = this.root.querySelector('#refreshtestdatapreview');

    this.generateButton?.addEventListener('click', this.handleGenerate);
    this.generatePairwiseButton?.addEventListener('click', this.handleGeneratePairwise);
    this.refreshPreviewButton?.addEventListener('click', this.handleRefreshPreview);
    this.render();
  }

  render() {
    const state = this.controller.getState();
    if (this.generatePairwiseButton) {
      this.generatePairwiseButton.style.display = state.pairwiseVisible ? '' : 'none';
    }
  }

  destroy() {
    this.generateButton?.removeEventListener('click', this.handleGenerate);
    this.generatePairwiseButton?.removeEventListener('click', this.handleGeneratePairwise);
    this.refreshPreviewButton?.removeEventListener('click', this.handleRefreshPreview);
    this.root.replaceChildren();
  }
}

export { PopulationActionsView };
