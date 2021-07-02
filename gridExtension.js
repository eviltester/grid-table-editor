class GridExtension{

    constructor(gridApi, columnApi) {
        this.gridApi = gridApi;
        this.columnApi = columnApi;
        this.nextFieldNumber=2;
    }


    getNewCol(named){
        var newCol = {};
        newCol.headerName = named;
        newCol.field = 'column' + this.nextFieldNumber;
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
    }

    addNeighbourColumnId(position, id, colTitle){

        if(colTitle === undefined || colTitle==="" || colTitle.length==0)
            return;

        var colDefs = this.gridApi.getColumnDefs();
  
        var newCol = this.getNewCol(colTitle);
      
        // add to right
        colDefs.push(newCol);
      
        this.gridApi.setColumnDefs(colDefs);
      
      
      
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
          if(col.field == newCol.field){
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
      
        // TODO: add default value for that column to all rows in rowData

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
        // colDefs.some(colDef =>{
        //   if(colDef.colId==id){
        //     return colDef;
        //   }
        // });
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

    addRow(){
        this.gridApi.applyTransaction({ add: [{}] });
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
            objectsToAdd.push({});
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