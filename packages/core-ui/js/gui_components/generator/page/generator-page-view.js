import { resolveDocumentObj } from '../../shared/dom/default-objects.js';

class GeneratorPageView {
  constructor({ root, controller, documentObj, services = {}, callbacks = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = resolveDocumentObj(documentObj, root);
    this.services = services;
    this.callbacks = callbacks;
    this.schemaDefinition = null;
    this.generatorControls = null;
    this.generatorPreview = null;
    this.schemaErrorDisplay = null;
  }

  mount() {
    if (!this.root) {
      return;
    }

    this.root.innerHTML = this.template();
    this.createFeatures();
    this.render();
  }

  template() {
    return `
      <section class="shared-generator-page generator-page" aria-label="Data Generator">
        <section class="generator-schema" id="generatorSchemaSection" data-section-order="2" aria-labelledby="generatorSchemaHeading">
          <div data-role="generator-schema-definition-root"></div>
        </section>
        <div data-role="generator-controls-root"></div>
        <div data-role="generator-preview-root"></div>
      </section>
    `;
  }

  createFeatures() {
    const state = this.controller.getState();

    this.generatorControls = this.services.createGeneratorControlsComponent?.({
      root: this.root.querySelector('[data-role="generator-controls-root"]'),
      documentObj: this.documentObj,
      props: state.controlsProps,
      services: this.services.generatorControlsServices || {},
      callbacks: this.callbacks.generatorControls || {},
    });

    this.generatorPreview = this.services.createGeneratorPreviewComponent?.({
      root: this.root.querySelector('[data-role="generator-preview-root"]'),
      documentObj: this.documentObj,
      props: state.previewProps,
      services: this.services.generatorPreviewServices || {},
      callbacks: this.callbacks.generatorPreview || {},
    });

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
    this.generatorControls?.update?.(state.controlsProps);
    this.generatorPreview?.update?.(state.previewProps);
  }

  destroy() {
    this.schemaDefinition?.destroy?.();
    this.generatorControls?.destroy?.();
    this.generatorPreview?.destroy?.();
    this.schemaErrorDisplay?.destroy?.();
    this.root.replaceChildren();
  }

  getSchemaDefinition() {
    return this.schemaDefinition;
  }

  getGeneratorControls() {
    return this.generatorControls;
  }

  getGeneratorPreview() {
    return this.generatorPreview;
  }

  getSchemaErrorDisplay() {
    return this.schemaErrorDisplay;
  }
}

export { GeneratorPageView };
