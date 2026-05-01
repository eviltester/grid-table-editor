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

  async getCellText(columnIndex, rowIndex) {
    const cell = this._cellByIndexes(columnIndex, rowIndex);
    return (await cell.innerText()).trim();
  }

  async getCellTextByColumnName(columnName, rowIndex) {
    const columnIndex = await this._columnIndexByName(columnName);
    return this.getCellText(columnIndex, rowIndex);
  }

  async clickCellByColumnName(columnName, rowIndex) {
    const columnIndex = await this._columnIndexByName(columnName);
    await this.clickCell(columnIndex, rowIndex);
  }

  _cellByIndexes(columnIndex, rowIndex) {
    return this.rows.nth(rowIndex).locator('.tabulator-cell').nth(columnIndex);
  }

  async _columnIndexByName(columnName) {
    const totalColumns = await this.headerTitles.count();
    for (let index = 0; index < totalColumns; index += 1) {
      const title = (await this.headerTitles.nth(index).innerText()).trim();
      if (title.includes(columnName)) {
        return index;
      }
    }

    throw new Error(`Column "${columnName}" was not found in Tabulator header.`);
  }
}

module.exports = { GridRendererComponent };
