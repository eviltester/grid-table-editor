const { expect } = require('@playwright/test');

class TextInputDialogComponent {
  constructor(page) {
    this.page = page;
    this.backdrop = page.locator('#text-input-modal-backdrop');
    this.input = this.backdrop.getByRole('textbox');
  }

  async expectVisible() {
    await expect(this.backdrop).toBeVisible();
  }

  async expectHidden() {
    await expect(this.backdrop).toBeHidden();
  }

  async submit(value) {
    await this.expectVisible();
    await this.input.fill(String(value ?? ''));
    await this.backdrop.getByRole('button', { name: /^ok$/i }).click();
    await this.expectHidden();
  }
}

module.exports = { TextInputDialogComponent };
