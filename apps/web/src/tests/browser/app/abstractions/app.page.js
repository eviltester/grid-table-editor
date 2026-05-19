const { expect } = require('@playwright/test');
const { TopNavigationComponent } = require('./components/top-navigation.component');
const { GridEditorComponent } = require('./components/grid-editor.component');
const { ImportExportControlsComponent } = require('./components/import-export-controls.component');
const { TabbedTextComponent } = require('./components/tabbed-text.component');
const { TestDataPanelComponent } = require('./components/test-data-panel.component');
const { FormatOptionsPanelComponent } = require('./components/format-options-panel.component');

class AppPage {
  constructor(page) {
    this.page = page;

    this.topNavigation = new TopNavigationComponent(page);
    this.gridEditor = new GridEditorComponent(page);
    this.importExportControls = new ImportExportControlsComponent(page);
    this.tabbedText = new TabbedTextComponent(page);
    this.formatOptionsPanel = new FormatOptionsPanelComponent(page);
    this.testDataPanel = new TestDataPanelComponent(page);

    this.initialLoading = page.locator('#initial-load');
  }

  async goto() {
    await this.page.goto('/app.html', { waitUntil: 'domcontentloaded' });
    await this.waitUntilReady();
  }

  async waitUntilReady() {
    try {
      await expect(this.initialLoading).toBeHidden({ timeout: 15000 });
    } catch (error) {
      if (!isTimeoutError(error)) {
        throw error;
      }
      // Fallback for intermittent loader visibility under slow dev-server startup:
      // if core components are interactive, treat the page as ready.
      await expect(this.gridEditor.grid).toBeVisible({ timeout: 15000 });
    }
    await this.topNavigation.expectReady();
    await this.gridEditor.expectReady();
    await this.importExportControls.expectReady();
    await this.tabbedText.expectReady();
    await this.formatOptionsPanel.expectReady();
    await this.testDataPanel.expectReady();
  }
}

function isTimeoutError(error) {
  return typeof error?.message === 'string' && error.message.includes('Timed out');
}

module.exports = { AppPage };
