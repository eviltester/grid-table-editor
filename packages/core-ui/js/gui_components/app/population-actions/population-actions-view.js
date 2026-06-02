import { resolveDocumentObj } from '../../shared/dom/default-objects.js';

class PopulationActionsView {
  constructor({ root, controller, documentObj, ids = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = resolveDocumentObj(documentObj, root);
    this.ids = {
      generateButton: 'generatedata',
      generatePairwiseButton: 'generateallpairs',
      refreshPreviewButton: 'refreshtestdatapreview',
      status: 'testdata-status',
      ...ids,
    };
    this.handleGenerate = () => this.controller.handleGenerate();
    this.handleGeneratePairwise = () => this.controller.handleGeneratePairwise();
    this.handleRefreshPreview = () => this.controller.handleRefreshPreview();
  }

  mount() {
    if (!this.root) {
      throw new Error('PopulationActionsView requires a root element');
    }

    this.root.innerHTML = `
      <button id="${this.ids.generateButton}">Generate</button>
      <button id="${this.ids.generatePairwiseButton}" style="display:none;">Generate Pairwise</button>
      <button id="${this.ids.refreshPreviewButton}">Refresh Text Preview</button>
      <span id="${this.ids.status}" class="import-progress-status" style="display:none;" aria-live="polite"></span>
    `;

    this.generateButton = this.root.querySelector(`#${this.ids.generateButton}`);
    this.generatePairwiseButton = this.root.querySelector(`#${this.ids.generatePairwiseButton}`);
    this.refreshPreviewButton = this.root.querySelector(`#${this.ids.refreshPreviewButton}`);

    this.generateButton?.addEventListener('click', this.handleGenerate);
    this.generatePairwiseButton?.addEventListener('click', this.handleGeneratePairwise);
    this.refreshPreviewButton?.addEventListener('click', this.handleRefreshPreview);
    this.render();
  }

  render() {
    const state = this.controller.getState();
    if (this.generateButton) {
      this.generateButton.disabled = state.generateBusy === true;
    }
    if (this.generatePairwiseButton) {
      this.generatePairwiseButton.style.display = state.pairwiseVisible ? '' : 'none';
      this.generatePairwiseButton.disabled = state.generatePairwiseBusy === true;
    }
    if (this.refreshPreviewButton) {
      this.refreshPreviewButton.disabled = state.refreshPreviewBusy === true;
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
