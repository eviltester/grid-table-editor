import { Importer } from "./grid/importer.js";
import { Exporter } from "./grid/exporter.js";
import { enableTestDataGenerationInterface } from "./gui_components/testdatadefn.js";
import { ExtendedDataGrid, activeGridEngine } from "./gui_components/data-grid-editor/main-display-grid.js";
import { ensureGridLibraryLoaded } from "./gui_components/data-grid-editor/grid-library-loader.js";
import { TabbedTextControl } from "./gui_components/tabbed-text-control.js"
import { ImportExportControls } from "./gui_components/import-export-controls.js";
import { GenericDataTable } from "./data_formats/generic-data-table.js";

var importer, exporter;
var mainDataGrid;
var importExportController;


async function bootstrapApp({
  documentObj = document,
  ensureGridLibraryLoadedFn = ensureGridLibraryLoaded,
  activeGridEngineName = activeGridEngine,
  ExtendedDataGridClass = ExtendedDataGrid,
  ImportExportControlsClass = ImportExportControls,
  TabbedTextControlClass = TabbedTextControl,
  ExporterClass = Exporter,
  ImporterClass = Importer,
  enableTestDataGenerationInterfaceFn = enableTestDataGenerationInterface,
  scheduleInitialInstructions = true,
  setTimeoutFn = setTimeout
} = {}) {

  console.log(`Using grid engine: ${activeGridEngineName}`);
  try{
    await ensureGridLibraryLoadedFn({ engine: activeGridEngineName });
  }catch(error){
    console.error(`Failed to load ${activeGridEngineName} library`, error);
    return;
  }
  
  let mainGridArea = documentObj.getElementById("main-grid-view");
  mainDataGrid = new ExtendedDataGridClass();
  mainDataGrid.createChildGrid(mainGridArea);

  importExportController = new ImportExportControlsClass();
  importExportController.addHTMLtoGui(documentObj.getElementById("import-export-controls"));

  new TabbedTextControlClass(documentObj.getElementById("tabbedTextArea"), importExportController).addToGui();


  exporter = new ExporterClass(mainDataGrid.getGridExtras());
  importer = new ImporterClass(mainDataGrid.getGridExtras());
  importExportController.setExporter(exporter);
  importExportController.setImporter(importer);


  // give a clue what to do by importing the instructions into the grid
  if(scheduleInitialInstructions){
    setTimeoutFn(setTextFromInstructions,3000);
  }

  importExportController.renderTextFromGrid();
  importExportController.setFileFormatType();
  importExportController.setOptionsViewForFormatType();

  enableTestDataGenerationInterfaceFn("testDataGeneratorContainer", importer, importExportController.getExportControls(), documentObj);

}

// setup the grid after the page has finished loading
if(typeof document !== "undefined"){
  document.addEventListener('DOMContentLoaded', async function() {
    await bootstrapApp();
  });
}


function setTextFromInstructions(){
  console.log("Setting Grid Instructions");
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

export { bootstrapApp }
