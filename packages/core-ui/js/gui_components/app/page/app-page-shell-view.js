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
    const openAttribute = state.showTestDataOpen ? ' open' : '';

    return `
      <div class="header">
        <div class="pageheading"><a href="/">AnyWayData</a></div>
        <div class="mainmenu">&nbsp;App&nbsp;</div>
        <div class="mainmenu"><a href="/generator.html">Generator</a></div>
        <div class="mainmenu"><a href="/docs/intro">Docs</a></div>
        <div class="mainmenu"><a href="/blog">Blog</a></div>
      </div>

      <div id="page-instructions"></div>

      <div class="main-app">
        <div id="main-grid-view"></div>

        <div class="importexport" id="import-export-controls"></div>

        <div class="testDataSchemaGui">
          <details${openAttribute}>
            <summary>Test Data <span data-help="test-data-summary-title" class="helpicon"></span></summary>
            <div id="testDataGeneratorContainer"></div>
          </details>
        </div>
      </div>

      <p id="initial-load" class="import-progress-status startup-loading-status" role="status" aria-live="polite">
        Please Wait, Loading Libraries...
      </p>
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
