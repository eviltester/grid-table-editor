import { Importer } from "./grid/importer.js";
import { Exporter } from "./grid/exporter.js";
import { enableTestDataGenerationInterface } from "./gui_components/testdatadefn.js";
import { ExtendedDataGrid } from "./gui_components/data-grid-editor/ag-grid/main-display-grid.js";
import { TabbedTextControl } from "./gui_components/tabbed-text-control.js"
import { ImportExportControls } from "./gui_components/import-export-controls.js";
import { GenericDataTable } from "./data_formats/generic-data-table.js";

var importer, exporter;
var mainDataGrid;
var importExportController;


// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
  
  let mainGridArea = document.getElementById("main-grid-view");
  mainDataGrid = new ExtendedDataGrid();
  mainDataGrid.createChildGrid(mainGridArea);

  importExportController = new ImportExportControls();
  importExportController.addHTMLtoGui(document.getElementById("import-export-controls"));

  new TabbedTextControl(document.getElementById("tabbedTextArea"), importExportController).addToGui();


  exporter = new Exporter(mainDataGrid.getGridExtras());
  importer = new Importer(mainDataGrid.getGridExtras());
  importExportController.setExporter(exporter);
  importExportController.setImporter(importer);


  // give a clue what to do by importing the instructions into the grid
  setTextFromInstructions();

  importExportController.renderTextFromGrid();
  importExportController.setFileFormatType();
  importExportController.setOptionsViewForFormatType();

  enableTestDataGenerationInterface("testDataGeneratorContainer", importer, importExportController.getExportControls());

});


function setTextFromInstructions(){
  mainDataGrid.getGridExtras().clearGrid();
  const instructions = document.querySelectorAll("div.instructions details ul li");
  let textData = new GenericDataTable();
  textData.addHeader("Instructions");
  instructions.forEach(instruction => {
    textData.appendDataRow([instruction.textContent]);
  })
  importer.setGridFromGenericDataTable(textData);
  // set the instructions to fit grid size
  mainDataGrid.sizeColumnsToFit()
}
