import { Importer } from '@anywaydata/core/grid/importer.js';
import { Exporter } from '@anywaydata/core/grid/exporter.js';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { mountTestDataGenerationPanel } from '../test-data-grid/index.js';
import { ExtendedDataGrid, activeGridEngine } from '../../data-grid-editor/main-display-grid.js';
import { ensureGridLibraryLoaded } from '../../data-grid-editor/grid-library-loader.js';
import { createImportExportWorkspaceComponent } from '../import-export-workspace/index.js';
import { createInstructionsComponent, APP_PAGE_INSTRUCTIONS_PROPS } from '../../shared/instructions/index.js';
import { createAppPageComponent } from './app-page-shell.js';
import { initHelpTooltips } from '../../../help/help-tooltips.js';
import { initThemeToggle } from '../../shared/theme-toggle.js';
import { createPageStartupLoadingStatus } from '../../shared/page-startup-loading-status.js';
import { getDefaultDocumentObj, resolveWindowObj } from '../../shared/dom/default-objects.js';

function createSampleGridData() {
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

  return sampleData;
}

function createInstructionsGridData({ items = APP_PAGE_INSTRUCTIONS_PROPS.items } = {}) {
  const instructionsData = new GenericDataTable();
  instructionsData.addHeader('Instructions');

  items.forEach((instruction) => {
    instructionsData.appendDataRow([instruction]);
  });

  return instructionsData;
}

function createInstructionsGridActions({ documentObj = getDefaultDocumentObj(), getMainDataGrid, getImporter } = {}) {
  let clickHandler = null;

  function loadGridData(dataTable) {
    const mainDataGrid = getMainDataGrid?.();
    const importer = getImporter?.();
    if (!mainDataGrid || !importer) {
      return;
    }

    mainDataGrid.getGridExtras().clearGrid();
    importer.setGridFromGenericDataTable(dataTable);
    mainDataGrid.sizeColumnsToFit();
  }

  function setSampleGridData() {
    loadGridData(createSampleGridData());
  }

  function setInstructionsGridData() {
    loadGridData(createInstructionsGridData());
  }

  function bind() {
    if (clickHandler) {
      documentObj?.removeEventListener?.('click', clickHandler);
    }

    clickHandler = (event) => {
      if (event.target.closest('.instructions-sample-data-button')) {
        event.preventDefault();
        event.stopPropagation();
        setSampleGridData();
        return;
      }

      if (event.target.closest('.instructions-copy-to-grid-button')) {
        event.preventDefault();
        event.stopPropagation();
        setInstructionsGridData();
      }
    };

    documentObj?.addEventListener?.('click', clickHandler);
  }

  function destroy() {
    if (clickHandler) {
      documentObj?.removeEventListener?.('click', clickHandler);
      clickHandler = null;
    }
  }

  return {
    bind,
    destroy,
    setSampleGridData,
    setInstructionsGridData,
  };
}

async function bootstrapApp({
  documentObj = getDefaultDocumentObj(),
  ensureGridLibraryLoadedFn = ensureGridLibraryLoaded,
  activeGridEngineName = activeGridEngine,
  ExtendedDataGridClass = ExtendedDataGrid,
  createImportExportWorkspaceComponentFn = createImportExportWorkspaceComponent,
  createAppPageComponentFn = createAppPageComponent,
  createInstructionsComponentFn = createInstructionsComponent,
  ExporterClass = Exporter,
  ImporterClass = Importer,
  mountTestDataGenerationPanelFn = mountTestDataGenerationPanel,
  enableTestDataGenerationInterfaceFn,
} = {}) {
  if (!documentObj) {
    return null;
  }
  initThemeToggle({ documentObj, windowObj: resolveWindowObj(null, documentObj) });
  const pageRoot = documentObj.getElementById('app-page-root');
  const appPageComponent = pageRoot
    ? createAppPageComponentFn({
        root: pageRoot,
      })
    : null;
  const startupLoadingStatus = createPageStartupLoadingStatus({
    documentObj,
    elementId: 'initial-load',
  });
  startupLoadingStatus.show();

  console.log(`Using grid engine: ${activeGridEngineName}`);
  try {
    await ensureGridLibraryLoadedFn({ engine: activeGridEngineName });
  } catch (error) {
    console.error(`Failed to load ${activeGridEngineName} library`, error);
    startupLoadingStatus.fail();
    return null;
  }

  let mainDataGrid = null;
  let instructionsComponent = null;
  let importExportController = null;
  let exporter = null;
  let importer = null;
  let instructionsGridActions = null;
  try {
    mainDataGrid = new ExtendedDataGridClass();
    mainDataGrid.createChildGrid(documentObj.getElementById('main-grid-view'));

    const instructionsRoot = documentObj.getElementById('page-instructions');
    instructionsComponent = instructionsRoot
      ? createInstructionsComponentFn({
          root: instructionsRoot,
          props: APP_PAGE_INSTRUCTIONS_PROPS,
        })
      : null;

    importExportController = createImportExportWorkspaceComponentFn({
      root: documentObj.getElementById('import-export-controls'),
      documentObj,
    });

    exporter = new ExporterClass(mainDataGrid.getGridExtras());
    importer = new ImporterClass(mainDataGrid.getGridExtras());
    importExportController.setExporter(exporter);
    importExportController.setImporter(importer);
    importExportController.setGridChangeSource?.(mainDataGrid.getGridExtras());

    importExportController.renderTextFromGrid();
    importExportController.setFileFormatType();
    importExportController.setOptionsViewForFormatType();
    initHelpTooltips({ documentObj, includeAppOnlyEntries: true });

    instructionsGridActions = createInstructionsGridActions({
      documentObj,
      getMainDataGrid: () => mainDataGrid,
      getImporter: () => importer,
    });
    instructionsGridActions.bind();

    const mountTestDataGeneration = enableTestDataGenerationInterfaceFn || mountTestDataGenerationPanelFn;
    mountTestDataGeneration(
      'testDataGeneratorContainer',
      importer,
      importExportController,
      mainDataGrid.getGridExtras()
    );
    startupLoadingStatus.clear();
  } catch (error) {
    startupLoadingStatus.fail();
    throw error;
  }

  return {
    mainDataGrid,
    importExportController,
    importer,
    exporter,
    instructionsGridActions,
    instructionsComponent,
    destroy() {
      instructionsGridActions.destroy();
      instructionsComponent?.destroy?.();
      importExportController?.destroy?.();
      mainDataGrid?.destroy?.();
      appPageComponent?.destroy?.();
    },
  };
}

export { bootstrapApp };
