const { expect } = require('@playwright/test');

class TopNavigationComponent {
  constructor(page) {
    this.page = page;
    this.brandLink = page.getByRole('link', { name: 'AnyWayData' });
    this.generatorLink = page.getByRole('link', { name: 'Generator' });
    this.docsLink = page.getByRole('link', { name: 'Docs' });
    this.blogLink = page.getByRole('link', { name: 'Blog' });
    this.instructionsSummary = page.locator('.instructions summary');
    this.instructionsDetails = page.locator('.instructions details');
  }

  async expectVisible() {
    await expect(this.brandLink).toBeVisible();
    await expect(this.generatorLink).toBeVisible();
    await expect(this.docsLink).toBeVisible();
    await expect(this.blogLink).toBeVisible();
  }

  async expectReady() {
    await this.expectVisible();
  }

  async gotoGenerator() {
    await this.generatorLink.click();
  }

  async clickBrand() {
    await this.brandLink.click();
  }

  async clickDocs() {
    await this.docsLink.click();
  }

  async clickBlog() {
    await this.blogLink.click();
  }

  async getDocsHref() {
    return this.docsLink.getAttribute('href');
  }

  async getBlogHref() {
    return this.blogLink.getAttribute('href');
  }

  async expandInstructions() {
    const expanded = (await this.instructionsDetails.getAttribute('open')) !== null;
    if (!expanded) {
      await this.instructionsSummary.click();
    }
  }

  async collapseInstructions() {
    const expanded = (await this.instructionsDetails.getAttribute('open')) !== null;
    if (expanded) {
      await this.instructionsSummary.click();
    }
  }

  async isInstructionsExpanded() {
    return (await this.instructionsDetails.getAttribute('open')) !== null;
  }
}

module.exports = { TopNavigationComponent };
