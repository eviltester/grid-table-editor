const { expect } = require('@playwright/test');
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
    await expect(this.container).toBeVisible();
    await expect(this.grid).toBeVisible();
    await expect(this.addRowButton).toBeVisible();
    await expect(this.addRowsAboveButton).toBeVisible();
    await expect(this.addRowsBelowButton).toBeVisible();
    await expect(this.deleteSelectedRowsButton).toBeVisible();
    await expect(this.quickFilterInput).toBeVisible();
    await expect(this.clearFiltersButton).toBeVisible();
    await expect(this.clearSortButton).toBeVisible();
    await expect(this.resetTableButton).toBeVisible();
  }

  async expectReady() {
    await this.expectVisible();
    await expect(this.grid.locator('.tabulator-col-title').first()).toBeVisible();
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
    const context = await this._buildClearFiltersContext(expectedActiveRowCount);

    try {
      await expect(async () => {
        await this._attemptClearFilters(context);
      }).toPass({ timeout: 15000, intervals: [100, 200, 400, 800] });
      return;
    } catch (error) {
      // fall through to detailed diagnostics
    }

    await this._throwClearFiltersDiagnostics(context);
  }

  async _attemptClearFilters(context) {
    await this.clearFiltersButton.click();
    await expect(this.quickFilterInput).toHaveValue('');
    await this._expectHeaderFiltersCleared();
    await this._expectActiveRowCountRecovered(context);
    await this.renderer.waitForGridSettle({ columnName: context.diagnosticColumn, stableForMs: 2000, timeoutMs: 7000 });
    await this._expectHeaderFiltersCleared();
    await this._expectActiveRowCountRecovered(context);
  }

  async _buildClearFiltersContext(expectedActiveRowCount) {
    const initialActiveRowCount = await this.renderer.getActiveRowCount();
    const columnNames = await this.header.getColumnNames();
    const diagnosticColumn = columnNames[0];
    const hadActiveFiltersBeforeClear = await this._hasActiveFilters();
    const minRecoveredRowCount =
      hadActiveFiltersBeforeClear && !Number.isFinite(expectedActiveRowCount)
        ? initialActiveRowCount + 1
        : initialActiveRowCount;
    return {
      expectedActiveRowCount,
      initialActiveRowCount,
      diagnosticColumn,
      minRecoveredRowCount,
    };
  }

  async _hasActiveFilters() {
    const quickFilterValue = await this.quickFilterInput.inputValue();
    if (String(quickFilterValue || '').trim().length > 0) {
      return true;
    }
    const headerFilterValues = await this._getHeaderFilterValues();
    return headerFilterValues.some((value) => value.length > 0);
  }

  async _getHeaderFilterValues() {
    return this.grid
      .locator('.tabulator-header-filter input')
      .evaluateAll((inputs) => inputs.map((input) => String(input.value || '').trim()));
  }

  async _expectHeaderFiltersCleared() {
    const headerFilterValues = await this._getHeaderFilterValues();
    expect(headerFilterValues.some((value) => value.length > 0)).toBe(false);
  }

  async _expectActiveRowCountRecovered(context) {
    const activeRowCount = await this.renderer.getActiveRowCount();
    if (Number.isFinite(context.expectedActiveRowCount)) {
      expect(activeRowCount).toBe(context.expectedActiveRowCount);
    } else {
      expect(activeRowCount).toBeGreaterThanOrEqual(context.minRecoveredRowCount);
    }
  }

  async _throwClearFiltersDiagnostics(context) {
    const quickFilterValue = await this.quickFilterInput.inputValue();
    const headerFilterValues = await this._getHeaderFilterValues();
    const activeRowCount = await this.renderer.getActiveRowCount();
    const snapshot = await this.renderer.getActiveTableSnapshot(context.diagnosticColumn, 3);
    throw new Error(
      [
        'Failed to clear all filters and restore active rows.',
        `quickFilter="${quickFilterValue}"`,
        `headerFilters=${JSON.stringify(headerFilterValues)}`,
        `activeRowCount=${activeRowCount}`,
        `expectedActiveRowCount=${Number.isFinite(context.expectedActiveRowCount) ? context.expectedActiveRowCount : 'n/a'}`,
        `diagnosticColumn=${context.diagnosticColumn || 'n/a'}`,
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
