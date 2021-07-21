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
    editable: true,
    filter:true,
    sortable:true,
  },

  components: {
    agColumnHeader: CustomHeader,
  },
  
  rowDragManaged: true,
  enableMultiRowDragging: true,
  rowSelection: 'multiple',
  onColumnResized: (params) => {params.api.resetRowHeights();}
};

var importer, exporter;

// setup the grid after the page has finished loading 
document.addEventListener('DOMContentLoaded', function() {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

  // having setup the grid, make it a little more responsive
  setTimeout(function(){document.getElementById("myGrid").style.height="40%";},1000)

  gridExtras = new GridExtension(gridOptions.api, gridOptions.columnApi);

  gridControls = new GridControl(gridExtras, new PageMap());
  gridControls.addHooksToPage(document);

  exporter = new Exporter(gridOptions.api);
  importer = new Importer(gridOptions.api, gridExtras);

  inputElement = document.getElementById('csvinput');
  inputElement.addEventListener('change', loadFile, false);

  // give a clue what to do by importing the instructions into the grid
  
  setTextFromInstructions();

  // setup the drop zone
  const dragDrop = new DragDropControl();
  dragDrop.configureAsDropZone(document.getElementById("dropzone"));

});

  // use papa parse for csv parsing https://www.papaparse.com/demo
 function loadFile() {

   type = document.querySelector("li.active-type a").getAttribute("data-type");

   if(type=="csv") {
     //console.log(this.files[0]);
     Papa.parse(this.files[0], {
       complete: function (results) {
         importer.setGridFromData(results.data);
         renderTextFromGrid();
       }
     });
     return;
   }

   this.readFile(this.files[0]);

 }

 function readFile(aFile){
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      setTextFromString(event.target.result);
      importText();
    });
    reader.readAsText(aFile);
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
    return false;
  }

  if(gridExtras.nameAlreadyExists(colTitle)){
    alert(`A column with name ${colTitle} already exists`);
    return false;
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


function duplicateColumnId(position, id) {
  var colTitle = prompt('Copy Column As?');

  if (colTitle != null && colTitle != '') {
    console.log('duplicate a column with this name: ' + colTitle);
  } else {
    return;
  }

  if(gridExtras.nameAlreadyExists(colTitle)){
    alert(`A column with name ${colTitle} already exists`);
    return false;
  }

  gridExtras.duplicateColumn(position, id, colTitle);
}

function addNeighbourColumnId(position, id) {
  var colTitle = prompt('New Column Name?');

  if (colTitle != null && colTitle != '') {
    console.log('create a new neighbour column with this name: ' + colTitle);
  } else {
    return;
  }

  if(gridExtras.nameAlreadyExists(colTitle)){
    alert(`A column with name ${colTitle} already exists`);
    return false;
  }

  gridExtras.addNeighbourColumnId(position, id, colTitle);
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
  if(type=="gherkin"){
    filename = "export.gherkin";
  }
  if(type=="html"){
    filename = "export.html";
  }

  var text = document.getElementById("markdownarea").value;
  download(filename, text);

}

function setFileFormatType(){
  type = document.querySelector("li.active-type a").getAttribute("data-type");

  var fileType;

  if(type=="csv"){
    fileType=".csv";
  }

  var filename;

  if(type=="markdown") {
    fileType=".md";
  }

  if(type=="json"){
    fileType=".json";
  }
  if(type=="javascript"){
    fileType=".js";
  }
  if(type=="gherkin"){
    fileType=".gherkin";
  }
  if(type=="html"){
    fileType=".html";
  }

  document.querySelectorAll(".fileFormat").forEach(elem => elem.innerText = fileType);
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

  if(type=="gherkin") {
    textToRender = exporter.getGridAsGherkin();
  }

  if(type=="html") {
    textToRender = exporter.getGridAsHTML();
  }

  setTextFromString(textToRender);
}

function setTextFromString(textToRender){
  document.getElementById('markdownarea').value = textToRender;
}

/*
  Importing
*/

function setTextFromInstructions(){
  gridExtras.clearGrid();
  var instructions = document.querySelectorAll("div.instructions details ul li");
  var textData = [];
  textData.push(["Instructions"]);
  instructions.forEach(instruction => {
    textData.push([instruction.innerText]);
  })
  importer.setGridFromData(textData);
}

function importText(){

  typeToImport = document.querySelector("li.active-type a").getAttribute("data-type");
  textToImport = document.getElementById("markdownarea").value;

  if(typeToImport=="html") {
    console.log("not implemented html import yet");
    return;
  }

  if(typeToImport=="markdown" || typeToImport=="gherkin") {
    importer.importMarkDownTextFrom(textToImport)
  }

  if(typeToImport=="gherkin") {
    importer.importMarkDownTextFrom(textToImport)
  }

  if(typeToImport=="csv") {
    var results=Papa.parse(textToImport);
    //console.log(results.errors);
    importer.setGridFromData(results.data);
  }

  if(typeToImport=="json" || typeToImport=="javascript") {
    importer.setGridFromData(Papa.parse(Papa.unparse(JSON.parse(textToImport))).data);
  }

}

function copyText() {
  // todo refactor out into a page model
  var copyText = document.getElementById("markdownarea");

  // select text
  copyText.select();
  copyText.setSelectionRange(0, 99999);

  document.execCommand("copy");

  document.getElementById("copyTextButton").innerText = "Copied";
  setTimeout(
    function(){ document.getElementById("copyTextButton").innerText = "Copy"; }
    , 3000);
}