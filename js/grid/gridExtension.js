/*
    A wrapper for AG Grid that makes it easier to add new columns
    and perform high level operations with the grid that we need
    for editing the grid.
*/
class GridExtension{

    constructor(gridApi, columnApi) {
        this.gridApi = gridApi;
        this.columnApi = columnApi;
        this.cellRendererText = (params) => {
            let val = params.value;
            if(val && val.replaceAll){
                val = params.value?.replaceAll("<", "&lt;")?.replaceAll(">","&gt;");
            }
            return `<div style='word-break:normal;line-height: normal'><p>${val}</p></div>`
        };
    }


    clearGrid(){
        const columnDefs = [
            {
                headerName: '~rename-me',
                field: 'column1'
            }
        ];
        this.gridApi.setColumnDefs(columnDefs);
        this.gridApi.setRowData([]);
    }

    clearFilters(){
        this.gridApi.setQuickFilter(null);
        this.gridApi.setFilterModel(null);
    }

    filterText(text){
        this.gridApi.setQuickFilter(text);
    }

    getNextFieldNumber(){
        const columnDefs = this.gridApi.getColumnDefs()
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

    getNewCol(named, fieldId){

        let newCol = {};
        newCol.headerName = named;
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
        this.gridApi.setColumnDefs(colDefs);
        var fieldNames = colDefs.map(colDef => colDef.field);
        this.addFieldsToData(fieldNames, '')
    }

    addFieldsToData(fieldNames, defaultValue){
        fieldNames.forEach(fieldName => {
            this.addFieldToData(fieldName, defaultValue);
        });
    }

    addFieldToData(fieldName, defaultValue){
        this.gridApi.forEachNode(node => {
            node.setDataValue(fieldName, defaultValue);
        });
    }

    duplicateColumn(position, id, colTitle) {

        this.addNeighbourColumnId(position, id, colTitle);

        let colDefsHunt = this.gridApi.getColumnDefs();
        let colDataToCopy;
        let destinationCol;

        colDefsHunt.forEach(col =>{
            if(col.headerName == colTitle){
                destinationCol = col;
            }
            if(col.colId == id){
                colDataToCopy = col;
            }
        })

        this.gridApi.forEachNode(node => {
            node.setDataValue(destinationCol.field, node.data[colDataToCopy.field])
        });

    }



    appendColumnToGrid(colTitle){

        let colDefs = this.gridApi.getColumnDefs();

        let newCol = this.getNewCol(colTitle);
        // add to right
        colDefs.push(newCol);

        this.gridApi.setColumnDefs(colDefs);

        this.addFieldToData(newCol.field, '')

        return newCol
    }

    moveColumnTo(position, id, columnToMove){
        // need to use column-state to set the order
        // https://www.ag-grid.com/javascript-grid/column-state/

        let columnState = this.columnApi.getColumnState();
        let newColumnStates = [];
        let currentColumnState;
        let newColumnState;

        // find new columnId
        let colDefsHunt = this.gridApi.getColumnDefs();
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

        this.columnApi.applyColumnState(
            { state: newColumnStates,
                applyOrder: true }
        );

    }

    addNeighbourColumnId(position, id, colTitle){

        if(colTitle === undefined || colTitle==="" || colTitle.length==0)
            return;

        let newCol = this.appendColumnToGrid(colTitle);
        this.moveColumnTo(position, id, newCol);

    }

    deleteColumnId(id){

        let colDefs = this.gridApi.getColumnDefs();
        let newColDefs = [];

        colDefs.forEach(colDef =>{
          if(colDef.colId!=id){
            newColDefs.push(colDef)
          }
        })
        
        this.gridApi.setColumnDefs(newColDefs);      

        // TODO: consider deleting all the data as well
    }

    getNumberOfColumns(){
        return this.gridApi.getColumnDefs().length;
    }

    getNumberOfSelectedRows(){
        return this.gridApi.getSelectedNodes().length;
    }



    getColumnDef(id){

        let colDefs = this.gridApi.getColumnDefs();
        for(let colDef of colDefs){
            if(colDef.colId==id){
                return colDef;
            }  
        }
    }

    nameAlreadyExists(name){
        var colDefs = this.gridApi.getColumnDefs();
        for(const  colDef of colDefs){
            if(colDef.headerName===name){
                return true;
            }
        }
        return false;
    }

    renameColId(id,name){

        var colDefs = this.gridApi.getColumnDefs();
        var editColDef;
        colDefs.forEach(colDef =>{
            if(colDef.colId==id){
              editColDef = colDef;
            }
          })
        editColDef.headerName = name;
        this.gridApi.setColumnDefs(colDefs);
    }

    deleteSelectedRows(){
        this.gridApi.applyTransaction({ remove: this.gridApi.getSelectedRows() });
    }

    getBlankRowData(){
        var colDefs = this.gridApi.getColumnDefs();
        var newRowObject = {}
        colDefs.forEach(colDef =>{
            newRowObject[colDef.field] = '';
        })
        return newRowObject;
    }

    addRow(){
        this.gridApi.applyTransaction({ add: [this.getBlankRowData()] });
    }
    

    addRowsRelativeToSelection(position){
        // -1 above, 1 below
        var rowsToAdd = this.gridApi.getSelectedNodes();

        var positionIndexToAddAt = 0;

        if(rowsToAdd.length==0){
            if(this.gridApi.getDisplayedRowCount()==0 || position<0){
            rowsToAdd = [{rowIndex:0}];
            }else{
            rowsToAdd = [{rowIndex: this.gridApi.getDisplayedRowCount()}];
            }
        }
        
        if(position<0){
            positionIndexToAddAt = this.getMinRowIndex(rowsToAdd);
        }else{
            positionIndexToAddAt = this.getMaxRowIndex(rowsToAdd)+position;
        }

        if(positionIndexToAddAt<0){
            positionIndexToAddAt=0;
        }

        var objectsToAdd = [];
        var numberOfRowsToAdd = rowsToAdd.length;
        for(var objectCountToAdd=0; objectCountToAdd<numberOfRowsToAdd; objectCountToAdd++){
            objectsToAdd.push(this.getBlankRowData());
        }

        this.gridApi.applyTransaction({ add: objectsToAdd, addIndex: positionIndexToAddAt });
    }

    // calculate the max row index from a selection of rows
    getMaxRowIndex(rowNodes){

        var maxIndex=0;
        rowNodes.forEach( node =>{
            if(node.rowIndex>maxIndex){
              maxIndex=node.rowIndex;
            }
          }
        )
        return maxIndex;
    }
      
    // calculate the first row index from a selection of rows
    getMinRowIndex(rowNodes){      
        var minIndex=rowNodes[0].rowIndex;
        rowNodes.forEach( node =>{
            if(node.rowIndex<minIndex){
              minIndex=node.rowIndex;
            }
          }
        )
        return minIndex;
    }
}

export {GridExtension}