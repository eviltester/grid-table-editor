const { expect } = require('@playwright/test');
const { MethodPickerDialogComponent } = require('./method-picker-dialog.component');

class SchemaEditorComponent {
  constructor(page, config) {
    this.page = page;
    this.config = {
      rowsSelector: config.rowsSelector,
      textAreaSelector: config.textAreaSelector,
      modeToggleSelector: config.modeToggleSelector || null,
      addFieldSelector: config.addFieldSelector || null,
      rowCountResolver: config.rowCountResolver || null,
      fieldMap: config.fieldMap || {},
    };

    this.rowsContainer = page.locator(this.config.rowsSelector);
    this.rows = page.locator(`${this.config.rowsSelector} .generator-schema-row`);
    this.textArea = page.locator(this.config.textAreaSelector);
    this.modeToggleButton = this.config.modeToggleSelector ? page.locator(this.config.modeToggleSelector) : null;
    this.addFieldButton = this.config.addFieldSelector ? page.locator(this.config.addFieldSelector) : null;
    this.methodPicker = new MethodPickerDialogComponent(page);
  }

  row(index) {
    return this.rows.nth(index);
  }

  async dismissOpenHelpTooltips() {
    await this.page.mouse.move(0, 0);
    await this.page.waitForTimeout(350);
  }

  async ensureSchemaMode() {
    if (!this.modeToggleButton) {
      return;
    }
    if ((await this.rows.count()) === 0) {
      return;
    }
    const firstRowVisible = await this.row(0).isVisible();
    if (!firstRowVisible) {
      await this.setTextMode(false);
    }
  }

  async isRowEditorMode() {
    if (!(await this.rowsContainer.isVisible())) {
      return false;
    }
    if ((await this.rows.count()) === 0) {
      return false;
    }
    return this.row(0).isVisible();
  }

  async setTextMode(enabled) {
    if (!this.modeToggleButton) {
      return;
    }
    const expected = enabled ? 'Edit as Schema' : 'Edit as Text';
    if (((await this.modeToggleButton.innerText()).trim() || '') !== expected) {
      await this.dismissOpenHelpTooltips();
      await this.modeToggleButton.click();
    }
    await expect(this.modeToggleButton).toHaveText(expected);
  }

  async setSchemaText(schemaText, { ensureTextMode = false, pressTab = false, waitMs = 0 } = {}) {
    if (ensureTextMode) {
      await this.setTextMode(true);
    }
    await this.textArea.fill(schemaText);
    if (pressTab) {
      await this.textArea.press('Tab');
    }
    if (waitMs > 0) {
      await this.page.waitForTimeout(waitMs);
    }
  }

  async getSchemaText({ ensureTextMode = false } = {}) {
    if (ensureTextMode) {
      await this.setTextMode(true);
    }
    return this.textArea.inputValue();
  }

  async addField() {
    if (!this.addFieldButton) {
      return;
    }
    await this.addFieldButton.click();
  }

  async getRowCount() {
    if (typeof this.config.rowCountResolver === 'function') {
      return this.config.rowCountResolver(this);
    }
    return this.rows.count();
  }

  resolveField(field) {
    return this.config.fieldMap[field] || field;
  }

  async setRowField(index, field, value) {
    await this.ensureSchemaMode();
    const mapped = this.resolveField(field);
    const input = this.row(index).locator(`[data-field="${mapped}"]`);
    await input.fill(String(value));
    await input.blur();
  }

  async getRowField(index, field) {
    await this.ensureSchemaMode();
    const mapped = this.resolveField(field);
    const input = this.row(index).locator(`[data-field="${mapped}"]`);
    if ((await input.count()) === 0) {
      return '';
    }
    const tag = await input.first().evaluate((el) => el.tagName.toLowerCase());
    if (tag === 'select') {
      return input.inputValue();
    }
    return input.inputValue();
  }

  async setRowSourceType(index, sourceType) {
    await this.ensureSchemaMode();
    await this.row(index).locator('select[data-field="sourceType"]').selectOption(sourceType);
  }

  async setRowTypeValue(index, value, { pickerTab = null, assertSchemaTextIncludesType = false } = {}) {
    await this.ensureSchemaMode();
    const requested = String(value);
    const lower = requested.toLowerCase();
    const coreTypes = ['enum', 'literal', 'regex', 'domain', 'faker'];

    if (coreTypes.includes(lower)) {
      await this.setRowSourceType(index, lower);
    } else {
      if (lower.startsWith('faker.') || lower.startsWith('helpers.')) {
        await this.setRowSourceType(index, 'faker');
      } else if (lower.includes('.')) {
        await this.setRowSourceType(index, 'domain');
      }
      await this.dismissOpenHelpTooltips();
      await this.row(index).locator('[data-action="pick-command"]').click();
      await this.methodPicker.chooseCommand(requested, { tab: pickerTab });
    }

    if (assertSchemaTextIncludesType) {
      await expect.poll(async () => (await this.getSchemaText()).toLowerCase(), { timeout: 3000 }).toContain(lower);
    }
  }

  async clickRowAction(index, action) {
    await this.ensureSchemaMode();
    await this.dismissOpenHelpTooltips();
    await this.row(index).locator(`button[data-action="${action}"]`).click();
  }

  async dragRowToIndex(fromIndex, toIndex, { placement = 'before' } = {}) {
    await this.ensureSchemaMode();
    const source = this.row(fromIndex).locator('[data-action="drag"]');
    const target = this.row(toIndex);
    const targetBox = await target.boundingBox();
    if (!targetBox) {
      throw new Error(`Unable to drag schema row ${fromIndex} to ${toIndex}: target row is not visible`);
    }
    const targetPosition = {
      x: Math.max(8, Math.min(targetBox.width - 8, 20)),
      y: placement === 'after' ? Math.max(8, targetBox.height - 8) : 8,
    };
    await source.dragTo(target, { targetPosition });
  }
}

module.exports = { SchemaEditorComponent };
