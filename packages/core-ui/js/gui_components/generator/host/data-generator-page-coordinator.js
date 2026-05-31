/*
 * Responsibilities:
 * - Generator-page host composition and preview-grid setup.
 * - Keeps shell rendering and feature mounting out of the main page class.
 */

import { createGeneratorControlsComponent } from '../controls/index.js';
import { createTimedStatusPresenter } from '../../shared/timed-error-display.js';
import { createRowCountControl } from '../../shared/row-count-control/index.js';
import { createSharedSchemaDefinitionComponent } from '../../shared/schema-definition/index.js';
import { renderDataGeneratorPageShell } from './data-generator-page-layout.js';
import { getOutputFormatGroups } from '../options/index.js';

function bindGeneratorPreviewRowCountControl({ page }) {
  const previewRowsRoot = page.documentObj.getElementById('previewRowsCountControl');
  if (!previewRowsRoot) {
    return [];
  }

  return [
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
    }),
  ];
}

function bindGeneratorPreviewEvents({ page }) {
  page.documentObj.getElementById('previewDataButton')?.addEventListener('click', () => page.previewData());
}

function initializeDataGeneratorPageHost({ page }) {
  renderDataGeneratorPageShell({ parentElement: page.parentElement });
  page.rowCountControls = bindGeneratorPreviewRowCountControl({ page });

  page.schemaErrorDisplay = createTimedStatusPresenter({
    documentObj: page.documentObj,
    elementId: 'generatorSchemaErrorText',
    timeoutMs: 5000,
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

  page.generatorControls = createGeneratorControlsComponent({
    root: page.documentObj.getElementById('generatorControlsRoot'),
    documentObj: page.documentObj,
    props: {
      selectedFormat: page.getSelectedOutputType?.() || 'csv',
      currentOptions: page.exporter?.getOptionsForType?.('csv'),
      pairwiseVisible: false,
    },
    services: {
      canExportFormat: (type) => page.exporter?.canExport?.(type) !== false,
      getOutputFormatGroups,
    },
    callbacks: {
      onFormatChanged: () => {
        page.renderOptionsPanelForSelectedFormat();
        page.renderOutputPreviewForCurrentSelection();
      },
      onApplyOptions: ({ sanitized }) => {
        page.applyCurrentTypeOptions(sanitized);
      },
      onGenerateData: () => {
        void page.generateDataFile();
      },
      onGeneratePairwise: () => {
        void page.generateAllPairsDataFile();
      },
    },
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

  page.formatOptionsPanel = page.generatorControls?.getFormatOptionsPanel?.() || null;
  page.optionsPanels = page.formatOptionsPanel?.getPanels?.() || {};

  page.renderSchemaRows();
  page.updateSchemaEditModeView?.();
  page.renderOptionsPanelForSelectedFormat();
  bindGeneratorPreviewEvents({ page });
}

export { bindGeneratorPreviewEvents as bindDataGeneratorPageEvents, initializeDataGeneratorPageHost };
