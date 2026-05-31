/*
 * Responsibilities:
 * - Generator-page host composition and event binding.
 * - Keeps shell rendering, preview-grid setup, and button wiring out of the main page class.
 */

import { createTimedStatusPresenter } from '../../shared/timed-error-display.js';
import { createFormatOptionsPanel } from '../../shared/format-options-panel/index.js';
import { createLoadingStatusPresenter, createStatusPresenter } from '../../shared/test-data/ui/index.js';
import { createRowCountControl } from '../../shared/row-count-control/index.js';
import { createSharedSchemaDefinitionComponent } from '../../shared/schema-definition/index.js';
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
}

function initializeDataGeneratorPageHost({ page, populateFormatOptionsFn }) {
  renderDataGeneratorPageShell({ parentElement: page.parentElement });
  page.rowCountControls = bindGeneratorRowCountControls({ page });

  page.schemaErrorDisplay = createTimedStatusPresenter({
    documentObj: page.documentObj,
    elementId: 'generatorSchemaErrorText',
    timeoutMs: 5000,
  });
  page.statusPresenter = createStatusPresenter({
    documentObj: page.documentObj,
    elementId: 'generatorStatusText',
    hideWhenEmpty: false,
  });
  page.loadingStatusPresenter = createLoadingStatusPresenter({
    documentObj: page.documentObj,
    elementId: 'generatorStatusText',
    hideWhenEmpty: false,
  });
  page.schemaDefinition = createSharedSchemaDefinitionComponent({
    root: page.documentObj.getElementById('generatorSchemaDefinition'),
    documentObj: page.documentObj,
    props: {
      headingText: 'Schema',
      ids: {
        rows: 'generatorSchemaRows',
        textContainer: 'generatorSchemaTextContainer',
        text: 'generatorSchemaText',
        addButton: 'addSchemaRowButton',
        toggleButton: 'schemaModeToggleButton',
        helpIcon: 'schemaModeHelpIcon',
        error: 'generatorSchemaErrorText',
      },
      schemaTextToDataRules: page.schemaTextToDataRules || (() => ({ dataRules: [], errors: [], schemaTokens: [] })),
      dataRulesToSchemaText: page.dataRulesToSchemaText || (() => ''),
      faker: page.faker,
      RandExp: page.RandExp,
      createBlankRow: () =>
        typeof page.createBlankSchemaRow === 'function'
          ? page.createBlankSchemaRow()
          : {
              id: 'generator-schema-row-fallback',
              name: '',
              sourceType: 'regex',
              command: '',
              params: '',
              value: '',
              comments: '',
              leadingTextLines: [],
            },
      mapRuleToRow: (rule, leadingTextLines = []) => {
        const row =
          typeof page.ruleToSchemaRow === 'function'
            ? page.ruleToSchemaRow(rule)
            : {
                id: 'generator-schema-row-fallback',
                name: '',
                sourceType: 'regex',
                command: '',
                params: '',
                value: '',
                comments: '',
                leadingTextLines: [],
              };
        row.leadingTextLines = Array.isArray(leadingTextLines) ? leadingTextLines.slice() : [];
        return row;
      },
      getMethodPickerOptions: (currentValue) =>
        (typeof page.getMethodPickerOptions === 'function' ? page.getMethodPickerOptions(currentValue) : []) || [],
      getVisibleDomainCommands: (currentValue) =>
        (typeof page.getVisibleDomainCommands === 'function' ? page.getVisibleDomainCommands(currentValue) : []) || [],
      fakerCommands: page.fakerCommands || [],
      sampleSchemaText: page.sampleSchemaText || '',
      buildModeHelpHtml: ({ inTextMode }) =>
        typeof page.buildSchemaModeHelpHtml === 'function' ? page.buildSchemaModeHelpHtml(inTextMode) : '',
      schemaErrorDisplay: page.schemaErrorDisplay,
      validateSchemaRows: (rows) =>
        typeof page.validateSchemaRows === 'function' ? page.validateSchemaRows(rows) : { rows, errors: [] },
      updatePairwiseButtonVisibility: () => page.updateAllPairsButtonVisibility?.(),
    },
    callbacks: {
      onSchemaError: (message) => page.showSchemaErrorStatus?.(message),
      onSchemaClear: () => page.clearSchemaErrorStatus?.(),
      onRowsChanged: () => page.updateAllPairsButtonVisibility?.(),
    },
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
      headerFilter: 'input',
      headerFilterFunc: 'like',
      sorter: 'string',
    },
  });
  page.previewGrid = new page.GridExtensionClass(page.previewTableApi);
  page.exporter = new page.ExporterClass(page.previewGrid);

  populateFormatOptionsFn();

  const optionsParent = page.documentObj.getElementById('generatorOptionsPanel');
  page.formatOptionsPanel = optionsParent
    ? createFormatOptionsPanel({
        root: optionsParent,
        documentObj: page.documentObj,
        windowObj: page.documentObj?.defaultView || globalThis.window,
        props: {
          selectedFormat: page.getSelectedOutputType(),
          currentOptions: page.exporter?.getOptionsForType?.(page.getSelectedOutputType()),
        },
        callbacks: {
          onApplyOptions: ({ sanitized }) => {
            page.applyCurrentTypeOptions(sanitized);
          },
        },
      })
    : null;
  page.optionsPanels = page.formatOptionsPanel?.getPanels?.() || {};

  page.renderSchemaRows();
  page.updateSchemaEditModeView?.();
  page.renderOptionsPanelForSelectedFormat();
  bindDataGeneratorPageEvents({ page });
}

export { bindDataGeneratorPageEvents, initializeDataGeneratorPageHost };
