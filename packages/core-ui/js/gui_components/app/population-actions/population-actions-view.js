import { resolveDocumentObj } from '../../shared/dom/default-objects.js';

class PopulationActionsView {
  constructor({ root, controller, documentObj, ids = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = resolveDocumentObj(documentObj, root);
    this.ids = { ...ids };
    this.handleGenerate = () => this.controller.handleGenerate();
    this.handleGeneratePairwise = () => this.controller.handleGeneratePairwise();
    this.handleRefreshPreview = () => this.controller.handleRefreshPreview();
  }

  mount() {
    if (!this.root) {
      throw new Error('PopulationActionsView requires a root element');
    }

    this.root.innerHTML = `
      <button${this.ids.generateButton ? ` id="${this.ids.generateButton}"` : ''} data-role="generate-button">Generate</button>
      <button${this.ids.generatePairwiseButton ? ` id="${this.ids.generatePairwiseButton}"` : ''} data-role="generate-pairwise-button" style="display:none;">Generate Pairwise</button>
      <button${this.ids.refreshPreviewButton ? ` id="${this.ids.refreshPreviewButton}"` : ''} data-role="refresh-preview-button">Refresh Text Preview</button>
      <span
        ${this.ids.status ? `id="${this.ids.status}"` : ''}
        data-role="population-status"
        class="import-progress-status"
        style="display:none;"
        aria-live="polite"
      ></span>
    `;

    this.generateButton = this.root.querySelector('[data-role="generate-button"]');
    this.generatePairwiseButton = this.root.querySelector('[data-role="generate-pairwise-button"]');
    this.refreshPreviewButton = this.root.querySelector('[data-role="refresh-preview-button"]');

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
