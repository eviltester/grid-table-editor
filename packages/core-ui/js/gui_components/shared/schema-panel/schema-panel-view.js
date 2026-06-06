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
      callbacks: this.callbacks.schemaDefinition || {},
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

    this.updateSchemaDefinition();
  }

  render() {
    this.updateSchemaDefinition();
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
    this.root.replaceChildren();
  }

  getSchemaDefinition() {
    return this.schemaDefinition;
  }

  getSchemaErrorDisplay() {
    return this.schemaErrorDisplay;
  }
}

export { SchemaPanelView };
