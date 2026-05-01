class ImportExportControlsComponent {
  constructor(page) {
    this.page = page;
    this.container = page.locator('#import-export-controls');
    this.setTextFromGridButton = page.getByRole('button', { name: /Set Text From Grid/i });
    this.setGridFromTextButton = page.getByRole('button', { name: /Set Grid From Text/i });
    this.downloadButton = page.getByRole('button', { name: /Download/i });
  }

  async expectVisible() {
    await this.container.waitFor({ state: 'visible' });
    await this.setTextFromGridButton.waitFor({ state: 'visible' });
    await this.downloadButton.waitFor({ state: 'visible' });
  }

  async setTextFromGrid() {
    await this.setTextFromGridButton.click();
  }
}

module.exports = { ImportExportControlsComponent };
