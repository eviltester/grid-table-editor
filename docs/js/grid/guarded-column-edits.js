class GuardedColumnEdits{

    constructor(gridExtension) {
        this.gridExtras = gridExtension;
    }

    renameColId(id) {
        var editColDef = this.gridExtras.getColumnDef(id);
        var colTitle = prompt('Column Name?', editColDef.headerName);
        
        if (colTitle != null && colTitle != '') {
            console.log('rename column ' + id + ' with this name: ' + colTitle);
        } else {
            return false;
        }
        
        if(this.gridExtras.nameAlreadyExists(colTitle)){
            alert(`A column with name ${colTitle} already exists`);
            return false;
        }
        
        this.gridExtras.renameColId(id, colTitle);
    }

    deleteColId(id) {
      
        if(this.gridExtras.getNumberOfColumns()==1){
            alert("Cannot Delete The Only Column");
            return;
        }
      
        let editColDef = this.gridExtras.getColumnDef(id);
      
        if(!confirm('Are you Sure You Want to Delete Column Named '+ editColDef.headerName + "?"))
          return;
      
          this.gridExtras.deleteColumnId(id);
    }
      
      
    duplicateColumnId(position, id) {
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
      
        this.gridExtras.duplicateColumn(position, id, colTitle);
    }
      
    addNeighbourColumnId(position, id) {
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
      
        this.gridExtras.addNeighbourColumnId(position, id, colTitle);
      }
}

export {GuardedColumnEdits}