const { expect } = require('@playwright/test');

class ConfirmDialogComponent {
  constructor(page) {
    this.page = page;
    this.backdrop = page.locator('#confirm-modal-backdrop');
  }

  async isVisible() {
    return (await this.backdrop.count()) > 0 && (await this.backdrop.isVisible());
  }

  async expectVisible() {
    await expect(this.backdrop).toBeVisible();
  }

  async expectHidden() {
    await expect(this.backdrop).toBeHidden();
  }

  async confirmIfVisible(options = {}) {
    if (!(await this.isVisible())) {
      return false;
    }
    await this.confirm(options);
    return true;
  }

  async cancelIfVisible() {
    if (!(await this.isVisible())) {
      return false;
    }
    await this.cancel();
    return true;
  }

  async confirm({ confirmLabel = /^ok$/i } = {}) {
    await this.expectVisible();
    await this.backdrop.getByRole('button', { name: confirmLabel }).click();
    await this.expectHidden();
  }

  async cancel() {
    await this.expectVisible();
    await this.backdrop.getByRole('button', { name: /^cancel$/i }).click();
    await this.expectHidden();
  }
}

module.exports = { ConfirmDialogComponent };
