class TabbedTextComponent {
  constructor(page) {
    this.page = page;
    this.container = page.locator('#tabbedTextArea');
    this.tabsList = page.locator('#tabbedTextArea .conversionTypesList');
    this.outputTextArea = page.locator('#tabbedTextArea textarea');
    this.previewOrEditButton = page.getByRole('button', { name: /Preview|Edit/i });
    this.copyButton = page.getByRole('button', { name: 'Copy', exact: true });
  }

  async expectVisible() {
    await this.container.waitFor({ state: 'visible' });
    await this.tabsList.waitFor({ state: 'visible' });
    await this.copyButton.waitFor({ state: 'visible' });
  }

  async selectFormat(name) {
    await this.page.getByRole('link', { name, exact: true }).click();
  }

  async preview() {
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await this.previewOrEditButton.click();
  }
}

module.exports = { TabbedTextComponent };
