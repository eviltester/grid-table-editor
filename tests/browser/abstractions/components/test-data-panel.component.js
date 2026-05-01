class TestDataPanelComponent {
  constructor(page) {
    this.page = page;
    this.container = page.locator('.testDataDefnGui');
    this.heading = page.getByText('Test Data', { exact: true });
    this.generateButton = page.getByRole('button', { name: 'Generate' });
    this.refreshTextPreviewButton = page.getByRole('button', { name: 'Refresh Text Preview' });
  }

  async expand() {
    await this.heading.click();
  }

  async expectExpanded() {
    await this.generateButton.waitFor({ state: 'visible' });
    await this.refreshTextPreviewButton.waitFor({ state: 'visible' });
  }
}

module.exports = { TestDataPanelComponent };
