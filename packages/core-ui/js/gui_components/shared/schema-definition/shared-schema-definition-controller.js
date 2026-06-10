import { createSharedSchemaEditorController } from '../test-data/schema/shared-schema-editor-controller.js';
import { getDefaultDocumentObj } from '../dom/default-objects.js';

const DEFAULT_SHARED_SCHEMA_IDS = Object.freeze({});

class SharedSchemaDefinitionController {
  constructor({ props = {}, callbacks = {}, documentObj = getDefaultDocumentObj() } = {}) {
    this.props = { ...props };
    this.callbacks = callbacks;
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
      footerClassName: this.props.footerClassName || 'shared-schema-footer',
      textAreaClassName: this.props.textAreaClassName || 'testDataSchemaTextArea',
      addButtonClassName: this.props.addButtonClassName || '',
      helpIconDataHelp: this.props.helpIconDataHelp || 'shared-schema-mode-help',
      toggleButtonTitle: this.props.toggleButtonTitle || 'Toggle schema text mode',
      addButtonLabel: this.props.addButtonLabel || '+ Add Field',
      textAreaPlaceholder: this.props.textAreaPlaceholder || 'Column Name\nrule\nColumn Name\nrule',
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
      validateSchemaRows: this.props.validateSchemaRows,
      updatePairwiseButtonVisibility: this.props.updatePairwiseButtonVisibility,
      updateHelpHints: this.props.updateHelpHints,
      timerApi: this.props.timerApi,
      rootElement: this.props.rootElement,
      elements: this.props.elements,
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

  getState() {
    return this.schemaEditor?.getState?.() || { schemaRows: [], schemaTextTokens: [], isTextMode: false };
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
