const { expect } = require('@playwright/test');

class ImportExportWorkspaceComponent {
  constructor(page) {
    this.page = page;
    this.container = page.locator('#import-export-controls');
    this.disclosure = this.container.locator('[data-role="import-export-toolbar-details"]').first();
    this.disclosureSummary = this.disclosure.locator('summary').first();
    this.setTextFromGridButton = this.container.getByRole('button', { name: /set text from grid/i });
    this.setGridFromTextButton = this.container.getByRole('button', { name: /set grid from text/i });
    this.clipboardImportButton = this.container.getByRole('button', { name: /import from clipboard/i });
    this.downloadButton = this.container.getByRole('button', { name: /download/i });
    this.importSettingsDetails = this.container.locator('[data-role="import-settings-details"]').first();
    this.importSettingsSummary = this.importSettingsDetails.locator('summary').first();
    this.importLabel = this.container
      .locator('label')
      .filter({ hasText: /import:/i })
      .first();
    this.fileInput = this.importLabel.locator('input[type="file"]').first();
    this.dropZone = this.container
      .locator('label')
      .filter({ hasText: /drag and drop/i })
      .first();
    this.fileFormatLabel = this.container.locator('[data-role="file-format-label"]').first();
    this.importProgressStatus = this.container.locator('[data-role="import-progress-status"]').first();
    this.exportProgressStatus = this.container.locator('[data-role="export-progress-status"]').first();
    this.errorStatus = this.container.locator('[data-role="error-status"]').first();
    this.trimInputOnRadio = this.container.getByRole('radio', { name: 'On' }).first();
    this.trimInputOffRadio = this.container.getByRole('radio', { name: 'Off' }).first();
    this.trimInputFieldsSelectedRadio = this.container.getByRole('radio', { name: 'Selected Fields' }).first();
    this.trimInputFieldsCsvInput = this.container.getByRole('textbox', { name: /trim input fields csv/i }).first();
  }

  async expectVisible() {
    await expect(this.container).toBeVisible();
    await expect(this.setTextFromGridButton).toBeVisible();
    await expect(this.disclosureSummary).toBeVisible();
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

  async importFromClipboard() {
    await this.openImportExportDetails();
    await this.clipboardImportButton.click();
  }

  async uploadFile(filePath) {
    await this.openImportExportDetails();
    await this.fileInput.setInputFiles(filePath);
  }

  async setTrimInput(enabled = true) {
    await this.openImportExportDetails();
    await this.openImportSettings();
    if (enabled) {
      await this.trimInputOnRadio.check();
      return;
    }
    await this.trimInputOffRadio.check();
  }

  async setTrimInputFieldsCsv(value) {
    await this.openImportExportDetails();
    await this.openImportSettings();
    await this.trimInputFieldsSelectedRadio.check();
    await this.trimInputFieldsCsvInput.fill(value);
  }

  async clickDownloadAndWaitForEvent() {
    await this.openImportExportDetails();
    const downloadPromise = this.page.waitForEvent('download');
    await this.downloadButton.click();
    return downloadPromise;
  }

  async isSetGridFromTextEnabled() {
    return this.setGridFromTextButton.isEnabled();
  }

  async expectSetGridFromTextEnabled(enabled = true) {
    if (enabled) {
      await expect(this.setGridFromTextButton).toBeEnabled();
      return;
    }
    await expect(this.setGridFromTextButton).toBeDisabled();
  }

  async getExtensionLabel() {
    return (await this.fileFormatLabel.innerText()).trim();
  }

  async expectExtensionLabel(value) {
    await expect(this.fileFormatLabel).toHaveText(value);
  }

  async isImportVisible() {
    await this.openImportExportDetails();
    return this.importLabel.isVisible();
  }

  async isDropZoneVisible() {
    await this.openImportExportDetails();
    return this.dropZone.isVisible();
  }

  async isDownloadVisible() {
    await this.openImportExportDetails();
    return this.downloadButton.isVisible();
  }

  async getProgressStatusText() {
    const exportText = ((await this.exportProgressStatus.textContent()) || '').trim();
    if (exportText) {
      return exportText;
    }
    return ((await this.importProgressStatus.textContent()) || '').trim();
  }

  async expectProgressStatusContains(value) {
    const status = (await this.exportProgressStatus.textContent())?.trim()
      ? this.exportProgressStatus
      : this.importProgressStatus;
    await expect(status).toContainText(value);
  }

  async getErrorText() {
    return ((await this.errorStatus.textContent()) || '').trim();
  }

  async openImportExportDetails() {
    if (await this.disclosure.evaluate((element) => element.open)) {
      return;
    }
    await this.disclosureSummary.click();
    await expect(this.disclosure).toHaveJSProperty('open', true);
  }

  async openImportSettings() {
    if (await this.importSettingsDetails.evaluate((element) => element.open)) {
      return;
    }
    await this.importSettingsSummary.click();
    await expect(this.importSettingsDetails).toHaveJSProperty('open', true);
  }
}

module.exports = { ImportExportWorkspaceComponent };
