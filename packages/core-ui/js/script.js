import { Importer } from '@anywaydata/core/grid/importer.js';
import { Exporter } from '@anywaydata/core/grid/exporter.js';
import { enableTestDataGenerationInterface } from './gui_components/testdatadefn.js';
import { ExtendedDataGrid, activeGridEngine } from './gui_components/data-grid-editor/main-display-grid.js';
import { ensureGridLibraryLoaded } from './gui_components/data-grid-editor/grid-library-loader.js';
import { TabbedTextControl } from './gui_components/tabbed-text-control.js';
import { ImportExportControls } from './gui_components/import-export-controls.js';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { initHelpTooltips } from './help/help-tooltips.js';
import { initThemeToggle } from './gui_components/theme-toggle.js';

var importer, exporter;
var mainDataGrid;
var importExportController;
var instructionsSampleButtonClickHandler;

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
} = {}) {
  initThemeToggle({ documentObj, windowObj: documentObj?.defaultView || window });

  console.log(`Using grid engine: ${activeGridEngineName}`);
  try {
    await ensureGridLibraryLoadedFn({ engine: activeGridEngineName });
  } catch (error) {
    console.error(`Failed to load ${activeGridEngineName} library`, error);
    return;
  }

  let mainGridArea = documentObj.getElementById('main-grid-view');
  mainDataGrid = new ExtendedDataGridClass();
  mainDataGrid.createChildGrid(mainGridArea);

  importExportController = new ImportExportControlsClass();
  importExportController.addHTMLtoGui(documentObj.getElementById('import-export-controls'));

  new TabbedTextControlClass(documentObj.getElementById('tabbedTextArea'), importExportController).addToGui();

  exporter = new ExporterClass(mainDataGrid.getGridExtras());
  importer = new ImporterClass(mainDataGrid.getGridExtras());
  importExportController.setExporter(exporter);
  importExportController.setImporter(importer);
  importExportController.setGridChangeSource?.(mainDataGrid.getGridExtras());

  importExportController.renderTextFromGrid();
  importExportController.setFileFormatType();
  importExportController.setOptionsViewForFormatType();
  initHelpTooltips({ documentObj, includeAppOnlyEntries: true });
  wireInstructionsSampleButton(documentObj);

  const loadingMessage = documentObj.getElementById('initial-load');
  if (loadingMessage) {
    loadingMessage.remove();
  }

  enableTestDataGenerationInterfaceFn(
    'testDataGeneratorContainer',
    importer,
    importExportController,
    mainDataGrid.getGridExtras()
  );
}

// setup the grid after the page has finished loading
if (typeof document !== 'undefined') {
  const runBootstrap = async function () {
    await bootstrapApp();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runBootstrap, { once: true });
  } else {
    runBootstrap();
  }
}

function setSampleGridData() {
  if (!mainDataGrid || !importer) {
    return;
  }

  const sampleData = new GenericDataTable();
  sampleData.addHeader('First Name');
  sampleData.addHeader('Last Name');
  sampleData.addHeader('Department');
  sampleData.addHeader('Role');
  sampleData.addHeader('Status');

  sampleData.appendDataRow(['Ava', 'Nguyen', 'Engineering', 'QA Engineer', 'Active']);
  sampleData.appendDataRow(['Liam', 'Patel', 'Sales', 'Account Executive', 'Onboarding']);
  sampleData.appendDataRow(['Noah', 'Carter', 'Finance', 'Analyst', 'Active']);
  sampleData.appendDataRow(['Mia', 'Roberts', 'Support', 'Team Lead', 'On Leave']);

  mainDataGrid.getGridExtras().clearGrid();
  importer.setGridFromGenericDataTable(sampleData);
  mainDataGrid.sizeColumnsToFit();
}

function setInstructionsGridData(documentObj = document) {
  if (!mainDataGrid || !importer) {
    return;
  }

  const instructions = documentObj.querySelectorAll('div.instructions details ul li');
  const instructionsData = new GenericDataTable();
  instructionsData.addHeader('Instructions');

  instructions.forEach((instruction) => {
    instructionsData.appendDataRow([instruction.textContent]);
  });

  mainDataGrid.getGridExtras().clearGrid();
  importer.setGridFromGenericDataTable(instructionsData);
  mainDataGrid.sizeColumnsToFit();
}

function wireInstructionsSampleButton(documentObj = document) {
  if (instructionsSampleButtonClickHandler) {
    documentObj.removeEventListener('click', instructionsSampleButtonClickHandler);
  }

  const handleInstructionsSampleButtonClick = (event) => {
    if (event.target.closest('.instructions-sample-data-button')) {
      event.preventDefault();
      event.stopPropagation();
      setSampleGridData();
      return;
    }

    if (event.target.closest('.instructions-copy-to-grid-button')) {
      event.preventDefault();
      event.stopPropagation();
      setInstructionsGridData(documentObj);
    }
  };

  instructionsSampleButtonClickHandler = handleInstructionsSampleButtonClick;
  documentObj.addEventListener('click', instructionsSampleButtonClickHandler);
}

export { bootstrapApp };
