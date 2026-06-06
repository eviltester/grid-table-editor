import { resolveDocumentObj } from '../../shared/dom/default-objects.js';
import { renderIconHtml } from '../../shared/primitives/icon/icon-core.js';
import { escapeHtml } from '../../shared/html-escape.js';

class PopulationActionsView {
  constructor({ root, controller, documentObj, ids = {}, services = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = resolveDocumentObj(documentObj, root);
    this.ids = { ...ids };
    this.services = services;
    this.handleGenerate = () => this.controller.handleGenerate();
    this.handleGeneratePairwise = () => this.controller.handleGeneratePairwise();
  }

  buildOptionalIdAttr(id) {
    return id ? ` id="${id}"` : '';
  }

  renderHelpButton({ helpHtml, ariaLabel }) {
    if (!helpHtml) {
      return '';
    }

    return `
      <button
        type="button"
        class="helpicon"
        data-help-role="help-icon"
        data-help="inline-population-action-help"
        data-help-text="${escapeHtml(helpHtml)}"
        aria-label="${escapeHtml(ariaLabel)}"
      ></button>`;
  }

  mount() {
    if (!this.root) {
      throw new Error('PopulationActionsView requires a root element');
    }

    this.root.innerHTML = this.template();
    this.generateButton = this.root.querySelector(`[data-role="${this.getRoleName('generateButton')}"]`);
    this.generatePairwiseButton = this.root.querySelector(
      `[data-role="${this.getRoleName('generatePairwiseButton')}"]`
    );
    this.generatePairwiseWrapper = this.root.querySelector(
      `[data-role="${this.getRoleName('generatePairwiseWrapper')}"]`
    );

    this.generateButton?.addEventListener('click', this.handleGenerate);
    this.generatePairwiseButton?.addEventListener('click', this.handleGeneratePairwise);
    this.render();
  }

  template() {
    const state = this.controller.getState();
    const generateButtonRole = this.getRoleName('generateButton', state);
    const generatePairwiseButtonRole = this.getRoleName('generatePairwiseButton', state);
    const generatePairwiseWrapperRole = this.getRoleName('generatePairwiseWrapper', state);
    const statusRole = this.getRoleName('status', state);

    return `
      <span class="shared-button-with-help">
        ${this.renderHelpButton({
          helpHtml: state.generateHelpHtml,
          ariaLabel: state.generateHelpLabel,
        })}
        <button${this.buildOptionalIdAttr(this.ids.generateButton)} data-role="${escapeHtml(generateButtonRole)}">
          ${renderIconHtml('file-plus', { className: 'app-icon shared-file-action-icon generator-file-icon' })}
          ${escapeHtml(state.generateLabel)}
        </button>
      </span>
      <span
        class="shared-button-with-help"
        ${this.buildOptionalIdAttr(this.ids.generatePairwiseButtonWrapper)}
        data-role="${escapeHtml(generatePairwiseWrapperRole)}"
        style="display:none;"
      >
        ${this.renderHelpButton({
          helpHtml: state.generatePairwiseHelpHtml,
          ariaLabel: state.generatePairwiseHelpLabel,
        })}
        <button${this.buildOptionalIdAttr(this.ids.generatePairwiseButton)} data-role="${escapeHtml(generatePairwiseButtonRole)}">
          ${renderIconHtml('file-plus', { className: 'app-icon shared-file-action-icon generator-file-icon' })}
          ${escapeHtml(state.generatePairwiseLabel)}
        </button>
      </span>
      ${
        state.statusVisible
          ? `
      <span
        ${this.buildOptionalIdAttr(this.ids.status)}
        data-role="${escapeHtml(statusRole)}"
        class="import-progress-status"
        style="display:none;"
        aria-live="polite"
      ></span>`
          : ''
      }
    `;
  }

  getRoleName(key, state = this.controller.getState()) {
    return state.roleNames?.[key] || '';
  }

  render() {
    const state = this.controller.getState();
    if (this.generateButton) {
      this.generateButton.disabled = state.generateBusy === true;
      this.generateButton.setAttribute('aria-disabled', state.generateBusy === true ? 'true' : 'false');
      this.generateButton.setAttribute('aria-busy', state.generateBusy === true ? 'true' : 'false');
    }
    if (this.generatePairwiseButton) {
      this.generatePairwiseButton.disabled = state.generatePairwiseBusy === true;
      this.generatePairwiseButton.setAttribute('aria-disabled', state.generatePairwiseBusy === true ? 'true' : 'false');
      this.generatePairwiseButton.setAttribute('aria-busy', state.generatePairwiseBusy === true ? 'true' : 'false');
    }
    if (this.generatePairwiseWrapper) {
      this.generatePairwiseWrapper.style.display = state.pairwiseVisible ? 'inline-flex' : 'none';
    }
    this.services.updateHelpHints?.();
  }

  destroy() {
    this.generateButton?.removeEventListener('click', this.handleGenerate);
    this.generatePairwiseButton?.removeEventListener('click', this.handleGeneratePairwise);
    this.root.replaceChildren();
  }
}

export { PopulationActionsView };
