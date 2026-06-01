const { expect } = require('@playwright/test');

class GeneratorPreviewComponent {
  constructor(page) {
    this.page = page;
    this.container = page.getByRole('region', { name: 'Preview' });
    this.rowsCountInput = page.getByRole('spinbutton', { name: 'Preview Items Count' });
    this.previewButton = page.getByRole('button', { name: 'Preview', exact: true });
    this.outputPreviewTextArea = page.getByRole('textbox', { name: 'Output Preview' });
    this.previewGrid = page.getByLabel('Data Table Preview Grid');
    this.headerTitles = this.previewGrid.locator('.tabulator-col-title');
    this.rows = this.previewGrid.locator('.tabulator-row');
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
    const count = await this.headerTitles.count();
    const names = [];
    for (let index = 0; index < count; index += 1) {
      names.push((await this.headerTitles.nth(index).innerText()).trim());
    }
    return names;
  }

  async getColumnTextsByName(columnName) {
    const columnIndex = await this._columnIndexByName(columnName);
    const rowCount = await this.rows.count();
    const values = [];
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      values.push((await this.rows.nth(rowIndex).locator('.tabulator-cell').nth(columnIndex).innerText()).trim());
    }
    return values;
  }

  async expectReadOnly() {
    const firstCell = this.rows.first().locator('.tabulator-cell').first();
    const editingInputs = this.previewGrid.locator(
      '.tabulator-editing input, .tabulator-editing textarea, .tabulator-editing select'
    );

    await expect(firstCell).toBeVisible();
    await firstCell.dblclick();
    await expect(editingInputs).toHaveCount(0);
  }

  async _columnIndexByName(columnName) {
    const expected = String(columnName || '')
      .split('\n')[0]
      .trim();
    const totalColumns = await this.headerTitles.count();
    for (let index = 0; index < totalColumns; index += 1) {
      const title = String(await this.headerTitles.nth(index).innerText())
        .split('\n')[0]
        .trim();
      if (title === expected) {
        return index;
      }
    }

    throw new Error(`Column "${columnName}" was not found in preview grid header.`);
  }
}

module.exports = { GeneratorPreviewComponent };
