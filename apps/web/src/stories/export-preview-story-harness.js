import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { Importer } from '@anywaydata/core/grid/importer.js';
import { Exporter } from '@anywaydata/core/grid/exporter.js';
import { createImportExportWorkspaceComponent } from '../../../../packages/core-ui/js/gui_components/app/import-export-workspace/index.js';
import {
  getCodeLanguageSubtasks,
  getUnitTestLanguageSubtasks,
} from '../../../../packages/core-ui/js/gui_components/generator/options/options-catalog-adapter.js';

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

const DIRECT_EXPORT_FORMAT_LABELS = {
  markdown: 'Markdown',
  csv: 'CSV',
  dsv: 'Delimited',
  json: 'JSON',
  jsonl: 'JSONL',
  xml: 'XML',
  sql: 'SQL',
  gherkin: 'Gherkin',
  html: 'HTML',
  asciitable: 'ASCII',
};

function getButtonByText(rootElement, text) {
  return (
    Array.from(rootElement?.querySelectorAll?.('button') || []).find(
      (button) => button?.textContent?.trim() === text
    ) || null
  );
}

function getCheckboxByLabelText(rootElement, labelText) {
  const labels = Array.from(rootElement?.querySelectorAll?.('label') || []);
  const matchingLabel = labels.find((label) => label?.textContent?.replace(/\s+/g, ' ')?.trim() === labelText);
  return matchingLabel?.querySelector?.('input[type="checkbox"]') || null;
}

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

function selectExportFormat(workspace, format) {
  if (!format) {
    return;
  }

  if (DIRECT_EXPORT_FORMATS.has(format) || CODE_EXPORT_FORMATS.has(format) || UNIT_TEST_EXPORT_FORMATS.has(format)) {
    workspace.setFileFormatType(format);
  }
}

function setAutoPreviewEnabled(workspace, enabled) {
  workspace.update({ autoPreviewEnabled: enabled === true });
}

function setPreviewRowLimit(workspace, value) {
  workspace.update({ previewRowLimit: value });
}

function getSelectionForFormatType(type) {
  if (!type) {
    return {
      group: 'Direct',
      type: '',
      label: '',
    };
  }

  if (DIRECT_EXPORT_FORMATS.has(type)) {
    return {
      group: 'Direct',
      type,
      label: DIRECT_EXPORT_FORMAT_LABELS[type] || type,
    };
  }

  const codeSubtask = getCodeLanguageSubtasks().find((subtask) => (subtask.types || [subtask.type]).includes(type));
  if (codeSubtask) {
    return {
      group: FORMAT_GROUP_LABELS.code,
      type,
      label: codeSubtask.label || type,
    };
  }

  const unitTestSubtask = getUnitTestLanguageSubtasks().find((subtask) =>
    (subtask.types || [subtask.type]).includes(type)
  );
  if (unitTestSubtask) {
    return {
      group: FORMAT_GROUP_LABELS['code-unit-test'],
      type,
      label: unitTestSubtask.label || type,
    };
  }

  return {
    group: 'Direct',
    type,
    label: type,
  };
}

function getActiveExportSelection(workspace) {
  return getSelectionForFormatType(workspace?.getState?.()?.selectedFormat || '');
}

function getSelectionFromAction(workspace, actionElement) {
  if (!actionElement) {
    return getActiveExportSelection(workspace);
  }

  const directType = actionElement.getAttribute('data-type');
  if (directType) {
    return getSelectionForFormatType(directType);
  }

  return getActiveExportSelection(workspace);
}

function getPreviewActionPayload(exporter, workspace, previewRowLimit, mode) {
  const { type } = getActiveExportSelection(workspace);
  const dataTable = exporter.getGridAsGenericDataTable(previewRowLimit);
  const serialized = serializeDataTable(dataTable);

  return {
    type,
    mode,
    previewRowLimit,
    textLength: workspace.getTextValue()?.length || 0,
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
          const type = getActiveExportSelection(workspace).type;
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
        exporter,
        workspace,
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
      type: optionsToApply?.outputFormat || getActiveExportSelection(workspace).type,
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
      type: getActiveExportSelection(workspace).type,
      ...serialized,
      sourceTextLength: workspace.getTextValue()?.length || 0,
    });
    return result;
  };

  setPreviewRowLimit(workspace, previewRowLimit);
  selectExportFormat(workspace, format);
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

  if (state === 'auto-previewed') {
    setAutoPreviewEnabled(workspace, true);
    workspace.renderTextFromGrid();
  } else {
    setAutoPreviewEnabled(workspace, false);
    workspace.setTextFromString('');
  }

  surface.querySelectorAll('a[data-tab-id], a[data-subtask-id], a[data-type]').forEach((actionElement) => {
    actionElement.addEventListener('click', async () => {
      await Promise.resolve();
      emitAction('onFormatSelected', getSelectionFromAction(workspace, actionElement));
    });
  });

  const setTextFromGridButton = surface.querySelector('[data-role="set-text-from-grid-button"]');
  setTextFromGridButton?.addEventListener('click', () => {
    emitAction('onSetTextFromGrid', {
      ...getPreviewActionPayload(
        exporter,
        workspace,
        workspace.getPreviewRowLimit(),
        workspace.isPreviewTextMode() ? 'preview' : 'edit'
      ),
      trigger: 'button',
    });
  });

  getButtonByText(surface, state === 'auto-previewed' ? 'Edit' : 'Preview')?.addEventListener('click', async () => {
    await Promise.resolve();
    emitAction('onPreviewModeChanged', {
      mode: workspace.isPreviewTextMode() ? 'preview' : 'edit',
      previewRowLimit: workspace.getPreviewRowLimit(),
    });
  });

  getCheckboxByLabelText(surface, 'Auto Sync')?.addEventListener('change', (event) => {
    emitAction('onAutoPreviewChanged', {
      enabled: event?.currentTarget?.checked === true,
      mode: workspace.isPreviewTextMode() ? 'preview' : 'edit',
    });
  });

  const copyTextButton = getButtonByText(surface, 'Copy');
  copyTextButton?.addEventListener('click', () => {
    emitAction('onCopyText', {
      type: getActiveExportSelection(workspace).type,
      textLength: workspace.getTextValue()?.length || 0,
    });
  });

  suppressActions = false;
  surface.__storybookCleanup = () => workspace.destroy();

  return surface;
}

export { renderGridPreviewStory };
