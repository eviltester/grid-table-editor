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

var importer, exporter;

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

  // having setup the grid, make it a little more responsive
  setTimeout(function(){document.getElementById("myGrid").style.height="40%";},1000)

  gridExtras = new GridExtension(gridOptions.api, gridOptions.columnApi);

  exporter = new Exporter(gridOptions.api);
  importer = new Importer(gridOptions.api, gridExtras);

  inputElement = document.getElementById('csvinput');
  inputElement.addEventListener('change', handleFiles, false);
});

    // use papa parse for csv parsing https://www.papaparse.com/demo
   function handleFiles() {
        //console.log(this.files[0]);
        Papa.parse(this.files[0], {
          complete: function(results) {
            importer.setGridFromData(results.data);
          }
        });
    }


/*
    Grid Amendments with Guarded Alerts
*/
function renameColId(id) {

  var editColDef = gridExtras.getColumnDef(id);
  var colTitle = prompt('Column Name?', editColDef.headerName);

  if (colTitle != null && colTitle != '') {
    console.log('rename column ' + id + ' with this name: ' + colTitle);
  } else {
    return;
  }

  gridExtras.renameColId(id, colTitle);
}

function deleteColId(id) {

  var colDefs = gridOptions.api.getColumnDefs();

  if(colDefs.length==1){
      alert("Cannot Delete The Only Column");
      return;
  }

  editColDef = gridExtras.getColumnDef(id);

  if(!confirm('Are you Sure You Want to Delete Column Named '+ editColDef.headerName + "?"))
    return;

  gridExtras.deleteColumnId(id);

}


function addNeighbourColumnId(position, id) {
  var colTitle = prompt('Column Name?');

  if (colTitle != null && colTitle != '') {
    console.log('create a new neighbour column with this name: ' + colTitle);
  } else {
    return;
  }

  gridExtras.addNeighbourColumnId(position, id, colTitle);
}


function renameColumn(id) {
  var colTitle = prompt('Column Name?');

  if (colTitle != null && colTitle != '') {
    console.log('rename column ' + id + ' with this name: ' + colTitle);
  } else {
    return;
  }

  gridExtras.renameColId(id,colTitle);
}


function addRow() {
  gridExtras.addRow();
}

function addRows(position) {
  gridExtras.addRowsRelativeToSelection(position);
}

function deleteSelectedRows() {
  if(!confirm('Are you Sure You Want to Delete Rows?'))
    return;

  gridExtras.deleteSelectedRows();
}



/*
  Exporting
 */
function csvExport(){
  exporter.csvExport();
}

function logMarkdown() {

  inDevExports(); // simple test while developing text views

  var markdownTable = exporter.getGridAsMarkdown();

  console.log(markdownTable);
  document.getElementById('markdownarea').value = markdownTable;
}



function inDevExports() {
  console.log(exporter.getGridAsJson());
  console.log(exporter.getGridAsJavaScriptJson());
  console.log(exporter.getGridAsCSV())
}

/*
  Importing
 */


function importMarkdownText(){
  importer.importMarkDownTextFrom(document.getElementById("markdownarea").value)
}