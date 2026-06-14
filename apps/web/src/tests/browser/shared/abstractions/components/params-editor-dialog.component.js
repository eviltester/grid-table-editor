const { expect } = require('@playwright/test');

class ParamsEditorDialogComponent {
  constructor(page) {
    this.page = page;
    this.overlay = page.locator('[data-role="params-editor-overlay"]');
    this.applyButton = this.overlay.locator('[data-role="params-editor-apply-button"]');
  }

  async expectOpen() {
    await expect(this.overlay.locator('[data-role="params-editor-dialog"]')).toBeVisible();
  }

  valueInput(name) {
    return this.overlay.getByRole('textbox', { name: new RegExp(`^${name} value$`, 'i') });
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
