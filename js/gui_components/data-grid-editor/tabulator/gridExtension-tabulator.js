import { GenericDataTable } from "../../../data_formats/generic-data-table.js"
import { TabulatorHelper } from "./tabulator-helpers.js"
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
class GridExtensionTabulator{

    constructor(tabulator) {
        this.tabulator = tabulator;
        this.tabUtils = new TabulatorHelper(tabulator);
        this._pendingGridMutation = Promise.resolve();

        // this.cellRendererText = (params) => {
        //     let val = params.value;
        //     if(val && val.replaceAll){
        //         val = params.value?.replaceAll("<", "&lt;")?.replaceAll(">","&gt;");
        //     }
        //     return `<div style='word-break:normal;line-height: normal'><p>${val}</p></div>`
        // };
    }


    // [x] convert to tabulature
    clearGrid(){
        const columnDefs = [
            { title: "~rename-me", field: "column1" }
        ];
        this._enqueueGridMutation(() => {
            return Promise.resolve(this.tabulator.setColumns(columnDefs))
                .then(() => this.tabulator.setData([]));
        });
    }

    // [x] convert to tabulature
    clearFilters(){
        // true means clear all header filters as well
        this.tabulator.clearFilter(true);
    }

    // [x] convert to tabulature
    filterText(text){
        this.tabUtils.filterAcrossAllColumns(text);
    }

     // [x] convert to tabulature
    getNextFieldNumber(){
        const columnDefs = this.tabulator.getColumnDefinitions()
        let largestNumber=0;
        columnDefs.forEach(column => {
            let fieldName = column.field;
            let fieldNumber = Number.parseInt(fieldName.replace("column",""));
            if(fieldNumber>largestNumber){
                largestNumber = fieldNumber;
            }
        });
        return largestNumber+1;
    }

     // [x] convert to tabulature
    getNewCol(named, fieldId){

        let newCol = {};
        newCol.title = named;
        if(fieldId===undefined){
            fieldId = this.getNextFieldNumber();
        }
        newCol.field = 'column' + fieldId;
        return newCol;
      }

    // given an array of String column names, set the grid to have those columns
    createColumns(columnNames) {
        let colDefs = [];
        let fieldId = this.getNextFieldNumber();
        columnNames.forEach(column => {
            let newCol = this.getNewCol(column, fieldId);
            colDefs.push(newCol);
            fieldId++;
        });
        this.tabulator.setColumns(colDefs);
        var fieldNames = colDefs.map(colDef => colDef.field);
        this._addFieldsToData(fieldNames, '')
    }

    _addFieldsToData(fieldNames, defaultValue){
        if(!fieldNames || fieldNames.length===0){
            return;
        }

        this._runWithoutRedraw(() => {
            this.tabulator.getRows().forEach(row => {
                let rowPatch = {};
                fieldNames.forEach(fieldName => {
                    rowPatch[fieldName] = defaultValue;
                });
                row.update(rowPatch);
            });
        });
    }

    _addFieldToData(fieldName, defaultValue){
        this._addFieldsToData([fieldName], defaultValue);
    }

    // [x] convert to tabulature
    duplicateColumn(position, columnOrId, colTitle) {
        const column = this._resolveColumn(columnOrId);
        if(!column){
            return;
        }

        const destinationCol = this.addNeighbourColumn(position, column, colTitle);
        if(!destinationCol){
            return;
        }

        this._copyColumnData(column.getDefinition().field, destinationCol.field);

    }



    appendColumnToGrid(colTitle){
        let newCol = this.getNewCol(colTitle);
        this.tabulator.addColumn(newCol, false);

        this._addFieldToData(newCol.field, '')

        return newCol
    }

    moveColumnTo(position, id, columnToMove){
        if(!id || !columnToMove){
            return;
        }

        const moveToAfter = position > 0;
        const resolvedColumn = this._resolveColumn(columnToMove);
        if(!resolvedColumn){
            return;
        }

        const targetId = this._normaliseId(id);
        resolvedColumn.move(targetId, moveToAfter);
    }

    // [x] convert to tabulature
    addNeighbourColumn(position, existingColumn, colTitle){

        if(colTitle === undefined || colTitle==="" || colTitle.length==0)
            return;

        const column = this.getNewCol(colTitle);
        const resolvedExistingColumn = this._resolveColumn(existingColumn);
        if(!resolvedExistingColumn){
            return;
        }

        var addToLeft = true;
        if(position>0){
            addToLeft=false;
        }
        this.tabulator.addColumn(column, addToLeft, resolvedExistingColumn);
        return column;
    }

    addNeighbourColumnId(position, id, colTitle){
        const existingColumn = this._getColumnById(id);
        this.addNeighbourColumn(position, existingColumn, colTitle);
    }

    // [x] convert to tabulature
    deleteColumn(columnOrId){
        const column = this._resolveColumn(columnOrId);
        if(!column){
            return;
        }
        column.delete();
    }

    deleteColumnId(id){
        this.deleteColumn(id);
    }

    // [x] convert to tabulature
    getNumberOfColumns(){
        return this.tabulator.getColumnDefinitions().length;
    }

    // [x] convert to tabulature
    getNumberOfSelectedRows(){
        return this.tabulator.getSelectedRows().length;
    }

    getColumnDef(id){
        const colDef = this.tabulator.getColumnDefinitions().find((definition) => {
            return definition.colId === id || definition.field === id || definition.title === id;
        });
        if(!colDef){
            return undefined;
        }
        return {
            ...colDef,
            colId: colDef.colId || colDef.field,
            headerName: colDef.title
        };
    }

    // [x] convert to tabulature
    nameAlreadyExists(name){
        var colDefs = this.tabulator.getColumnDefinitions();
        for(const  colDef of colDefs){
            if(colDef.title===name){
                return true;
            }
        }
        return false;
    }

    // [x] convert to tabulature
    renameColumn(columnOrId,name){
        const column = this._resolveColumn(columnOrId);
        if(!column){
            return;
        }
        column.updateDefinition({title:name});
    }

    renameColId(id, name){
        this.renameColumn(id, name);
    }

    // [x] convert to tabulature
    deleteSelectedRows(){
        const rows = this.tabulator.getSelectedRows();
        this.tabulator.deleteRow(rows);
    }

    // [x] convert to tabulature
    _getBlankRowData(){
        var colDefs = this.tabulator.getColumnDefinitions();
        var newRowObject = {}
        colDefs.forEach(colDef =>{
            newRowObject[colDef.field] = '';
        })
        return newRowObject;
    }

    // [x] convert to tabulature
    addRow(){
        this.tabUtils.addRowToBottom(this._getBlankRowData());
    }
    

    // [x] convert to tabulature
    addRowsRelativeToSelection(position){
        // -1 above, 1 below
        var selectedRows = this.tabulator.getSelectedRows();

        var positionIndexToAddAt = 0;

        // if nothing is selected, just call add row above or below
        if(selectedRows.length==0){
            // and there are no rows then add to top
            if(this.tabulator.getDataCount()==0 || position<0){
                this.tabUtils.addRowToTop(this._getBlankRowData());
                return;
            }else{
                this.tabUtils.addRowToBottom(this._getBlankRowData());
                return;
            }
        }
        
        var relativeToRow;
        if(position<0){
            relativeToRow = this._getMinRow(selectedRows);
        }else{
            relativeToRow = this._getMaxRow(selectedRows);
        }

        var objectsToAdd = [];
        var numberOfRowsToAdd = selectedRows.length;
        for(var objectCountToAdd=0; objectCountToAdd<numberOfRowsToAdd; objectCountToAdd++){
            objectsToAdd.push(this._getBlankRowData());
        }

        var addAbove = true;
        if(position>0){
            addAbove = false;
        }
        this.tabulator.addData(objectsToAdd, addAbove, relativeToRow); 
    }

    // calculate the max row from a selection of rows
    _getMaxRow(rowComponents){

        var maxRow=rowComponents[0];
        rowComponents.forEach( node =>{
            if(node.getPosition()>maxRow.getPosition()){
              maxRow=node;
            }
          }
        )
        return maxRow;
    }
      
    // calculate the first row from a selection of rows
    _getMinRow(rowComponents){      
        var minRow=rowComponents[0];
        rowComponents.forEach( node =>{
            if(node.getPosition()<minRow.getPosition()){
              minRow=node;
            }
          }
        )
        return minRow;
    }


    /*
        Export grid extensions
    */
    // TODO: consider creating a GridBackedGenericDataTable such that it is a generic wrapper
    // then we don't have to copy the data out into a new structure
    // [x] convert to tabulature
    getGridAsGenericDataTable(maxRows){

        let dataTable = new GenericDataTable();
        const columnDefs = this.tabulator.getColumnDefinitions();
        dataTable.setHeaders(columnDefs.map(col => col.title));

        const fieldnames = columnDefs.map(col => col.field);
        const activeRows = this.tabulator.getData("active");
        const rowLimit = this._normaliseRowLimit(maxRows);
        const rowsToExport = rowLimit === undefined ? activeRows.length : Math.min(rowLimit, activeRows.length);

        // Fast path for large exports: build rows in memory once, then assign.
        const rows = new Array(rowsToExport);
        for(let rowIndex=0; rowIndex<rowsToExport; rowIndex++){
            const sourceRow = activeRows[rowIndex];
            const vals = new Array(fieldnames.length);
            for(let colIndex=0; colIndex<fieldnames.length; colIndex++){
                const value = sourceRow[fieldnames[colIndex]];
                vals[colIndex] = value === undefined || value === null ? "" : String(value);
            }
            rows[rowIndex] = vals;
        }
        dataTable.rows = rows;

        return dataTable;
    }

    _getRowAsGenericDataValsArray(aRow, fieldnames){
        var vals = [];
        for (const propertyid in fieldnames) {
            var property = fieldnames[propertyid];
            vals.push(aRow[property] ? String(aRow[property]) : '');
        }
        return vals;
    }

    // [x] convert to tabulature
    getHeadersFromGrid(){
        return this.tabulator.getColumnDefinitions().map(col => col.title);
    }


    /*
        Import Grid Extensions
    */
    // [x] convert to tabulature
    setGridFromGenericDataTable(dataTable){

      if(dataTable.getColumnCount()==0){
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
      let fieldnames = columnDefs.map(col => col.field);
      for(let rowIndex=0; rowIndex<rowCount; rowIndex++){
          addRows[rowIndex] = dataTable.getRowAsObjectUsingHeadings(rowIndex, fieldnames);
      }

      // Tabulator column resets are async; chain operations to avoid fallback headers.
      return this._enqueueGridMutation(async () => {
          await Promise.resolve(this.tabulator.setColumns(columnDefs));
          await Promise.resolve(this._setBulkData(addRows));

          this._applyHeaderTitles(headers);
          await this._autoFitFirstColumn();
      });

      // TODO : apply transactions incrementally for larger data sets
      //this.tabulator.applyTransaction({ add: addRows });
    }   

    _applyHeaderTitles(headers){
        const columns = this.tabulator.getColumns();
        this._runWithoutRedraw(() => {
            columns.forEach((column, index) => {
                const header = headers[index];
                if(header === undefined){
                    return;
                }

                const definition = column.getDefinition ? column.getDefinition() : {};
                if(definition.title === header){
                    return;
                }

                column.updateDefinition({ title: header });
            });
        });
    }

    _runWithoutRedraw(callback){
        if(typeof callback !== "function"){
            return;
        }

        const supportsRedrawControl =
            typeof this.tabulator.blockRedraw === "function" &&
            typeof this.tabulator.restoreRedraw === "function";

        if(!supportsRedrawControl){
            callback();
            return;
        }

        this.tabulator.blockRedraw();
        try{
            callback();
        }finally{
            this.tabulator.restoreRedraw();
        }
    }

    _copyColumnData(sourceFieldName, destinationFieldName){
        const allData = typeof this.tabulator.getData === "function" ? this.tabulator.getData() : null;
        const canUseBulkDataPath = Array.isArray(allData) && typeof this.tabulator.redraw === "function";

        if(canUseBulkDataPath){
            this._runWithoutRedraw(() => {
                for(let rowIndex=0; rowIndex<allData.length; rowIndex++){
                    const rowData = allData[rowIndex];
                    rowData[destinationFieldName] = rowData[sourceFieldName];
                }
            });
            this.tabulator.redraw(true);
            return;
        }

        this._runWithoutRedraw(() => {
            this.tabulator.getRows().forEach(row => {
                let obj = {};
                obj[destinationFieldName] = row.getData()[sourceFieldName];
                row.update(obj);
            });
        });
    }

    _enqueueGridMutation(mutationFn){
        if(typeof mutationFn !== "function"){
            return this._pendingGridMutation;
        }

        this._pendingGridMutation = this._pendingGridMutation
            .catch(() => undefined)
            .then(() => mutationFn());

        return this._pendingGridMutation;
    }

    _yieldToBrowser(){
        return new Promise((resolve) => setTimeout(resolve, 0));
    }

    _setBulkData(rows){
        if(typeof this.tabulator.replaceData === "function"){
            return this.tabulator.replaceData(rows);
        }
        return this.tabulator.setData(rows);
    }

    async _autoFitFirstColumn(){
        if(typeof this.tabulator.getColumnDefinitions !== "function"){
            return;
        }

        const columnDefinitions = this.tabulator.getColumnDefinitions();
        const firstColumnField = columnDefinitions?.[0]?.field;
        if(!firstColumnField){
            return;
        }

        let firstColumn = undefined;
        if(typeof this.tabulator.getColumn === "function"){
            firstColumn = this.tabulator.getColumn(firstColumnField);
        }

        if(!firstColumn && typeof this.tabulator.getColumns === "function"){
            firstColumn = this.tabulator.getColumns()?.[0];
        }

        if(!firstColumn || typeof firstColumn.fitToData !== "function"){
            return;
        }

        await this._yieldToBrowser();
        await Promise.resolve(firstColumn.fitToData());
    }

    _normaliseId(idOrColumn){
        if(typeof idOrColumn === "string"){
            return idOrColumn;
        }
        if(idOrColumn?.getDefinition){
            const definition = idOrColumn.getDefinition();
            return definition.colId || definition.field || definition.title;
        }
        return undefined;
    }

    _getColumnById(id){
        const normalisedId = this._normaliseId(id);
        return this.tabulator.getColumns().find((column) => {
            const definition = column.getDefinition();
            return definition.colId === normalisedId ||
                   definition.field === normalisedId ||
                   definition.title === normalisedId;
        });
    }

    _resolveColumn(columnOrId){
        if(columnOrId?.getDefinition){
            return columnOrId;
        }
        return this._getColumnById(columnOrId);
    }

    _normaliseRowLimit(maxRows){
        if(typeof maxRows !== "number" || !Number.isFinite(maxRows)){
            return undefined;
        }
        return Math.max(0, Math.floor(maxRows));
    }

}

export {GridExtensionTabulator as GridExtension}
