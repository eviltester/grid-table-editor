import { resolveDocumentObj, resolveWindowObj } from '../dom/default-objects.js';
import { escapeHtml } from '../html-escape.js';
import { buildPreviewText } from '../stored-schemas-manager/stored-schemas-manager-controller.js';
import { MAX_STORED_SCHEMA_NAME_LENGTH } from '../stored-schemas/stored-schemas-storage.js';

function ensureDialogElements(documentObj) {
  let backdrop = documentObj.getElementById('stored-schemas-dialog-backdrop');
  if (backdrop) {
    return { backdrop, owned: false };
  }
  backdrop = documentObj.createElement('div');
  backdrop.id = 'stored-schemas-dialog-backdrop';
  backdrop.className = 'text-input-modal-backdrop';
  backdrop.style.display = 'none';
  backdrop.innerHTML = `
    <div class="text-input-modal stored-schemas-dialog" data-role="stored-schemas-dialog" role="dialog" aria-modal="true" aria-labelledby="stored-schemas-dialog-title">
      <h3 id="stored-schemas-dialog-title" class="text-input-modal-title">Saved Schemas</h3>
      <div data-role="stored-schemas-dialog-list"></div>
      <div class="text-input-modal-actions">
        <button type="button" data-role="stored-schemas-dialog-close">Close</button>
      </div>
    </div>
  `;
  documentObj.body.appendChild(backdrop);
  return { backdrop, owned: true };
}

class StoredSchemasDialogView {
  constructor({ controller, documentObj, windowObj, callbacks = {} } = {}) {
    this.controller = controller;
    this.documentObj = resolveDocumentObj(documentObj, null);
    this.windowObj = resolveWindowObj(windowObj, this.documentObj);
    this.callbacks = callbacks;
    const ensured = ensureDialogElements(this.documentObj);
    this.backdrop = ensured.backdrop;
    this.owned = ensured.owned === true;
    this.handleBackdropClick = (event) => {
      if (event.target === this.backdrop) {
        this.close();
      }
    };
    this.handleContainerClick = async (event) => {
      const loadButton = event.target?.closest?.('[data-action="load"]');
      if (loadButton) {
        const entry = this.controller.getState().entries.find((item) => item.id === loadButton.getAttribute('data-id'));
        if (entry) {
          await this.callbacks.onLoad?.(entry);
          this.close();
        }
        return;
      }
      const renameButton = event.target?.closest?.('[data-action="rename"]');
      if (renameButton) {
        const entry = this.controller
          .getState()
          .entries.find((item) => item.id === renameButton.getAttribute('data-id'));
        this.controller.startRename(entry?.id || '', entry?.name || '');
        this.render();
        return;
      }
      const cancelRenameButton = event.target?.closest?.('[data-action="cancel-rename"]');
      if (cancelRenameButton) {
        this.controller.cancelRename();
        this.render();
        return;
      }
      const applyRenameButton = event.target?.closest?.('[data-action="apply-rename"]');
      if (applyRenameButton) {
        const id = applyRenameButton.getAttribute('data-id');
        await this.callbacks.onRename?.(id, this.controller.getState().renameValue);
        this.controller.cancelRename();
        this.render();
        return;
      }
      const deleteButton = event.target?.closest?.('[data-action="delete"]');
      if (deleteButton) {
        const id = deleteButton.getAttribute('data-id');
        const entry = this.controller.getState().entries.find((item) => item.id === id);
        if (entry) {
          await this.callbacks.onDelete?.(entry);
          this.render();
        }
      }
    };
    this.handleRenameInput = (event) => {
      const truncatedValue = String(event.target?.value || '').slice(0, MAX_STORED_SCHEMA_NAME_LENGTH);
      if (event.target) {
        event.target.value = truncatedValue;
      }
      this.controller.setRenameValue(truncatedValue);
    };
    this.handleCloseClick = () => this.close();
  }

  getListElement() {
    return this.backdrop?.querySelector?.('[data-role="stored-schemas-dialog-list"]') || null;
  }

  open(entries = []) {
    this.controller.open(entries);
    this.show();
    this.render();
    this.backdrop.addEventListener('click', this.handleBackdropClick);
    this.getListElement()?.addEventListener('click', this.handleContainerClick);
    this.getListElement()?.addEventListener('input', this.handleRenameInput);
    this.backdrop
      .querySelector('[data-role="stored-schemas-dialog-close"]')
      ?.addEventListener('click', this.handleCloseClick);
    this.windowObj?.setTimeout?.(() => {
      this.backdrop?.querySelector?.('[data-role="stored-schemas-dialog-close"]')?.focus?.();
    }, 0);
  }

  render() {
    const state = this.controller.getState();
    const listElement = this.getListElement();
    if (!listElement) {
      return;
    }
    listElement.innerHTML = state.entries
      .map((entry) => {
        const isRenaming = state.renamingId === entry.id;
        const escapedEntryId = escapeHtml(entry.id);
        const escapedEntryName = escapeHtml(entry.name);
        const escapedRenameValue = escapeHtml(state.renameValue);
        const escapedPreviewText = escapeHtml(buildPreviewText(entry.schemaText) || 'No schema preview available.');
        return `
          <section class="stored-schemas-dialog__row" data-role="stored-schemas-dialog-row">
            <div class="stored-schemas-dialog__name">
              ${
                isRenaming
                  ? `<input type="text" aria-label="Rename ${escapedEntryName}" data-role="stored-schemas-rename-input" maxlength="${MAX_STORED_SCHEMA_NAME_LENGTH}" value="${escapedRenameValue}">`
                  : `<strong>${escapedEntryName}</strong>`
              }
              <span
                class="helpicon"
                data-help-role="option-help-icon"
                data-role="stored-schemas-dialog-preview"
                data-help-text="${escapedPreviewText}"></span>
            </div>
            <div class="stored-schemas-dialog__actions">
              <button type="button" data-action="load" data-id="${escapedEntryId}">Load</button>
              ${
                isRenaming
                  ? `<button type="button" data-action="apply-rename" data-id="${escapedEntryId}">Apply</button>
                     <button type="button" data-action="cancel-rename" data-id="${escapedEntryId}">Cancel</button>`
                  : `<button type="button" data-action="rename" data-id="${escapedEntryId}">Rename</button>`
              }
              <button type="button" data-action="delete" data-id="${escapedEntryId}">Delete</button>
            </div>
          </section>
        `;
      })
      .join('');
    this.callbacks.onRender?.();
  }

  setEntries(entries) {
    this.controller.setEntries(entries);
    this.render();
  }

  show() {
    this.backdrop.style.display = 'flex';
  }

  hide() {
    this.backdrop.style.display = 'none';
  }

  close() {
    this.controller.close();
    this.backdrop.removeEventListener('click', this.handleBackdropClick);
    this.getListElement()?.removeEventListener('click', this.handleContainerClick);
    this.getListElement()?.removeEventListener('input', this.handleRenameInput);
    this.backdrop
      .querySelector('[data-role="stored-schemas-dialog-close"]')
      ?.removeEventListener('click', this.handleCloseClick);
    this.hide();
  }

  destroy() {
    this.close();
    if (this.owned && this.backdrop?.parentNode) {
      this.backdrop.parentNode.removeChild(this.backdrop);
    }
  }
}

export { StoredSchemasDialogView };
