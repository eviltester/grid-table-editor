const { expect } = require('@playwright/test');
const { GridRendererComponent } = require('./grid-renderer.component');

class TestDataPanelComponent {
  constructor(page) {
    this.page = page;
    this.container = page.locator('.testDataSchemaGui');
    this.details = this.container.locator('details');
    this.heading = this.container.getByText('Test Data', { exact: true });
    this.generateButton = page.getByRole('button', { name: 'Generate' });
    this.generatePairwiseButton = page.locator('#generateallpairs');
    this.refreshTextPreviewButton = page.getByRole('button', { name: 'Refresh Text Preview' });
    this.generateCountInput = page.locator('#generateCount');
    this.newTableMode = page.locator('input[name="testDataGenerationMode"][value="new-table"]');
    this.amendTableMode = page.locator('input[name="testDataGenerationMode"][value="amend-table"]');
    this.amendSelectedMode = page.locator('input[name="testDataGenerationMode"][value="amend-selected"]');
    this.schemaTextArea = page.locator('#testDataSchemaText');
    this.status = page.locator('#testdata-status');
    this.schemaGrid = page.locator('#testDataSchemaGrid');
    this.schemaRenderer = new GridRendererComponent(page, this.schemaGrid);
    this.addSchemaColumnButton = page.getByRole('button', { name: /\+ Add Column/ });
    this.deleteSelectedSchemaRowsButton = this.container.getByRole('button', { name: '- Delete Selected' });
  }

  async expectVisible() {
    await expect(this.container).toBeVisible();
    await expect(this.heading).toBeVisible();
  }

  async expectReady() {
    await this.expectVisible();
  }

  async expand() {
    if (!(await this.isExpanded())) {
      await this.heading.click();
    }
  }

  async collapse() {
    if (await this.isExpanded()) {
      await this.heading.click();
    }
  }

  async expectExpanded() {
    await expect(this.generateButton).toBeVisible();
    await expect(this.refreshTextPreviewButton).toBeVisible();
    await expect(this.generateCountInput).toBeVisible();
    await expect(this.schemaTextArea).toBeVisible();
    await expect(this.schemaGrid).toBeVisible();
  }

  async isExpanded() {
    return (await this.details.getAttribute('open')) !== null;
  }

  async setGenerateCount(count) {
    await this.generateCountInput.fill(String(count));
  }

  async getGenerateCount() {
    return this.generateCountInput.inputValue();
  }

  async setModeNewTable() {
    await this.newTableMode.check();
  }

  async setModeAmendTable() {
    await this.amendTableMode.check();
  }

  async setModeAmendSelected() {
    await this.amendSelectedMode.check();
  }

  async setSchemaText(specText) {
    await this.schemaTextArea.fill(specText);
    await this.schemaTextArea.press('Tab');
  }

  async clickGenerate() {
    await this.generateButton.click();
  }

  async clickGeneratePairwise() {
    await this.generatePairwiseButton.click();
  }

  async clickRefreshTextPreview() {
    await this.refreshTextPreviewButton.click();
  }

  async getStatusText() {
    return (await this.status.innerText()).trim();
  }

  async addSchemaRow() {
    await this.addSchemaColumnButton.click();
  }

  async deleteSelectedSchemaRows() {
    await this.deleteSelectedSchemaRowsButton.click();
  }

  async getSchemaRowCount() {
    return this.schemaRenderer.countRows();
  }

  async selectSchemaRow(rowIndex) {
    const row = this.schemaGrid.locator('.tabulator-row').nth(rowIndex);
    await row.click();
    await this.page.keyboard.press('Space');
  }

  async getSelectedSchemaRowCount() {
    return this.schemaRenderer.countSelectedRows();
  }

  async setSchemaCell(rowIndex, field, value) {
    await this.schemaRenderer.setCellTextByField(field, rowIndex, value);
  }

  async setSchemaTypeValue(rowIndex, value, { pickerTab = null, assertSchemaTextIncludesType = true } = {}) {
    await this.schemaRenderer.clickCellByField('type', rowIndex);
    const pickerTrigger = this.schemaGrid.locator('.tabulator-editing .test-data-grid-command-picker-trigger').first();
    if ((await pickerTrigger.count()) > 0) {
      await pickerTrigger.click();
      const search = this.page.locator('.method-picker-search');
      await expect(search).toBeVisible();
      if (pickerTab) {
        await this.page.locator('.method-picker-tabs button', { hasText: new RegExp(`^${pickerTab}$`, 'i') }).click();
      }
      await search.fill(String(value));
      const valueLower = String(value).toLowerCase();
      let targetTile = this.page
        .locator('.method-picker-tile .method-picker-tile-command')
        .filter({ hasText: new RegExp(`^${valueLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') })
        .first();
      if ((await targetTile.count()) === 0) {
        targetTile = this.page.locator('.method-picker-tile .method-picker-tile-command').first();
      }
      await targetTile.click();
      await this.page.locator('[data-action="apply"]').click();
      await expect(this.page.locator('.method-picker-overlay')).toHaveCount(0);
      await this.schemaRenderer.clickCellByField('columnName', rowIndex);
      await expect
        .poll(async () => (await this.getSchemaCell(rowIndex, 'type')).trim().toLowerCase(), { timeout: 3000 })
        .toBe(valueLower);
      if (assertSchemaTextIncludesType) {
        await expect
          .poll(async () => (await this.getSchemaText()).toLowerCase(), { timeout: 3000 })
          .toContain(valueLower);
      }
      return;
    }

    await this.schemaRenderer.setCellTextByField('type', rowIndex, value);
  }

  async getSchemaText() {
    return this.schemaTextArea.inputValue();
  }

  async getSchemaCell(rowIndex, field) {
    return this.schemaRenderer.getCellTextByField(field, rowIndex);
  }
}

module.exports = { TestDataPanelComponent };
