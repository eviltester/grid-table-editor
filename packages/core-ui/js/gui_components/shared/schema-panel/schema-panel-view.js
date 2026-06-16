import { resolveDocumentObj } from '../dom/default-objects.js';
import { escapeHtml } from '../html-escape.js';

class SchemaPanelView {
  constructor({ root, controller, documentObj, services = {}, callbacks = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = resolveDocumentObj(documentObj, root);
    this.services = services;
    this.callbacks = callbacks;
    this.schemaDefinition = null;
    this.schemaErrorDisplay = null;
    this.storedSchemasManager = null;
  }

  mount() {
    if (!this.root) {
      throw new Error('SchemaPanelView requires a root element');
    }

    this.root.innerHTML = this.template();
    this.createFeatures();
    this.render();
  }

  template() {
    const state = this.controller.getState();
    const sectionId = state.sectionId ? ` id="${escapeHtml(state.sectionId)}"` : '';
    const sectionOrder = state.sectionOrder ? ` data-section-order="${escapeHtml(state.sectionOrder)}"` : '';
    const ariaLabel = state.ariaLabel ? ` aria-label="${escapeHtml(state.ariaLabel)}"` : '';
    const ariaLabelledBy = state.ariaLabelledBy ? ` aria-labelledby="${escapeHtml(state.ariaLabelledBy)}"` : '';
    const schemaDefinitionRootId = state.schemaDefinitionRootId
      ? ` id="${escapeHtml(state.schemaDefinitionRootId)}"`
      : '';

    return `
      <section
        class="${escapeHtml(state.className)}"
        data-role="${escapeHtml(state.rootDataRole)}"${sectionId}${sectionOrder}${ariaLabel}${ariaLabelledBy}
      >
        <div${schemaDefinitionRootId} data-role="${escapeHtml(state.schemaDefinitionRootDataRole)}"></div>
        ${state.storedSchemasEnabled ? `<div data-role="${escapeHtml(state.storedSchemasRootDataRole)}"></div>` : ''}
      </section>
    `;
  }

  createFeatures() {
    const state = this.controller.getState();
    const schemaDefinitionRoot = this.getSchemaDefinitionRoot(state);

    this.schemaDefinition = this.services.createSharedSchemaDefinitionComponent?.({
      root: schemaDefinitionRoot,
      documentObj: this.documentObj,
      props: {
        ...state.schemaDefinitionProps,
      },
      callbacks: {
        ...(this.callbacks.schemaDefinition || {}),
        onSchemaTextChanged: (schemaText) => {
          this.storedSchemasManager?.setCurrentSchemaText?.(schemaText);
          this.callbacks.schemaDefinition?.onSchemaTextChanged?.(schemaText);
        },
      },
    });

    if (state.useTimedSchemaErrorDisplay) {
      this.schemaErrorDisplay = this.services.createTimedStatusPresenter?.({
        documentObj: this.documentObj,
        resolveElement: () =>
          this.getSchemaDefinitionRoot(this.controller.getState())?.querySelector?.('[data-role="schema-error"]') ||
          null,
        timeoutMs: state.schemaErrorTimeoutMs,
      });
    }

    if (state.storedSchemasEnabled) {
      const storedSchemasRoot = this.root.querySelector(`[data-role="${state.storedSchemasRootDataRole}"]`);
      this.storedSchemasManager =
        this.services.createStoredSchemasManagerComponent?.({
          root: storedSchemasRoot,
          documentObj: this.documentObj,
          props: {
            currentSchemaText: this.schemaDefinition?.getSchemaText?.() || '',
            ...(state.storedSchemasProps || {}),
          },
          callbacks: {
            onSchemaLoaded: (schemaText) => {
              this.schemaDefinition?.loadSchemaText?.(schemaText, { showErrors: true });
              this.storedSchemasManager?.setCurrentSchemaText?.(schemaText);
              this.callbacks.storedSchemas?.onSchemaLoaded?.(schemaText);
            },
            onStatus: (message, options) => this.callbacks.storedSchemas?.onStatus?.(message, options),
          },
        }) || null;
    }

    this.updateSchemaDefinition();
  }

  render() {
    this.updateSchemaDefinition();
    this.storedSchemasManager?.update?.({
      ...(this.controller.getState().storedSchemasProps || {}),
      currentSchemaText: this.schemaDefinition?.getSchemaText?.() || '',
    });
  }

  updateSchemaDefinition() {
    const state = this.controller.getState();
    this.schemaDefinition?.update?.({
      ...state.schemaDefinitionProps,
      ...(this.schemaErrorDisplay ? { schemaErrorDisplay: this.schemaErrorDisplay } : {}),
    });
  }

  getSchemaDefinitionRoot(state = this.controller.getState()) {
    return this.root.querySelector(`[data-role="${state.schemaDefinitionRootDataRole}"]`);
  }

  destroy() {
    this.schemaDefinition?.destroy?.();
    this.schemaErrorDisplay?.destroy?.();
    this.storedSchemasManager?.destroy?.();
    this.root.replaceChildren();
  }

  getSchemaDefinition() {
    return this.schemaDefinition;
  }

  getSchemaErrorDisplay() {
    return this.schemaErrorDisplay;
  }

  getStoredSchemasManager() {
    return this.storedSchemasManager;
  }
}

export { SchemaPanelView };
