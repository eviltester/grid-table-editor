import { bindDetailsContentVisibility } from '../../shared/dom/details-disclosure-focus.js';

class AppPageShellView {
  constructor({ root, controller } = {}) {
    this.root = root;
    this.controller = controller;
    this.unbindTestDataDetailsVisibility = null;
  }

  mount() {
    if (!this.root) {
      throw new Error('AppPageShellView requires a root element');
    }

    this.render();
  }

  template() {
    const state = this.controller.getState();
    const testDataOpenAttribute = state.showTestDataOpen ? ' open' : '';

    return `
      <div id="page-instructions"></div>

      <div class="main-app">
        <div id="main-grid-view"></div>

        <div class="testDataSchemaGui" data-role="test-data-panel-shell">
          <details data-role="test-data-details"${testDataOpenAttribute}>
            <summary>Test Data <span data-help="test-data-summary-title" data-help-role="help-icon" class="helpicon"></span></summary>
            <div id="testDataGeneratorContainer" data-role="test-data-details-content"></div>
          </details>
        </div>

        <div class="importexport" id="import-export-controls"></div>
      </div>
    `;
  }

  render() {
    this.unbindTestDataDetailsVisibility?.();
    this.unbindTestDataDetailsVisibility = null;
    this.root.innerHTML = this.template();
    this.bindDisclosureVisibility();
  }

  bindDisclosureVisibility() {
    this.unbindTestDataDetailsVisibility = bindDetailsContentVisibility({
      detailsElement: this.root.querySelector('[data-role="test-data-details"]'),
      contentElement: this.root.querySelector('[data-role="test-data-details-content"]'),
    });
  }

  destroy() {
    this.unbindTestDataDetailsVisibility?.();
    this.unbindTestDataDetailsVisibility = null;
    this.root.replaceChildren();
  }
}

export { AppPageShellView };
