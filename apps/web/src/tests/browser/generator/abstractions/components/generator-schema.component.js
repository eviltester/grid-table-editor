const { expect } = require('@playwright/test');
const { SchemaEditorComponent } = require('../../../shared/abstractions/components/schema-editor.component');

class GeneratorSchemaComponent {
  constructor(page) {
    this.page = page;
    this.container = page.locator('#generatorSchemaSection');
    this.editor = new SchemaEditorComponent(page, {
      rootSelector: '#generatorSchemaSection',
    });
    this.modeToggleButton = this.editor.modeToggleButton;
    this.textArea = this.editor.textArea;
    this.rows = this.editor.rows;
  }

  async expectReady() {
    await expect(this.container).toBeVisible();
    await expect(this.modeToggleButton).toBeVisible();
  }

  async setTextMode(enabled) {
    await this.editor.setTextMode(enabled);
  }

  async setSchemaText(schemaText) {
    await this.editor.setSchemaText(schemaText, { ensureTextMode: true });
  }

  async addField() {
    await this.editor.addField();
  }

  async getRowCount() {
    return this.rows.count();
  }

  row(index) {
    return this.rows.nth(index);
  }

  async setRowName(index, value) {
    await this.editor.setRowField(index, 'name', value);
  }

  async setRowSourceType(index, value) {
    await this.editor.setRowSourceType(index, value);
  }

  async setRowValue(index, value) {
    await this.editor.setRowField(index, 'value', value);
  }

  async getRowName(index) {
    return this.row(index).locator('input[data-field="name"]').inputValue();
  }

  async getSchemaText() {
    return this.editor.getSchemaText({ ensureTextMode: true });
  }

  async clickRowAction(index, action) {
    await this.row(index).locator(`button[data-action="${action}"]`).click();
  }
}

module.exports = { GeneratorSchemaComponent };
