import { Importer } from "./grid/importer.js";
import { Exporter } from "./grid/exporter.js";
import { enableTestDataGenerationInterface } from "./gui_components/testdatadefn.js";
import { ExtendedDataGrid } from "./gui_components/main-display-grid.js";
import {TabbedTextControl} from "./gui_components/tabbed-text-control.js"
import { ImportExportControls } from "./gui_components/import-export-controls.js";



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


  exporter = new Exporter(mainDataGrid.getGridApi());
  importer = new Importer(mainDataGrid.getGridApi(), mainDataGrid.getGridExtras());
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
  let textData = [];
  textData.push(["Instructions"]);
  instructions.forEach(instruction => {
    textData.push([instruction.textContent]);
  })
  importer.setGridFromData(textData);
  // set the instructions to fit grid size
  mainDataGrid.getGridApi().sizeColumnsToFit()
}
