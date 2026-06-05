const { expect } = require('@playwright/test');
const { GridRendererComponent } = require('./grid-renderer.component');
const { ConfirmDialogComponent } = require('./confirm-dialog.component');
const { TextInputDialogComponent } = require('./text-input-dialog.component');

class GridHeaderComponent {
  constructor(page, gridRootLocator, renderer = undefined) {
    this.page = page;
    this.gridRoot = gridRootLocator;
    this.renderer = renderer || new GridRendererComponent(page, gridRootLocator);
    this.confirmDialog = new ConfirmDialogComponent(page);
    this.textInputDialog = new TextInputDialogComponent(page);
  }

  async getColumnNames() {
    return this.renderer.getColumnNames();
  }

  async countColumns() {
    return this.renderer.countColumns();
  }

  async expectHasAnyColumns() {
    await this.renderer.expectHasAnyColumns();
  }

  async expectActionButtonsVisible(columnName) {
    const headerRoot = this._headerRootByName(columnName);
    await expect(headerRoot.getByRole('button', { name: 'Add column left', exact: true })).toBeVisible();
    await expect(headerRoot.getByRole('button', { name: 'Rename column', exact: true })).toBeVisible();
    await expect(headerRoot.getByRole('button', { name: 'Delete column', exact: true })).toBeVisible();
    await expect(headerRoot.getByRole('button', { name: 'Duplicate column', exact: true })).toBeVisible();
    await expect(headerRoot.getByRole('button', { name: 'Add column right', exact: true })).toBeVisible();
  }

  async clickAction(columnName, action) {
    const actionTitleMap = {
      rename: 'Rename column',
      delete: 'Delete column',
      duplicate: 'Duplicate column',
      'add-left': 'Add column left',
      'add-right': 'Add column right',
      'sort-asc': 'Sort ascending',
      'sort-desc': 'Sort descending',
      'sort-none': 'Clear sort',
    };
    const title = actionTitleMap[action] || action;
    const headerRoot = this._headerRootByName(columnName);
    const actionLocator = headerRoot.locator(`[aria-label="${title}"], [title="${title}"]`).first();
    await actionLocator.click();
  }

  async renameColumn(columnName, newName) {
    await this.clickAction(columnName, 'rename');
    await this.fillTextInputModal(newName);
  }

  async addColumnLeft(columnName, newName) {
    await this.clickAction(columnName, 'add-left');
    await this.fillTextInputModal(newName);
  }

  async addColumnRight(columnName, newName) {
    await this.clickAction(columnName, 'add-right');
    await this.fillTextInputModal(newName);
  }

  async duplicateColumn(columnName, newName) {
    await this.clickAction(columnName, 'duplicate');
    await this.fillTextInputModal(newName);
  }

  async deleteColumn(columnName) {
    await this.clickAction(columnName, 'delete');
    await this.confirmDialog.confirmIfVisible();
  }

  async sortAsc(columnName) {
    await this._ensureSortState(columnName, 'asc', 'sort-asc');
    await this.renderer.waitForGridSettle({ columnName });
  }

  async sortDesc(columnName) {
    await this._ensureSortState(columnName, 'desc', 'sort-desc');
    await this.renderer.waitForGridSettle({ columnName });
  }

  async clearSort(columnName) {
    await this.clickAction(columnName, 'sort-none');
  }

  async setColumnFilter(columnName, value) {
    const input = this._headerFilterInputByName(columnName);
    await input.fill(value);
    await input.press('Enter');
  }

  async getColumnFilterValue(columnName) {
    return this._headerFilterInputByName(columnName).inputValue();
  }

  async getAllFilterValues() {
    return this.renderer
      .allHeaderFilterInputs()
      .evaluateAll((inputs) => inputs.map((input) => String(input.value || '').trim()));
  }

  async hasActiveFilters() {
    const values = await this.getAllFilterValues();
    return values.some((value) => value.length > 0);
  }

  async getColumnSortState(columnName) {
    const header = this._headerRootByName(columnName);
    return (await header.getAttribute('aria-sort')) || '';
  }

  async _ensureSortState(columnName, expectedState, action) {
    await expect(async () => {
      await this.clickAction(columnName, action);
      const state = await this.getColumnSortState(columnName);
      expect(String(state)).toContain(expectedState);
    }).toPass({ timeout: 3000, intervals: [100, 200, 400] });
  }

  _headerTitleByName(columnName) {
    return this.renderer.columnTitle(columnName);
  }

  _headerRootByName(columnName) {
    return this.renderer.columnRoot(columnName);
  }

  _headerFilterInputByName(columnName) {
    return this.renderer.headerFilterInput(columnName);
  }

  async fillTextInputModal(value) {
    await this.textInputDialog.submit(value);
  }
}

module.exports = { GridHeaderComponent };
