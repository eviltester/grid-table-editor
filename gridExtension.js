class GridExtension{

    constructor(gridApi, columnApi) {
        this.gridApi = gridApi;
        this.columnApi = columnApi;
        this.nextFieldNumber=2;
        this.cellRendererText = params => `<div style='word-break:normal;line-height: normal'><p>${params.value}</p></div>`;
    }


    clearGrid(){
        var columnDefs = [
            {
                headerName: '~rename-me',
                field: 'column1'
            }
        ];
        this.gridApi.setColumnDefs(columnDefs);
        this.gridApi.setRowData([]);
        this.nextFieldNumber=2;
    }

    clearFilters(){
        this.gridApi.setQuickFilter(null);
        this.gridApi.setFilterModel(null);
    }

    filterText(text){
        gridOptions.api.setQuickFilter(text);
    }

    getNewCol(named){

        var newCol = {};
        newCol.headerName = named;
        newCol.field = 'column' + this.nextFieldNumber;
        newCol.cellRenderer = this.cellRendererText;
        this.nextFieldNumber++;
        return newCol;
      }

    // given an array of String column names, set the grid to have those columns
    createColumns(columnNames) {
        var colDefs = [];
        columnNames.forEach(column => {
            var newCol = this.getNewCol(column);
            colDefs.push(newCol);
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
            var vals = [];
            node.setDataValue(fieldName, defaultValue);
        });
    }

    duplicateColumn(position, id, colTitle) {

        this.addNeighbourColumnId(position, id, colTitle);

        var colDefsHunt = this.gridApi.getColumnDefs();
        var colDataToCopy;
        var destinationCol;

        colDefsHunt.forEach(col =>{
            if(col.headerName == colTitle){
                destinationCol = col;
            }
            if(col.colId == id){
                colDataToCopy = col;
            }
        })

        this.gridApi.forEachNode(node => {
            var vals = [];
            node.setDataValue(destinationCol.field, node.data[colDataToCopy.field])
        });

    }



    appendColumnToGrid(colTitle){

        var colDefs = this.gridApi.getColumnDefs();

        var newCol = this.getNewCol(colTitle);
        // add to right
        colDefs.push(newCol);

        this.gridApi.setColumnDefs(colDefs);

        this.addFieldToData(newCol.field, '')

        return newCol
    }

    moveColumnTo(position, id, columnToMove){
        // need to use column-state to set the order
        // https://www.ag-grid.com/javascript-grid/column-state/

        var columnState = this.columnApi.getColumnState();
        var newColumnStates = [];
        var currentColumnState;
        var newColumnState;

        // find new columnId
        var colDefsHunt = this.gridApi.getColumnDefs();
        var newColId;
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

        var newCol = this.appendColumnToGrid(colTitle);
        this.moveColumnTo(position, id, newCol);

    }

    deleteColumnId(id){

        var colDefs = this.gridApi.getColumnDefs();

        var newColDefs = [];

        colDefs.forEach(colDef =>{
          if(colDef.colId!=id){
            newColDefs.push(colDef)
          }
        })
        
        this.gridApi.setColumnDefs(newColDefs);      

        // TODO: consider deleting all the data as well
    }

    getColumnDef(id){

        var colDefs = this.gridApi.getColumnDefs();
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