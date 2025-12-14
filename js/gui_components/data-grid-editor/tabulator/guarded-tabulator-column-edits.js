class GuardedTabulatorColumnEdits{

    constructor(gridExtension) {
        this.gridExtras = gridExtension;
    }

    // todo: ids here look suspiciously ag-grid specific

    renameColumn(column) {

        if(column==null || column==undefined){
            alert("Column not found");
            return;
        }

        var colTitle = prompt('Column Name?', column.getDefinition().title);
        
        if (colTitle != null && colTitle != '') {
            console.log('rename column ' +  column.getDefinition().title + ' with this name: ' + colTitle);
        } else {
            return false;
        }
        
        if(this.gridExtras.nameAlreadyExists(colTitle)){
            alert(`A column with name ${colTitle} already exists`);
            return false;
        }
        
        this.gridExtras.renameColumn(column, colTitle);
    }

    deleteColumn(column) {
      
        if(column==null || column==undefined){
            alert("Column not found");
            return;
        }

        if(this.gridExtras.getNumberOfColumns()==1){
            alert("Cannot Delete The Only Column");
            return;
        }
    
        if(!confirm('Are you Sure You Want to Delete Column Named '+  column.getDefinition().title + "?"))
          return;
      
          this.gridExtras.deleteColumn(column);
    }
      
      
    duplicateColumn(position, column) {
        let colTitle = prompt('Copy Column As?');
      
        if (colTitle != null && colTitle != '') {
          console.log('duplicate a column with this name: ' + colTitle);
        } else {
          return;
        }
      
        if(this.gridExtras.nameAlreadyExists(colTitle)){
          alert(`A column with name ${colTitle} already exists`);
          return false;
        }
      
        this.gridExtras.duplicateColumn(position, column, colTitle);
    }
      
    addNeighbourColumn(position, existingColumn) {

        if(existingColumn==null || existingColumn==undefined){
            alert("Column not found");
            return;
        }

        let colTitle = prompt('New Column Name?');
      
        if (colTitle != null && colTitle != '') {
          console.log('create a new neighbour column with this name: ' + colTitle);
        } else {
          return;
        }
      
        if(this.gridExtras.nameAlreadyExists(colTitle)){
          alert(`A column with name ${colTitle} already exists`);
          return false;
        }
      
        this.gridExtras.addNeighbourColumn(position, existingColumn, colTitle);
      }
}

export {GuardedTabulatorColumnEdits}