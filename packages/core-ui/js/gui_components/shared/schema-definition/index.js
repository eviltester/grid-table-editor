import { SharedSchemaDefinitionController } from './shared-schema-definition-controller.js';
import { SharedSchemaDefinitionView } from './shared-schema-definition-view.js';
import { createUpdateHelpHints } from '../../../help/help-tooltips.js';

function createSharedSchemaDefinitionComponent({ root, props = {}, callbacks = {}, documentObj = document } = {}) {
  const controller = new SharedSchemaDefinitionController({
    props: {
      ...props,
      rootElement: root,
      updateHelpHints: props.updateHelpHints || createUpdateHelpHints(documentObj, root),
    },
    callbacks,
    documentObj,
  });
  const view = new SharedSchemaDefinitionView({
    root,
    controller,
    documentObj,
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
    syncFromText(options) {
      return controller.syncFromText(options);
    },
    validateRows() {
      return controller.validateRows();
    },
    syncTextFromRows() {
      return controller.syncTextFromRows();
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
    render() {
      return controller.render();
    },
    setRows(rows) {
      return controller.setRows(rows);
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
    getState() {
      return controller.getState();
    },
  };
}

export { createSharedSchemaDefinitionComponent, SharedSchemaDefinitionController, SharedSchemaDefinitionView };
