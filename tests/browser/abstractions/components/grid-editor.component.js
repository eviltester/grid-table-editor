const { GridRendererComponent } = require('./grid-renderer.component');

class GridEditorComponent {
  constructor(page) {
    this.page = page;
    this.container = page.locator('#main-grid-view');
    this.grid = page.locator('#myGrid');
    this.renderer = new GridRendererComponent(page, this.grid);
    this.addRowButton = page.getByRole('button', { name: 'Add Row', exact: true });
    this.quickFilterInput = page.getByLabel('Filter:');
    this.clearFiltersButton = page.getByRole('button', { name: 'Clear Filters' });
    this.resetTableButton = page.getByRole('button', { name: 'Reset Table' });
  }

  async expectVisible() {
    await this.container.waitFor({ state: 'visible' });
    await this.grid.waitFor({ state: 'visible' });
    await this.addRowButton.waitFor({ state: 'visible' });
  }

  async addRow() {
    await this.addRowButton.click();
  }

  async filterBy(text) {
    await this.quickFilterInput.fill(text);
  }

  async clearFilters() {
    await this.clearFiltersButton.click();
  }
}

module.exports = { GridEditorComponent };
