import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { TabulatorHelper } from './tabulator-helpers.js';

const AUTO_FIT_ROW_SAMPLE_LIMIT = 500;
/*
    A wrapper for Tabulature to conform to the main abstraction
    that makes it easier to add new columns
    and perform high level operations with the grid that we need
    for editing the grid.

    todo: GridExtension would be an interface so we need to identify all the
    functions which are used externally and all those which are internal
    only - mark internals as _functionName
    todo: then carry do the same on the AG Grid wrapper

*/
class GridExtensionTabulator {
  constructor(tabulator) {
    this.tabulator = tabulator;
    this.tabUtils = new TabulatorHelper(tabulator);
    this._pendingGridMutation = Promise.resolve();

    this._bindSharedGridChangeEventListeners();

    // this.cellRendererText = (params) => {
    //     let val = params.value;
    //     if(val && val.replaceAll){
    //         val = params.value?.replaceAll("<", "&lt;")?.replaceAll(">","&gt;");
    //     }
    //     return `<div style='word-break:normal;line-height: normal'><p>${val}</p></div>`
    // };
  }

  // [x] convert to tabulature
  clearGrid() {
    const columnDefs = [{ title: '~rename-me', field: 'column1' }];
    return this._enqueueGridMutation(() => {
      return Promise.resolve(this.tabulator.setColumns(columnDefs)).then(() => this.tabulator.setData([]));
    }).then(() => {
      this._notifyGridChanged();
    });
  }

  // [x] convert to tabulature
  clearFilters() {
    // true means clear all header filters as well
    this.tabulator.clearFilter(true);
    this.tabUtils.clearGlobalFilterQuery();
    this._notifyGridChanged();
  }

  clearSort() {
    if (typeof this.tabulator.clearSort === 'function') {
      this.tabulator.clearSort();
    }
  }

  sizeColumnsToFit() {
    const columnDefinitions = this.tabulator.getColumnDefinitions?.() || [];
    if (columnDefinitions.length === 0) {
      return;
    }

    const columnsByField = new Map();
    if (typeof this.tabulator.getColumns === 'function') {
      this.tabulator.getColumns().forEach((column) => {
        const definition = column?.getDefinition?.() || {};
        if (definition.field) {
          columnsByField.set(definition.field, column);
        }
      });
    }

    this._runWithoutRedraw(() => {
      columnDefinitions.forEach((definition) => {
        const field = definition?.field;
        if (!field) {
          return;
        }

        const width = this._estimateColumnWidth(field);
        const column = columnsByField.get(field);
        if (typeof column?.setWidth === 'function') {
          column.setWidth(width);
          return;
        }

        if (typeof column?.updateDefinition === 'function') {
          column.updateDefinition({ width });
        }
      });
    });
  }

  // [x] convert to tabulature
  filterText(text) {
    this.tabUtils.filterAcrossAllColumns(text);
    this._notifyGridChanged();
  }

  // [x] convert to tabulature
  getNextFieldNumber() {
    const columnDefs = this.tabulator.getColumnDefinitions();
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

  // [x] convert to tabulature
  getNewCol(named, fieldId) {
    let newCol = {};
    newCol.title = named;
    if (fieldId === undefined) {
      fieldId = this.getNextFieldNumber();
    }
    newCol.field = 'column' + fieldId;
    return newCol;
  }

  // given an array of String column names, set the grid to have those columns
  createColumns(columnNames) {
    let colDefs = [];
    let fieldId = this.getNextFieldNumber();
    columnNames.forEach((column) => {
      let newCol = this.getNewCol(column, fieldId);
      colDefs.push(newCol);
      fieldId++;
    });
    this.tabulator.setColumns(colDefs);
    var fieldNames = colDefs.map((colDef) => colDef.field);
    this._addFieldsToData(fieldNames, '');
    this._notifyGridChanged();
  }

  _addFieldsToData(fieldNames, defaultValue) {
    if (!fieldNames || fieldNames.length === 0) {
      return;
    }

    this._runWithoutRedraw(() => {
      this.tabulator.getRows().forEach((row) => {
        let rowPatch = {};
        fieldNames.forEach((fieldName) => {
          rowPatch[fieldName] = defaultValue;
        });
        row.update(rowPatch);
      });
    });
  }

  _addFieldToData(fieldName, defaultValue) {
    this._addFieldsToData([fieldName], defaultValue);
  }

  // [x] convert to tabulature
  async duplicateColumn(position, columnOrId, colTitle) {
    const column = this._resolveColumn(columnOrId);
    if (!column) {
      return;
    }

    const destinationCol = this.addNeighbourColumn(position, column, colTitle);
    if (!destinationCol) {
      return;
    }

    await this._copyColumnData(column.getDefinition().field, destinationCol.field);
    this._notifyGridChanged();
  }

  appendColumnToGrid(colTitle) {
    let newCol = this.getNewCol(colTitle);
    this.tabulator.addColumn(newCol, false);

    this._addFieldToData(newCol.field, '');
    this._notifyGridChanged();

    return newCol;
  }

  moveColumnTo(position, id, columnToMove) {
    if (!id || !columnToMove) {
      return;
    }

    const moveToAfter = position > 0;
    const resolvedColumn = this._resolveColumn(columnToMove);
    if (!resolvedColumn) {
      return;
    }

    const targetId = this._normaliseId(id);
    resolvedColumn.move(targetId, moveToAfter);
    this._notifyGridChanged();
  }

  // [x] convert to tabulature
  addNeighbourColumn(position, existingColumn, colTitle) {
    if (colTitle === undefined || colTitle === '' || colTitle.length === 0) return;

    const column = this.getNewCol(colTitle);
    const resolvedExistingColumn = this._resolveColumn(existingColumn);
    if (!resolvedExistingColumn) {
      return;
    }

    var addToLeft = true;
    if (position > 0) {
      addToLeft = false;
    }
    this.tabulator.addColumn(column, addToLeft, resolvedExistingColumn);
    this._notifyGridChanged();
    return column;
  }

  addNeighbourColumnId(position, id, colTitle) {
    const existingColumn = this._getColumnById(id);
    this.addNeighbourColumn(position, existingColumn, colTitle);
  }

  // [x] convert to tabulature
  deleteColumn(columnOrId) {
    const column = this._resolveColumn(columnOrId);
    if (!column) {
      return;
    }
    column.delete();
    this._notifyGridChanged();
  }

  deleteColumnId(id) {
    this.deleteColumn(id);
  }

  // [x] convert to tabulature
  getNumberOfColumns() {
    return this.tabulator.getColumnDefinitions().length;
  }

  // [x] convert to tabulature
  getNumberOfSelectedRows() {
    return this.tabulator.getSelectedRows().length;
  }

  getRowCount() {
    const activeDataCount = this._getActiveDataCount();
    if (Number.isFinite(activeDataCount)) {
      return activeDataCount;
    }
    if (typeof this.tabulator.getDataCount === 'function') {
      return this.tabulator.getDataCount();
    }
    return 0;
  }

  getTotalRowCount() {
    if (typeof this.tabulator.getDataCount === 'function') {
      const totalCount = this.tabulator.getDataCount();
      if (Number.isFinite(totalCount)) {
        return totalCount;
      }
    }

    const allRows = typeof this.tabulator.getData === 'function' ? this.tabulator.getData() : undefined;
    return Array.isArray(allRows) ? allRows.length : 0;
  }

  getVisibleRowCount() {
    return this.getRowCount();
  }

  hasActiveFilters() {
    const activeGlobalFilter = String(this.tabUtils?.getActiveGlobalFilterQuery?.() || '').trim();
    if (activeGlobalFilter.length > 0) {
      return true;
    }

    if (typeof this.tabulator.getHeaderFilters === 'function') {
      const headerFilters = this.tabulator.getHeaderFilters();
      const hasHeaderFilters =
        Array.isArray(headerFilters) &&
        headerFilters.some((filter) => {
          if (filter === null || filter === undefined) {
            return false;
          }
          if (typeof filter === 'string') {
            return filter.trim().length > 0;
          }
          if (typeof filter === 'object' && Object.prototype.hasOwnProperty.call(filter, 'value')) {
            return String(filter.value ?? '').trim().length > 0;
          }
          return true;
        });
      if (hasHeaderFilters) {
        return true;
      }
    }

    return false;
  }

  getRowVisibilitySummary() {
    const totalRowCount = this.getTotalRowCount();
    const visibleRowCount = this.getVisibleRowCount();
    const hasActiveFilters = this.hasActiveFilters() || visibleRowCount !== totalRowCount;

    return {
      totalRowCount,
      visibleRowCount,
      hasActiveFilters,
    };
  }

  getSelectedRowIndexes() {
    const selectedRows = this.tabulator.getSelectedRows();
    if (!Array.isArray(selectedRows)) {
      return [];
    }

    const rawPositions = selectedRows
      .map((rowComponent) => {
        if (typeof rowComponent?.getPosition !== 'function') {
          return undefined;
        }
        const rawPosition = rowComponent.getPosition();
        if (!Number.isFinite(rawPosition)) {
          return undefined;
        }
        return Number.parseInt(rawPosition, 10);
      })
      .filter((index) => Number.isFinite(index));

    const isZeroBased = rawPositions.includes(0);
    const selectedIndexes = rawPositions.map((position) => {
      if (isZeroBased) {
        return Math.max(0, position);
      }
      return Math.max(0, position - 1);
    });

    return [...new Set(selectedIndexes)].sort((a, b) => a - b);
  }

  async applyGeneratedSchemaAmend({ mode, desiredRowCount, schemaHeaders, generateRow, selectedRowIndexes = [] } = {}) {
    if (!Array.isArray(schemaHeaders) || schemaHeaders.length === 0 || typeof generateRow !== 'function') {
      return { noSelectedRows: mode === 'amend-selected', amendedRows: 0 };
    }

    const desiredCount = Math.max(0, Number.parseInt(desiredRowCount ?? 0, 10) || 0);
    const headerToField = await this._ensureColumnsForHeaders(schemaHeaders);

    let targetIndexes = [];
    if (mode === 'amend-selected') {
      const selected = Array.isArray(selectedRowIndexes) ? selectedRowIndexes : [];
      const sortedSelected = [
        ...new Set(
          selected
            .filter((value) => Number.isFinite(value))
            .map((value) => Math.floor(value))
            .filter((value) => value >= 0)
        ),
      ].sort((a, b) => a - b);

      if (sortedSelected.length === 0) {
        return { noSelectedRows: true, amendedRows: 0 };
      }
      targetIndexes = sortedSelected.slice(0, Math.min(desiredCount, sortedSelected.length));
    } else {
      const rowCount = this.getRowCount();
      const requiredRows = Math.max(0, desiredCount - rowCount);
      if (requiredRows > 0) {
        await this._appendBlankRows(requiredRows);
      }
    }

    let targetRows = [];
    if (mode === 'amend-selected') {
      targetRows = targetIndexes.map((rowIndex) => this._getActiveRowDataAt(rowIndex)).filter((rowData) => rowData);
    } else {
      targetRows = this._getActiveRowDataSlice(Math.max(0, desiredCount)).filter((rowData) => rowData);
    }

    if (targetRows.length === 0) {
      return { noSelectedRows: false, amendedRows: 0 };
    }

    const maxSchemaColumns = schemaHeaders.length;
    targetRows.forEach((rowData) => {
      const generated = generateRow();
      for (let schemaIndex = 0; schemaIndex < maxSchemaColumns; schemaIndex++) {
        const header = schemaHeaders[schemaIndex];
        const field = headerToField[header];
        if (!field) {
          continue;
        }
        const value = generated?.[schemaIndex];
        rowData[field] = value === undefined || value === null ? '' : String(value);
      }
    });

    this._refreshTableAfterBulkMutation();
    this._notifyGridChanged();

    return { noSelectedRows: false, amendedRows: targetRows.length };
  }

  getColumnDef(id) {
    const colDef = this.tabulator.getColumnDefinitions().find((definition) => {
      return definition.colId === id || definition.field === id || definition.title === id;
    });
    if (!colDef) {
      return undefined;
    }
    return {
      ...colDef,
      colId: colDef.colId || colDef.field,
      headerName: colDef.title,
    };
  }

  // [x] convert to tabulature
  nameAlreadyExists(name) {
    var colDefs = this.tabulator.getColumnDefinitions();
    for (const colDef of colDefs) {
      if (colDef.title === name) {
        return true;
      }
    }
    return false;
  }

  // [x] convert to tabulature
  renameColumn(columnOrId, name) {
    const column = this._resolveColumn(columnOrId);
    if (!column) {
      return;
    }
    column.updateDefinition({ title: name });
    this._notifyGridChanged();
  }

  renameColId(id, name) {
    this.renameColumn(id, name);
  }

  // [x] convert to tabulature
  deleteSelectedRows() {
    const rows = this.tabulator.getSelectedRows();
    this.tabulator.deleteRow(rows);
    this._notifyGridChanged();
  }

  // [x] convert to tabulature
  _getBlankRowData() {
    var colDefs = this.tabulator.getColumnDefinitions();
    var newRowObject = {};
    colDefs.forEach((colDef) => {
      newRowObject[colDef.field] = '';
    });
    return newRowObject;
  }

  // [x] convert to tabulature
  addRow() {
    return Promise.resolve(this.tabUtils.addRowToBottom(this._getBlankRowData())).then(() => {
      this._notifyGridChanged();
    });
  }

  // [x] convert to tabulature
  addRowsRelativeToSelection(position) {
    // -1 above, 1 below
    var selectedRows = this.tabulator.getSelectedRows();

    // if nothing is selected, just call add row above or below
    if (selectedRows.length === 0) {
      // and there are no rows then add to top
      if (this.tabulator.getDataCount() === 0 || position < 0) {
        return Promise.resolve(this.tabUtils.addRowToTop(this._getBlankRowData())).then(() => {
          this._notifyGridChanged();
        });
      } else {
        return Promise.resolve(this.tabUtils.addRowToBottom(this._getBlankRowData())).then(() => {
          this._notifyGridChanged();
        });
      }
    }

    var relativeToRow;
    if (position < 0) {
      relativeToRow = this._getMinRow(selectedRows);
    } else {
      relativeToRow = this._getMaxRow(selectedRows);
    }

    var objectsToAdd = [];
    var numberOfRowsToAdd = selectedRows.length;
    for (let objectCountToAdd = 0; objectCountToAdd < numberOfRowsToAdd; objectCountToAdd++) {
      objectsToAdd.push(this._getBlankRowData());
    }

    var addAbove = true;
    if (position > 0) {
      addAbove = false;
    }
    return Promise.resolve(this.tabulator.addData(objectsToAdd, addAbove, relativeToRow)).then(() => {
      this._notifyGridChanged();
    });
  }

  // calculate the max row from a selection of rows
  _getMaxRow(rowComponents) {
    var maxRow = rowComponents[0];
    rowComponents.forEach((node) => {
      if (node.getPosition() > maxRow.getPosition()) {
        maxRow = node;
      }
    });
    return maxRow;
  }

  // calculate the first row from a selection of rows
  _getMinRow(rowComponents) {
    var minRow = rowComponents[0];
    rowComponents.forEach((node) => {
      if (node.getPosition() < minRow.getPosition()) {
        minRow = node;
      }
    });
    return minRow;
  }

  /*
        Export grid extensions
    */
  // TODO: consider creating a GridBackedGenericDataTable such that it is a generic wrapper
  // then we don't have to copy the data out into a new structure
  // [x] convert to tabulature
  getGridAsGenericDataTable(maxRows) {
    let dataTable = new GenericDataTable();
    const columnDefs = this.tabulator.getColumnDefinitions();
    dataTable.setHeaders(columnDefs.map((col) => col.title));

    const fieldnames = columnDefs.map((col) => col.field);
    const rowLimit = this._normaliseRowLimit(maxRows);
    if (rowLimit !== undefined) {
      // Preview/export-limited path: avoid materialising full active row data.
      const limitedRows = this._getLimitedActiveRowData(rowLimit);
      const rows = new Array(limitedRows.length);
      for (let rowIndex = 0; rowIndex < limitedRows.length; rowIndex++) {
        rows[rowIndex] = this._rowObjectToValues(limitedRows[rowIndex], fieldnames);
      }
      dataTable.rows = rows;
      return dataTable;
    }

    const activeRows = this.tabulator.getData('active');
    const rows = new Array(activeRows.length);
    for (let rowIndex = 0; rowIndex < activeRows.length; rowIndex++) {
      rows[rowIndex] = this._rowObjectToValues(activeRows[rowIndex], fieldnames);
    }
    dataTable.rows = rows;

    return dataTable;
  }

  async getGridAsGenericDataTableAsync(maxRows, progressCallback) {
    const dataTable = new GenericDataTable();
    const columnDefs = this.tabulator.getColumnDefinitions();
    dataTable.setHeaders(columnDefs.map((col) => col.title));

    const fieldnames = columnDefs.map((col) => col.field);
    const rowLimit = this._normaliseRowLimit(maxRows);
    const sourceRows =
      rowLimit !== undefined ? this._getLimitedActiveRowData(rowLimit) : this.tabulator.getData('active');

    const totalRows = Array.isArray(sourceRows) ? sourceRows.length : 0;
    const rows = new Array(totalRows);
    const batchSize = 200;

    progressCallback?.(`Reading grid data... 0/${totalRows} rows (0%)`);

    for (let start = 0; start < totalRows; start += batchSize) {
      const end = Math.min(start + batchSize, totalRows);
      for (let rowIndex = start; rowIndex < end; rowIndex++) {
        rows[rowIndex] = this._rowObjectToValues(sourceRows[rowIndex], fieldnames);
      }

      const percent = Math.round((end / Math.max(totalRows, 1)) * 100);
      progressCallback?.(`Reading grid data... ${end}/${totalRows} rows (${percent}%)`);

      if (end < totalRows) {
        await this._yieldToBrowser();
      }
    }

    dataTable.rows = rows;
    return dataTable;
  }

  _getRowAsGenericDataValsArray(aRow, fieldnames) {
    var vals = [];
    for (const propertyid in fieldnames) {
      const property = fieldnames[propertyid];
      const value = aRow?.[property];
      vals.push(value === undefined || value === null ? '' : String(value));
    }
    return vals;
  }

  // [x] convert to tabulature
  getHeadersFromGrid() {
    return this.tabulator.getColumnDefinitions().map((col) => col.title);
  }

  /*
        Import Grid Extensions
    */
  // [x] convert to tabulature
  setGridFromGenericDataTable(dataTable) {
    if (dataTable.getColumnCount() === 0) {
      // will not create a table with no columns
      // TODO : report errors on screen
    }

    const headers = dataTable.getHeaders();

    // Rebuild columns deterministically on import so header titles are preserved
    // and field ids start from column1 each time (parity with AG Grid import flow).
    const columnDefs = headers.map((header, index) => {
      const field = `column${index + 1}`;
      return { title: header, field };
    });

    const rowCount = dataTable.getRowCount();
    const addRows = new Array(rowCount);
    let fieldnames = columnDefs.map((col) => col.field);
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      const rowObject = dataTable.getRowAsObjectUsingHeadings(rowIndex, fieldnames);
      const normalisedRow = {};
      for (const fieldName of fieldnames) {
        const value = rowObject?.[fieldName];
        normalisedRow[fieldName] = value === undefined || value === null ? '' : String(value);
      }
      addRows[rowIndex] = normalisedRow;
    }

    // Tabulator column resets are async; chain operations to avoid fallback headers.
    return this._enqueueGridMutation(async () => {
      await Promise.resolve(this.tabulator.setColumns(columnDefs));
      await Promise.resolve(this._setBulkData(addRows));

      this._applyHeaderTitles(headers);
      await this._autoFitFirstColumn();
      this._notifyGridChanged();
    });

    // TODO : apply transactions incrementally for larger data sets
    //this.tabulator.applyTransaction({ add: addRows });
  }

  _applyHeaderTitles(headers) {
    const columns = this.tabulator.getColumns();
    this._runWithoutRedraw(() => {
      columns.forEach((column, index) => {
        const header = headers[index];
        if (header === undefined) {
          return;
        }

        const definition = column.getDefinition ? column.getDefinition() : {};
        if (definition.title === header) {
          return;
        }

        column.updateDefinition({ title: header });
      });
    });
  }

  _runWithoutRedraw(callback) {
    if (typeof callback !== 'function') {
      return;
    }

    const supportsRedrawControl =
      typeof this.tabulator.blockRedraw === 'function' && typeof this.tabulator.restoreRedraw === 'function';

    if (!supportsRedrawControl) {
      callback();
      return;
    }

    this.tabulator.blockRedraw();
    try {
      callback();
    } finally {
      this.tabulator.restoreRedraw();
    }
  }

  async _copyColumnData(sourceFieldName, destinationFieldName) {
    const rowComponents = typeof this.tabulator.getRows === 'function' ? this.tabulator.getRows() : null;
    if (Array.isArray(rowComponents) && rowComponents.length > 0) {
      const updates = [];
      this._runWithoutRedraw(() => {
        rowComponents.forEach((row) => {
          const sourceValue = row.getData?.()[sourceFieldName];
          updates.push(Promise.resolve(row.update({ [destinationFieldName]: sourceValue })));
        });
      });
      await Promise.all(updates);
      return;
    }

    const allData = typeof this.tabulator.getData === 'function' ? this.tabulator.getData() : null;
    if (Array.isArray(allData) && allData.length > 0) {
      const updatedRows = allData.map((rowData) => ({
        ...rowData,
        [destinationFieldName]: rowData[sourceFieldName],
      }));
      await Promise.resolve(this._setBulkData(updatedRows));
    }
  }

  _enqueueGridMutation(mutationFn) {
    if (typeof mutationFn !== 'function') {
      return this._pendingGridMutation;
    }

    this._pendingGridMutation = this._pendingGridMutation.catch(() => undefined).then(() => mutationFn());

    return this._pendingGridMutation;
  }

  _yieldToBrowser() {
    return new Promise((resolve) => setTimeout(resolve, 0));
  }

  _setBulkData(rows) {
    const setResult =
      typeof this.tabulator.replaceData === 'function'
        ? this.tabulator.replaceData(rows)
        : this.tabulator.setData(rows);
    return Promise.resolve(setResult).then(() => {
      this._reapplyActiveFiltersAfterBulkMutation();
    });
  }

  async _autoFitFirstColumn() {
    if (typeof this.tabulator.getColumnDefinitions !== 'function') {
      return;
    }

    const columnDefinitions = this.tabulator.getColumnDefinitions();
    const firstColumnField = columnDefinitions?.[0]?.field;
    if (!firstColumnField) {
      return;
    }

    let firstColumn = undefined;
    if (typeof this.tabulator.getColumn === 'function') {
      firstColumn = this.tabulator.getColumn(firstColumnField);
    }

    if (!firstColumn && typeof this.tabulator.getColumns === 'function') {
      firstColumn = this.tabulator.getColumns()?.[0];
    }

    if (!firstColumn) {
      return;
    }

    await this._yieldToBrowser();
    const estimatedWidth = this._estimateFirstColumnWidth(firstColumnField);

    if (typeof firstColumn.setWidth === 'function') {
      firstColumn.setWidth(estimatedWidth);
      return;
    }

    if (typeof firstColumn.updateDefinition === 'function') {
      await Promise.resolve(firstColumn.updateDefinition({ width: estimatedWidth }));
    }
  }

  _estimateFirstColumnWidth(firstColumnField) {
    return this._estimateColumnWidth(firstColumnField);
  }

  _estimateColumnWidth(fieldName) {
    const columnDefinitions = this.tabulator.getColumnDefinitions?.() || [];
    const columnDefinition = columnDefinitions.find((definition) => definition.field === fieldName) || {};
    const titleLength = String(columnDefinition.title || '').length;

    const activeRows = this._getLimitedActiveRowData(AUTO_FIT_ROW_SAMPLE_LIMIT);
    let maxTextLength = titleLength;
    if (Array.isArray(activeRows)) {
      for (let rowIndex = 0; rowIndex < activeRows.length; rowIndex++) {
        const value = activeRows[rowIndex]?.[fieldName];
        const valueLength = String(value ?? '').length;
        if (valueLength > maxTextLength) {
          maxTextLength = valueLength;
        }
      }
    }

    // Approximate width: average monospace-ish character size + padding.
    const estimatedWidth = Math.ceil(maxTextLength * 8 + 32);
    return Math.max(120, Math.min(estimatedWidth, 900));
  }

  _getLimitedActiveRowData(limit) {
    if (limit <= 0) {
      return [];
    }

    // Prefer row components for limited preview because it avoids full data cloning.
    if (typeof this.tabulator.getRows === 'function') {
      const rowComponents = this.tabulator.getRows('active');
      if (Array.isArray(rowComponents)) {
        const maxRows = Math.min(limit, rowComponents.length);
        const rows = new Array(maxRows);
        for (let index = 0; index < maxRows; index++) {
          const component = rowComponents[index];
          rows[index] = typeof component?.getData === 'function' ? component.getData() : {};
        }
        return rows;
      }
    }

    const activeRows = this.tabulator.getData('active');
    return Array.isArray(activeRows) ? activeRows.slice(0, limit) : [];
  }

  _rowObjectToValues(sourceRow, fieldnames) {
    const vals = new Array(fieldnames.length);
    for (let colIndex = 0; colIndex < fieldnames.length; colIndex++) {
      const value = sourceRow?.[fieldnames[colIndex]];
      vals[colIndex] = value === undefined || value === null ? '' : String(value);
    }
    return vals;
  }

  async _ensureColumnsForHeaders(schemaHeaders) {
    const headerToField = {};
    const existingDefinitions = this.tabulator.getColumnDefinitions();
    existingDefinitions.forEach((definition) => {
      if (definition?.title) {
        headerToField[definition.title] = definition.field;
      }
    });

    const missingHeaders = [];
    for (let index = 0; index < schemaHeaders.length; index++) {
      const header = schemaHeaders[index];
      if (headerToField[header]) {
        continue;
      }
      missingHeaders.push(header);
    }

    if (missingHeaders.length === 0) {
      return headerToField;
    }

    const nextFieldNumber = this.getNextFieldNumber();
    const appendedDefinitions = missingHeaders.map((header, index) => {
      const newColumn = this.getNewCol(header, nextFieldNumber + index);
      headerToField[header] = newColumn.field;
      return newColumn;
    });

    await Promise.resolve(this.tabulator.setColumns([...existingDefinitions, ...appendedDefinitions]));
    await this._addFieldsToExistingRowsBulk(
      appendedDefinitions.map((definition) => definition.field),
      ''
    );

    return headerToField;
  }

  async _appendBlankRows(count) {
    if (count <= 0) {
      return;
    }
    const newRows = [];
    for (let index = 0; index < count; index++) {
      newRows.push(this._getBlankRowData());
    }
    await Promise.resolve(this.tabulator.addData(newRows, false));
  }

  _normaliseId(idOrColumn) {
    if (typeof idOrColumn === 'string') {
      return idOrColumn;
    }
    if (idOrColumn?.getDefinition) {
      const definition = idOrColumn.getDefinition();
      return definition.colId || definition.field || definition.title;
    }
    return undefined;
  }

  _getColumnById(id) {
    const normalisedId = this._normaliseId(id);
    return this.tabulator.getColumns().find((column) => {
      const definition = column.getDefinition();
      return (
        definition.colId === normalisedId || definition.field === normalisedId || definition.title === normalisedId
      );
    });
  }

  _resolveColumn(columnOrId) {
    if (columnOrId?.getDefinition) {
      return columnOrId;
    }
    return this._getColumnById(columnOrId);
  }

  _normaliseRowLimit(maxRows) {
    if (typeof maxRows !== 'number' || !Number.isFinite(maxRows)) {
      return undefined;
    }
    return Math.max(0, Math.floor(maxRows));
  }

  _getActiveDataCount() {
    if (typeof this.tabulator.getDataCount === 'function') {
      const activeCount = this.tabulator.getDataCount('active');
      if (Number.isFinite(activeCount)) {
        return activeCount;
      }
    }

    const activeRows = this.tabulator?.rowManager?.activeRows;
    if (Array.isArray(activeRows)) {
      return activeRows.length;
    }

    return undefined;
  }

  _getActiveRowComponentAt(index) {
    if (index < 0) {
      return undefined;
    }

    const activeRows = this.tabulator?.rowManager?.activeRows;
    if (Array.isArray(activeRows) && activeRows[index]) {
      const row = activeRows[index];
      if (typeof row.getComponent === 'function') {
        return row.getComponent();
      }
      return row;
    }

    if (typeof this.tabulator.getRows === 'function') {
      const activeRowComponents = this.tabulator.getRows('active');
      if (Array.isArray(activeRowComponents)) {
        return activeRowComponents[index];
      }
    }

    return undefined;
  }

  _getActiveRowComponentsSlice(limit) {
    if (limit <= 0) {
      return [];
    }

    const activeRows = this.tabulator?.rowManager?.activeRows;
    if (Array.isArray(activeRows)) {
      return activeRows
        .slice(0, limit)
        .map((row) => (typeof row?.getComponent === 'function' ? row.getComponent() : row))
        .filter(Boolean);
    }

    if (typeof this.tabulator.getRows === 'function') {
      const activeRowComponents = this.tabulator.getRows('active');
      if (Array.isArray(activeRowComponents)) {
        return activeRowComponents.slice(0, limit);
      }
    }

    return [];
  }

  async _addFieldsToExistingRowsBulk(fieldNames, defaultValue) {
    if (!Array.isArray(fieldNames) || fieldNames.length === 0) {
      return;
    }

    const allData = typeof this.tabulator.getData === 'function' ? this.tabulator.getData() : undefined;
    if (Array.isArray(allData)) {
      for (let rowIndex = 0; rowIndex < allData.length; rowIndex++) {
        const rowData = allData[rowIndex];
        for (let fieldIndex = 0; fieldIndex < fieldNames.length; fieldIndex++) {
          rowData[fieldNames[fieldIndex]] = defaultValue;
        }
      }
      this._refreshTableAfterBulkMutation();
      return;
    }

    const patchTemplate = {};
    fieldNames.forEach((fieldName) => {
      patchTemplate[fieldName] = defaultValue;
    });

    const rowComponents = typeof this.tabulator.getRows === 'function' ? this.tabulator.getRows() : [];
    if (!Array.isArray(rowComponents) || rowComponents.length === 0) {
      return;
    }

    const updates = rowComponents.map((rowComponent) => {
      return Promise.resolve(rowComponent.update({ ...patchTemplate }));
    });
    await Promise.all(updates);
  }

  _getActiveRowDataAt(index) {
    if (index < 0) {
      return undefined;
    }

    const activeRows = this.tabulator?.rowManager?.activeRows;
    if (Array.isArray(activeRows) && activeRows[index]) {
      return activeRows[index]?.data;
    }

    const activeData = typeof this.tabulator.getData === 'function' ? this.tabulator.getData('active') : undefined;
    if (Array.isArray(activeData)) {
      return activeData[index];
    }

    return undefined;
  }

  _getActiveRowDataSlice(limit) {
    if (limit <= 0) {
      return [];
    }

    const activeRows = this.tabulator?.rowManager?.activeRows;
    if (Array.isArray(activeRows)) {
      return activeRows
        .slice(0, limit)
        .map((row) => row?.data)
        .filter(Boolean);
    }

    const activeData = typeof this.tabulator.getData === 'function' ? this.tabulator.getData('active') : undefined;
    if (Array.isArray(activeData)) {
      return activeData.slice(0, limit);
    }

    return [];
  }

  _refreshTableAfterBulkMutation() {
    if (typeof this.tabulator.refreshData === 'function') {
      this.tabulator.refreshData();
      this._reapplyActiveFiltersAfterBulkMutation();
      return;
    }

    if (typeof this.tabulator.redraw === 'function') {
      this.tabulator.redraw(true);
    }
    this._reapplyActiveFiltersAfterBulkMutation();
  }

  _reapplyActiveFiltersAfterBulkMutation() {
    if (typeof this.tabulator.refreshFilter === 'function') {
      this.tabulator.refreshFilter();
      return;
    }

    const activeGlobalFilter = String(this.tabUtils?.getActiveGlobalFilterQuery?.() || '').trim();
    if (activeGlobalFilter.length > 0) {
      this.tabUtils.filterAcrossAllColumns(activeGlobalFilter);
    }
  }

  onGridChanged(callback) {
    if (typeof callback !== 'function') {
      return () => {};
    }
    const callbacks = this._getSharedGridChangedCallbacks();
    callbacks.add(callback);
    return () => {
      callbacks.delete(callback);
    };
  }

  _notifyGridChanged() {
    this._getSharedGridChangedCallbacks().forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.error('Grid change callback failed', error);
      }
    });
  }

  _getSharedGridChangedCallbacks() {
    if (!this.tabulator) {
      return new Set();
    }
    if (!this.tabulator.__gridChangedCallbacks) {
      this.tabulator.__gridChangedCallbacks = new Set();
    }
    return this.tabulator.__gridChangedCallbacks;
  }

  _bindSharedGridChangeEventListeners() {
    if (!this.tabulator || typeof this.tabulator.on !== 'function') {
      return;
    }
    if (this.tabulator.__gridChangedEventsBound === true) {
      return;
    }

    const handlers = {
      cellEdited: () => this._notifyGridChanged(),
      rowMoved: () => this._notifyGridChanged(),
      columnMoved: () => this._notifyGridChanged(),
      dataFiltered: () => this._notifyGridChanged(),
    };
    this.tabulator.__gridChangedEventHandlers = handlers;
    this.tabulator.on('cellEdited', handlers.cellEdited);
    this.tabulator.on('rowMoved', handlers.rowMoved);
    this.tabulator.on('columnMoved', handlers.columnMoved);
    this.tabulator.on('dataFiltered', handlers.dataFiltered);
    this.tabulator.__gridChangedEventsBound = true;
  }

  destroy() {
    if (!this.tabulator || typeof this.tabulator.off !== 'function') {
      return;
    }
    const handlers = this.tabulator.__gridChangedEventHandlers;
    if (!handlers) {
      return;
    }

    if (typeof handlers.cellEdited === 'function') {
      this.tabulator.off('cellEdited', handlers.cellEdited);
    }
    if (typeof handlers.rowMoved === 'function') {
      this.tabulator.off('rowMoved', handlers.rowMoved);
    }
    if (typeof handlers.columnMoved === 'function') {
      this.tabulator.off('columnMoved', handlers.columnMoved);
    }
    if (typeof handlers.dataFiltered === 'function') {
      this.tabulator.off('dataFiltered', handlers.dataFiltered);
    }
    this.tabulator.__gridChangedEventsBound = false;
    delete this.tabulator.__gridChangedEventHandlers;
  }
}

export { GridExtensionTabulator as GridExtension };
