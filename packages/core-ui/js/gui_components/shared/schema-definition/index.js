import { SharedSchemaDefinitionController } from './shared-schema-definition-controller.js';
import { SharedSchemaDefinitionView } from './shared-schema-definition-view.js';
import { createUpdateHelpHints } from '../../../help/help-tooltips.js';
import { resolveDocumentObj } from '../dom/default-objects.js';
import { createSchemaFileTransferService } from '../schema-file-transfer-service.js';

function createSharedSchemaDefinitionComponent({ root, props = {}, callbacks = {}, services = {}, documentObj } = {}) {
  const resolvedDocumentObj = resolveDocumentObj(documentObj, root);
  const schemaFileTransferService =
    services.schemaFileTransferService || createSchemaFileTransferService({ documentObj: resolvedDocumentObj });
  const controller = new SharedSchemaDefinitionController({
    props: {
      ...props,
      rootElement: root,
      updateHelpHints: props.updateHelpHints || createUpdateHelpHints(resolvedDocumentObj, root),
    },
    callbacks,
    services: {
      schemaFileTransferService,
    },
    documentObj: resolvedDocumentObj,
  });
  const view = new SharedSchemaDefinitionView({
    root,
    controller,
    documentObj: resolvedDocumentObj,
  });
  view.mount();

  return {
    update(nextProps) {
      controller.updateProps(nextProps);
      view.render();
    },
    destroy() {
      view.destroy();
      controller.destroy();
    },
    toggleMode() {
      return controller.toggleMode();
    },
    insertSampleSchema() {
      return controller.insertSampleSchema();
    },
    parseTextToRows(schemaText) {
      return controller.parseTextToRows(schemaText);
    },
    syncFromText(options) {
      return controller.syncFromText(options);
    },
    validateRows() {
      return controller.validateRows();
    },
    syncTextFromRows() {
      return controller.syncTextFromRows();
    },
    getSchemaText() {
      return controller.getSchemaText();
    },
    addRow() {
      return controller.addRow();
    },
    addRowAfter(index) {
      return controller.addRowAfter(index);
    },
    removeRowAt(index) {
      return controller.removeRowAt(index);
    },
    moveRowAt(index, direction) {
      return controller.moveRowAt(index, direction);
    },
    moveRowToIndex(fromIndex, toIndex) {
      return controller.moveRowToIndex(fromIndex, toIndex);
    },
    render() {
      return controller.render();
    },
    setRows(rows) {
      return controller.setRows(rows);
    },
    replaceRows(rows) {
      return controller.replaceRows(rows);
    },
    setTokens(tokens) {
      return controller.setTokens(tokens);
    },
    getTokens() {
      return controller.getTokens();
    },
    setTextMode(isTextMode) {
      return controller.setTextMode(isTextMode);
    },
    loadSchemaFromFile(file) {
      return controller.loadSchemaFromFile(file);
    },
    loadSchemaText(schemaText, options) {
      return controller.loadSchemaText(schemaText, options);
    },
    saveSchemaToFile(options) {
      return controller.saveSchemaToFile(options);
    },
    getState() {
      return controller.getState();
    },
    applySemanticValidationForRow(rowId) {
      return controller.applySemanticValidationForRow(rowId);
    },
  };
}

export { createSharedSchemaDefinitionComponent };
