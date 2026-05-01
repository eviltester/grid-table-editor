class TestDataPanelComponent {
  constructor(page) {
    this.page = page;
    this.container = page.locator('.testDataDefnGui');
    this.details = this.container.locator('details');
    this.heading = page.getByText('Test Data', { exact: true });
    this.generateButton = page.getByRole('button', { name: 'Generate' });
    this.refreshTextPreviewButton = page.getByRole('button', { name: 'Refresh Text Preview' });
  }

  async expectVisible() {
    await this.container.waitFor({ state: 'visible' });
    await this.heading.waitFor({ state: 'visible' });
  }

  async expectReady() {
    await this.expectVisible();
  }

  async expand() {
    await this.heading.click();
  }

  async collapse() {
    await this.heading.click();
  }

  async expectExpanded() {
    await this.generateButton.waitFor({ state: 'visible' });
    await this.refreshTextPreviewButton.waitFor({ state: 'visible' });
  }

  async isExpanded() {
    return this.details.evaluate((d) => d.hasAttribute('open'));
  }
}

module.exports = { TestDataPanelComponent };
