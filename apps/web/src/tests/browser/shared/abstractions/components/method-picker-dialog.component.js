const { expect } = require('@playwright/test');

class MethodPickerDialogComponent {
  constructor(page) {
    this.page = page;
    this.overlay = page.locator('[data-role="method-picker-overlay"]');
    this.searchInput = this.overlay.locator('[data-role="method-picker-search"]');
    this.tabButtons = this.overlay.locator('[data-role="method-picker-tab"]');
    this.commandLabels = this.overlay.locator('[data-role="method-picker-command"]');
    this.applyButton = this.overlay.locator('[data-action="apply"]');
  }

  async expectOpen() {
    await expect(this.searchInput).toBeVisible();
  }

  async chooseCommand(command, { tab = null } = {}) {
    await this.expectOpen();
    if (tab) {
      await this.overlay.locator('[data-role="method-picker-tab"]', { hasText: new RegExp(`^${tab}$`, 'i') }).click();
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
