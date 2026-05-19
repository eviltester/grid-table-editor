import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
/*
    A wrapper for AG Grid that makes it easier to add new columns
    and perform high level operations with the grid that we need
    for editing the grid.

    GridExtension would be an interface
*/
class GridExtensionAgGrid {
  constructor(gridApi) {
    this.gridApi = gridApi;
    this._gridChangedCallbacks = new Set();
    this.cellRendererText = (params) => {
      let val = params.value;
      if (val && val.replaceAll) {
        val = params.value?.replaceAll('<', '&lt;')?.replaceAll('>', '&gt;');
      }
      return `<div style='word-break:normal;line-height: normal'><p>${val}</p></div>`;
    };
  }

  clearGrid() {
    const columnDefs = [
      {
        headerName: '~rename-me',
        field: 'column1',
      },
    ];
    this.gridApi.setGridOption('columnDefs', columnDefs);
    this.gridApi.setGridOption('rowData', []);
    this._notifyGridChanged();
  }

  clearFilters() {
    this.gridApi.setGridOption('quickFilterText', null);
    this.gridApi.setFilterModel(null);
  }

  clearSort() {
    if (typeof this.gridApi.applyColumnState === 'function') {
      this.gridApi.applyColumnState({
        defaultState: { sort: null },
      });
      return;
    }

    if (typeof this.gridApi.setSortModel === 'function') {
      this.gridApi.setSortModel(null);
    }
  }

  filterText(text) {
    this.gridApi.setGridOption('quickFilterText', text);
  }

  getNextFieldNumber() {
    const columnDefs = this.gridApi.getColumnDefs();
    let largestNumber = 0;
    columnDefs.forEach((column) => {
      let fieldName = column.field;
      let fieldNumber = Number.parseInt(fieldName.replace('column', ''));
      if (fieldNumber > largestNumber) {
        largestNumber = fieldNumber;
      }
    });
    return largestNumber + 1;
  }

  getNewCol(named, fieldId) {
    let newCol = {};
    newCol.headerName = named;
    if (fieldId === undefined) {
      fieldId = this.getNextFieldNumber();
    }
    newCol.field = 'column' + fieldId;
    newCol.cellRenderer = this.cellRendererText;
    return newCol;
  }

  // given an array of String column names, set the grid to have those columns
  createColumns(columnNames, { notify = true } = {}) {
    let colDefs = [];
    let fieldId = this.getNextFieldNumber();
    columnNames.forEach((column) => {
      let newCol = this.getNewCol(column, fieldId);
      colDefs.push(newCol);
      fieldId++;
    });
    this.gridApi.setGridOption('columnDefs', colDefs);
    var fieldNames = colDefs.map((colDef) => colDef.field);
    this.addFieldsToData(fieldNames, '');
    if (notify) {
      this._notifyGridChanged();
    }
  }

  addFieldsToData(fieldNames, defaultValue) {
    fieldNames.forEach((fieldName) => {
      this.addFieldToData(fieldName, defaultValue);
    });
  }

  addFieldToData(fieldName, defaultValue) {
    this.gridApi.forEachNode((node) => {
      node.setDataValue(fieldName, defaultValue);
    });
  }

  duplicateColumn(position, id, colTitle) {
    this.addNeighbourColumnId(position, id, colTitle);

    let colDefsHunt = this.gridApi.getColumnDefs();
    let colDataToCopy;
    let destinationCol;

    colDefsHunt.forEach((col) => {
      if (col.headerName == colTitle) {
        destinationCol = col;
      }
      if (col.colId == id) {
        colDataToCopy = col;
      }
    });

    this.gridApi.forEachNode((node) => {
      node.setDataValue(destinationCol.field, node.data[colDataToCopy.field]);
    });
  }

  appendColumnToGrid(colTitle) {
    let colDefs = this.gridApi.getColumnDefs();

    let newCol = this.getNewCol(colTitle);
    // add to right
    colDefs.push(newCol);

    this.gridApi.setGridOption('columnDefs', colDefs);

    this.addFieldToData(newCol.field, '');
    this._notifyGridChanged();

    return newCol;
  }

  moveColumnTo(position, id, columnToMove) {
    // need to use column-state to set the order
    // https://www.ag-grid.com/javascript-grid/column-state/

    let columnState = this.gridApi.getColumnState();
    let newColumnStates = [];
    let currentColumnState;
    let newColumnState;

    // find new columnId
    let colDefsHunt = this.gridApi.getColumnDefs();
    let newColId;
    colDefsHunt.forEach((col) => {
      if (col.field == columnToMove.field) {
        newColId = col.colId;
      }
    });

    // find main column state
    columnState.forEach((col) => {
      if (col.colId == id) {
        currentColumnState = col;
      }
    });

    // find new column id
    columnState.forEach((col) => {
      if (col.colId == newColId) {
        newColumnState = col;
      }
    });

    // shuffle by creating a new state
    columnState.forEach((colDef) => {
      if (colDef.colId == id) {
        if (position < 0) {
          newColumnStates.push(newColumnState);
          newColumnStates.push(currentColumnState);
        } else {
          newColumnStates.push(currentColumnState);
          newColumnStates.push(newColumnState);
        }
      } else {
        if (colDef.colId != newColId) {
          newColumnStates.push(colDef);
        }
      }
    });

    this.gridApi.applyColumnState({ state: newColumnStates, applyOrder: true });
  }

  addNeighbourColumnId(position, id, colTitle) {
    if (colTitle === undefined || colTitle === '' || colTitle.length == 0) return;

    let newCol = this.appendColumnToGrid(colTitle);
    this.moveColumnTo(position, id, newCol);
  }

  deleteColumnId(id) {
    let colDefs = this.gridApi.getColumnDefs();
    let newColDefs = [];

    colDefs.forEach((colDef) => {
      if (colDef.colId != id) {
        newColDefs.push(colDef);
      }
    });

    this.gridApi.setGridOption('columnDefs', newColDefs);
    this._notifyGridChanged();

    // TODO : consider deleting all the data as well
  }

  getNumberOfColumns() {
    return this.gridApi.getColumnDefs().length;
  }

  getNumberOfSelectedRows() {
    return this.gridApi.getSelectedNodes().length;
  }

  getRowCount() {
    if (typeof this.gridApi.getDisplayedRowCount === 'function') {
      return this.gridApi.getDisplayedRowCount();
    }

    let rowCount = 0;
    this.gridApi.forEachNodeAfterFilterAndSort(() => {
      rowCount++;
    });
    return rowCount;
  }

  getSelectedRowIndexes() {
    const selectedNodes = this.gridApi.getSelectedNodes();
    return selectedNodes
      .map((node) => node?.rowIndex)
      .filter((rowIndex) => Number.isFinite(rowIndex) && rowIndex >= 0)
      .sort((a, b) => a - b);
  }

  async applyGeneratedSchemaAmend({ mode, desiredRowCount, schemaHeaders, generateRow, selectedRowIndexes = [] } = {}) {
    if (!Array.isArray(schemaHeaders) || schemaHeaders.length === 0 || typeof generateRow !== 'function') {
      return { noSelectedRows: mode === 'amend-selected', amendedRows: 0 };
    }

    const desiredCount = Math.max(0, Number.parseInt(desiredRowCount ?? 0, 10) || 0);
    const headerToField = this._ensureColumnsForHeaders(schemaHeaders);

    let targetNodes = [];
    if (mode === 'amend-selected') {
      const sortedSelected = [
        ...new Set(
          (Array.isArray(selectedRowIndexes) ? selectedRowIndexes : [])
            .filter((value) => Number.isFinite(value))
            .map((value) => Math.floor(value))
            .filter((value) => value >= 0)
        ),
      ].sort((a, b) => a - b);

      if (sortedSelected.length === 0) {
        return { noSelectedRows: true, amendedRows: 0 };
      }

      const rowsToAmend = Math.min(desiredCount, sortedSelected.length);
      for (let index = 0; index < rowsToAmend; index++) {
        const node = this._getDisplayedRowNodeAt(sortedSelected[index]);
        if (node) {
          targetNodes.push(node);
        }
      }
    } else {
      const currentRowCount = this.getRowCount();
      const rowsToAppend = Math.max(0, desiredCount - currentRowCount);
      if (rowsToAppend > 0) {
        this._appendBlankRows(rowsToAppend);
      }

      for (let index = 0; index < desiredCount; index++) {
        const node = this._getDisplayedRowNodeAt(index);
        if (node) {
          targetNodes.push(node);
        }
      }
    }

    for (let targetIndex = 0; targetIndex < targetNodes.length; targetIndex++) {
      const node = targetNodes[targetIndex];
      const generated = generateRow();
      for (let schemaIndex = 0; schemaIndex < schemaHeaders.length; schemaIndex++) {
        const header = schemaHeaders[schemaIndex];
        const field = headerToField[header];
        if (!field) {
          continue;
        }
        const value = generated?.[schemaIndex];
        node.setDataValue(field, value === undefined || value === null ? '' : String(value));
      }
    }

    this._notifyGridChanged();
    return { noSelectedRows: false, amendedRows: targetNodes.length };
  }

  getColumnDef(id) {
    let colDefs = this.gridApi.getColumnDefs();
    for (let colDef of colDefs) {
      if (colDef.colId == id) {
        return colDef;
      }
    }
  }

  nameAlreadyExists(name) {
    var colDefs = this.gridApi.getColumnDefs();
    for (const colDef of colDefs) {
      if (colDef.headerName === name) {
        return true;
      }
    }
    return false;
  }

  renameColId(id, name) {
    var colDefs = this.gridApi.getColumnDefs();
    var editColDef;
    colDefs.forEach((colDef) => {
      if (colDef.colId == id) {
        editColDef = colDef;
      }
    });
    editColDef.headerName = name;
    this.gridApi.setGridOption('columnDefs', colDefs);
    this._notifyGridChanged();
  }

  deleteSelectedRows() {
    this.gridApi.applyTransaction({ remove: this.gridApi.getSelectedRows() });
    this._notifyGridChanged();
  }

  getBlankRowData() {
    var colDefs = this.gridApi.getColumnDefs();
    var newRowObject = {};
    colDefs.forEach((colDef) => {
      newRowObject[colDef.field] = '';
    });
    return newRowObject;
  }

  addRow() {
    this.gridApi.applyTransaction({ add: [this.getBlankRowData()] });
    this._notifyGridChanged();
  }

  addRowsRelativeToSelection(position) {
    // -1 above, 1 below
    var rowsToAdd = this.gridApi.getSelectedNodes();

    var positionIndexToAddAt = 0;

    if (rowsToAdd.length == 0) {
      if (this.gridApi.getDisplayedRowCount() == 0 || position < 0) {
        rowsToAdd = [{ rowIndex: 0 }];
      } else {
        rowsToAdd = [{ rowIndex: this.gridApi.getDisplayedRowCount() }];
      }
    }

    if (position < 0) {
      positionIndexToAddAt = this.getMinRowIndex(rowsToAdd);
    } else {
      positionIndexToAddAt = this.getMaxRowIndex(rowsToAdd) + position;
    }

    if (positionIndexToAddAt < 0) {
      positionIndexToAddAt = 0;
    }

    var objectsToAdd = [];
    var numberOfRowsToAdd = rowsToAdd.length;
    for (var objectCountToAdd = 0; objectCountToAdd < numberOfRowsToAdd; objectCountToAdd++) {
      objectsToAdd.push(this.getBlankRowData());
    }

    this.gridApi.applyTransaction({ add: objectsToAdd, addIndex: positionIndexToAddAt });
    this._notifyGridChanged();
  }

  // calculate the max row index from a selection of rows
  getMaxRowIndex(rowNodes) {
    var maxIndex = 0;
    rowNodes.forEach((node) => {
      if (node.rowIndex > maxIndex) {
        maxIndex = node.rowIndex;
      }
    });
    return maxIndex;
  }

  // calculate the first row index from a selection of rows
  getMinRowIndex(rowNodes) {
    var minIndex = rowNodes[0].rowIndex;
    rowNodes.forEach((node) => {
      if (node.rowIndex < minIndex) {
        minIndex = node.rowIndex;
      }
    });
    return minIndex;
  }

  /*
        Export grid extensions
    */
  // TODO: consider creating a GridBackedGenericDataTable such that it is a generic wrapper
  // then we don't have to copy the data out into a new structure
  getGridAsGenericDataTable(maxRows) {
    let dataTable = new GenericDataTable();
    dataTable.setHeaders(this.gridApi.getColumnDefs().map((col) => col.headerName));

    var fieldnames = this.gridApi.getColumnDefs().map((col) => col.field);
    const rowLimit = this._normaliseRowLimit(maxRows);

    if (
      rowLimit !== undefined &&
      typeof this.gridApi.getDisplayedRowCount === 'function' &&
      typeof this.gridApi.getDisplayedRowAtIndex === 'function'
    ) {
      const totalRows = this.gridApi.getDisplayedRowCount();
      const maxRowsToRead = Math.min(rowLimit, totalRows);
      for (let rowIndex = 0; rowIndex < maxRowsToRead; rowIndex++) {
        const node = this.gridApi.getDisplayedRowAtIndex(rowIndex);
        if (!node) {
          continue;
        }
        dataTable.appendDataRow(this._nodeToRowValues(node, fieldnames));
      }
      return dataTable;
    }

    // since we can filter and sort...
    // if we use forEachNode then it ignores the filter and does not honour the sorting
    let rowsAdded = 0;
    this.gridApi.forEachNodeAfterFilterAndSort((node) => {
      if (rowLimit !== undefined && rowsAdded >= rowLimit) {
        return;
      }
      dataTable.appendDataRow(this._nodeToRowValues(node, fieldnames));
      rowsAdded++;
    });

    return dataTable;
  }

  getHeadersFromGrid() {
    return this.gridApi.getColumnDefs().map((col) => col.headerName);
  }

  /*
        Import Grid Extensions
    */
  setGridFromGenericDataTable(dataTable) {
    if (dataTable.getColumnCount() == 0) {
      // will not create a table with no columns
      // TODO : report errors on screen
    }

    this.createColumns(dataTable.getHeaders(), { notify: false });
    this.gridApi.setGridOption('rowData', []);

    let addRows = [];

    let fieldnames = this.gridApi.getColumnDefs().map((col) => col.field);

    for (let rowIndex = 0; rowIndex < dataTable.getRowCount(); rowIndex++) {
      const rowObject = dataTable.getRowAsObjectUsingHeadings(rowIndex, fieldnames);
      const normalisedRow = {};
      for (const fieldName of fieldnames) {
        const value = rowObject?.[fieldName];
        normalisedRow[fieldName] = value === undefined || value === null ? '' : String(value);
      }
      addRows.push(normalisedRow);
    }

    // TODO : apply transactions incrementally for larger data sets
    this.gridApi.applyTransaction({ add: addRows });
    this._notifyGridChanged();
  }

  onGridChanged(callback) {
    if (typeof callback !== 'function') {
      return () => {};
    }
    this._gridChangedCallbacks.add(callback);
    return () => {
      this._gridChangedCallbacks.delete(callback);
    };
  }

  notifyGridChanged() {
    this._notifyGridChanged();
  }

  _notifyGridChanged() {
    this._gridChangedCallbacks.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.error('Grid change callback failed', error);
      }
    });
  }

  _nodeToRowValues(node, fieldnames) {
    const vals = [];
    for (const propertyid in fieldnames) {
      const property = fieldnames[propertyid];
      const value = node?.data?.[property];
      vals.push(value === undefined || value === null ? '' : String(value));
    }
    return vals;
  }

  _ensureColumnsForHeaders(schemaHeaders) {
    const headerToField = {};
    this.gridApi.getColumnDefs().forEach((definition) => {
      if (definition?.headerName) {
        headerToField[definition.headerName] = definition.field;
      }
    });

    for (let index = 0; index < schemaHeaders.length; index++) {
      const header = schemaHeaders[index];
      if (headerToField[header]) {
        continue;
      }
      const appended = this.appendColumnToGrid(header);
      headerToField[header] = appended?.field;
    }

    return headerToField;
  }

  _appendBlankRows(count) {
    if (count <= 0) {
      return;
    }

    const rows = [];
    for (let index = 0; index < count; index++) {
      rows.push(this.getBlankRowData());
    }
    this.gridApi.applyTransaction({ add: rows });
  }

  _getDisplayedRowNodeAt(index) {
    if (index < 0) {
      return undefined;
    }
    if (typeof this.gridApi.getDisplayedRowAtIndex === 'function') {
      return this.gridApi.getDisplayedRowAtIndex(index);
    }

    let foundNode = undefined;
    let currentIndex = 0;
    this.gridApi.forEachNodeAfterFilterAndSort((node) => {
      if (foundNode) {
        return;
      }
      if (currentIndex === index) {
        foundNode = node;
        return;
      }
      currentIndex++;
    });
    return foundNode;
  }

  _normaliseRowLimit(maxRows) {
    if (typeof maxRows !== 'number' || !Number.isFinite(maxRows)) {
      return undefined;
    }
    return Math.max(0, Math.floor(maxRows));
  }
}

export { GridExtensionAgGrid as GridExtension };
