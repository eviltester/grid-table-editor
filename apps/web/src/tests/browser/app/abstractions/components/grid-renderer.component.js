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
    await expect(this.gridRoot.locator('.tabulator-col-title').filter({ hasText: columnName }).first()).toBeVisible();
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
    const columnIndex = await this._columnIndexByName(columnName);
    return this.gridRoot.evaluate(
      (root, { targetColumnIndex, limit }) => {
        const rowEls = Array.from(root.querySelectorAll('.tabulator-row')).filter((row) => row.offsetParent !== null);
        if (rowEls.length < limit) {
          return [];
        }
        return rowEls.slice(0, limit).map((row) => {
          const cell = row.querySelectorAll('.tabulator-cell')[targetColumnIndex];
          return String(cell?.textContent ?? '').trim();
        });
      },
      { targetColumnIndex: columnIndex, limit: desiredCount }
    );
  }

  async getTopActiveColumnTextsByName(columnName, count) {
    const desiredCount = Number(count) || 0;
    if (desiredCount <= 0) {
      return [];
    }
    const normalizedName = this._normalizeColumnTitle(columnName);
    return this.gridRoot.evaluate(
      (root, { normalizedName: targetColumnName, desiredCount: limit }) => {
        const tableFromRoot = root?.__tabulator;
        const tableFromGlobal = globalThis?.Tabulator?.findTable?.('#myGrid')?.[0];
        const table = tableFromRoot || tableFromGlobal;
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

  async getActiveRowCount() {
    return this.gridRoot.evaluate((root) => {
      const tableFromRoot = root?.__tabulator;
      const tableFromGlobal = globalThis?.Tabulator?.findTable?.('#myGrid')?.[0];
      const table = tableFromRoot || tableFromGlobal;
      if (!table) {
        return 0;
      }
      const rows = table.getData?.('active') || [];
      return Array.isArray(rows) ? rows.length : 0;
    });
  }

  async getActiveColumnTextsByName(columnName, count) {
    const desiredCount = Number(count) || 0;
    if (desiredCount <= 0) {
      return [];
    }
    return this.getTopActiveColumnTextsByName(columnName, desiredCount);
  }

  async getActiveTableSnapshot(columnName, sampleSize = 3) {
    const desiredSampleSize = Math.max(0, Number(sampleSize) || 0);
    const activeRowCount = await this.getActiveRowCount();
    const topValues =
      desiredSampleSize > 0 && columnName ? await this.getActiveColumnTextsByName(columnName, desiredSampleSize) : [];
    return { activeRowCount, topValues };
  }

  async waitForGridSettle({
    columnName,
    sampleSize = 3,
    stablePolls = 3,
    stableForMs = 800,
    timeoutMs = 5000,
    pollIntervalMs = 75,
  } = {}) {
    const requiredStablePolls = Math.max(2, Number(stablePolls) || 2);
    const desiredSampleSize = Math.max(0, Number(sampleSize) || 0);
    const requiredStableForMs = Math.max(0, Number(stableForMs) || 0);
    let stableCount = 0;
    let lastSignature = '';
    let stableSince = 0;

    await expect
      .poll(
        async () => {
          const now = Date.now();
          const snapshot = await this.getActiveTableSnapshot(columnName, desiredSampleSize);
          const signature = JSON.stringify(snapshot);
          if (signature === lastSignature) {
            stableCount += 1;
          } else {
            stableCount = 1;
            lastSignature = signature;
            stableSince = now;
          }
          const stableDuration = stableSince > 0 ? now - stableSince : 0;
          return stableCount >= requiredStablePolls && stableDuration >= requiredStableForMs;
        },
        { timeout: timeoutMs, intervals: [pollIntervalMs] }
      )
      .toBe(true);

    return this.getActiveTableSnapshot(columnName, desiredSampleSize);
  }

  async clickCellByColumnName(columnName, rowIndex) {
    const columnIndex = await this._columnIndexByName(columnName);
    await this.clickCell(columnIndex, rowIndex);
  }

  async selectRow(rowIndex) {
    await this.rows.nth(rowIndex).click();
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
