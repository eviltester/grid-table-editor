import { resolveDocumentObj } from '../../shared/dom/default-objects.js';
import { GeneratorOutputFormatSelectorController } from './generator-output-format-selector-controller.js';
import { GeneratorOutputFormatSelectorView } from './generator-output-format-selector-view.js';

function createGeneratorOutputFormatSelectorComponent({
  root,
  props = {},
  services = {},
  callbacks = {},
  documentObj,
} = {}) {
  const resolvedDocumentObj = resolveDocumentObj(documentObj, root);
  const controller = new GeneratorOutputFormatSelectorController({ props, callbacks });
  const view = new GeneratorOutputFormatSelectorView({
    root,
    controller,
    documentObj: resolvedDocumentObj,
    services,
    ids: props.ids || {},
  });

  view.mount();

  return {
    update(nextProps) {
      controller.updateProps(nextProps);
      view.render();
    },
    destroy() {
      view.destroy();
    },
    getState() {
      return controller.getState();
    },
    getSelectedFormat() {
      return view.getSelectedFormat();
    },
  };
}

export { createGeneratorOutputFormatSelectorComponent };
