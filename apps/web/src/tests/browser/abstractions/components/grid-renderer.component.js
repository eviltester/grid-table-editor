const { expect } = require('@playwright/test');

class GridRendererComponent {
  constructor(page, gridRootLocator) {
    this.page = page;
    this.gridRoot = gridRootLocator;
    this.headerTitles = this.gridRoot.locator('.tabulator-col-title');
    this.rows = this.gridRoot.locator('.tabulator-row');
  }

  async countRows() {
    return this.rows.count();
  }

  async getColumnNames() {
    const count = await this.headerTitles.count();
    const names = [];
    for (let index = 0; index < count; index += 1) {
      names.push((await this.headerTitles.nth(index).innerText()).trim());
    }
    return names;
  }

  async countVisibleRows() {
    return this.rows.evaluateAll((rowEls) => rowEls.filter((row) => row.offsetParent !== null).length);
  }

  async countSelectedRows() {
    return this.gridRoot.locator('.tabulator-row.tabulator-selected').count();
  }

  async waitForColumnName(columnName) {
    await this.gridRoot
      .locator('.tabulator-col-title')
      .filter({ hasText: columnName })
      .first()
      .waitFor({ state: 'visible' });
  }

  async clickCell(columnIndex, rowIndex) {
    const cell = this._cellByIndexes(columnIndex, rowIndex);
    await cell.click();
  }

  async clickCellByField(field, rowIndex) {
    await this._cellByField(field, rowIndex).click();
  }

  async getCellText(columnIndex, rowIndex) {
    const cell = this._cellByIndexes(columnIndex, rowIndex);
    return (await cell.innerText()).trim();
  }

  async getCellTextByField(field, rowIndex) {
    return (await this._cellByField(field, rowIndex).innerText()).trim();
  }

  async getCellTextByColumnName(columnName, rowIndex) {
    const columnIndex = await this._columnIndexByName(columnName);
    return this.getCellText(columnIndex, rowIndex);
  }

  async getColumnTextsByName(columnName) {
    const columnIndex = await this._columnIndexByName(columnName);
    const rowCount = await this.countRows();
    const values = [];
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      values.push(await this.getCellText(columnIndex, rowIndex));
    }
    return values;
  }

  async getTopVisibleColumnTextsByName(columnName, count) {
    const desiredCount = Number(count) || 0;
    if (desiredCount <= 0) {
      return [];
    }
    const visibleRows = await this.countVisibleRows();
    if (visibleRows < desiredCount) {
      return [];
    }
    const values = [];
    for (let rowIndex = 0; rowIndex < desiredCount; rowIndex += 1) {
      values.push(await this.getCellTextByColumnName(columnName, rowIndex));
    }
    return values;
  }

  async getTopActiveColumnTextsByName(columnName, count) {
    const desiredCount = Number(count) || 0;
    if (desiredCount <= 0) {
      return [];
    }
    const normalizedName = this._normalizeColumnTitle(columnName);
    return this.page.evaluate(
      ({ normalizedName: targetColumnName, desiredCount: limit }) => {
        const tables = globalThis?.Tabulator?.findTable?.('#myGrid') || [];
        const table = tables[0];
        if (!table) {
          return [];
        }

        const normalize = (value) =>
          String(value || '')
            .split('\n')[0]
            .trim();

        const columnDef = (table.getColumnDefinitions?.() || []).find((definition) => {
          const byTitle = normalize(definition?.title) === targetColumnName;
          const byField = normalize(definition?.field) === targetColumnName;
          return byTitle || byField;
        });
        if (!columnDef?.field) {
          return [];
        }

        const rows = table.getData?.('active') || [];
        return rows.slice(0, limit).map((row) => String(row?.[columnDef.field] ?? '').trim());
      },
      { normalizedName, desiredCount }
    );
  }

  async clickCellByColumnName(columnName, rowIndex) {
    const columnIndex = await this._columnIndexByName(columnName);
    await this.clickCell(columnIndex, rowIndex);
  }

  async selectRow(rowIndex) {
    await this.clickCell(0, rowIndex);
  }

  async selectRows(rowIndexes) {
    if (!rowIndexes || rowIndexes.length === 0) {
      return;
    }
    await this.selectRow(rowIndexes[0]);
    for (let i = 1; i < rowIndexes.length; i += 1) {
      await this.rows.nth(rowIndexes[i]).click({ modifiers: ['Control'] });
    }
  }

  async setCellTextByField(field, rowIndex, value) {
    const cell = this._cellByField(field, rowIndex);
    await cell.click();
    await cell.click();

    let editor = cell.locator('input,textarea,select').first();
    if ((await editor.count()) === 0) {
      editor = this.gridRoot
        .locator('.tabulator-editing input, .tabulator-editing textarea, .tabulator-editing select')
        .first();
    }

    await editor.fill(String(value));
    await editor.press('Enter');
    await this._waitForCellValue(cell, value);
  }

  async setCellTextByColumnName(columnName, rowIndex, value) {
    const columnIndex = await this._columnIndexByName(columnName);
    const cell = this._cellByIndexes(columnIndex, rowIndex);
    await cell.click();
    await cell.click();
    let editor = cell.locator('input,textarea,select').first();
    if ((await editor.count()) === 0) {
      editor = this.gridRoot
        .locator('.tabulator-editing input, .tabulator-editing textarea, .tabulator-editing select')
        .first();
    }
    await editor.fill(String(value));
    await editor.press('Enter');
    await this._waitForCellValue(cell, value);
  }

  async doubleClickCellByColumnName(columnName, rowIndex) {
    const columnIndex = await this._columnIndexByName(columnName);
    await this._cellByIndexes(columnIndex, rowIndex).dblclick();
  }

  _cellByIndexes(columnIndex, rowIndex) {
    return this.rows.nth(rowIndex).locator('.tabulator-cell').nth(columnIndex);
  }

  _cellByField(field, rowIndex) {
    return this.rows.nth(rowIndex).locator(`.tabulator-cell[tabulator-field="${field}"]`);
  }

  async _columnIndexByName(columnName) {
    const expected = this._normalizeColumnTitle(columnName);
    const totalColumns = await this.headerTitles.count();
    for (let index = 0; index < totalColumns; index += 1) {
      const title = this._normalizeColumnTitle(await this.headerTitles.nth(index).innerText());
      if (title === expected) {
        return index;
      }
    }

    throw new Error(`Column "${columnName}" was not found in Tabulator header.`);
  }

  _normalizeColumnTitle(rawText) {
    return String(rawText || '')
      .split('\n')[0]
      .trim();
  }

  async _waitForCellValue(cell, value) {
    await expect.poll(async () => (await cell.innerText()).trim()).toBe(String(value));
  }
}

module.exports = { GridRendererComponent };
