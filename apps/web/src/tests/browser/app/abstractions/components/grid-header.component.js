const { expect } = require('@playwright/test');
const { GridRendererComponent } = require('./grid-renderer.component');

class GridHeaderComponent {
  constructor(page, gridRootLocator, renderer = undefined) {
    this.page = page;
    this.gridRoot = gridRootLocator;
    this.headers = this.gridRoot.locator('.tabulator-col');
    this.renderer = renderer || new GridRendererComponent(page, gridRootLocator);
  }

  async getColumnNames() {
    const titles = this.gridRoot.locator('.tabulator-col .tabulator-col-title');
    const count = await titles.count();
    const names = [];
    for (let index = 0; index < count; index += 1) {
      names.push(this._normalizeTitle(await titles.nth(index).innerText()));
    }
    return names;
  }

  async countColumns() {
    return this.gridRoot.locator('.tabulator-col .tabulator-col-title').count();
  }

  async expectHasAnyColumns() {
    await expect(this.gridRoot.locator('.tabulator-col .tabulator-col-title').first()).toBeVisible();
  }

  async clickAction(columnName, action) {
    const headerTitle = this._headerTitleByName(columnName);
    const actionTitleMap = {
      rename: 'rename',
      delete: 'delete',
      duplicate: 'duplicate',
      'add-left': 'add left',
      'add-right': 'add right',
      'sort-asc': 'Sort Asc',
      'sort-desc': 'Sort Desc',
      'sort-none': 'Clear Sort',
    };
    const title = actionTitleMap[action] || action;
    const headerRoot = headerTitle.locator(`xpath=ancestor::*[contains(@class,'tabulator-col')]`);
    const actionLocator = headerRoot.locator(`[title="${title}"], [title*="${title}"]`).first();
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
    const confirmBackdrop = this.page.locator('#confirm-modal-backdrop');
    if ((await confirmBackdrop.count()) > 0 && (await confirmBackdrop.isVisible())) {
      await confirmBackdrop.locator('#confirm-modal-ok').click();
      await expect(confirmBackdrop).toBeHidden();
    }
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
    const header = this._headerTitleByName(columnName).locator(`xpath=ancestor::*[contains(@class,'tabulator-col')]`);
    const input = header.locator('.tabulator-header-filter input');
    await input.fill(value);
    await input.press('Enter');
  }

  async getColumnFilterValue(columnName) {
    const header = this._headerTitleByName(columnName).locator(`xpath=ancestor::*[contains(@class,'tabulator-col')]`);
    return header.locator('.tabulator-header-filter input').inputValue();
  }

  async getColumnSortState(columnName) {
    const header = this._headerTitleByName(columnName)
      .locator(`xpath=ancestor::*[contains(@class,'tabulator-col')]`)
      .first();
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
    const normalized = this._normalizeTitle(columnName);
    return this.gridRoot.locator('.tabulator-col-title', { hasText: normalized }).first();
  }

  _normalizeTitle(rawText) {
    return String(rawText || '')
      .split('\n')[0]
      .trim();
  }

  async fillTextInputModal(value) {
    const backdrop = this.page.locator('#text-input-modal-backdrop');
    await expect(backdrop).toBeVisible();
    const input = backdrop.locator('#text-input-modal-field');
    await input.fill(String(value ?? ''));
    await backdrop.locator('#text-input-modal-ok').click();
    await expect(backdrop).toBeHidden();
  }
}

module.exports = { GridHeaderComponent };
