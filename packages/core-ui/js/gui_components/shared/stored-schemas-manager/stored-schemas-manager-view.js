import { resolveDocumentObj, resolveWindowObj } from '../dom/default-objects.js';
import { escapeHtml } from '../html-escape.js';
import { MAX_STORED_SCHEMA_NAME_LENGTH } from '../stored-schemas/stored-schemas-storage.js';

class StoredSchemasManagerView {
  constructor({ root, controller, documentObj, windowObj, services = {}, callbacks = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = resolveDocumentObj(documentObj, root);
    this.windowObj = resolveWindowObj(windowObj, this.documentObj);
    this.services = services;
    this.callbacks = callbacks;
    this.autosaveTimer = null;
    this.handleLastUsedChange = (event) => {
      this.controller.setSelectedLastUsedId(event.target?.value || '');
      this.render();
    };
    this.handleSaveAsClick = async () => {
      const currentSchemaText = this.controller.getState().currentSchemaText;
      const requestedName = await this.services.requestTextInput?.({
        title: 'Save Schema As',
        label: 'Schema name',
        initialValue: '',
        okLabel: 'Save Schema',
        cancelLabel: 'Cancel',
        maxLength: MAX_STORED_SCHEMA_NAME_LENGTH,
      });
      if (requestedName === null) {
        return;
      }
      const result = this.services.storage?.saveNamedSchema?.(requestedName, currentSchemaText);
      this.refreshFromStorage(result?.errorMessage || '');
      if (result?.ok) {
        this.callbacks.onStatus?.(`Saved schema "${result.entry?.name || requestedName}".`, { dismissable: true });
      }
    };
    this.handleRecoverDraftClick = () => {
      const result = this.services.storage?.recoverDraft?.();
      if (result?.draft?.schemaText) {
        this.callbacks.onSchemaLoaded?.(result.draft.schemaText);
        this.callbacks.onStatus?.('Recovered draft schema.', { dismissable: true });
      }
      this.refreshFromStorage(result?.errorMessage || '');
    };
    this.handleLoadLastUsedClick = () => {
      const selectedEntry = this.controller.getSelectedLastUsedEntry();
      if (!selectedEntry?.schemaText) {
        return;
      }
      this.callbacks.onSchemaLoaded?.(selectedEntry.schemaText);
      this.callbacks.onStatus?.(`Loaded ${selectedEntry.name}.`, { dismissable: true });
    };
    this.handleClearLastUsedClick = () => {
      const result = this.services.storage?.clearLastUsed?.();
      this.refreshFromStorage(result?.errorMessage || '');
      if (result?.ok) {
        this.callbacks.onStatus?.('Cleared last used schemas.', { dismissable: true });
      }
    };
    this.handleLoadSavedClick = async () => {
      await this.services.openStoredSchemasDialog?.({
        storage: this.services.storage,
        onLoadSchema: (schemaText, entry) => {
          this.callbacks.onSchemaLoaded?.(schemaText);
          this.callbacks.onStatus?.(`Loaded ${entry?.name || 'saved schema'}.`, { dismissable: true });
        },
        onStatus: (message, options) => this.callbacks.onStatus?.(message, options),
        onDidChange: () => this.refreshFromStorage(),
      });
    };
  }

  mount() {
    if (!this.root) {
      throw new Error('StoredSchemasManagerView requires a root element');
    }
    this.root.innerHTML = this.template();
    this.bindEvents();
    this.render();
  }

  template() {
    return `
      <section class="stored-schemas-manager" data-role="stored-schemas-manager">
        <details data-role="stored-schemas-details">
          <summary data-role="stored-schemas-summary">Managed Stored Schemas (0)</summary>
          <div class="stored-schemas-manager__body" data-role="stored-schemas-body">
            <div class="stored-schemas-manager__actions">
              <button type="button" data-role="stored-schemas-save-as" aria-label="Save Schema As" title="Save Schema As">Save Schema As</button>
              <span
                class="helpicon"
                data-help-role="option-help-icon"
                data-role="stored-schemas-draft-preview"></span>
              <button type="button" data-role="stored-schemas-recover-draft" aria-label="Recover Draft" title="Recover Draft">Recover Draft</button>
            </div>
            <div class="stored-schemas-manager__actions">
              <label>
                <span>Last Used</span>
                <select aria-label="Last Used" data-role="stored-schemas-last-used-select"></select>
              </label>
              <span
                class="helpicon"
                data-help-role="option-help-icon"
                data-role="stored-schemas-last-used-preview"></span>
              <button type="button" data-role="stored-schemas-load-last-used" aria-label="Load last used schema" title="Load last used schema">Load</button>
              <button type="button" data-role="stored-schemas-clear-last-used" aria-label="Clear last used schema" title="Clear last used schema">Clear Last Used</button>
            </div>
            <div class="stored-schemas-manager__actions">
              <button type="button" data-role="stored-schemas-open-saved-dialog">Load Saved Schema</button>
            </div>
          </div>
        </details>
      </section>
    `;
  }

  bindEvents() {
    this.root
      .querySelector('[data-role="stored-schemas-last-used-select"]')
      ?.addEventListener('change', this.handleLastUsedChange);
    this.root.querySelector('[data-role="stored-schemas-save-as"]')?.addEventListener('click', this.handleSaveAsClick);
    this.root
      .querySelector('[data-role="stored-schemas-recover-draft"]')
      ?.addEventListener('click', this.handleRecoverDraftClick);
    this.root
      .querySelector('[data-role="stored-schemas-load-last-used"]')
      ?.addEventListener('click', this.handleLoadLastUsedClick);
    this.root
      .querySelector('[data-role="stored-schemas-clear-last-used"]')
      ?.addEventListener('click', this.handleClearLastUsedClick);
    this.root
      .querySelector('[data-role="stored-schemas-open-saved-dialog"]')
      ?.addEventListener('click', this.handleLoadSavedClick);
  }

  render() {
    const viewModel = this.controller.getViewModel();
    const summary = this.root.querySelector('[data-role="stored-schemas-summary"]');
    const draftPreview = this.root.querySelector('[data-role="stored-schemas-draft-preview"]');
    const lastUsedPreview = this.root.querySelector('[data-role="stored-schemas-last-used-preview"]');
    const lastUsedSelect = this.root.querySelector('[data-role="stored-schemas-last-used-select"]');
    const saveAsButton = this.root.querySelector('[data-role="stored-schemas-save-as"]');
    const recoverDraftButton = this.root.querySelector('[data-role="stored-schemas-recover-draft"]');
    const loadLastUsedButton = this.root.querySelector('[data-role="stored-schemas-load-last-used"]');
    const clearLastUsedButton = this.root.querySelector('[data-role="stored-schemas-clear-last-used"]');
    const openSavedDialogButton = this.root.querySelector('[data-role="stored-schemas-open-saved-dialog"]');

    if (summary) {
      summary.textContent = viewModel.summaryLabel;
    }
    if (saveAsButton) {
      saveAsButton.disabled = viewModel.saveAsDisabled;
    }
    if (recoverDraftButton) {
      recoverDraftButton.disabled = viewModel.recoverDraftDisabled;
    }
    if (loadLastUsedButton) {
      loadLastUsedButton.disabled = viewModel.loadLastUsedDisabled;
    }
    if (clearLastUsedButton) {
      clearLastUsedButton.disabled = viewModel.clearLastUsedDisabled;
    }
    if (openSavedDialogButton) {
      openSavedDialogButton.disabled = viewModel.loadSavedDisabled;
    }
    if (draftPreview) {
      draftPreview.setAttribute('data-help-text', escapeHtml(viewModel.recoverDraftPreview || 'No draft saved yet.'));
    }
    if (lastUsedPreview) {
      lastUsedPreview.setAttribute(
        'data-help-text',
        escapeHtml(viewModel.selectedLastUsedPreview || 'No last used schema selected.')
      );
    }
    if (lastUsedSelect) {
      lastUsedSelect.innerHTML = '';
      const placeholder = this.documentObj.createElement('option');
      placeholder.value = '';
      placeholder.textContent =
        viewModel.lastUsedOptions.length > 0 ? 'Select a saved history item' : 'No last used schemas';
      lastUsedSelect.appendChild(placeholder);
      viewModel.lastUsedOptions.forEach((option) => {
        const optionElement = this.documentObj.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        lastUsedSelect.appendChild(optionElement);
      });
      lastUsedSelect.value = viewModel.selectedLastUsedId || '';
    }
    this.services.updateHelpHints?.();
  }

  refreshFromStorage(statusMessage = '') {
    const summary = this.services.storage?.getSummaryState?.();
    this.controller.setSummary(summary);
    this.render();
    const combinedMessage = statusMessage || summary?.errorMessage || '';
    if (combinedMessage) {
      this.callbacks.onStatus?.(combinedMessage, {
        severity: summary?.ok === false ? 'error' : 'warning',
        dismissable: true,
      });
    }
  }

  setCurrentSchemaText(schemaText) {
    const normalizedText = String(schemaText || '');
    this.controller.setCurrentSchemaText(normalizedText);
    this.render();
    if (this.autosaveTimer !== null) {
      this.windowObj?.clearTimeout?.(this.autosaveTimer);
      this.autosaveTimer = null;
    }
    if (normalizedText.trim().length === 0) {
      return;
    }
    this.autosaveTimer = this.windowObj?.setTimeout?.(() => {
      this.autosaveTimer = null;
      const result = this.services.storage?.saveDraft?.(normalizedText);
      this.refreshFromStorage(result?.errorMessage || '');
    }, 300);
  }

  recordCurrentSchemaAsLastUsed() {
    const result = this.services.storage?.recordLastUsed?.(this.controller.getState().currentSchemaText);
    this.refreshFromStorage(result?.errorMessage || '');
    return result;
  }

  destroy() {
    if (this.autosaveTimer !== null) {
      this.windowObj?.clearTimeout?.(this.autosaveTimer);
      this.autosaveTimer = null;
    }
    this.root
      .querySelector('[data-role="stored-schemas-last-used-select"]')
      ?.removeEventListener('change', this.handleLastUsedChange);
    this.root
      .querySelector('[data-role="stored-schemas-save-as"]')
      ?.removeEventListener('click', this.handleSaveAsClick);
    this.root
      .querySelector('[data-role="stored-schemas-recover-draft"]')
      ?.removeEventListener('click', this.handleRecoverDraftClick);
    this.root
      .querySelector('[data-role="stored-schemas-load-last-used"]')
      ?.removeEventListener('click', this.handleLoadLastUsedClick);
    this.root
      .querySelector('[data-role="stored-schemas-clear-last-used"]')
      ?.removeEventListener('click', this.handleClearLastUsedClick);
    this.root
      .querySelector('[data-role="stored-schemas-open-saved-dialog"]')
      ?.removeEventListener('click', this.handleLoadSavedClick);
    this.root.replaceChildren();
  }
}

export { StoredSchemasManagerView };
