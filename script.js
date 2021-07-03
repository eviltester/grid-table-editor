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

// generate text file https://jsfiddle.net/ourcodeworld/rce6nn3z/2/
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

// Start file download.
function fileDownload(){

  renderTextFromGrid();

  type = document.querySelector("li.active-type a").getAttribute("data-type");

  if(type=="csv"){
    exporter.csvExport();
    return;
  }

  var filename;

  if(type=="markdown") {
    filename = "export.md";
  }

  if(type=="json"){
    filename = "export.json";
  }
  if(type=="javascript"){
    filename = "export.js";
  }

  var text = document.getElementById("markdownarea").value;
  download(filename, text);

}

function renderTextFromGrid() {

  type = document.querySelector("li.active-type a").getAttribute("data-type");
  var textToRender;

  if(type=="markdown") {
    textToRender = exporter.getGridAsMarkdown();
  }

  if(type=="csv") {
    textToRender = exporter.getGridAsCSV();
  }

  if(type=="json") {
    textToRender = exporter.getGridAsJson();
  }

  if(type=="javascript") {
    textToRender = exporter.getGridAsJavaScriptJson();
  }

  document.getElementById('markdownarea').value = textToRender;
}

/*
  Importing
*/


function importText(){

  typeToImport = document.querySelector("li.active-type a").getAttribute("data-type");
  textToImport = document.getElementById("markdownarea").value;

  if(type=="markdown") {
    importer.importMarkDownTextFrom(textToImport)
  }

  if(type=="csv") {
    importer.setGridFromData(Papa.parse(textToImport).data);
  }

  if(type=="json" || type=="javascript") {
    importer.setGridFromData(Papa.parse(Papa.unparse(JSON.parse(textToImport))).data);
  }

}