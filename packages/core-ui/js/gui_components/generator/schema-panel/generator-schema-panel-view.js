import { resolveDocumentObj } from '../../shared/dom/default-objects.js';

class GeneratorSchemaPanelView {
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
      throw new Error('GeneratorSchemaPanelView requires a root element');
    }

    this.root.innerHTML = this.template();
    this.createFeatures();
    this.render();
  }

  template() {
    return `
      <section class="generator-schema" id="generatorSchemaSection" data-section-order="2" aria-labelledby="generatorSchemaHeading">
        <div data-role="generator-schema-definition-root"></div>
      </section>
    `;
  }

  createFeatures() {
    const state = this.controller.getState();

    this.schemaDefinition = this.services.createSharedSchemaDefinitionComponent?.({
      root: this.root.querySelector('[data-role="generator-schema-definition-root"]'),
      documentObj: this.documentObj,
      props: {
        ...state.schemaDefinitionProps,
      },
      callbacks: this.callbacks.schemaDefinition || {},
    });

    this.schemaErrorDisplay = this.services.createTimedStatusPresenter?.({
      documentObj: this.documentObj,
      resolveElement: () =>
        this.root?.querySelector?.('[data-role="generator-schema-definition-root"] [data-role="schema-error"]') || null,
      timeoutMs: 5000,
    });

    this.schemaDefinition?.update?.({
      ...state.schemaDefinitionProps,
      schemaErrorDisplay: this.schemaErrorDisplay,
    });
  }

  render() {
    const state = this.controller.getState();
    this.schemaDefinition?.update?.({
      ...state.schemaDefinitionProps,
      schemaErrorDisplay: this.schemaErrorDisplay,
    });
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

export { GeneratorSchemaPanelView };
