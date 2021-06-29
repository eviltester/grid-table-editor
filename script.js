var rowData = [];

var nextFieldNumber = 2;

var columnDefs = [
  {
    headerName: '~rename-me',
    field: 'column1'
  }
];

var gridOptions = {
  columnDefs: columnDefs,
  rowData: rowData,

  defaultColDef: {
    wrapText: true,
    autoHeight: true,
    resizable: true,
    rowDrag: true,
    editable: true
  },
  components: {
    agColumnHeader: CustomHeader,
  },
  rowDragManaged: true,
  enableMultiRowDragging: true,
  rowSelection: 'multiple'
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);
  // having setup the grid, make it a little more responsive
  setTimeout(function(){document.getElementById("myGrid").style.height="40%";},1000)
});

// given an array of String column names, set the grid to have those columns
function createColumns(columnNames) {
  var colDefs = [];
  columnNames.forEach(column => {
    var newCol = getNewCol(column);
    colDefs.push(newCol);
    console.log(newCol);
  });
  gridOptions.api.setColumnDefs(colDefs);
}

function addColumn() {
  var colTitle = prompt('Column Name?');

  if (colTitle != null && colTitle != '') {
    console.log('create a new column with this name: ' + colTitle);
  } else {
    return;
  }

  var colDefs = gridOptions.api.getColumnDefs();
  var newCol = getNewCol(colTitle);

  colDefs.push(newCol);

  gridOptions.api.setColumnDefs(colDefs);

  // todo add default value for that column to all rows in rowData
}


/*
    Using Grid Column IDs
*/
function renameColId(id) {

  var colDefs = gridOptions.api.getColumnDefs();
  var editColDef;
  colDefs.forEach(colDef =>{
    if(colDef.colId==id){
      editColDef = colDef;
    }
  })

  var colTitle = prompt('Column Name?', editColDef.headerName);

  if (colTitle != null && colTitle != '') {
    console.log('rename column ' + id + ' with this name: ' + colTitle);
  } else {
    return;
  }

  editColDef.headerName = colTitle;

  
  gridOptions.api.setColumnDefs(colDefs);
}

function deleteColId(id) {

  var colDefs = gridOptions.api.getColumnDefs();

  if(colDefs.length==1){
      alert("Cannot Delete The Only Column");
      return;
  }

  var editColDef;
  colDefs.forEach(colDef =>{
    if(colDef.colId==id){
      editColDef = colDef;
    }
  })

  if(!confirm('Are you Sure You Want to Delete Column Named '+ editColDef.headerName + "?"))
    return;

  var newColDefs = [];

  var editColDef;
  colDefs.forEach(colDef =>{
    if(colDef.colId!=id){
      newColDefs.push(colDef)
    }
  })
  
  gridOptions.api.setColumnDefs(newColDefs);
}

function getNewCol(named){
  var newCol = {};
  newCol.headerName = named;
  newCol.field = 'column' + nextFieldNumber;
  nextFieldNumber++;
  return newCol;
}

function addNeighbourColumnId(position, id) {
  var colTitle = prompt('Column Name?');

  if (colTitle != null && colTitle != '') {
    console.log('create a new neighbour column with this name: ' + colTitle);
  } else {
    return;
  }

  var colDefs = gridOptions.api.getColumnDefs();
  
  var newCol = getNewCol(colTitle);

  // add to right
  colDefs.push(newCol);

  gridOptions.api.setColumnDefs(colDefs);



  // need to use column-state to set the order
  // https://www.ag-grid.com/javascript-grid/column-state/

  var columnState = gridOptions.columnApi.getColumnState();
  var newColumnStates = [];
  var currentColumnState;
  var newColumnState;

  // find new columnId
  var colDefsHunt = gridOptions.api.getColumnDefs();
  var newColId;
  colDefsHunt.forEach(col =>{
    if(col.field == newCol.field){
      console.log(newCol.colId);
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

  gridOptions.columnApi.applyColumnState({ state: newColumnStates, applyOrder: true });

  // todo add default value for that column to all rows in rowData
}





/*
  using position indexes
*/


function renameColumn(id) {
  var colTitle = prompt('Column Name?');

  if (colTitle != null && colTitle != '') {
    console.log('rename column ' + id + ' with this name: ' + colTitle);
  } else {
    return;
  }

  var colDefs = gridOptions.api.getColumnDefs();
  colDefs[id - 1].headerName = colTitle;
  gridOptions.api.setColumnDefs(colDefs);
}

function addRow() {
  gridOptions.api.applyTransaction({ add: [{}] });
}

function getMaxRowIndex(rowNodes){

  var maxIndex=0;
  rowNodes.forEach( node =>{
      if(node.rowIndex>maxIndex){
        maxIndex=node.rowIndex;
      }
    }

  )
  return maxIndex;
}

function getMinRowIndex(rowNodes){

  var minIndex=rowNodes[0].rowIndex;
  rowNodes.forEach( node =>{
      if(node.rowIndex<minIndex){
        minIndex=node.rowIndex;
      }
    }

  )
  return minIndex;
}


function addRows(position) {
  // -1 above, 1 below
  var rowsToAdd = gridOptions.api.getSelectedNodes();

  var positionIndexToAddAt = 0;

  if(rowsToAdd.length==0){
    if(gridOptions.api.getDisplayedRowCount()==0 || position<0){
      rowsToAdd = [{rowIndex:0}];
    }else{
      rowsToAdd = [{rowIndex:gridOptions.api.getDisplayedRowCount()}];
    }
  }
  
  if(position<0){
    positionIndexToAddAt = getMinRowIndex(rowsToAdd);
  }else{
    positionIndexToAddAt = getMaxRowIndex(rowsToAdd)+position;
  }

  if(positionIndexToAddAt<0){
    positionIndexToAddAt=0;
  }

  var objectsToAdd = [];
  var numberOfRowsToAdd = rowsToAdd.length;
  for(var objectCountToAdd=0; objectCountToAdd<numberOfRowsToAdd; objectCountToAdd++){
      objectsToAdd.push({});
  }

  gridOptions.api.applyTransaction({ add: objectsToAdd, addIndex: positionIndexToAddAt });
}

function deleteRows() {
  gridOptions.api.applyTransaction({ remove: gridOptions.api.getSelectedRows() });
}

function csvExport(){
  gridOptions.api.exportDataAsCsv();
}

function logMarkdown() {
  var markdownTable = '';

  //console.log(gridOptions.api.getColumnDefs())
  // output headers
  var headers = gridOptions.api.getColumnDefs().map(col => col.headerName);
  //console.log(headers);

  var fieldnames = gridOptions.api.getColumnDefs().map(col => col.field);
  //console.log(fieldnames);

  // output rows
  //console.log(rowData);
  var gridRowData = [];
  gridOptions.api.forEachNode(node => {
    var vals = [];
    //console.log(node.data);

    for (const propertyid in fieldnames) {
      property = fieldnames[propertyid];
      //console.log(property);
      //console.log(`- ${property}: ${node.data[property]}`);
      vals.push(node.data[property] ? node.data[property] : ' ');
    }
    gridRowData.push(vals);
  });
  //console.log(gridRowData);

  markdownTable = markdownTable + '|' + headers.join('|') + '|' + '\n';
  markdownTable =
    markdownTable + '|' + headers.map(name => '-----').join('|') + '|' + '\n';
  //console.log(gridRowData);
  gridRowData.forEach(values => {
    markdownTable = markdownTable + '|' + values.join('|') + '|' + '\n';
  });
  console.log(markdownTable);
  document.getElementById('markdownarea').value = markdownTable;
}

// use papa parse for csv parsing https://www.papaparse.com/demo
document.addEventListener('DOMContentLoaded', function() {
  const inputElement = document.getElementById('csvinput');
  inputElement.addEventListener('change', handleFiles, false);
});

function setGridFromData(data){

  var header = true;
  data.forEach(row => {
    if (header) {
      createColumns(row);
      header = false;
      gridOptions.api.setRowData([]);
    } else {
      var fieldnames = gridOptions.api
        .getColumnDefs()
        .map(col => col.field);
      var vals = {};
      for (const propertyid in fieldnames) {
        vals[fieldnames[propertyid]] = row[propertyid];
      }
      //console.log(vals);
      gridOptions.api.applyTransaction({ add: [vals] });
    }
  });
}

function handleFiles() {
  //console.log(this.files[0]);
  Papa.parse(this.files[0], {
    complete: function(results) {
      setGridFromData(results.data);
    }
  });
}

// Basic Markdown Table Parsing
function markdownTableToDataRows(markdownTable){
    const rows = markdownTable.split(/[\r\n]+/);
    var data = [];
    var rowCount = 0;
    rows.forEach(row =>{
      var rowString = row.trim();
      
      if(rowString.charAt(0)=="|"){
        rowString = rowString.substring(1);
      }
      if(rowString.charAt(rowString.length-1)=="|"){
        rowString=rowString.slice(0, -1);
      }

      var rowString = rowString.trim();

      if(rowString.length>0 && rowCount!=1){
        var values = rowString.split("|");
        var cellValues = values.map(contents => contents.trim());
        console.log(cellValues);
        data.push(cellValues);
      }

      rowCount++;      
    });

    return data;
}

function importMarkdownText(){
  setGridFromData(
    markdownTableToDataRows(
      document.getElementById("markdownarea").value
    )
  );
}