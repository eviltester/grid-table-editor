class TabulatorHelper {
  constructor(tabulator) {
    this.tabulator = tabulator;
    this._activeGlobalFilterQuery = '';
  }

  filterAcrossAllColumns(value) {
    const query = String(value ?? '')
      .trim()
      .toLowerCase();

    // If nothing typed, clear all filters
    if (!query) {
      this.tabulator.clearFilter();
      this._activeGlobalFilterQuery = '';
      return;
    }

    this._activeGlobalFilterQuery = query;

    // Custom filter - keep rows where any primitive value contains the query.
    this.tabulator.setFilter((row) => {
      const activeQuery = this._activeGlobalFilterQuery;
      for (const key in row) {
        if (!Object.prototype.hasOwnProperty.call(row, key)) {
          continue;
        }
        const value = row[key];
        if (value === null || value === undefined) {
          continue;
        }
        if (String(value).toLowerCase().includes(activeQuery)) {
          return true;
        }
      }
      return false;
    });
  }

  addRowToBottom(rowToAdd) {
    // add row to bottom of table - false for bottom, true for top
    this.addRow(rowToAdd, false);
  }

  addRowToTop(rowToAdd) {
    // add row to top of table - false for bottom, true for top
    this.addRow(rowToAdd, true);
  }

  addRow(rowToAdd, addToTop) {
    // add row to bottom of table - false for bottom, true for top
    this.tabulator.addData([rowToAdd], addToTop);
  }
}

export { TabulatorHelper as TabulatorHelper };
