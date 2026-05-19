const { expect } = require('@playwright/test');

class GeneratorGenerateOptionsComponent {
  constructor(page) {
    this.page = page;
    this.container = page.locator('#generatorGenerateOptionsSection');
    this.rowsCountInput = page.locator('#generateRowsCount');
    this.outputFormatSelect = page.locator('#generatorOutputFormat');
    this.generateDataButton = page.locator('#generateDataButton');
    this.generatePairwiseButton = page.locator('#generateAllPairsButton');
  }

  async expectReady() {
    await expect(this.container).toBeVisible();
    await expect(this.rowsCountInput).toBeVisible();
    await expect(this.outputFormatSelect).toBeVisible();
    await expect(this.generateDataButton).toBeVisible();
  }

  async setRowsCount(value) {
    await this.rowsCountInput.fill(String(value));
  }

  async setOutputFormat(format) {
    await this.outputFormatSelect.selectOption(format);
  }

  async clickGenerateData() {
    await this.generateDataButton.click();
  }

  async clickGeneratePairwise() {
    await this.generatePairwiseButton.click();
  }
}

module.exports = { GeneratorGenerateOptionsComponent };
