import RandExp from 'randexp';
import { faker } from '@faker-js/faker';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { Importer } from '@anywaydata/core/grid/importer.js';
import { Exporter } from '@anywaydata/core/grid/exporter.js';
import { createImportExportWorkspaceComponent } from '../../../../packages/core-ui/js/gui_components/app/import-export-workspace/index.js';
import {
  getCodeLanguageSubtasks,
  getUnitTestLanguageSubtasks,
} from '../../../../packages/core-ui/js/gui_components/generator/options/index.js';

let storySurfaceCounter = 0;

const DIRECT_EXPORT_FORMATS = new Set([
  'markdown',
  'csv',
  'dsv',
  'json',
  'jsonl',
  'xml',
  'sql',
  'gherkin',
  'html',
  'asciitable',
]);

const CODE_EXPORT_FORMATS = new Set(getCodeLanguageSubtasks().map((subtask) => subtask.type));
const UNIT_TEST_EXPORT_FORMATS = new Set(
  getUnitTestLanguageSubtasks().flatMap((subtask) => subtask.types || [subtask.type])
);

const FORMAT_GROUP_LABELS = {
  code: 'Code',
  'code-unit-test': 'Code (Unit Test)',
};

function createStorySurface(sectionName) {
  storySurfaceCounter += 1;
  const section = document.createElement('section');
  section.className = 'main-app';
  section.dataset.storySurface = `${sectionName}-${storySurfaceCounter}`;
  return section;
}

function emitStoryAction(actionHandler, payload, { suppressActions = false } = {}) {
  if (suppressActions || typeof actionHandler !== 'function') {
    return;
  }
  actionHandler(payload);
}

function cloneGenericDataTable(sourceTable, maxRows) {
  const cloned = new GenericDataTable();
  if (!sourceTable) {
    return cloned;
  }

  cloned.setHeaders(sourceTable.getHeaders?.() || []);
  const rowCount = sourceTable.getRowCount?.() || 0;
  const limit = Number.isFinite(maxRows) ? Math.min(rowCount, Math.max(0, Math.floor(maxRows))) : rowCount;
  for (let rowIndex = 0; rowIndex < limit; rowIndex += 1) {
    cloned.appendDataRow([...(sourceTable.getRow?.(rowIndex) || [])]);
  }
  return cloned;
}

function serializeDataTable(dataTable) {
  const clonedTable = cloneGenericDataTable(dataTable);
  const headers = clonedTable.getHeaders?.() || [];
  const rows = [];
  const rowCount = clonedTable.getRowCount?.() || 0;

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    rows.push([...(clonedTable.getRow?.(rowIndex) || [])]);
  }

  return {
    headers: [...headers],
    rows,
    rowCount: rows.length,
    headerCount: headers.length,
  };
}

function createSampleGridData() {
  const dataTable = new GenericDataTable();
  dataTable.setHeaders(['First Name', 'Last Name', 'Department', 'Role', 'Status']);
  dataTable.appendDataRow(['Ava', 'Nguyen', 'Engineering', 'QA Engineer', 'Active']);
  dataTable.appendDataRow(['Liam', 'Patel', 'Sales', 'Account Executive', 'Onboarding']);
  dataTable.appendDataRow(['Noah', 'Carter', 'Finance', 'Analyst', 'Active']);
  dataTable.appendDataRow(['Mia', 'Roberts', 'Support', 'Team Lead', 'On Leave']);
  dataTable.appendDataRow(['Ezra', 'Kim', 'Design', 'Researcher', 'Active']);
  dataTable.appendDataRow(['Sofia', 'Brooks', 'Operations', 'Coordinator', 'Paused']);
  dataTable.appendDataRow(['Owen', 'Price', 'Security', 'Engineer', 'Escalated']);
  dataTable.appendDataRow(['Chloe', 'Ward', 'Legal', 'Counsel', 'Review']);
  dataTable.appendDataRow(['Ivy', 'Flores', 'Marketing', 'Manager', 'Active']);
  dataTable.appendDataRow(['Leo', 'Hayes', 'Data', 'Scientist', 'Pilot']);
  dataTable.appendDataRow(['Nora', 'Bell', 'Product', 'Owner', 'Backlog']);
  dataTable.appendDataRow(['Mason', 'Gray', 'Support', 'Specialist', 'Resolved']);
  return dataTable;
}

class StoryMemoryGrid {
  constructor(initialTable = new GenericDataTable()) {
    this.table = cloneGenericDataTable(initialTable);
    this.changeCallbacks = new Set();
  }

  getGridAsGenericDataTable(maxRows) {
    return cloneGenericDataTable(this.table, maxRows);
  }

  getHeadersFromGrid() {
    return [...(this.table.getHeaders?.() || [])];
  }

  getRowCount() {
    return this.table.getRowCount?.() || 0;
  }

  getSelectedRowIndexes() {
    return [];
  }

  setGridFromGenericDataTable(dataTable) {
    this.table = cloneGenericDataTable(dataTable);
    this.notifyGridChanged();
    return Promise.resolve(this.table);
  }

  clearGrid() {
    this.table = new GenericDataTable();
    this.notifyGridChanged();
  }

  onGridChanged(callback) {
    this.changeCallbacks.add(callback);
    return () => {
      this.changeCallbacks.delete(callback);
    };
  }

  notifyGridChanged() {
    this.changeCallbacks.forEach((callback) => callback());
  }
}

function installStoryGlobals() {
  globalThis.RandExp = RandExp;
  globalThis.faker = faker;
  if (typeof document.execCommand !== 'function') {
    document.execCommand = () => true;
  }
}

function dispatchStoryClick(element) {
  element?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

function selectExportFormat(surface, format) {
  if (DIRECT_EXPORT_FORMATS.has(format)) {
    dispatchStoryClick(surface.querySelector(`.type-select-action[data-type="${format}"]`));
    return;
  }

  if (CODE_EXPORT_FORMATS.has(format)) {
    dispatchStoryClick(surface.querySelector('.type-select-action[data-group="code"]'));
    dispatchStoryClick(surface.querySelector(`.subtask-select-action[data-type="${format}"]`));
    return;
  }

  if (UNIT_TEST_EXPORT_FORMATS.has(format)) {
    dispatchStoryClick(surface.querySelector('.type-select-action[data-group="code-unit-test"]'));
    dispatchStoryClick(surface.querySelector(`.subtask-select-action[data-type="${format}"]`));
  }
}

function setCheckboxValue(input, checked) {
  if (!input) {
    return;
  }
  input.checked = checked === true;
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

function setPreviewRowLimit(surface, value) {
  const previewRowsInput = surface.querySelector('#previewRowsCount');
  if (!previewRowsInput) {
    return;
  }
  previewRowsInput.value = String(value);
  previewRowsInput.dispatchEvent(new Event('input', { bubbles: true }));
}

function getActiveExportSelection(surface) {
  const activeSubtask = surface.querySelector('.subtask-select.active-type');
  const activeMainType = surface.querySelector('.type-select.active-main-type .type-select-action');
  const activeDirectType = surface.querySelector('.type-select.active-type .type-select-action');

  if (activeSubtask) {
    const action = activeSubtask.querySelector('.subtask-select-action');
    return {
      group: FORMAT_GROUP_LABELS[activeMainType?.dataset?.group] || activeMainType?.textContent?.trim() || 'Code',
      type: action?.getAttribute('data-type') || activeSubtask.getAttribute('data-type') || '',
      label: action?.textContent?.trim() || '',
    };
  }

  return {
    group: 'Direct',
    type: activeDirectType?.getAttribute('data-type') || '',
    label: activeDirectType?.textContent?.trim() || '',
  };
}

function getSelectionFromAction(surface, actionElement) {
  if (!actionElement) {
    return getActiveExportSelection(surface);
  }

  const directType = actionElement.getAttribute('data-type');
  const isSubtask = actionElement.classList.contains('subtask-select-action');
  const group = actionElement.getAttribute('data-group');

  if (isSubtask && directType) {
    const activeMainType = surface.querySelector('.type-select.active-main-type .type-select-action');
    return {
      group: FORMAT_GROUP_LABELS[activeMainType?.dataset?.group] || activeMainType?.textContent?.trim() || 'Code',
      type: directType,
      label: actionElement.textContent?.trim() || '',
    };
  }

  if (directType) {
    return {
      group: 'Direct',
      type: directType,
      label: actionElement.textContent?.trim() || '',
    };
  }

  if (group) {
    return getActiveExportSelection(surface);
  }

  return getActiveExportSelection(surface);
}

function getPreviewActionPayload(surface, exporter, previewRowLimit, mode) {
  const { type } = getActiveExportSelection(surface);
  const previewTextArea = surface.querySelector('#markdownarea');
  const dataTable = exporter.getGridAsGenericDataTable(previewRowLimit);
  const serialized = serializeDataTable(dataTable);

  return {
    type,
    mode,
    previewRowLimit,
    textLength: previewTextArea?.value?.length || 0,
    rowCount: serialized.rowCount,
    headerCount: serialized.headerCount,
  };
}

function applyExportFormatOptions(workspace, format, options = {}) {
  if (format === 'json' || format === 'jsonl') {
    workspace.applyCurrentTypeOptions({
      outputFormat: format,
      options: {
        prettyPrint: options.prettyPrint !== false,
        prettyPrintDelimiter: options.prettyPrintDelimiter || '  ',
        asObject: options.asObject === true,
        asPropertyNamed: options.asPropertyNamed || '',
      },
    });
    return;
  }

  if (format === 'csv' || format === 'dsv') {
    workspace.applyCurrentTypeOptions({
      outputFormat: format,
      options: {
        delimiter: format === 'dsv' ? options.delimiter || '\t' : ',',
        quotes: options.quotes === true,
        header: options.header === true,
        quoteChar: options.quoteChar || '"',
        escapeChar: options.escapeChar || '"',
      },
    });
  }
}

function renderGridPreviewStory({
  format = 'csv',
  state = 'start-blank',
  previewRowLimit = 10,
  prettyPrint = true,
  asObject = false,
  asPropertyNamed = '',
  quotes = false,
  header = false,
  delimiter = '\t',
  actions = {},
} = {}) {
  installStoryGlobals();

  const surface = createStorySurface('grid-preview');
  const workspaceHost = document.createElement('div');
  workspaceHost.id = `story-import-export-${storySurfaceCounter}`;
  surface.appendChild(workspaceHost);

  const memoryGrid = new StoryMemoryGrid(createSampleGridData());
  const importer = new Importer(memoryGrid);
  const exporter = new Exporter(memoryGrid);
  let suppressActions = true;

  const emitAction = (actionName, payload) => {
    emitStoryAction(actions?.[actionName], payload, { suppressActions });
  };

  const workspace = createImportExportWorkspaceComponent({
    root: workspaceHost,
    documentObj: document,
    props: {
      previewRowLimit,
    },
    services: {
      requestConfirm: async () => true,
      clipboardService: {
        copyFromTextArea: () => {},
      },
      downloadService: {
        downloadText: (filename, text) => {
          const type = getActiveExportSelection(surface).type;
          emitAction('onDownloadRequested', {
            type,
            fileExtension: filename.replace(/^export/, ''),
            textLength: text?.length || 0,
          });
        },
      },
    },
  });
  workspace.setImporter(importer);
  workspace.setExporter(exporter);
  workspace.setGridChangeSource(memoryGrid);

  const originalRenderTextFromGrid = workspace.renderTextFromGrid.bind(workspace);
  workspace.renderTextFromGrid = (...args) => {
    const result = originalRenderTextFromGrid(...args);
    emitAction(
      'onPreviewRendered',
      getPreviewActionPayload(
        surface,
        exporter,
        workspace.getPreviewRowLimit(),
        workspace.isPreviewTextMode() ? 'preview' : 'edit'
      )
    );
    return result;
  };

  const originalApplyCurrentTypeOptions = workspace.applyCurrentTypeOptions.bind(workspace);
  workspace.applyCurrentTypeOptions = (optionsToApply) => {
    const result = originalApplyCurrentTypeOptions(optionsToApply);
    emitAction('onOptionsApplied', {
      type: optionsToApply?.outputFormat || getActiveExportSelection(surface).type,
      options:
        typeof structuredClone === 'function'
          ? structuredClone(optionsToApply?.options || optionsToApply || {})
          : JSON.parse(JSON.stringify(optionsToApply?.options || optionsToApply || {})),
    });
    return result;
  };

  const originalSetGridFromGenericDataTable = importer.setGridFromGenericDataTable.bind(importer);
  importer.setGridFromGenericDataTable = async (dataTable) => {
    const result = await originalSetGridFromGenericDataTable(dataTable);
    const serialized = serializeDataTable(dataTable);
    emitAction('onSetGridFromText', {
      type: getActiveExportSelection(surface).type,
      ...serialized,
      sourceTextLength: surface.querySelector('#markdownarea')?.value?.length || 0,
    });
    return result;
  };

  setPreviewRowLimit(surface, previewRowLimit);
  selectExportFormat(surface, format);
  applyExportFormatOptions(workspace, format, {
    prettyPrint,
    asObject,
    asPropertyNamed,
    quotes,
    header,
    delimiter,
  });
  workspace.setFileFormatType();
  workspace.setOptionsViewForFormatType();

  const autoPreviewCheckbox = surface.querySelector('#autoPreviewCheckbox');
  if (state === 'auto-previewed') {
    setCheckboxValue(autoPreviewCheckbox, true);
    workspace.renderTextFromGrid();
  } else {
    setCheckboxValue(autoPreviewCheckbox, false);
    const previewTextArea = surface.querySelector('#markdownarea');
    if (previewTextArea) {
      previewTextArea.value = '';
    }
  }

  surface.querySelectorAll('.type-select-action, .subtask-select-action').forEach((actionElement) => {
    actionElement.addEventListener('click', () => {
      emitAction('onFormatSelected', getSelectionFromAction(surface, actionElement));
    });
  });

  const setTextFromGridButton = surface.querySelector('#settextfromgridbutton');
  setTextFromGridButton?.addEventListener('click', () => {
    emitAction('onSetTextFromGrid', {
      ...getPreviewActionPayload(
        surface,
        exporter,
        workspace.getPreviewRowLimit(),
        workspace.isPreviewTextMode() ? 'preview' : 'edit'
      ),
      trigger: 'button',
    });
    emitAction(
      'onPreviewRendered',
      getPreviewActionPayload(
        surface,
        exporter,
        workspace.getPreviewRowLimit(),
        workspace.isPreviewTextMode() ? 'preview' : 'edit'
      )
    );
  });

  surface.querySelector('#previewEditModeButton')?.addEventListener('click', async () => {
    await Promise.resolve();
    emitAction('onPreviewModeChanged', {
      mode: workspace.isPreviewTextMode() ? 'preview' : 'edit',
      previewRowLimit: workspace.getPreviewRowLimit(),
    });
  });

  surface.querySelector('#autoPreviewCheckbox')?.addEventListener('change', (event) => {
    emitAction('onAutoPreviewChanged', {
      enabled: event?.currentTarget?.checked === true,
      mode: workspace.isPreviewTextMode() ? 'preview' : 'edit',
    });
  });

  const copyTextButton = surface.querySelector('#copyTextButton');
  copyTextButton?.addEventListener('click', () => {
    emitAction('onCopyText', {
      type: getActiveExportSelection(surface).type,
      textLength: surface.querySelector('#markdownarea')?.value?.length || 0,
    });
  });

  suppressActions = false;
  surface.__storybookCleanup = () => workspace.destroy();

  return surface;
}

export { renderGridPreviewStory };
