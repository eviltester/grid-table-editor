class GridHeaderComponent {
  constructor(page, gridRootLocator) {
    this.page = page;
    this.gridRoot = gridRootLocator;
    this.headers = this.gridRoot.locator('.tabulator-col');
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
    this.page.once('dialog', async (dialog) => {
      await dialog.accept(newName);
    });
    await this.clickAction(columnName, 'rename');
  }

  async addColumnLeft(columnName, newName) {
    this.page.once('dialog', async (dialog) => {
      await dialog.accept(newName);
    });
    await this.clickAction(columnName, 'add-left');
  }

  async addColumnRight(columnName, newName) {
    this.page.once('dialog', async (dialog) => {
      await dialog.accept(newName);
    });
    await this.clickAction(columnName, 'add-right');
  }

  async duplicateColumn(columnName, newName) {
    this.page.once('dialog', async (dialog) => {
      await dialog.accept(newName);
    });
    await this.clickAction(columnName, 'duplicate');
  }

  async deleteColumn(columnName) {
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await this.clickAction(columnName, 'delete');
  }

  async sortAsc(columnName) {
    await this._ensureSortState(columnName, 'asc', 'sort-asc');
  }

  async sortDesc(columnName) {
    await this._ensureSortState(columnName, 'desc', 'sort-desc');
  }

  async clearSort(columnName) {
    await this.clickAction(columnName, 'sort-none');
  }

  async setColumnFilter(columnName, value) {
    const header = this._headerTitleByName(columnName).locator(`xpath=ancestor::*[contains(@class,'tabulator-col')]`);
    const input = header.locator('.tabulator-header-filter input');
    await input.fill(value);
    await input.dispatchEvent('input');
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
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await this.clickAction(columnName, action);
      for (let check = 0; check < 10; check += 1) {
        const state = await this.getColumnSortState(columnName);
        if (String(state).includes(expectedState)) {
          return;
        }
        await this.page.waitForTimeout(50);
      }
    }
    throw new Error(`Failed to set sort state '${expectedState}' for column '${columnName}'.`);
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
}

module.exports = { GridHeaderComponent };
