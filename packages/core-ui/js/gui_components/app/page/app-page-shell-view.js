class AppPageShellView {
  constructor({ root, controller } = {}) {
    this.root = root;
    this.controller = controller;
  }

  mount() {
    if (!this.root) {
      throw new Error('AppPageShellView requires a root element');
    }

    this.root.innerHTML = this.template();
  }

  template() {
    const state = this.controller.getState();
    const testDataOpenAttribute = state.showTestDataOpen ? ' open' : '';

    return `
      <div id="page-instructions"></div>

      <div class="main-app">
        <div id="main-grid-view"></div>

        <div class="testDataSchemaGui" data-role="test-data-panel-shell">
          <details${testDataOpenAttribute}>
            <summary>Test Data <span data-help="test-data-summary-title" data-help-role="help-icon" class="helpicon"></span></summary>
            <div id="testDataGeneratorContainer"></div>
          </details>
        </div>

        <div class="importexport" id="import-export-controls"></div>
      </div>
    `;
  }

  render() {
    this.root.innerHTML = this.template();
  }

  destroy() {
    this.root.replaceChildren();
  }
}

export { AppPageShellView };
