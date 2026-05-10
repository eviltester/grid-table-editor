const { GridRendererComponent } = require('./grid-renderer.component');
const { GridHeaderComponent } = require('./grid-header.component');

class GridEditorComponent {
  constructor(page) {
    this.page = page;
    this.container = page.locator('#main-grid-view');
    this.grid = page.locator('#myGrid');
    this.renderer = new GridRendererComponent(page, this.grid);
    this.header = new GridHeaderComponent(page, this.grid, this.renderer);
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
    await this.grid.locator('.tabulator-col-title').first().waitFor({ state: 'visible' });
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

  async clearFilters({ expectedActiveRowCount } = {}) {
    const initialActiveRowCount = await this.renderer.getActiveRowCount();
    const columnNames = await this.header.getColumnNames();
    const diagnosticColumn = columnNames[0];
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await this.clearFiltersButton.click();
      for (let check = 0; check < 30; check += 1) {
        const quickFilterValue = await this.quickFilterInput.inputValue();
        const headerFilterValues = await this.grid
          .locator('.tabulator-header-filter input')
          .evaluateAll((inputs) => inputs.map((input) => String(input.value || '').trim()));
        const hasActiveColumnFilter = headerFilterValues.some((value) => value.length > 0);
        const activeRowCount = await this.renderer.getActiveRowCount();

        const filtersAreCleared = quickFilterValue === '' && !hasActiveColumnFilter;
        const rowCountRecovered = Number.isFinite(expectedActiveRowCount)
          ? activeRowCount === expectedActiveRowCount
          : activeRowCount >= initialActiveRowCount;

        if (filtersAreCleared && rowCountRecovered) {
          try {
            await this.renderer.waitForGridSettle({ columnName: diagnosticColumn, stableForMs: 2000, timeoutMs: 7000 });
          } catch (error) {
            // Let retry loop continue so we can recover from transient settle timing.
            await this.page.waitForTimeout(50);
            continue;
          }

          const quickFilterAfterSettle = await this.quickFilterInput.inputValue();
          const headerFilterValuesAfterSettle = await this.grid
            .locator('.tabulator-header-filter input')
            .evaluateAll((inputs) => inputs.map((input) => String(input.value || '').trim()));
          const activeRowCountAfterSettle = await this.renderer.getActiveRowCount();
          const filtersStillCleared =
            quickFilterAfterSettle === '' && !headerFilterValuesAfterSettle.some((value) => value.length > 0);
          const rowCountStillRecovered = Number.isFinite(expectedActiveRowCount)
            ? activeRowCountAfterSettle === expectedActiveRowCount
            : activeRowCountAfterSettle >= initialActiveRowCount;
          if (filtersStillCleared && rowCountStillRecovered) {
            return;
          }
        }
        await this.page.waitForTimeout(50);
      }
    }

    const quickFilterValue = await this.quickFilterInput.inputValue();
    const headerFilterValues = await this.grid
      .locator('.tabulator-header-filter input')
      .evaluateAll((inputs) => inputs.map((input) => String(input.value || '').trim()));
    const activeRowCount = await this.renderer.getActiveRowCount();
    const snapshot = await this.renderer.getActiveTableSnapshot(diagnosticColumn, 3);
    throw new Error(
      [
        'Failed to clear all filters and restore active rows.',
        `quickFilter="${quickFilterValue}"`,
        `headerFilters=${JSON.stringify(headerFilterValues)}`,
        `activeRowCount=${activeRowCount}`,
        `expectedActiveRowCount=${Number.isFinite(expectedActiveRowCount) ? expectedActiveRowCount : 'n/a'}`,
        `diagnosticColumn=${diagnosticColumn || 'n/a'}`,
        `topValues=${JSON.stringify(snapshot.topValues || [])}`,
      ].join(' ')
    );
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
