const { expect } = require('@playwright/test');
const { TopNavigationComponent } = require('./components/top-navigation.component');
const { GridEditorComponent } = require('./components/grid-editor.component');
const { ImportExportWorkspaceComponent } = require('./components/import-export-workspace.component');
const { TextPreviewEditorComponent } = require('./components/text-preview-editor.component');
const { TestDataPanelComponent } = require('./components/test-data-panel.component');
const { FormatOptionsPanelComponent } = require('./components/format-options-panel.component');

class AppPage {
  constructor(page) {
    this.page = page;

    this.topNavigation = new TopNavigationComponent(page);
    this.gridEditor = new GridEditorComponent(page);
    this.importExportWorkspace = new ImportExportWorkspaceComponent(page);
    this.textPreviewEditor = new TextPreviewEditorComponent(page);
    this.formatOptionsPanel = new FormatOptionsPanelComponent(page);
    this.testDataPanel = new TestDataPanelComponent(page);

    this.initialLoading = page.locator('#initial-load');
  }

  async goto(path = '/app.html') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
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
    await this.importExportWorkspace.expectReady();
    await this.textPreviewEditor.expectReady();
    await this.formatOptionsPanel.expectReady();
    await this.testDataPanel.expectReady();
  }
}

function isTimeoutError(error) {
  if (typeof error?.message !== 'string') {
    return false;
  }

  return error.message.includes('Timed out') || error.message.includes('Timeout:');
}

module.exports = { AppPage };
