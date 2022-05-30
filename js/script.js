import { Importer } from "./data_formats/importer.js";
import { Exporter } from "./exporter.js";
import { GridExtension } from "./grid/gridExtension.js";
import { DragDropControl } from "./gui_components/drag-drop-dontrol.js";
import { GridControl, GridControlsPageMap } from "./gui_components/gridControl.js"
import { CustomHeader } from "./grid/customHeader.js";
import { ExportControls, ExportsPageMap } from "./gui_components/exportControls.js";
import { enableTestDataGenerationInterface } from "./testdatadefn.js";


var rowData = [];

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
  rowDragMultiRow: true,
  rowSelection: 'multiple',
  //onColumnResized: (params) => {params.api.resetRowHeights();}
};

var importer, exporter;
var gridExtras;


function readFile(aFile){
  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    setTextFromString(event.target.result);
    importTextArea();
  });
  reader.readAsText(aFile);
}

window.readFile = readFile;


// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

  // having setup the grid, make it a little more responsive
  setTimeout(function(){document.getElementById("myGrid").style.height="40%";},1000)

  gridExtras = new GridExtension(gridOptions.api, gridOptions.columnApi);

  let gridControls = new GridControl(gridExtras, new GridControlsPageMap());
  gridControls.addHooksToPage(document);

  exporter = new Exporter(gridOptions.api);
  window.exporter = exporter;
  importer = new Importer(gridOptions.api, gridExtras);
  window.importer = importer;

  let exportControls = new ExportControls(exporter, new ExportsPageMap(),
                                      fileTypes, renderTextFromGrid)
                    .addHooksToPage(document);

  let inputElement = document.getElementById('csvinput');
  inputElement.addEventListener('change', loadFile, false);

  // give a clue what to do by importing the instructions into the grid
  setTextFromInstructions();

  // setup the drop zone
  const dragDrop = new DragDropControl(readFile);
  dragDrop.configureAsDropZone(document.getElementById("dropzone"));

});

  // use papa parse for csv parsing https://www.papaparse.com/demo
function loadFile() {

  let type = document.querySelector("li.active-type a").getAttribute("data-type");

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

  readFile(this.files[0]);

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
  const type = document.querySelector("li.active-type a").getAttribute("data-type");

  const importControlLocators = ["#importtextbutton", "#filedownload", "#dropzone", "#csvinputlabel", "#csvinput"];
  let importControls = [];
  importControlLocators.forEach(locator =>{ 
      let elem = document.querySelector(locator);
      if(elem){
        importControls.push(elem);
      }
  })

  if(!fileTypes.hasOwnProperty(type)){
    console.log(`Data Type ${type} not supported`);
    return;
  }

  let importVisibility = "visible";

  if(!importer.canImport(type)){
    console.log(`Data Type ${type} not supported for importing`);
    importVisibility="hidden";
  }

  importControls.forEach(e => e.style.visibility = importVisibility);

  const fileType = fileTypes[type].fileExtension;

  document.querySelectorAll(".fileFormat").forEach(elem => elem.innerText = fileType);
}

window.setFileFormatType = setFileFormatType;

function renderTextFromGrid() {

  let type = document.querySelector("li.active-type a").getAttribute("data-type");

  if(!exporter.canExport(type)){
    console.log(`Data Type ${type} not supported for exporting`);
    return;
  }

  setTextFromString(exporter.getGridAs(type));
}

window.renderTextFromGrid = renderTextFromGrid;

function setTextFromString(textToRender){
  document.getElementById('markdownarea').value = textToRender;
}



/*
  Importing
*/

function setTextFromInstructions(){
  gridExtras.clearGrid();
  const instructions = document.querySelectorAll("div.instructions details ul li");
  let textData = [];
  textData.push(["Instructions"]);
  instructions.forEach(instruction => {
    textData.push([instruction.textContent]);
  })
  importer.setGridFromData(textData);
  // set the instructions to fit grid size
  gridOptions.api.sizeColumnsToFit()
}

function importTextArea(){
  const typeToImport = document.querySelector("li.active-type a").getAttribute("data-type");
  const textToImport = document.getElementById("markdownarea").value;
  importer.importText(typeToImport, textToImport);
}

window.importTextArea = importTextArea;



window.addEventListener('load', function() {
  document.querySelectorAll(".type-select-action").forEach( lielem => lielem.addEventListener("click", (e) => {

    // set the display buttons
    document.querySelectorAll(".type-select").forEach(elem => elem.classList.remove("active-type"));

    e.target.parentElement.classList.add("active-type");

    // switched tab so re-render text
    window.renderTextFromGrid();
    window.setFileFormatType();
    // don't try to navigate
    return false;
  }));

  enableTestDataGenerationInterface("testDataGeneratorContainer", importer, renderTextFromGrid);
})