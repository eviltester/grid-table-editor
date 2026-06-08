const { expect } = require('@playwright/test');
const { GeneratorSchemaComponent } = require('./components/generator-schema.component');
const { GeneratorGenerateOptionsComponent } = require('./components/generator-generate-options.component');
const { GeneratorPreviewComponent } = require('./components/generator-preview.component');

class GeneratorPage {
  constructor(page) {
    this.page = page;
    this.initialLoading = page.locator('#generator-initial-load');
    this.root = page.locator('#generator-app .shared-generator-page');

    this.schema = new GeneratorSchemaComponent(page);
    this.generateOptions = new GeneratorGenerateOptionsComponent(page);
    this.preview = new GeneratorPreviewComponent(page);
  }

  async goto(path = '/generator.html') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.waitUntilReady();
  }

  async waitUntilReady() {
    await expect(this.initialLoading).toHaveCount(0);
    await expect(this.root).toBeVisible();
    await this.schema.expectReady();
    await this.generateOptions.expectReady();
    await this.preview.expectReady();
  }

  async downloadGeneratedData() {
    const downloadPromise = this.page.waitForEvent('download');
    await this.generateOptions.clickGenerateData();
    return downloadPromise;
  }

  async downloadGeneratedPairwiseData() {
    await this.generateOptions.clickGeneratePairwise();
    const dialog = this.page.getByRole('dialog', { name: 'Generate Combinations' });
    await expect(dialog).toBeVisible();
    const downloadPromise = this.page.waitForEvent('download');
    await dialog.getByRole('button', { name: 'Generate' }).click();
    return downloadPromise;
  }
}

module.exports = { GeneratorPage };
