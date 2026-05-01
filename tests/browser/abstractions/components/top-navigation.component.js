class TopNavigationComponent {
  constructor(page) {
    this.page = page;
    this.brandLink = page.getByRole('link', { name: 'AnyWayData' });
    this.generatorLink = page.getByRole('link', { name: 'Generator' });
    this.docsLink = page.getByRole('link', { name: 'Docs' });
    this.blogLink = page.getByRole('link', { name: 'Blog' });
  }

  async expectVisible() {
    await this.brandLink.waitFor({ state: 'visible' });
    await this.generatorLink.waitFor({ state: 'visible' });
    await this.docsLink.waitFor({ state: 'visible' });
    await this.blogLink.waitFor({ state: 'visible' });
  }

  async expectReady() {
    await this.expectVisible();
  }
}

module.exports = { TopNavigationComponent };
