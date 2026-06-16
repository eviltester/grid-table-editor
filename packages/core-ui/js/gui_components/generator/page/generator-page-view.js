import { resolveDocumentObj } from '../../shared/dom/default-objects.js';

class GeneratorPageView {
  constructor({ root, controller, documentObj, services = {}, callbacks = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = resolveDocumentObj(documentObj, root);
    this.services = services;
    this.callbacks = callbacks;
    this.generatorSchemaPanel = null;
    this.generatorControls = null;
    this.generatorPreview = null;
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
        <div data-role="generator-schema-panel-root"></div>
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

    this.generatorSchemaPanel = this.services.createSchemaPanelComponent?.({
      root: this.root.querySelector('[data-role="generator-schema-panel-root"]'),
      documentObj: this.documentObj,
      props: {
        className: 'generator-schema',
        sectionId: 'generatorSchemaSection',
        sectionOrder: '2',
        ariaLabelledBy: 'generatorSchemaHeading',
        rootDataRole: 'generator-schema-panel-root',
        schemaDefinitionRootDataRole: 'generator-schema-definition-root',
        storedSchemasEnabled: true,
        storedSchemasProps: state.storedSchemasProps,
        useTimedSchemaErrorDisplay: true,
        schemaErrorTimeoutMs: 5000,
        schemaDefinitionProps: {
          ...state.schemaDefinitionProps,
        },
      },
      callbacks: {
        schemaDefinition: this.callbacks.schemaDefinition || {},
        storedSchemas: this.callbacks.storedSchemas || {},
      },
    });
  }

  render() {
    const state = this.controller.getState();
    this.generatorSchemaPanel?.update?.({
      className: 'generator-schema',
      sectionId: 'generatorSchemaSection',
      sectionOrder: '2',
      ariaLabelledBy: 'generatorSchemaHeading',
      rootDataRole: 'generator-schema-panel-root',
      schemaDefinitionRootDataRole: 'generator-schema-definition-root',
      storedSchemasEnabled: true,
      storedSchemasProps: state.storedSchemasProps,
      useTimedSchemaErrorDisplay: true,
      schemaErrorTimeoutMs: 5000,
      schemaDefinitionProps: {
        ...state.schemaDefinitionProps,
      },
    });
    this.generatorControls?.update?.(state.controlsProps);
    this.generatorPreview?.update?.(state.previewProps);
  }

  destroy() {
    this.generatorSchemaPanel?.destroy?.();
    this.generatorControls?.destroy?.();
    this.generatorPreview?.destroy?.();
    this.root.replaceChildren();
  }

  getSchemaDefinition() {
    return this.generatorSchemaPanel?.getSchemaDefinition?.() || null;
  }

  getGeneratorControls() {
    return this.generatorControls;
  }

  getGeneratorPreview() {
    return this.generatorPreview;
  }

  getSchemaErrorDisplay() {
    return this.generatorSchemaPanel?.getSchemaErrorDisplay?.() || null;
  }

  recordCurrentSchemaAsLastUsed() {
    return this.generatorSchemaPanel?.recordCurrentSchemaAsLastUsed?.() || null;
  }
}

export { GeneratorPageView };
