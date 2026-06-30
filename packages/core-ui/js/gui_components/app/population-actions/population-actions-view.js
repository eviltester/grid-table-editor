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
    this.handleGenerateSchemaFromGrid = () => this.controller.handleGenerateSchemaFromGrid();
    this.handleUnsafeFakerExpressionsChange = (event) =>
      this.controller.handleUnsafeFakerExpressionsChange(event.target?.checked === true);
    this.handleGenerationSettingsClick = () => {
      this.controller.toggleGenerationSettings();
      this.render();
    };
    this.handleGenerationSettingsClose = () => {
      this.controller.closeGenerationSettings();
      this.render();
    };
    this.handleGenerationSettingsDocumentClick = (event) => this.handleDocumentClickOutsideGenerationSettings(event);
    this.isGenerationSettingsDocumentClickBound = false;
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

  renderGenerationSettings(state) {
    if (state.unsafeFakerExpressionsVisible !== true) {
      return '';
    }

    return `
      <span class="population-generation-settings">
        <button
          type="button"
          class="population-generation-settings__button"
          data-role="generation-settings-button"
          aria-label="${escapeHtml(state.generationSettingsLabel)}"
          title="${escapeHtml(state.generationSettingsLabel)}"
          aria-expanded="${state.generationSettingsOpen ? 'true' : 'false'}"
        >
          ${renderIconHtml('settings', { className: 'app-icon population-generation-settings__icon' })}
        </button>
        <div
          class="population-generation-settings__dialog"
          data-role="generation-settings-dialog"
          role="dialog"
          aria-label="${escapeHtml(state.generationSettingsLabel)}"
          ${state.generationSettingsOpen ? '' : 'hidden'}
        >
          <div class="population-generation-settings__dialog-head">
            <strong>${escapeHtml(state.generationSettingsLabel)}</strong>
            <button
              type="button"
              class="population-generation-settings__close"
              data-role="generation-settings-close"
              aria-label="Close settings"
              title="Close settings"
            >
              ${renderIconHtml('x', { className: 'app-icon population-generation-settings__close-icon' })}
            </button>
          </div>
          <label class="population-generation-setting" data-role="unsafe-faker-expressions-setting">
            <input
              type="checkbox"
              data-role="unsafe-faker-expressions-checkbox"
              ${state.unsafeFakerExpressions ? 'checked' : ''}
            >
            <span>${escapeHtml(state.unsafeFakerExpressionsLabel)}</span>
            ${this.renderHelpButton({
              helpHtml: state.unsafeFakerExpressionsHelpHtml,
              ariaLabel: state.unsafeFakerExpressionsHelpLabel,
            })}
          </label>
        </div>
      </span>`;
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
    this.generateSchemaButton = this.root.querySelector(`[data-role="${this.getRoleName('generateSchemaButton')}"]`);
    this.generatePairwiseWrapper = this.root.querySelector(
      `[data-role="${this.getRoleName('generatePairwiseWrapper')}"]`
    );
    this.generationSettingsButton = this.root.querySelector('[data-role="generation-settings-button"]');
    this.generationSettingsContainer = this.root.querySelector('.population-generation-settings');
    this.generationSettingsDialog = this.root.querySelector('[data-role="generation-settings-dialog"]');
    this.generationSettingsCloseButton = this.root.querySelector('[data-role="generation-settings-close"]');
    this.unsafeFakerExpressionsCheckbox = this.root.querySelector('[data-role="unsafe-faker-expressions-checkbox"]');

    this.generateButton?.addEventListener('click', this.handleGenerate);
    this.generatePairwiseButton?.addEventListener('click', this.handleGeneratePairwise);
    this.generateSchemaButton?.addEventListener('click', this.handleGenerateSchemaFromGrid);
    this.generationSettingsButton?.addEventListener('click', this.handleGenerationSettingsClick);
    this.generationSettingsCloseButton?.addEventListener('click', this.handleGenerationSettingsClose);
    this.unsafeFakerExpressionsCheckbox?.addEventListener('change', this.handleUnsafeFakerExpressionsChange);
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
        ${this.renderGenerationSettings(state)}
        ${this.renderHelpButton({
          helpHtml: state.generateHelpHtml,
          ariaLabel: state.generateHelpLabel,
        })}
        <button${this.buildOptionalIdAttr(this.ids.generateButton)} data-role="${escapeHtml(generateButtonRole)}" aria-label="${escapeHtml(
          state.generateLabel
        )}" title="${escapeHtml(state.generateLabel)}">
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
        <button${this.buildOptionalIdAttr(
          this.ids.generatePairwiseButton
        )} data-role="${escapeHtml(generatePairwiseButtonRole)}" aria-label="${escapeHtml(
          state.generatePairwiseLabel
        )}" title="${escapeHtml(state.generatePairwiseLabel)}">
          ${renderIconHtml('file-plus', { className: 'app-icon shared-file-action-icon generator-file-icon' })}
          ${escapeHtml(state.generatePairwiseLabel)}
        </button>
      </span>
      ${
        state.generateSchemaVisible
          ? `<span class="shared-button-with-help">
        ${this.renderHelpButton({
          helpHtml: state.generateSchemaHelpHtml,
          ariaLabel: state.generateSchemaHelpLabel,
        })}
        <button data-role="${escapeHtml(this.getRoleName('generateSchemaButton', state))}" aria-label="${escapeHtml(
          state.generateSchemaLabel
        )}" title="${escapeHtml(state.generateSchemaLabel)}">
          ${renderIconHtml('grid', { className: 'app-icon shared-file-action-icon generator-file-icon' })}
          ${escapeHtml(state.generateSchemaLabel)}
        </button>
      </span>`
          : ''
      }
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

  handleDocumentClickOutsideGenerationSettings(event) {
    if (this.controller.getState().generationSettingsOpen !== true) {
      return;
    }
    if (this.generationSettingsContainer?.contains(event.target)) {
      return;
    }

    this.controller.closeGenerationSettings();
    this.render();
  }

  syncGenerationSettingsDocumentClick(state) {
    const shouldBind =
      state.unsafeFakerExpressionsVisible === true && state.generationSettingsOpen === true && this.documentObj;
    if (shouldBind && !this.isGenerationSettingsDocumentClickBound) {
      this.documentObj.addEventListener('click', this.handleGenerationSettingsDocumentClick, true);
      this.isGenerationSettingsDocumentClickBound = true;
      return;
    }
    if (!shouldBind && this.isGenerationSettingsDocumentClickBound) {
      this.documentObj.removeEventListener('click', this.handleGenerationSettingsDocumentClick, true);
      this.isGenerationSettingsDocumentClickBound = false;
    }
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
    if (this.generateSchemaButton) {
      this.generateSchemaButton.disabled = state.generateSchemaBusy === true;
      this.generateSchemaButton.setAttribute('aria-disabled', state.generateSchemaBusy === true ? 'true' : 'false');
      this.generateSchemaButton.setAttribute('aria-busy', state.generateSchemaBusy === true ? 'true' : 'false');
    }
    if (this.generatePairwiseWrapper) {
      this.generatePairwiseWrapper.style.display = state.pairwiseVisible ? 'inline-flex' : 'none';
    }
    if (this.generationSettingsButton) {
      this.generationSettingsButton.setAttribute('aria-expanded', state.generationSettingsOpen ? 'true' : 'false');
    }
    if (this.generationSettingsDialog) {
      this.generationSettingsDialog.hidden = state.generationSettingsOpen !== true;
    }
    if (this.unsafeFakerExpressionsCheckbox) {
      this.unsafeFakerExpressionsCheckbox.checked = state.unsafeFakerExpressions === true;
    }
    this.syncGenerationSettingsDocumentClick(state);
    this.services.updateHelpHints?.();
  }

  destroy() {
    this.syncGenerationSettingsDocumentClick({
      unsafeFakerExpressionsVisible: false,
      generationSettingsOpen: false,
    });
    this.generateButton?.removeEventListener('click', this.handleGenerate);
    this.generatePairwiseButton?.removeEventListener('click', this.handleGeneratePairwise);
    this.generateSchemaButton?.removeEventListener('click', this.handleGenerateSchemaFromGrid);
    this.generationSettingsButton?.removeEventListener('click', this.handleGenerationSettingsClick);
    this.generationSettingsCloseButton?.removeEventListener('click', this.handleGenerationSettingsClose);
    this.unsafeFakerExpressionsCheckbox?.removeEventListener('change', this.handleUnsafeFakerExpressionsChange);
    this.root.replaceChildren();
  }
}

export { PopulationActionsView };
