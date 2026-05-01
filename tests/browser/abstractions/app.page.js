const { TopNavigationComponent } = require('./components/top-navigation.component');
const { GridEditorComponent } = require('./components/grid-editor.component');
const { ImportExportControlsComponent } = require('./components/import-export-controls.component');
const { TabbedTextComponent } = require('./components/tabbed-text.component');
const { TestDataPanelComponent } = require('./components/test-data-panel.component');

class AppPage {
  constructor(page) {
    this.page = page;

    this.topNavigation = new TopNavigationComponent(page);
    this.gridEditor = new GridEditorComponent(page);
    this.importExportControls = new ImportExportControlsComponent(page);
    this.tabbedText = new TabbedTextComponent(page);
    this.testDataPanel = new TestDataPanelComponent(page);

    this.initialLoading = page.locator('#initial-load');
  }

  async goto() {
    await this.page.goto('/app.html', { waitUntil: 'domcontentloaded' });
    await this.waitUntilReady();
  }

  async waitUntilReady() {
    await this.initialLoading.waitFor({ state: 'hidden' });
    await this.topNavigation.expectVisible();
    await this.gridEditor.expectVisible();
    await this.importExportControls.expectVisible();
    await this.tabbedText.expectVisible();
  }
}

module.exports = { AppPage };
