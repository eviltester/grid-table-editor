class OverlaySafeActivationComponent {
  constructor(page) {
    this.page = page;
  }

  async dismissOpenHelpTooltips() {
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.mouse.move(4, 4);
    await this.page.waitForTimeout(150);
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.waitForTimeout(150);
  }

  async activateButton(buttonLocator) {
    await this.dismissOpenHelpTooltips();
    await buttonLocator.focus();
    await buttonLocator.press('Enter');
  }
}

module.exports = { OverlaySafeActivationComponent };
