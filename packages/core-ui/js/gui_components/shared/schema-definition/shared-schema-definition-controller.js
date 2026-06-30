import { createSharedSchemaEditorController } from '../test-data/schema/shared-schema-editor-controller.js';
import { getDefaultDocumentObj } from '../dom/default-objects.js';

const DEFAULT_SHARED_SCHEMA_IDS = Object.freeze({});

class SharedSchemaDefinitionController {
  constructor({ props = {}, callbacks = {}, services = {}, documentObj = getDefaultDocumentObj() } = {}) {
    this.props = { ...props };
    this.callbacks = callbacks;
    this.services = services;
    this.documentObj = documentObj;
    this.schemaEditor = null;
  }

  updateProps(nextProps = {}) {
    this.props = { ...this.props, ...nextProps };
  }

  attachElements(elements = {}) {
    this.props = {
      ...this.props,
      elements: {
        ...(this.props.elements || {}),
        ...elements,
      },
    };
  }

  getViewModel() {
    const ids = this.props.ids || {};
    return {
      headingText: this.props.headingText || '',
      sectionClassName: this.props.sectionClassName || 'shared-schema-definition-shell',
      headingClassName: this.props.headingClassName || 'shared-schema-heading',
      headingRowClassName: this.props.headingRowClassName || '',
      errorClassName: this.props.errorClassName || 'shared-schema-error',
      helpGroupClassName: this.props.helpGroupClassName || 'shared-schema-button-with-help',
      rowsClassName: this.props.rowsClassName || 'shared-schema-rows',
      textContainerClassName: this.props.textContainerClassName || 'shared-schema-text',
      constraintsDetailsClassName: this.props.constraintsDetailsClassName || 'shared-schema-constraints',
      constraintsSummaryClassName: this.props.constraintsSummaryClassName || 'shared-schema-constraints-summary',
      constraintsTextAreaClassName:
        this.props.constraintsTextAreaClassName || 'testDataSchemaTextArea shared-schema-constraints-textarea',
      footerClassName: this.props.footerClassName || 'shared-schema-footer',
      textAreaClassName: this.props.textAreaClassName || 'testDataSchemaTextArea',
      addButtonClassName: this.props.addButtonClassName || '',
      helpIconDataHelp: this.props.helpIconDataHelp || 'shared-schema-mode-help',
      toggleButtonTitle: this.props.toggleButtonTitle || 'Toggle schema text mode',
      addButtonLabel: this.props.addButtonLabel || '+ Add Field',
      textAreaPlaceholder: this.props.textAreaPlaceholder || 'Column Name\nrule\nColumn Name\nrule',
      constraintsTextAreaPlaceholder:
        this.props.constraintsTextAreaPlaceholder || 'IF [Column] = "value" THEN [Other Column] = "value" ENDIF',
      fileActionsClassName: this.props.fileActionsClassName || 'shared-schema-file-actions',
      loadFileButtonClassName: this.props.loadFileButtonClassName || 'icon-button',
      saveFileButtonClassName: this.props.saveFileButtonClassName || 'icon-button',
      loadFileButtonLabel: this.props.loadFileButtonLabel || 'Load Schema File',
      saveFileButtonLabel: this.props.saveFileButtonLabel || 'Save Schema File',
      loadFileInputAccept: this.props.loadFileInputAccept || '.txt,.schema,text/plain',
      ids: {
        rows: ids.rows || null,
        textContainer: ids.textContainer || null,
        text: ids.text || null,
        addButton: ids.addButton || null,
        toggleButton: ids.toggleButton || null,
        helpIcon: ids.helpIcon || null,
        error: ids.error || null,
      },
    };
  }

  connect() {
    if (this.schemaEditor) {
      return;
    }

    this.schemaEditor = createSharedSchemaEditorController({
      documentObj: this.documentObj,
      schemaTextToDataRules: this.props.schemaTextToDataRules,
      dataRulesToSchemaText: this.props.dataRulesToSchemaText,
      faker: this.props.faker,
      RandExp: this.props.RandExp,
      createBlankRow: this.props.createBlankRow,
      mapRuleToRow: this.props.mapRuleToRow,
      getMethodPickerOptions: this.props.getMethodPickerOptions,
      getVisibleDomainCommands: this.props.getVisibleDomainCommands,
      fakerCommands: this.props.fakerCommands,
      sampleSchemaText: this.props.sampleSchemaText,
      buildModeHelpHtml: this.props.buildModeHelpHtml,
      schemaErrorDisplay: this.props.schemaErrorDisplay,
      onSchemaError: this.callbacks.onSchemaError,
      onSchemaClear: this.callbacks.onSchemaClear,
      onSchemaParseError: this.callbacks.onSchemaParseError,
      onRowsChanged: this.callbacks.onRowsChanged,
      onSchemaTextChanged: this.callbacks.onSchemaTextChanged,
      validateSchemaRows: this.props.validateSchemaRows,
      getUnsafeFakerExpressions: this.props.getUnsafeFakerExpressions,
      updatePairwiseButtonVisibility: this.props.updatePairwiseButtonVisibility,
      updateHelpHints: this.props.updateHelpHints,
      timerApi: this.props.timerApi,
      rootElement: this.props.rootElement,
      elements: this.props.elements,
      requestConfirm: this.services.requestConfirm,
      createConfirmDialogServiceFn: this.services.createConfirmDialogServiceFn,
    });
  }

  init() {
    this.connect();
    this.schemaEditor?.init?.();
  }

  destroy() {
    this.schemaEditor?.destroy?.();
    this.schemaEditor = null;
  }

  toggleMode() {
    return this.schemaEditor?.toggleMode?.();
  }

  insertSampleSchema() {
    return this.schemaEditor?.insertSampleSchema?.();
  }

  parseTextToRows(schemaText) {
    return this.schemaEditor?.parseTextToRows?.(schemaText) || { rows: [], errors: [], tokens: [] };
  }

  syncFromText(options) {
    return this.schemaEditor?.syncFromText?.(options) || { rows: [], errors: [] };
  }

  validateRows() {
    return this.schemaEditor?.validateRows?.() || { rows: [], errors: [] };
  }

  syncTextFromRows() {
    return this.schemaEditor?.syncTextFromRows?.();
  }

  getSchemaText() {
    return this.schemaEditor?.getSchemaText?.() || '';
  }

  syncConstraintsFromEditor(options) {
    return this.schemaEditor?.syncConstraintsFromEditor?.(options) || { rows: [], errors: [] };
  }

  addRow() {
    return this.schemaEditor?.addRow?.();
  }

  addRowAfter(index) {
    return this.schemaEditor?.addRowAfter?.(index);
  }

  removeRowAt(index) {
    return this.schemaEditor?.removeRowAt?.(index);
  }

  moveRowAt(index, direction) {
    return this.schemaEditor?.moveRowAt?.(index, direction);
  }

  moveRowToIndex(fromIndex, toIndex) {
    return this.schemaEditor?.moveRowToIndex?.(fromIndex, toIndex);
  }

  render() {
    return this.schemaEditor?.render?.();
  }

  setRows(rows) {
    return this.schemaEditor?.setRows?.(rows, { allowEmpty: Array.isArray(rows) && rows.length === 0 });
  }

  replaceRows(rows) {
    return this.schemaEditor?.replaceRows?.(rows) || { rows: [], errors: [] };
  }

  setTokens(tokens) {
    return this.schemaEditor?.setTokens?.(tokens);
  }

  getTokens() {
    return this.schemaEditor?.getTokens?.() || [];
  }

  setTextMode(isTextMode) {
    return this.schemaEditor?.setTextMode?.(isTextMode);
  }

  setSchemaError(message) {
    const text = String(message || '');
    this.props.schemaErrorDisplay?.show?.(text);
    this.callbacks.onSchemaError?.(text);
  }

  clearSchemaError() {
    this.props.schemaErrorDisplay?.clear?.();
    this.callbacks.onSchemaClear?.();
  }

  async loadSchemaFromFile(file) {
    if (!file) {
      return null;
    }

    const fileTransferService = this.services.schemaFileTransferService;
    if (typeof fileTransferService?.readSchemaTextFile !== 'function') {
      const message = 'Schema file loading is not available in this browser.';
      this.setSchemaError(message);
      return { rows: this.getState().rows || [], errors: [new Error(message)] };
    }

    try {
      this.clearSchemaError();
      const schemaText = await fileTransferService.readSchemaTextFile(file);
      const result = this.loadSchemaText(schemaText, { showErrors: true, preferRowMode: true });
      if (result?.applied !== false) {
        this.callbacks.onSchemaFileLoaded?.({
          fileName: file.name || '',
          schemaText,
          result,
        });
      }
      return result;
    } catch (error) {
      const message = `Unable to load schema file: ${error?.message || String(error)}`;
      this.setSchemaError(message);
      return { rows: this.getState().rows || [], errors: [new Error(message)] };
    }
  }

  loadSchemaText(schemaText, options) {
    return this.schemaEditor?.loadSchemaText?.(schemaText, options) || { rows: [], errors: [] };
  }

  saveSchemaToFile({ filename = this.props.schemaFileName || 'schema.txt' } = {}) {
    const fileTransferService = this.services.schemaFileTransferService;
    if (typeof fileTransferService?.downloadSchemaText !== 'function') {
      const message = 'Schema file saving is not available in this browser.';
      this.setSchemaError(message);
      return false;
    }

    this.clearSchemaError();
    const schemaText = this.getSchemaText();
    const didStartDownload = fileTransferService.downloadSchemaText(schemaText, {
      filename,
    });
    this.callbacks.onSchemaFileSaved?.({
      filename,
      schemaText,
      didStartDownload,
    });
    return didStartDownload;
  }

  getState() {
    return (
      this.schemaEditor?.getState?.() || {
        rows: [],
        tokens: [],
        constraints: [],
        constraintText: '',
        isTextMode: false,
      }
    );
  }

  handleInput(event) {
    return this.schemaEditor?.handleInput?.(event);
  }

  handleFocusOut(event) {
    return this.schemaEditor?.handleFocusOut?.(event);
  }

  handleClick(event) {
    return this.schemaEditor?.handleClick?.(event);
  }

  handleDragStart(event) {
    return this.schemaEditor?.handleDragStart?.(event);
  }

  handleDragOver(event) {
    return this.schemaEditor?.handleDragOver?.(event);
  }

  handleDrop(event) {
    return this.schemaEditor?.handleDrop?.(event);
  }

  handleDragEnd() {
    return this.schemaEditor?.handleDragEnd?.();
  }

  applySemanticValidationForRow(rowId) {
    return this.schemaEditor?.applySemanticValidationForRow?.(rowId);
  }
}

export { SharedSchemaDefinitionController, DEFAULT_SHARED_SCHEMA_IDS };
