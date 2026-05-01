const { GridRendererComponent } = require('./grid-renderer.component');

class TestDataPanelComponent {
  constructor(page) {
    this.page = page;
    this.container = page.locator('.testDataDefnGui');
    this.details = this.container.locator('details');
    this.heading = page.getByText('Test Data', { exact: true });
    this.generateButton = page.getByRole('button', { name: 'Generate' });
    this.refreshTextPreviewButton = page.getByRole('button', { name: 'Refresh Text Preview' });
    this.generateCountInput = page.locator('#generateCount');
    this.newTableMode = page.locator('input[name="testDataGenerationMode"][value="new-table"]');
    this.amendTableMode = page.locator('input[name="testDataGenerationMode"][value="amend-table"]');
    this.amendSelectedMode = page.locator('input[name="testDataGenerationMode"][value="amend-selected"]');
    this.schemaTextArea = page.locator('#testdatadefntext');
    this.status = page.locator('#testdata-status');
    this.schemaGrid = page.locator('#defngrid');
    this.schemaRenderer = new GridRendererComponent(page, this.schemaGrid);
    this.addSchemaColumnButton = page.getByRole('button', { name: /\+ Add Column/ });
    this.deleteSelectedSchemaRowsButton = page.getByRole('button', { name: /Delete Selected/ });
  }

  async expectVisible() {
    await this.container.waitFor({ state: 'visible' });
    await this.heading.waitFor({ state: 'visible' });
  }

  async expectReady() {
    await this.expectVisible();
  }

  async expand() {
    await this.heading.click();
  }

  async collapse() {
    await this.heading.click();
  }

  async expectExpanded() {
    await this.generateButton.waitFor({ state: 'visible' });
    await this.refreshTextPreviewButton.waitFor({ state: 'visible' });
    await this.generateCountInput.waitFor({ state: 'visible' });
    await this.schemaTextArea.waitFor({ state: 'visible' });
    await this.schemaGrid.waitFor({ state: 'visible' });
  }

  async isExpanded() {
    return this.details.evaluate((d) => d.hasAttribute('open'));
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
  }

  async clickGenerate() {
    await this.generateButton.click();
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
    await this.schemaRenderer.selectRow(rowIndex);
  }

  async setSchemaCell(rowIndex, field, value) {
    await this.schemaRenderer.setCellTextByField(field, rowIndex, value);
  }

  async setSchemaTypeValue(rowIndex, value) {
    // Type column may use Tabulator list editor. Try generic set first.
    await this.schemaRenderer.clickCellByField('type', rowIndex);
    await this.schemaRenderer.clickCellByField('type', rowIndex);

    let editor = this.schemaGrid
      .locator('.tabulator-editing input, .tabulator-editing textarea, .tabulator-editing select')
      .first();
    if ((await editor.count()) === 0) {
      await this.schemaRenderer.setCellTextByField('type', rowIndex, value);
      return;
    }

    const tag = await editor.evaluate((el) => el.tagName.toLowerCase());
    if (tag === 'select') {
      await editor.selectOption(String(value));
      await editor.press('Enter');
    } else {
      await editor.fill(String(value));
      await editor.press('Enter');
    }
    return;
  }

  async getSchemaText() {
    return this.schemaTextArea.inputValue();
  }
}

module.exports = { TestDataPanelComponent };
