const { expect } = require('@playwright/test');
const { GridRendererComponent } = require('../../../app/abstractions/components/grid-renderer.component');

class GeneratorPreviewComponent {
  constructor(page) {
    this.page = page;
    this.container = page.getByRole('region', { name: 'Preview' });
    this.rowsCountInput = page.getByRole('spinbutton', { name: 'Preview Items Count' });
    this.previewButton = page.getByRole('button', { name: 'Preview', exact: true });
    this.outputPreviewTextArea = page.getByRole('textbox', { name: 'Output Preview' });
    this.previewGrid = page.getByLabel('Data Table Preview Grid');
    this.renderer = new GridRendererComponent(page, this.previewGrid);
  }

  async expectReady() {
    await expect(this.container).toBeVisible();
    await expect(this.rowsCountInput).toBeVisible();
    await expect(this.previewButton).toBeVisible();
    await expect(this.outputPreviewTextArea).toBeVisible();
    await expect(this.previewGrid).toBeVisible();
  }

  async setRowsCount(value) {
    await this.rowsCountInput.fill(String(value));
  }

  async clickPreview() {
    await this.previewButton.click();
  }

  async getOutputPreviewText() {
    return this.outputPreviewTextArea.inputValue();
  }

  async getColumnNames() {
    return this.renderer.getColumnNames();
  }

  async getColumnTextsByName(columnName) {
    return this.renderer.getColumnTextsByName(columnName);
  }

  async expectReadOnly() {
    await this.renderer.expectCellReadOnly(0, 0);
  }
}

module.exports = { GeneratorPreviewComponent };
