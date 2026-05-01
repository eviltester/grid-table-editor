class ImportExportControlsComponent {
  constructor(page) {
    this.page = page;
    this.container = page.locator('#import-export-controls');
    this.setTextFromGridButton = page.locator('#settextfromgridbutton');
    this.setGridFromTextButton = page.locator('#setgridfromtextbutton');
    this.downloadButton = page.locator('#filedownload');
    this.importLabel = page.locator('#csvinputlabel');
    this.dropZone = page.locator('#dropzone');
    this.fileFormatLabel = page.locator('.fileFormat').first();
  }

  async expectVisible() {
    await this.container.waitFor({ state: 'visible' });
    await this.setTextFromGridButton.waitFor({ state: 'visible' });
    await this.downloadButton.waitFor({ state: 'visible' });
  }

  async expectReady() {
    await this.expectVisible();
  }

  async setTextFromGrid() {
    await this.setTextFromGridButton.click();
  }

  async setGridFromText() {
    await this.setGridFromTextButton.click();
  }

  async isSetGridFromTextEnabled() {
    return this.setGridFromTextButton.isEnabled();
  }

  async getExtensionLabel() {
    return (await this.fileFormatLabel.innerText()).trim();
  }

  async isImportVisible() {
    return this.importLabel.evaluate((el) => getComputedStyle(el).visibility !== 'hidden');
  }

  async isDropZoneVisible() {
    return this.dropZone.evaluate((el) => getComputedStyle(el).visibility !== 'hidden');
  }

  async isDownloadVisible() {
    return this.downloadButton.evaluate((el) => getComputedStyle(el).visibility !== 'hidden');
  }
}

module.exports = { ImportExportControlsComponent };
