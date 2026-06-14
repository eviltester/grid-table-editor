const { expect } = require('@playwright/test');

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

class ParamsEditorDialogComponent {
  constructor(page) {
    this.page = page;
    this.overlay = page.locator('[data-role="params-editor-overlay"]');
    this.dialog = page.getByRole('dialog', { name: /^edit params for /i });
    this.applyButton = this.dialog.getByRole('button', { name: /^apply$/i });
  }

  async expectOpen() {
    await expect(this.dialog).toBeVisible();
  }

  valueInput(name) {
    return this.dialog.getByRole('textbox', { name: new RegExp(`^${escapeRegExp(name)} value$`, 'i') });
  }

  async setValue(name, value) {
    await this.expectOpen();
    await this.valueInput(name).fill(String(value));
  }

  async apply() {
    await this.expectOpen();
    await this.applyButton.click();
    await expect(this.overlay).toHaveCount(0);
  }
}

module.exports = { ParamsEditorDialogComponent };
