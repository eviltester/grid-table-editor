const { expect } = require('@playwright/test');

class GeneratorGenerateOptionsComponent {
  constructor(page) {
    this.page = page;
    this.container = page.getByRole('region', { name: 'Generate Data and Options' });
    this.rowsCountInput = page.getByRole('spinbutton', { name: 'Generate Rows' });
    this.outputFormatSelect = page.getByLabel('Output Format');
    this.generateDataButton = page.getByRole('button', { name: 'Generate Data' });
    this.generatePairwiseButton = page.getByRole('button', { name: 'Generate Pairwise' });
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
