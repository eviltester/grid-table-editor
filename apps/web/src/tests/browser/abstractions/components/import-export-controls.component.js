const { expect } = require('@playwright/test');

class ImportExportControlsComponent {
  constructor(page) {
    this.page = page;
    this.container = page.locator('#import-export-controls');
    this.setTextFromGridButton = page.locator('#settextfromgridbutton');
    this.setGridFromTextButton = page.locator('#setgridfromtextbutton');
    this.downloadButton = page.locator('#filedownload');
    this.importLabel = page.locator('#csvinputlabel');
    this.fileInput = page.locator('#csvinput');
    this.dropZone = page.locator('#dropzone');
    this.fileFormatLabel = page.locator('.fileFormat').first();
    this.progressStatus = page.locator('#import-progress-status');
  }

  async expectVisible() {
    await expect(this.container).toBeVisible();
    await expect(this.setTextFromGridButton).toBeVisible();
    await expect(this.downloadButton).toBeVisible();
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

  async uploadFile(filePath) {
    await this.fileInput.setInputFiles(filePath);
  }

  async clickDownloadAndWaitForEvent() {
    const downloadPromise = this.page.waitForEvent('download');
    await this.downloadButton.click();
    return downloadPromise;
  }

  async isSetGridFromTextEnabled() {
    return this.setGridFromTextButton.isEnabled();
  }

  async getExtensionLabel() {
    return (await this.fileFormatLabel.innerText()).trim();
  }

  async isImportVisible() {
    return this.importLabel.isVisible();
  }

  async isDropZoneVisible() {
    return this.dropZone.isVisible();
  }

  async isDownloadVisible() {
    return this.downloadButton.isVisible();
  }

  async getProgressStatusText() {
    return (await this.progressStatus.innerText()).trim();
  }
}

module.exports = { ImportExportControlsComponent };
