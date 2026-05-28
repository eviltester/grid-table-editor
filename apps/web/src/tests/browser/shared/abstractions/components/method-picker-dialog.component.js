const { expect } = require('@playwright/test');

class MethodPickerDialogComponent {
  constructor(page) {
    this.page = page;
    this.overlay = page.locator('.method-picker-overlay');
    this.searchInput = page.locator('.method-picker-search');
    this.tabButtons = page.locator('.method-picker-tabs button');
    this.commandLabels = page.locator('.method-picker-tile .method-picker-tile-command');
    this.applyButton = page.locator('[data-action="apply"]');
  }

  async expectOpen() {
    await expect(this.searchInput).toBeVisible();
  }

  async chooseCommand(command, { tab = null } = {}) {
    await this.expectOpen();
    if (tab) {
      await this.page.locator('.method-picker-tabs button', { hasText: new RegExp(`^${tab}$`, 'i') }).click();
    }

    const requested = String(command);
    await this.searchInput.fill(requested);
    const matches = this.commandLabels.filter({
      hasText: new RegExp(`^${requested.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
    });
    if ((await matches.count()) === 0) {
      throw new Error(`Method picker command not found: ${requested}`);
    }
    const target = matches.first();

    await target.click();
    await this.applyButton.click();
    await expect(this.overlay).toHaveCount(0);
  }
}

module.exports = { MethodPickerDialogComponent };
