const { expect } = require('@playwright/test');

class GeneratorSchemaComponent {
  constructor(page) {
    this.page = page;
    this.container = page.locator('#generatorSchemaSection');
    this.modeToggleButton = page.locator('#schemaModeToggleButton');
    this.textArea = page.locator('#generatorSchemaText');
    this.rowsContainer = page.locator('#generatorSchemaRows');
    this.rows = page.locator('.generator-schema-row');
    this.addFieldButton = page.locator('#addSchemaRowButton');
  }

  async expectReady() {
    await expect(this.container).toBeVisible();
    await expect(this.modeToggleButton).toBeVisible();
  }

  async setTextMode(enabled) {
    const shouldShowSchemaButton = enabled ? 'Edit as Schema' : 'Edit as Text';
    if ((await this.modeToggleButton.innerText()).trim() !== shouldShowSchemaButton) {
      await this.modeToggleButton.click();
    }
    await expect(this.modeToggleButton).toHaveText(shouldShowSchemaButton);
  }

  async setSchemaText(schemaText) {
    await this.setTextMode(true);
    await this.textArea.fill(schemaText);
  }

  async addField() {
    await this.addFieldButton.click();
  }

  async getRowCount() {
    return this.rows.count();
  }

  row(index) {
    return this.rows.nth(index);
  }

  async setRowName(index, value) {
    await this.row(index).locator('input[data-field="name"]').fill(value);
  }

  async setRowSourceType(index, value) {
    await this.row(index).locator('select[data-field="sourceType"]').selectOption(value);
  }

  async setRowValue(index, value) {
    await this.row(index).locator('input[data-field="value"]').fill(value);
  }

  async getRowName(index) {
    return this.row(index).locator('input[data-field="name"]').inputValue();
  }

  async getSchemaText() {
    await this.setTextMode(true);
    return this.textArea.inputValue();
  }

  async clickRowAction(index, action) {
    await this.row(index).locator(`button[data-action="${action}"]`).click();
  }
}

module.exports = { GeneratorSchemaComponent };
