class GeneratorPageView {
  constructor({ root, controller, documentObj = document, services = {}, callbacks = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = documentObj;
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
      <section class="generator-page" aria-label="Data Generator">
        <section class="generator-schema" id="generatorSchemaSection" data-section-order="2" aria-labelledby="generatorSchemaHeading">
          <div id="generatorSchemaDefinition"></div>
        </section>
        <div id="generatorControlsRoot"></div>
        <div id="generatorPreviewRoot"></div>
      </section>
    `;
  }

  createFeatures() {
    const state = this.controller.getState();

    this.schemaErrorDisplay = this.services.createTimedStatusPresenter?.({
      documentObj: this.documentObj,
      elementId: 'generatorSchemaErrorText',
      timeoutMs: 5000,
    });

    this.generatorControls = this.services.createGeneratorControlsComponent?.({
      root: this.root.querySelector('#generatorControlsRoot'),
      documentObj: this.documentObj,
      props: state.controlsProps,
      services: this.services.generatorControlsServices || {},
      callbacks: this.callbacks.generatorControls || {},
    });

    this.generatorPreview = this.services.createGeneratorPreviewComponent?.({
      root: this.root.querySelector('#generatorPreviewRoot'),
      documentObj: this.documentObj,
      props: state.previewProps,
      services: this.services.generatorPreviewServices || {},
      callbacks: this.callbacks.generatorPreview || {},
    });

    this.schemaDefinition = this.services.createSharedSchemaDefinitionComponent?.({
      root: this.root.querySelector('#generatorSchemaDefinition'),
      documentObj: this.documentObj,
      props: {
        ...state.schemaDefinitionProps,
        schemaErrorDisplay: this.schemaErrorDisplay,
      },
      callbacks: this.callbacks.schemaDefinition || {},
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
    this.schemaErrorDisplay?.clear?.();
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
