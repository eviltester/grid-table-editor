const { expect } = require('@playwright/test');
const { GridRendererComponent } = require('./grid-renderer.component');
const { ConfirmDialogComponent } = require('./confirm-dialog.component');
const { TextInputDialogComponent } = require('./text-input-dialog.component');
const { SchemaEditorComponent } = require('../../../shared/abstractions/components/schema-editor.component');
const {
  OverlaySafeActivationComponent,
} = require('../../../shared/abstractions/components/overlay-safe-activation.component');

class TestDataPanelComponent {
  constructor(page) {
    this.page = page;
    this.container = page.locator('[data-role="test-data-panel-shell"]');
    this.panelRoot = page.locator('[data-role="data-population-panel-root"]');
    this.details = this.container.locator(':scope > details');
    this.heading = this.container.getByText('Test Data', { exact: true });
    this.generateButton = this.container.getByRole('button', { name: 'Generate', exact: true });
    this.generatePairwiseButton = this.container.getByRole('button', { name: 'Generate Combinations' });
    this.generateSchemaButton = this.container.getByRole('button', { name: 'Grid to Enum Schema', exact: true });
    this.combinationsDialog = page.getByRole('dialog', { name: 'Generate Combinations' });
    this.combinationsDialogStrengthSelect = this.combinationsDialog.getByLabel('n');
    this.combinationsDialogCancelButton = this.combinationsDialog.getByRole('button', { name: 'Cancel' });
    this.combinationsDialogGenerateButton = this.combinationsDialog.getByRole('button', { name: 'Generate' });
    this.generateCountInput = this.container.getByRole('spinbutton', { name: 'How Many?' });
    this.newTableMode = this.container.locator('input[name="testDataGenerationMode"][value="new-table"]');
    this.amendTableMode = this.container.locator('input[name="testDataGenerationMode"][value="amend-table"]');
    this.amendSelectedMode = this.container.locator('input[name="testDataGenerationMode"][value="amend-selected"]');
    this.addSchemaColumnButton = this.container.getByRole('button', { name: /\+ Add (Column|Field)/ });
    this.deleteSelectedSchemaRowsButton = this.container.getByRole('button', { name: '- Delete Selected' });
    this.selectedSchemaRowIndex = 0;
    this.overlaySafeActivation = new OverlaySafeActivationComponent(page);
    this.confirmDialog = new ConfirmDialogComponent(page);
    this.textInputDialog = new TextInputDialogComponent(page);
    this.schemaEditor = new SchemaEditorComponent(page, {
      rootSelector: '[data-role="data-population-panel-root"]',
      fieldMap: {
        columnName: 'name',
        value: 'value',
        comments: 'comments',
        params: 'params',
        type: 'sourceType',
      },
      rowCountResolver: async (editor) => {
        const specText = await editor.getSchemaText();
        const schemaLines = specText
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line.length > 0 && !line.startsWith('#'));
        const domCount = Math.max(0, (await editor.rows.count()) - 1);
        const textCount = schemaLines.length > 0 ? Math.ceil(schemaLines.length / 2) : 0;
        return Math.max(domCount, textCount);
      },
    });
    this.schemaTextArea = this.schemaEditor.textArea;
    this.schemaError = this.panelRoot.locator('[data-role="schema-error"]');
    this.status = this.panelRoot.locator('[data-role="population-status"]').first();
    this.storedSchemasSummary = this.panelRoot.getByText(/Managed Stored Schemas/);
    this.storedSchemasSaveAsButton = this.panelRoot.getByRole('button', { name: 'Save Schema As' });
    this.storedSchemasRecoverDraftButton = this.panelRoot.getByRole('button', { name: 'Recover Draft' });
    this.storedSchemasLastUsedSelect = this.panelRoot.getByRole('combobox', { name: 'Last Used' });
    this.storedSchemasLoadLastUsedButton = this.panelRoot.getByRole('button', { name: 'Load last used schema' });
    this.storedSchemasLoadSavedButton = this.panelRoot.getByRole('button', { name: 'Load Saved Schema' });
    this.storedSchemasDialog = page.getByRole('dialog', { name: 'Saved Schemas' });
    this.schemaGrid = this.schemaEditor.rowsContainer;
    this.schemaRenderer = new GridRendererComponent(page, this.schemaGrid);
  }

  async isRowEditorMode() {
    return this.schemaEditor.isRowEditorMode();
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
    await expect(this.generateCountInput).toBeVisible();
    await expect(this.schemaGrid).toBeVisible();
  }

  async expandStoredSchemas() {
    const details = this.panelRoot.locator('[data-role="stored-schemas-details"]');
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

  getSavedSchemaRows() {
    return this.storedSchemasDialog.locator('[data-role="stored-schemas-dialog-row"]');
  }

  async getSavedSchemaRowByExactName(name) {
    const rows = await this.getSavedSchemaRows().all();
    const matchingRows = [];

    for (const row of rows) {
      if ((await row.locator('strong').innerText()).trim() === name) {
        matchingRows.push(row);
      }
    }

    expect(matchingRows).toHaveLength(1);
    return matchingRows[0];
  }

  async loadSavedSchemaByName(name) {
    await this.openSavedSchemasDialog();
    const row = await this.getSavedSchemaRowByExactName(name);
    await row.getByRole('button', { name: 'Load' }).click();
    await expect(this.storedSchemasDialog).toBeHidden();
  }

  async renameSavedSchema(name, nextName) {
    await this.openSavedSchemasDialog();
    const row = await this.getSavedSchemaRowByExactName(name);
    await row.getByRole('button', { name: 'Rename' }).click();
    await row.getByRole('textbox').fill(nextName);
    await row.getByRole('button', { name: 'Apply' }).click();
  }

  async deleteSavedSchema(name) {
    await this.openSavedSchemasDialog();
    const row = await this.getSavedSchemaRowByExactName(name);
    await row.getByRole('button', { name: 'Delete' }).click();
    await this.confirmDialog.confirm({ confirmLabel: /delete/i });
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
    await this.schemaEditor.setSchemaText(specText, { ensureTextMode: true, pressTab: true, waitMs: 1200 });
  }

  async loadSchemaFile(file) {
    await this.schemaEditor.loadSchemaFile(file);
  }

  async saveSchemaFileAndWaitForDownload() {
    return this.schemaEditor.saveSchemaFileAndWaitForDownload();
  }

  async setSchemaTextMode(enabled) {
    await this.schemaEditor.setTextMode(Boolean(enabled));
  }

  async dismissOpenHelpTooltips() {
    await this.overlaySafeActivation.dismissOpenHelpTooltips();
  }

  async clickGenerate() {
    await this.overlaySafeActivation.activateButton(this.generateButton);
  }

  async clickGeneratePairwise() {
    await this.openGenerateCombinationsDialog();
    await this.combinationsDialogGenerateButton.click();
  }

  async openGenerateCombinationsDialog() {
    await this.overlaySafeActivation.activateButton(this.generatePairwiseButton);
    await expect(this.combinationsDialog).toBeVisible();
  }

  async openGridToEnumSchemaDialog() {
    await this.overlaySafeActivation.activateButton(this.generateSchemaButton);
    await this.textInputDialog.expectVisible();
  }

  async submitGridToEnumSchemaLimit(value) {
    await this.textInputDialog.submit(value, { submitLabel: /build schema/i });
  }

  async cancelGenerateCombinationsDialog() {
    await this.combinationsDialogCancelButton.click();
    await expect(this.combinationsDialog).toBeHidden();
  }

  async setCombinationStrength(strength) {
    await this.combinationsDialogStrengthSelect.selectOption(String(strength));
  }

  async chooseCombinationStrategy(strategyName) {
    await this.combinationsDialog.getByRole('radio', { name: new RegExp(strategyName, 'i') }).click();
  }

  async submitGenerateCombinationsDialog() {
    await this.combinationsDialogGenerateButton.click();
  }

  async getStatusText() {
    return (await this.status.innerText()).trim();
  }

  async addSchemaRow() {
    await this.addSchemaColumnButton.click();
  }

  async deleteSelectedSchemaRows() {
    if (await this.isRowEditorMode()) {
      const row = this.schemaEditor.row(this.selectedSchemaRowIndex || 0);
      const removeButton = row.locator('[data-action="remove"]');
      if ((await removeButton.count()) > 0) {
        await removeButton.click();
      } else {
        await this.schemaEditor.rowsContainer.locator('.shared-schema-row [data-action="remove"]').first().click();
      }
      return;
    }
    await this.deleteSelectedSchemaRowsButton.click();
  }

  async getSchemaRowCount() {
    return this.schemaEditor.getRowCount();
  }

  async selectSchemaRow(rowIndex) {
    if (await this.isRowEditorMode()) {
      this.selectedSchemaRowIndex = rowIndex;
      await this.schemaEditor.row(rowIndex).click();
      return;
    }
    await this.schemaRenderer.selectRow(rowIndex);
    await this.page.keyboard.press('Space');
  }

  async getSelectedSchemaRowCount() {
    if (await this.isRowEditorMode()) {
      return 1;
    }
    return this.schemaRenderer.countSelectedRows();
  }

  async setSchemaCell(rowIndex, field, value) {
    await this.schemaEditor.setRowField(rowIndex, field, value);
  }

  async setSchemaTypeValue(rowIndex, value, { pickerTab = null, assertSchemaTextIncludesType = true } = {}) {
    await this.schemaEditor.setRowTypeValue(rowIndex, value, {
      pickerTab,
      assertSchemaTextIncludesType,
    });
  }

  async getSchemaText() {
    return this.schemaTextArea.inputValue();
  }

  getSchemaRow(rowIndex) {
    return this.schemaEditor.row(rowIndex);
  }

  async getSchemaSourceType(rowIndex) {
    return this.getSchemaRow(rowIndex).locator('select[data-field="sourceType"]').inputValue();
  }

  getSchemaValidationMessage(rowIndex) {
    return this.getSchemaRow(rowIndex).locator('.shared-schema-row-validation');
  }

  async getSchemaErrorText() {
    return (await this.schemaError.textContent())?.trim() || '';
  }

  async getSchemaCell(rowIndex, field) {
    const mapped = this.schemaEditor.resolveField(field);
    const input = this.schemaEditor.row(rowIndex).locator(`[data-field="${mapped}"]`);
    if ((await input.count()) > 0) {
      const tag = await input.first().evaluate((el) => el.tagName.toLowerCase());
      if (tag === 'select') {
        const sourceType = await input.inputValue();
        if (mapped === 'sourceType' && (sourceType === 'domain' || sourceType === 'faker')) {
          const commandButton = this.schemaEditor.row(rowIndex).locator('[data-action="pick-command"]');
          if ((await commandButton.count()) > 0) {
            return (await commandButton.first().innerText()).trim();
          }
        }
        return sourceType;
      }
      return input.inputValue();
    }
    if (mapped === 'value') {
      const paramsInput = this.schemaEditor.row(rowIndex).locator('[data-field="params"]');
      if ((await paramsInput.count()) > 0) {
        return paramsInput.inputValue();
      }
    }
    return this.schemaRenderer.getCellTextByField(field, rowIndex);
  }
}

module.exports = { TestDataPanelComponent };
