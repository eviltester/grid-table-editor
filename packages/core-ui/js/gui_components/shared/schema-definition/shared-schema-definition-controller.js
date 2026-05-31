import { createSharedSchemaEditorController } from '../test-data/schema/index.js';

class SharedSchemaDefinitionController {
  constructor({ props = {}, callbacks = {}, documentObj = globalThis.document } = {}) {
    this.props = { ...props };
    this.callbacks = callbacks;
    this.documentObj = documentObj;
    this.schemaEditor = null;
  }

  updateProps(nextProps = {}) {
    this.props = { ...this.props, ...nextProps };
  }

  getViewModel() {
    const ids = this.props.ids || {};
    return {
      headingText: this.props.headingText || '',
      sectionClassName: this.props.sectionClassName || 'generator-schema',
      headingClassName: this.props.headingClassName || 'generator-schema-head',
      headingRowClassName: this.props.headingRowClassName || '',
      errorClassName: this.props.errorClassName || 'generator-schema-error-text',
      textAreaClassName: this.props.textAreaClassName || 'testDataSchemaTextArea',
      addButtonClassName: this.props.addButtonClassName || '',
      helpIconDataHelp: this.props.helpIconDataHelp || 'generator-schema-mode-help',
      toggleButtonTitle: this.props.toggleButtonTitle || 'Toggle schema text mode',
      addButtonLabel: this.props.addButtonLabel || '+ Add Field',
      textAreaPlaceholder: this.props.textAreaPlaceholder || 'Column Name\nrule\nColumn Name\nrule',
      ids: {
        rows: ids.rows || 'generatorSchemaRows',
        textContainer: ids.textContainer || 'generatorSchemaTextContainer',
        text: ids.text || 'generatorSchemaText',
        addButton: ids.addButton || 'addSchemaRowButton',
        toggleButton: ids.toggleButton || 'schemaModeToggleButton',
        helpIcon: ids.helpIcon || 'schemaModeHelpIcon',
        error: ids.error || 'generatorSchemaErrorText',
      },
    };
  }

  connect() {
    if (this.schemaEditor) {
      return;
    }

    const ids = this.getViewModel().ids;
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
      rootElement: this.props.rootElement,
      idMap: {
        generatorSchemaRows: ids.rows,
        generatorSchemaTextContainer: ids.textContainer,
        generatorSchemaText: ids.text,
        addSchemaRowButton: ids.addButton,
        schemaModeToggleButton: ids.toggleButton,
        schemaModeHelpIcon: ids.helpIcon,
      },
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

  render() {
    return this.schemaEditor?.render?.();
  }

  setRows(rows) {
    return this.schemaEditor?.setRows?.(rows, { allowEmpty: Array.isArray(rows) && rows.length === 0 });
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

export { SharedSchemaDefinitionController };
