import { Importer } from '@anywaydata/core/grid/importer.js';
import { Exporter } from '@anywaydata/core/grid/exporter.js';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { mountTestDataGenerationPanel } from '../test-data-grid/controller/test-data-grid-controller.js';
import { createDataGridComponent } from '../../data-grid-editor/index.js';
import { ensureGridLibraryLoaded } from '../../data-grid-editor/grid-library-loader.js';
import { GridExtension as TabulatorGridExtension } from '../../data-grid-editor/tabulator/gridExtension-tabulator.js';
import { createImportExportWorkspaceComponent } from '../import-export-workspace/index.js';
import { createDefaultTabDefinitions } from '../format-selector/format-selector-controller.js';
import { createInstructionsComponent } from '../../shared/instructions/index.js';
import { APP_PAGE_INSTRUCTIONS_PROPS } from '../../shared/instructions/app-page-instructions.js';
import { createAppPageComponent } from './app-page-shell.js';
import { initHelpTooltips } from '../../../help/help-tooltips.js';
import { createThemeToggleComponent } from '../../shared/theme-toggle.js';
import { createPageStartupLoadingStatus } from '../../shared/page-startup-loading-status.js';
import { getDefaultDocumentObj, resolveWindowObj } from '../../shared/dom/default-objects.js';

function resolveThemeToggleHostElement(documentObj) {
  return documentObj?.querySelector?.('[data-role="theme-toggle-host"]') || null;
}

function resolveAppStartupLoadingElement(documentObj) {
  return documentObj?.getElementById?.('initial-load') || null;
}

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
      const actionButton = event.target.closest?.('[data-role="instructions-action-button"]');
      const actionId = actionButton?.getAttribute?.('data-action-id');
      if (!actionId) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (actionId === 'load-sample-data') {
        setSampleGridData();
        return;
      }

      if (actionId === 'copy-instructions-to-grid') {
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

function createContextMenuFormatItems() {
  return createDefaultTabDefinitions().flatMap((definition) => {
    if (Array.isArray(definition.subtasks)) {
      return definition.subtasks.map((subtask) => ({
        type: subtask.selectedType || subtask.type,
        label: subtask.label,
      }));
    }
    return definition.type ? [{ type: definition.type, label: definition.label }] : [];
  });
}

async function bootstrapApp({
  documentObj = getDefaultDocumentObj(),
  ensureGridLibraryLoadedFn = ensureGridLibraryLoaded,
  createDataGridComponentFn = createDataGridComponent,
  TabulatorCtor,
  GridExtensionClass = TabulatorGridExtension,
  createImportExportWorkspaceComponentFn = createImportExportWorkspaceComponent,
  createAppPageComponentFn = createAppPageComponent,
  createInstructionsComponentFn = createInstructionsComponent,
  ExporterClass = Exporter,
  ImporterClass = Importer,
  mountTestDataGenerationPanelFn = mountTestDataGenerationPanel,
  initHelpTooltipsFn = initHelpTooltips,
} = {}) {
  if (!documentObj) {
    return null;
  }
  const resolvedWindowObj = resolveWindowObj(null, documentObj);
  const resolvedTabulatorCtor = TabulatorCtor || resolvedWindowObj?.Tabulator || globalThis.Tabulator;
  const themeToggle = createThemeToggleComponent({
    documentObj,
    windowObj: resolvedWindowObj,
    hostElement: resolveThemeToggleHostElement(documentObj),
  });
  const pageRoot = documentObj.getElementById('app-page-root');
  const appPageComponent = pageRoot
    ? createAppPageComponentFn({
        root: pageRoot,
      })
    : null;
  const startupLoadingStatus = createPageStartupLoadingStatus({
    documentObj,
    resolveElement: () => resolveAppStartupLoadingElement(documentObj),
  });
  startupLoadingStatus.show();

  console.log('Using grid engine: tabulator');
  try {
    await ensureGridLibraryLoadedFn({ document: documentObj });
  } catch (error) {
    console.error('Failed to load tabulator library', error);
    startupLoadingStatus.fail();
    return null;
  }

  let mainDataGrid = null;
  let instructionsComponent = null;
  let importExportController = null;
  let exporter = null;
  let importer = null;
  let instructionsGridActions = null;
  const contextMenuFormatItems = createContextMenuFormatItems();
  try {
    mainDataGrid = createDataGridComponentFn({
      root: documentObj.getElementById('main-grid-view'),
      documentObj,
      services: {
        TabulatorCtor: resolvedTabulatorCtor,
        GridExtensionClass,
        getPreviewExportFormats: () => contextMenuFormatItems,
        previewAs: async (format) => {
          importExportController?.openDetails?.();
          return importExportController?.previewAs?.(format);
        },
        exportAs: async (format) => {
          importExportController?.openDetails?.();
          return importExportController?.downloadAs?.(format);
        },
      },
    });

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
    initHelpTooltipsFn({
      documentObj,
      includeAppOnlyEntries: true,
      rootElement: pageRoot || documentObj,
    });

    instructionsGridActions = createInstructionsGridActions({
      documentObj,
      getMainDataGrid: () => mainDataGrid,
      getImporter: () => importer,
    });
    instructionsGridActions.bind();

    mountTestDataGenerationPanelFn(
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
      themeToggle?.destroy?.();
    },
  };
}

export { bootstrapApp };
