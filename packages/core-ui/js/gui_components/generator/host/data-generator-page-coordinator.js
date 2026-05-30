/*
 * Responsibilities:
 * - Generator-page host composition and event binding.
 * - Keeps shell rendering, preview-grid setup, and button wiring out of the main page class.
 */

import { TimedErrorDisplay } from '../../shared/timed-error-display.js';
import { createStatusPresenter } from '../../shared/test-data/ui/index.js';
import { createRowCountControl } from '../../shared/row-count-control/index.js';
import { renderDataGeneratorPageShell } from './data-generator-page-layout.js';

function bindGeneratorRowCountControls({ page }) {
  const rowCountControls = [];

  const generateRowsRoot = page.documentObj.getElementById('generateRowsCountControl');
  if (generateRowsRoot) {
    rowCountControls.push(
      createRowCountControl({
        root: generateRowsRoot,
        documentObj: page.documentObj,
        props: {
          inputId: 'generateRowsCount',
          label: 'Generate Rows',
          min: 0,
          step: 1,
          value: 1000,
        },
      })
    );
  }

  const previewRowsRoot = page.documentObj.getElementById('previewRowsCountControl');
  if (previewRowsRoot) {
    rowCountControls.push(
      createRowCountControl({
        root: previewRowsRoot,
        documentObj: page.documentObj,
        props: {
          inputId: 'previewRowsCount',
          label: 'Preview Items Count',
          min: 0,
          max: 50,
          step: 1,
          value: 10,
          labelClassName: 'generator-preview-count-label',
        },
      })
    );
  }

  return rowCountControls;
}

function bindDataGeneratorPageEvents({ page }) {
  const addSchemaRowButton = page.documentObj.getElementById('addSchemaRowButton');
  addSchemaRowButton?.addEventListener('click', () => {
    page.addRowAfter(page.schemaRows.length - 1);
  });

  const schemaModeToggleButton = page.documentObj.getElementById('schemaModeToggleButton');
  schemaModeToggleButton?.addEventListener('click', () => page.toggleSchemaEditMode());

  const schemaTextArea = page.documentObj.getElementById('generatorSchemaText');
  schemaTextArea?.addEventListener('input', () => {
    page.updateAllPairsButtonVisibility();
  });

  page.documentObj.addEventListener('click', (event) => page.handleGlobalButtonClick(event));

  page.documentObj.getElementById('previewDataButton')?.addEventListener('click', () => page.previewData());
  page.documentObj.getElementById('generateDataButton')?.addEventListener('click', () => {
    void page.generateDataFile();
  });
  page.documentObj.getElementById('generateAllPairsButton')?.addEventListener('click', () => {
    void page.generateAllPairsDataFile();
  });

  page.documentObj.getElementById('generatorOutputFormat')?.addEventListener('change', () => {
    page.renderOptionsPanelForSelectedFormat();
    page.renderOutputPreviewForCurrentSelection();
  });

  const schemaRowsContainer = page.documentObj.getElementById('generatorSchemaRows');
  schemaRowsContainer?.addEventListener('input', (event) => page.handleRowInputChange(event));
  schemaRowsContainer?.addEventListener('change', (event) => page.handleRowInputChange(event));
  schemaRowsContainer?.addEventListener('focusout', (event) => page.handleRowFocusOut(event));
  schemaRowsContainer?.addEventListener('dragstart', (event) => page.handleRowDragStart(event));
  schemaRowsContainer?.addEventListener('dragover', (event) => page.handleRowDragOver(event));
  schemaRowsContainer?.addEventListener('drop', (event) => page.handleRowDrop(event));
  schemaRowsContainer?.addEventListener('dragend', () => page.handleRowDragEnd());
  schemaRowsContainer?.addEventListener('click', (event) => page.handleRowButtonClick(event));
}

function initializeDataGeneratorPageHost({ page, createOptionsPanelsForParentFn, populateFormatOptionsFn }) {
  renderDataGeneratorPageShell({ parentElement: page.parentElement });
  page.rowCountControls = bindGeneratorRowCountControls({ page });

  page.schemaErrorDisplay = new TimedErrorDisplay({
    documentObj: page.documentObj,
    elementId: 'generatorSchemaErrorText',
    timeoutMs: 5000,
  });
  page.statusPresenter = createStatusPresenter({
    documentObj: page.documentObj,
    elementId: 'generatorStatusText',
    hideWhenEmpty: false,
  });

  page.previewTableApi = new page.TabulatorCtor(page.documentObj.getElementById('generator-preview-grid'), {
    data: [],
    columns: [{ title: '~preview', field: 'column1', sorter: 'string' }],
    autoColumns: false,
    headerSort: true,
    selectableRows: true,
    selectableRowsRangeMode: 'click',
    layout: 'fitDataStretch',
    columnDefaults: {
      resizable: true,
      editor: 'input',
      editorParams: { selectContents: true },
      headerFilter: 'input',
      headerFilterFunc: 'like',
      sorter: 'string',
    },
  });
  page.previewGrid = new page.GridExtensionClass(page.previewTableApi);
  page.exporter = new page.ExporterClass(page.previewGrid);

  populateFormatOptionsFn();

  const optionsParent = page.documentObj.getElementById('generatorOptionsPanel');
  page.optionsPanels = optionsParent ? createOptionsPanelsForParentFn(optionsParent) : {};

  page.renderSchemaRows();
  page.updateSchemaEditModeView();
  page.renderOptionsPanelForSelectedFormat();
  bindDataGeneratorPageEvents({ page });
}

export { bindDataGeneratorPageEvents, initializeDataGeneratorPageHost };
