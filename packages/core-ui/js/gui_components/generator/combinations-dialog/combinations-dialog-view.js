import { resolveDocumentObj } from '../../shared/dom/default-objects.js';
import { escapeHtml } from '../../shared/html-escape.js';
import { N_WISE_DOCS_URL, getStrengthExplanation } from '../generation/n-wise-generation-options.js';

class CombinationsDialogView {
  constructor({ root, controller, documentObj } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = resolveDocumentObj(documentObj, root);
    this.handleStrengthChange = (event) => {
      this.controller.setStrength(event.target.value);
      this.renderDialog();
    };
    this.handleStrategyButtonClick = (event) => {
      const strategyButton = event.currentTarget;
      this.controller.setAlgorithm(strategyButton?.getAttribute('data-strategy-id') || '');
      this.renderDialog();
    };
    this.handleSubmit = () => {
      this.controller.submit();
      this.render();
    };
    this.handleCancel = () => {
      this.controller.close();
      this.render();
    };
    this.handleBackdropClick = (event) => {
      if (event.target === this.root) {
        this.controller.close();
        this.render();
      }
    };
    this.handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        this.controller.close();
        this.render();
      }
    };
  }

  mount() {
    if (!this.root) {
      throw new Error('CombinationsDialogView requires a root element');
    }
    this.root.className = 'n-wise-dialog-overlay';
    this.root.setAttribute('data-role', 'n-wise-dialog-overlay');
    this.root.addEventListener('click', this.handleBackdropClick);
    this.root.addEventListener('keydown', this.handleKeyDown);
    this.render();
  }

  render() {
    const state = this.controller.getState();
    this.root.style.display = state.open ? 'flex' : 'none';
    if (!state.open) {
      this.root.replaceChildren();
      return;
    }
    this.renderDialog();
  }

  renderDialog() {
    const state = this.controller.getState();
    if (!state.open) {
      this.render();
      return;
    }
    const disabled = state.strengths.length === 0 || state.strategies.length === 0;
    this.root.innerHTML = `
      <div class="n-wise-dialog" data-role="n-wise-dialog" role="dialog" aria-modal="true" aria-labelledby="n-wise-dialog-title">
        <div class="n-wise-dialog-header">
          <h3 id="n-wise-dialog-title">Generate Combinations</h3>
          <button type="button" class="n-wise-dialog-close" data-role="n-wise-dialog-close" aria-label="Close">x</button>
        </div>
        <div class="n-wise-dialog-body">
          <p class="n-wise-dialog-explanation">${escapeHtml(getStrengthExplanation(state.enumColumnCount))}</p>
          <label class="n-wise-dialog-field">
            <span>n</span>
            <select data-role="n-wise-strength-select" aria-label="n" ${disabled ? 'disabled' : ''}>
              ${state.strengths
                .map(
                  (strength) =>
                    `<option value="${strength}" ${strength === state.selectedStrength ? 'selected' : ''}>${strength}-wise</option>`
                )
                .join('')}
            </select>
          </label>
          <div class="n-wise-dialog-field">
            <span id="n-wise-strategy-list-label">Strategy</span>
            ${this.renderStrategyList(state, disabled)}
          </div>
          <p class="n-wise-dialog-docs">
            <a href="${escapeHtml(N_WISE_DOCS_URL)}" target="_blank" rel="noopener noreferrer">N-wise generation docs</a>
          </p>
        </div>
        <div class="n-wise-dialog-actions">
          <button type="button" data-role="n-wise-dialog-cancel">Cancel</button>
          <button type="button" class="n-wise-dialog-primary" data-role="n-wise-dialog-submit" ${
            disabled ? 'disabled' : ''
          }>Generate</button>
        </div>
      </div>
    `;
    this.bindDialogEvents();
  }

  renderStrategyList(state, disabled) {
    if (disabled) {
      return `
        <div
          class="n-wise-strategy-list"
          data-role="n-wise-strategy-list"
          role="radiogroup"
          aria-labelledby="n-wise-strategy-list-label"
          aria-disabled="true"
        >
          <p class="n-wise-dialog-description" data-role="n-wise-strategy-description">
            No strategy is available for the current schema.
          </p>
        </div>
      `;
    }

    return `
      <div
        class="n-wise-strategy-list"
        data-role="n-wise-strategy-list"
        role="radiogroup"
        aria-labelledby="n-wise-strategy-list-label"
      >
        ${state.strategies
          .map((strategy) => {
            const selected = strategy.id === state.selectedAlgorithm;
            return `
              <button
                type="button"
                class="n-wise-strategy-option${selected ? ' is-selected' : ''}"
                data-role="n-wise-strategy-option"
                data-strategy-id="${escapeHtml(strategy.id)}"
                role="radio"
                aria-checked="${selected ? 'true' : 'false'}"
              >
                <span class="n-wise-strategy-name">${escapeHtml(strategy.label)}</span>
                <span class="n-wise-strategy-description">${escapeHtml(strategy.description)}</span>
              </button>
            `;
          })
          .join('')}
      </div>
    `;
  }

  bindDialogEvents() {
    const strengthSelect = this.root.querySelector('[data-role="n-wise-strength-select"]');
    strengthSelect?.addEventListener('input', this.handleStrengthChange);
    strengthSelect?.addEventListener('change', this.handleStrengthChange);
    this.root
      .querySelectorAll('[data-role="n-wise-strategy-option"]')
      .forEach((strategyButton) => strategyButton.addEventListener('click', this.handleStrategyButtonClick));
    this.root.querySelector('[data-role="n-wise-dialog-submit"]')?.addEventListener('click', this.handleSubmit);
    this.root.querySelector('[data-role="n-wise-dialog-cancel"]')?.addEventListener('click', this.handleCancel);
    this.root.querySelector('[data-role="n-wise-dialog-close"]')?.addEventListener('click', this.handleCancel);
    this.root.querySelector('[data-role="n-wise-strength-select"]')?.focus?.();
  }

  destroy() {
    this.root.removeEventListener('click', this.handleBackdropClick);
    this.root.removeEventListener('keydown', this.handleKeyDown);
    this.root.replaceChildren();
    this.root.remove();
  }
}

export { CombinationsDialogView };
