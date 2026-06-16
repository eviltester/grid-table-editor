const { expect } = require('@playwright/test');
const { SchemaEditorComponent } = require('../../../shared/abstractions/components/schema-editor.component');
const { TextInputDialogComponent } = require('../../../app/abstractions/components/text-input-dialog.component');
const { ConfirmDialogComponent } = require('../../../app/abstractions/components/confirm-dialog.component');

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
    this.errorStatus = this.container.locator('[data-role="schema-error"]');
    this.storedSchemasSummary = this.container.getByText(/Managed Stored Schemas/);
    this.storedSchemasSaveAsButton = this.container.getByRole('button', { name: 'Save Schema As' });
    this.storedSchemasRecoverDraftButton = this.container.getByRole('button', { name: 'Recover Draft' });
    this.storedSchemasLastUsedSelect = this.container.getByLabel('Last Used');
    this.storedSchemasLoadLastUsedButton = this.container.getByRole('button', { name: /^Load$/ });
    this.storedSchemasLoadSavedButton = this.container.getByRole('button', { name: 'Load Saved Schema' });
    this.storedSchemasDialog = page.getByRole('dialog', { name: 'Saved Schemas' });
    this.textInputDialog = new TextInputDialogComponent(page);
    this.confirmDialog = new ConfirmDialogComponent(page);
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

  async expandStoredSchemas() {
    const details = this.container.locator('[data-role="stored-schemas-details"]');
    if ((await details.getAttribute('open')) === null) {
      await this.storedSchemasSummary.click();
    }
  }

  async saveSchemaAs(name) {
    await this.expandStoredSchemas();
    await this.storedSchemasSaveAsButton.click();
    await this.textInputDialog.submit(name, { submitLabel: /save schema/i });
  }

  async recoverDraft() {
    await this.expandStoredSchemas();
    await this.storedSchemasRecoverDraftButton.click();
  }

  async loadLastUsed() {
    await this.expandStoredSchemas();
    await this.storedSchemasLastUsedSelect.selectOption({ index: 1 });
    await this.storedSchemasLoadLastUsedButton.click();
  }

  async openSavedSchemasDialog() {
    await this.expandStoredSchemas();
    await this.storedSchemasLoadSavedButton.click();
    await expect(this.storedSchemasDialog).toBeVisible();
  }

  async loadSavedSchemaByName(name) {
    await this.openSavedSchemasDialog();
    const row = this.storedSchemasDialog.locator('[data-role="stored-schemas-dialog-row"]').filter({ hasText: name });
    await row.getByRole('button', { name: 'Load' }).click();
    await expect(this.storedSchemasDialog).toBeHidden();
  }

  async renameSavedSchema(name, nextName) {
    await this.openSavedSchemasDialog();
    const row = this.storedSchemasDialog.locator('[data-role="stored-schemas-dialog-row"]').filter({ hasText: name });
    await row.getByRole('button', { name: 'Rename' }).click();
    await row.getByRole('textbox').fill(nextName);
    await row.getByRole('button', { name: 'Apply' }).click();
  }

  async deleteSavedSchema(name) {
    await this.openSavedSchemasDialog();
    const row = this.storedSchemasDialog.locator('[data-role="stored-schemas-dialog-row"]').filter({ hasText: name });
    await row.getByRole('button', { name: 'Delete' }).click();
    await this.confirmDialog.confirm({ confirmLabel: /delete/i });
  }
}

module.exports = { GeneratorSchemaComponent };
