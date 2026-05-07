const { GridRendererComponent } = require('./grid-renderer.component');
const { GridHeaderComponent } = require('./grid-header.component');

class GridEditorComponent {
  constructor(page) {
    this.page = page;
    this.container = page.locator('#main-grid-view');
    this.grid = page.locator('#myGrid');
    this.renderer = new GridRendererComponent(page, this.grid);
    this.header = new GridHeaderComponent(page, this.grid);
    this.addRowButton = page.getByRole('button', { name: 'Add Row', exact: true });
    this.addRowsAboveButton = page.getByRole('button', { name: 'Add Rows Above' });
    this.addRowsBelowButton = page.getByRole('button', { name: 'Add Rows Below' });
    this.deleteSelectedRowsButton = page.getByRole('button', { name: 'Delete Selected Rows' });
    this.quickFilterInput = page.getByLabel('Filter:');
    this.clearFiltersButton = page.getByRole('button', { name: 'Clear Filters' });
    this.clearSortButton = page.getByRole('button', { name: 'Clear Sort' });
    this.resetTableButton = page.getByRole('button', { name: 'Reset Table' });
  }

  async expectVisible() {
    await this.container.waitFor({ state: 'visible' });
    await this.grid.waitFor({ state: 'visible' });
    await this.addRowButton.waitFor({ state: 'visible' });
    await this.addRowsAboveButton.waitFor({ state: 'visible' });
    await this.addRowsBelowButton.waitFor({ state: 'visible' });
    await this.deleteSelectedRowsButton.waitFor({ state: 'visible' });
    await this.quickFilterInput.waitFor({ state: 'visible' });
    await this.clearFiltersButton.waitFor({ state: 'visible' });
    await this.clearSortButton.waitFor({ state: 'visible' });
    await this.resetTableButton.waitFor({ state: 'visible' });
  }

  async expectReady() {
    await this.expectVisible();
    await this.renderer.waitForColumnName('Instructions');
  }

  async addRow() {
    await this.addRowButton.click();
  }

  async addRowAndWaitForCountIncrease() {
    const before = await this.renderer.countRows();
    await this.addRow();
    return before + 1;
  }

  async filterBy(text) {
    await this.quickFilterInput.fill(text);
  }

  async setQuickFilter(text) {
    await this.filterBy(text);
  }

  async addRowsAbove() {
    await this.addRowsAboveButton.click();
  }

  async addRowsBelow() {
    await this.addRowsBelowButton.click();
  }

  async deleteSelectedRows() {
    const handler = async (dialog) => {
      if (dialog.message() === 'Are you Sure You Want to Delete Rows?') {
        await dialog.accept();
      }
    };
    this.page.on('dialog', handler);
    try {
      await this.deleteSelectedRowsButton.click();
    } finally {
      this.page.off('dialog', handler);
    }
  }

  async selectRow(rowIndex) {
    await this.renderer.selectRow(rowIndex);
  }

  async selectRows(rowIndexes) {
    await this.renderer.selectRows(rowIndexes);
  }

  async clearFilters() {
    await this.clearFiltersButton.click();
  }

  async clearSort() {
    await this.clearSortButton.click();
  }

  async resetTable() {
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await this.resetTableButton.click();
  }
}

module.exports = { GridEditorComponent };
