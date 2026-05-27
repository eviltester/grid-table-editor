const { expect } = require('@playwright/test');
const { GridRendererComponent } = require('./grid-renderer.component');
const { SchemaEditorComponent } = require('../../../shared/abstractions/components/schema-editor.component');
const {
  MethodPickerDialogComponent,
} = require('../../../shared/abstractions/components/method-picker-dialog.component');

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
    this.schemaGrid = page.locator('#testDataSchemaGrid, #testDataSchemaRows');
    this.schemaRenderer = new GridRendererComponent(page, this.schemaGrid);
    this.addSchemaColumnButton = page.getByRole('button', { name: /\+ Add (Column|Field)/ });
    this.deleteSelectedSchemaRowsButton = this.container.getByRole('button', { name: '- Delete Selected' });
    this.selectedSchemaRowIndex = 0;
    this.schemaEditor = new SchemaEditorComponent(page, {
      rowsSelector: '#testDataSchemaRows',
      textAreaSelector: '#testDataSchemaText',
      modeToggleSelector: '#testDataSchemaModeToggleButton',
      addFieldSelector: '#testDataAddSchemaRowButton',
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
    this.methodPicker = new MethodPickerDialogComponent(page);
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
    await expect(this.refreshTextPreviewButton).toBeVisible();
    await expect(this.generateCountInput).toBeVisible();
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
    await this.schemaEditor.setSchemaText(specText, { ensureTextMode: true, pressTab: true, waitMs: 1200 });
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
    if (await this.isRowEditorMode()) {
      const row = this.schemaEditor.row(this.selectedSchemaRowIndex || 0);
      const removeButton = row.locator('[data-action="remove"]');
      if ((await removeButton.count()) > 0) {
        await removeButton.click();
      } else {
        await this.page.locator('#testDataSchemaRows .generator-schema-row [data-action="remove"]').first().click();
      }
      return;
    }
    await this.deleteSelectedSchemaRowsButton.click();
  }

  async getSchemaRowCount() {
    if (await this.isRowEditorMode()) {
      return this.schemaEditor.getRowCount();
    }
    return this.schemaRenderer.countRows();
  }

  async selectSchemaRow(rowIndex) {
    if (await this.isRowEditorMode()) {
      this.selectedSchemaRowIndex = rowIndex;
      await this.schemaEditor.row(rowIndex).click();
      return;
    }
    const row = this.schemaGrid.locator('.tabulator-row').nth(rowIndex);
    await row.click();
    await this.page.keyboard.press('Space');
  }

  async getSelectedSchemaRowCount() {
    if (await this.isRowEditorMode()) {
      return 1;
    }
    return this.schemaRenderer.countSelectedRows();
  }

  async setSchemaCell(rowIndex, field, value) {
    if (await this.isRowEditorMode()) {
      await this.schemaEditor.setRowField(rowIndex, field, value);
      return;
    }
    await this.schemaRenderer.setCellTextByField(field, rowIndex, value);
  }

  async setSchemaTypeValue(rowIndex, value, { pickerTab = null, assertSchemaTextIncludesType = true } = {}) {
    if (await this.isRowEditorMode()) {
      await this.schemaEditor.setRowTypeValue(rowIndex, value, {
        pickerTab,
        assertSchemaTextIncludesType,
      });
      return;
    }
    await this.schemaRenderer.clickCellByField('type', rowIndex);
    const pickerTrigger = this.schemaGrid.locator('.tabulator-editing .test-data-grid-command-picker-trigger').first();
    if ((await pickerTrigger.count()) > 0) {
      await pickerTrigger.click();
      await this.methodPicker.chooseCommand(String(value), { tab: pickerTab });
      const valueLower = String(value).toLowerCase();
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
    if (await this.isRowEditorMode()) {
      const mapped = this.schemaEditor.resolveField(field);
      const input = this.schemaEditor.row(rowIndex).locator(`[data-field="${mapped}"]`);
      if ((await input.count()) === 0) {
        return '';
      }
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
    return this.schemaRenderer.getCellTextByField(field, rowIndex);
  }
}

module.exports = { TestDataPanelComponent };
