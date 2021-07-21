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

  exportControls = new ExportControls(exporter, new ExportsPageMap(),
                                      fileTypes, renderTextFromGrid)
                    .addHooksToPage(document);

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
  Exporting and Importing
 */

// generate text file https://jsfiddle.net/ourcodeworld/rce6nn3z/2/

const fileTypes ={};
fileTypes["csv"] = {type: "csv", fileExtension: ".csv"};
fileTypes["markdown"] =   {type: "markdown", fileExtension: ".md"};
fileTypes["json"] =   {type: "json", fileExtension: ".json"};
fileTypes["javascript"] =   {type: "javascript", fileExtension: ".js"};
fileTypes["gherkin"] =   {type: "gherkin", fileExtension: ".gherkin"};
fileTypes["html"] = {type: "html", fileExtension: ".html"};


// Start file download.


function setFileFormatType(){
  type = document.querySelector("li.active-type a").getAttribute("data-type");

  importControlLocators = ["#importtextbutton", "#filedownload", "#dropzone", "#csvinputlabel", "#csvinput"];
  importControls = [];
  importControlLocators.forEach(locator => 
    { 
      var elem = document.querySelector(locator);
      if(elem){
        importControls.push(elem);
      }
  })

  if(!fileTypes.hasOwnProperty(type)){
    console.log(`Data Type ${type} not supported`);
    return;
  }

  importVisibility = "visible";

  if(!importer.canImport(type)){
    console.log(`Data Type ${type} not supported for importing`);
    importVisibility="hidden";
  }

  importControls.forEach(e => e.style.visibility = importVisibility);

  const fileType = fileTypes[type].fileExtension;

  document.querySelectorAll(".fileFormat").forEach(elem => elem.innerText = fileType);
}

function renderTextFromGrid() {

  type = document.querySelector("li.active-type a").getAttribute("data-type");

  if(!exporter.canExport(type)){
    console.log(`Data Type ${type} not supported for exporting`);
    return;
  }

  setTextFromString(exporter.getGridAs(type));
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
  // set the instructions to fit grid size
  gridOptions.api.sizeColumnsToFit()
}

function importText(){

  typeToImport = document.querySelector("li.active-type a").getAttribute("data-type");
  textToImport = document.getElementById("markdownarea").value;

  if(!fileTypes.hasOwnProperty(typeToImport)){
    console.log(`Data Type ${typeToImport} not supported`);
    return;
  }

  if(!importer.canImport(typeToImport)){
    console.log(`Data Type ${typeToImport} not supported for importing`);
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

