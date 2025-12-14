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
        this.tabulator.clearData();          // removes **all rows**

        const columnDefs = [
            { title: "~rename-me", field: "column1" }
        ];
        this.tabulator.setColumns(columnDefs);
        this.tabulator.setData([]);
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
        newCol.cellRenderer = this.cellRendererText;
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
        this.tabulator.setGridOption("columnDefs",colDefs);
        var fieldNames = colDefs.map(colDef => colDef.field);
        this._addFieldsToData(fieldNames, '')
    }

    _addFieldsToData(fieldNames, defaultValue){
        fieldNames.forEach(fieldName => {
            this.addFieldToData(fieldName, defaultValue);
        });
    }

    _addFieldToData(fieldName, defaultValue){
        this.tabulator.forEachNode(node => {
            node.setDataValue(fieldName, defaultValue);
        });
    }

    // [x] convert to tabulature
    duplicateColumn(position, column, colTitle) {

        this.addNeighbourColumn(position, column, colTitle);

        let colDefsHunt = this.tabulator.getColumnDefinitions();
        let colDataToCopy;
        let destinationCol;

        colDefsHunt.forEach(col =>{
            if(col.title == colTitle){
                destinationCol = col;
            }
        })

        this.tabulator.getRows().forEach(row => {
            console.log(destinationCol);
            const fieldName = destinationCol.field;
            let obj = {};
            obj[fieldName] = row.getData()[column.getDefinition().field];
            row.update(obj);
        });

    }



    appendColumnToGrid(colTitle){

        let colDefs = this.tabulator.getColumnDefs();

        let newCol = this.getNewCol(colTitle);
        // add to right
        colDefs.push(newCol);

        this.tabulator.setGridOption("columnDefs",colDefs);

        this.addFieldToData(newCol.field, '')

        return newCol
    }

    moveColumnTo(position, id, columnToMove){
        // need to use column-state to set the order
        // https://www.ag-grid.com/javascript-grid/column-state/

        let columnState = this.tabulator.getColumnState();
        let newColumnStates = [];
        let currentColumnState;
        let newColumnState;

        // find new columnId
        let colDefsHunt = this.tabulator.getColumnDefs();
        let newColId;
        colDefsHunt.forEach(col =>{
            if(col.field == columnToMove.field){
                newColId = col.colId;
            }
        })


        // find main column state
        columnState.forEach(col =>{
            if(col.colId== id){
                currentColumnState=col;
            }
        })

        // find new column id
        columnState.forEach(col =>{
            if(col.colId== newColId){
                newColumnState=col;
            }
        })

        // shuffle by creating a new state
        columnState.forEach(colDef =>{
            if(colDef.colId==id){
                if(position<0){
                    newColumnStates.push(newColumnState)
                    newColumnStates.push(currentColumnState)
                }else{
                    newColumnStates.push(currentColumnState)
                    newColumnStates.push(newColumnState)      }
            }else{
                if(colDef.colId!=newColId){
                    newColumnStates.push(colDef);
                }
            }
        })

        this.tabulator.applyColumnState(
            { state: newColumnStates,
                applyOrder: true }
        );

    }

    // [x] convert to tabulature
    addNeighbourColumn(position, existingColumn, colTitle){

        if(colTitle === undefined || colTitle==="" || colTitle.length==0)
            return;

        const column = this.getNewCol(colTitle);

        var addToLeft = true;
        if(position>0){
            addToLeft=false;
        }
        this.tabulator.addColumn(column, addToLeft, existingColumn);
    }

    // [x] convert to tabulature
    deleteColumn(column){
        column.delete();
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

        let colDefs = this.tabulator.getColumnDefinitions();
        for(let colDef of colDefs){
            if(colDef.colId==id){
                return colDef;
            }  
        }
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
    renameColumn(column,name){
        this.tabulator.updateColumnDefinition(column, {title:name});
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
    getGridAsGenericDataTable(){

        let dataTable = new GenericDataTable();
        dataTable.setHeaders(this.tabulator.getColumnDefinitions().map(col => col.title));

        var fieldnames = this.tabulator.getColumnDefinitions().map(col => col.field);
    
        // since we can filter and sort...        
        this.tabulator.getData("active").forEach(node => {
            var vals = this._getRowAsGenericDataValsArray(node, fieldnames);
            dataTable.appendDataRow(vals);
        });

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

      this.tabulator.clearData();

      // auto columns is set so we don't do this
      //this.createColumns(dataTable.getHeaders());
      //this.tabulator.setGridOption("rowData",[]);

      let addRows = [];
      
      //let fieldnames = dataTable.getColumnDefs().map(col => col.field);

      for(let rowIndex=0; rowIndex<dataTable.getRowCount(); rowIndex++){
          addRows.push(dataTable.getRowAsObject(rowIndex));
      }

      this.tabulator.setData(addRows);

      // TODO : apply transactions incrementally for larger data sets
      //this.tabulator.applyTransaction({ add: addRows });
    }   

}

export {GridExtensionTabulator as GridExtension}