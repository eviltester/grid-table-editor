import RandExp from 'randexp';
import { faker } from '@faker-js/faker';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { Importer } from '@anywaydata/core/grid/importer.js';
import { Exporter } from '@anywaydata/core/grid/exporter.js';
import { ImportExportControls } from '../../../../packages/core-ui/js/gui_components/app/import-export-controls.js';
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

const scopedDocumentState = new WeakMap();

function createStorySurface(sectionName) {
  storySurfaceCounter += 1;
  const section = document.createElement('section');
  section.className = 'main-app';
  section.dataset.storySurface = `${sectionName}-${storySurfaceCounter}`;
  return section;
}

function replaceElementWithClone(element) {
  if (!element?.parentNode) {
    return element;
  }
  const replacement = element.cloneNode(true);
  element.parentNode.replaceChild(replacement, element);
  return replacement;
}

function emitStoryAction(actionHandler, payload, { suppressActions = false } = {}) {
  if (suppressActions || typeof actionHandler !== 'function') {
    return;
  }
  actionHandler(payload);
}

function getScopedDocumentState(doc) {
  let state = scopedDocumentState.get(doc);
  if (!state) {
    state = {
      originals: {
        querySelector: doc.querySelector,
        querySelectorAll: doc.querySelectorAll,
        getElementById: doc.getElementById,
      },
      stack: [],
    };
    scopedDocumentState.set(doc, state);
  }
  return state;
}

function applyScopedDocumentState(doc, state) {
  const activeScope = state.stack.at(-1);
  if (!activeScope) {
    doc.querySelector = state.originals.querySelector;
    doc.querySelectorAll = state.originals.querySelectorAll;
    doc.getElementById = state.originals.getElementById;
    return;
  }

  doc.querySelector = function querySelector(selector) {
    return activeScope.surface.querySelector(selector) || state.originals.querySelector.call(doc, selector);
  };
  doc.querySelectorAll = function querySelectorAll(selector) {
    const scopedMatches = activeScope.surface.querySelectorAll(selector);
    return scopedMatches.length > 0 ? scopedMatches : state.originals.querySelectorAll.call(doc, selector);
  };
  doc.getElementById = function getElementById(id) {
    return activeScope.surface.querySelector(`#${id}`) || state.originals.getElementById.call(doc, id);
  };
}

function withScopedDocument(surface, callback) {
  if (!surface || typeof callback !== 'function') {
    return callback?.();
  }

  const doc = document;
  const state = getScopedDocumentState(doc);
  const scope = { surface };
  state.stack.push(scope);
  applyScopedDocumentState(doc, state);

  const restoreScope = () => {
    const scopeIndex = state.stack.lastIndexOf(scope);
    if (scopeIndex >= 0) {
      state.stack.splice(scopeIndex, 1);
    }
    applyScopedDocumentState(doc, state);
  };

  try {
    const result = callback();
    if (typeof result?.then === 'function') {
      return Promise.resolve(result).finally(restoreScope);
    }
    restoreScope();
    return result;
  } catch (error) {
    restoreScope();
    throw error;
  }
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
  const previewButton = surface.querySelector('#previewEditModeButton');
  if (!previewButton) {
    return;
  }
  previewButton.textContent = `Preview (${value})`;
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

function getSurfaceActiveExportType(surface) {
  const activeAction =
    surface.querySelector('.subtask-select.active-type .subtask-select-action') ||
    surface.querySelector('.type-select.active-type .type-select-action');
  return activeAction?.getAttribute('data-type') || 'csv';
}

function setSurfacePreviewText(surface, exporter, previewRowLimit) {
  const previewTextArea = surface.querySelector('#markdownarea');
  if (!previewTextArea) {
    return;
  }
  const type = getSurfaceActiveExportType(surface);
  const previewDataTable = exporter.getGridAsGenericDataTable(previewRowLimit);
  previewTextArea.value = exporter.getDataTableAs(type, previewDataTable) || '';
}

function scopeImportExportControllerToSurface(surface, importExportController) {
  const methodNames = [
    'renderTextFromGrid',
    'setFileFormatType',
    'setOptionsViewForFormatType',
    'applyCurrentTypeOptions',
    'setCurrentTypeOptions',
    'toggleTextEditMode',
    'importTextArea',
    '_syncGridFromTextButtonState',
    '_bindPreviewTextInputIfAvailable',
    '_bindAutoPreviewCheckboxIfAvailable',
    '_syncAutoPreviewControlState',
    '_getActiveType',
  ];

  methodNames.forEach((methodName) => {
    const originalMethod = importExportController[methodName];
    if (typeof originalMethod !== 'function') {
      return;
    }
    importExportController[methodName] = (...args) =>
      withScopedDocument(surface, () => originalMethod.apply(importExportController, args));
  });

  const exportControlMethodNames = ['renderTextFromGrid', 'setTextFromString', 'copyText', 'fileDownload'];
  exportControlMethodNames.forEach((methodName) => {
    const originalMethod = importExportController.exportControls?.[methodName];
    if (typeof originalMethod !== 'function') {
      return;
    }
    importExportController.exportControls[methodName] = (...args) =>
      withScopedDocument(surface, () => originalMethod.apply(importExportController.exportControls, args));
  });
}

function applyExportFormatOptions(importExportController, format, options = {}) {
  if (format === 'json' || format === 'jsonl') {
    importExportController.applyCurrentTypeOptions({
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
    importExportController.applyCurrentTypeOptions({
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
  document.body.appendChild(surface);
  const workspaceHost = document.createElement('div');
  workspaceHost.id = `story-import-export-${storySurfaceCounter}`;
  surface.appendChild(workspaceHost);

  const memoryGrid = new StoryMemoryGrid(createSampleGridData());
  const importer = new Importer(memoryGrid);
  const exporter = new Exporter(memoryGrid);
  const legacyControls = new ImportExportControls({
    requestConfirm: async () => true,
    documentObj: document,
  });
  const workspace = createImportExportWorkspaceComponent({
    root: workspaceHost,
    documentObj: document,
    services: {
      importExportControls: legacyControls,
    },
  });
  workspace.setImporter(importer);
  workspace.setExporter(exporter);
  workspace.setGridChangeSource(memoryGrid);
  const importExportController = workspace.getImportExportControls();
  scopeImportExportControllerToSurface(surface, importExportController);
  let suppressActions = true;

  const emitAction = (actionName, payload) => {
    emitStoryAction(actions?.[actionName], payload, { suppressActions });
  };

  const originalRenderTextFromGrid = importExportController.renderTextFromGrid.bind(importExportController);
  importExportController.renderTextFromGrid = (...args) => {
    const result = withScopedDocument(surface, () => originalRenderTextFromGrid(...args));
    emitAction(
      'onPreviewRendered',
      getPreviewActionPayload(
        surface,
        exporter,
        importExportController.getPreviewRowLimit(),
        importExportController.isPreviewTextMode() ? 'preview' : 'edit'
      )
    );
    return result;
  };

  const originalApplyCurrentTypeOptions = importExportController.applyCurrentTypeOptions.bind(importExportController);
  importExportController.applyCurrentTypeOptions = (optionsToApply) => {
    const result = withScopedDocument(surface, () => originalApplyCurrentTypeOptions(optionsToApply));
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

  importExportController.previewRowLimit = previewRowLimit;
  setPreviewRowLimit(surface, previewRowLimit);
  withScopedDocument(surface, () => {
    selectExportFormat(surface, format);
    applyExportFormatOptions(importExportController, format, {
      prettyPrint,
      asObject,
      asPropertyNamed,
      quotes,
      header,
      delimiter,
    });
    importExportController.setFileFormatType();
    importExportController.setOptionsViewForFormatType();
  });

  const autoPreviewCheckbox = surface.querySelector('#autoPreviewCheckbox');
  if (state === 'auto-previewed') {
    withScopedDocument(surface, () => {
      setCheckboxValue(autoPreviewCheckbox, true);
      importExportController.renderTextFromGrid();
    });
    setSurfacePreviewText(surface, exporter, previewRowLimit);
  } else {
    withScopedDocument(surface, () => {
      setCheckboxValue(autoPreviewCheckbox, false);
    });
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

  const setTextFromGridButton = replaceElementWithClone(surface.querySelector('#settextfromgridbutton'));
  setTextFromGridButton?.addEventListener('click', () => {
    withScopedDocument(surface, () => originalRenderTextFromGrid());
    emitAction('onSetTextFromGrid', {
      ...getPreviewActionPayload(
        surface,
        exporter,
        importExportController.getPreviewRowLimit(),
        importExportController.isPreviewTextMode() ? 'preview' : 'edit'
      ),
      trigger: 'button',
    });
    emitAction(
      'onPreviewRendered',
      getPreviewActionPayload(
        surface,
        exporter,
        importExportController.getPreviewRowLimit(),
        importExportController.isPreviewTextMode() ? 'preview' : 'edit'
      )
    );
  });

  const setGridFromTextButton = replaceElementWithClone(surface.querySelector('#setgridfromtextbutton'));
  setGridFromTextButton?.addEventListener('click', async () => {
    const type = getActiveExportSelection(surface).type;
    const textToImport = surface.querySelector('#markdownarea')?.value || '';
    try {
      const result = await withScopedDocument(surface, () => importExportController.importTextArea());
      if (result === undefined) {
        emitAction('onSetGridFromTextFailed', {
          type,
          message: 'Unable to parse input into data table.',
          sourceTextLength: textToImport.length,
        });
      }
    } catch (error) {
      emitAction('onSetGridFromTextFailed', {
        type,
        message: error?.message || 'Unable to parse input into data table.',
        sourceTextLength: textToImport.length,
      });
    }
  });

  surface.querySelector('#previewEditModeButton')?.addEventListener('click', async () => {
    await Promise.resolve();
    emitAction('onPreviewModeChanged', {
      mode: importExportController.isPreviewTextMode() ? 'preview' : 'edit',
      previewRowLimit: importExportController.getPreviewRowLimit(),
    });
  });

  surface.querySelector('#autoPreviewCheckbox')?.addEventListener('change', (event) => {
    emitAction('onAutoPreviewChanged', {
      enabled: event?.currentTarget?.checked === true,
      mode: importExportController.isPreviewTextMode() ? 'preview' : 'edit',
    });
  });

  const copyTextButton = replaceElementWithClone(surface.querySelector('#copyTextButton'));
  copyTextButton?.addEventListener('click', () => {
    withScopedDocument(surface, () => importExportController.exportControls.copyText());
    emitAction('onCopyText', {
      type: getActiveExportSelection(surface).type,
      textLength: surface.querySelector('#markdownarea')?.value?.length || 0,
    });
  });

  const fileDownloadButton = replaceElementWithClone(surface.querySelector('#filedownload'));
  fileDownloadButton?.addEventListener('click', () => {
    const type = getActiveExportSelection(surface).type;
    emitAction('onDownloadRequested', {
      type,
      fileExtension: exporter.getFileExtensionFor(type),
      textLength: surface.querySelector('#markdownarea')?.value?.length || 0,
    });
    withScopedDocument(surface, () => importExportController.exportControls.fileDownload());
  });

  suppressActions = false;
  surface.__storybookCleanup = () => workspace.destroy();

  return surface;
}

export { renderGridPreviewStory };
