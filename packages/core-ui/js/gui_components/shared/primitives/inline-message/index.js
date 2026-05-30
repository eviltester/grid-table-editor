import { InlineMessageController } from './inline-message-controller.js';
import { InlineMessageView } from './inline-message-view.js';

function createInlineMessageComponent({ root, props = {} } = {}) {
  let view;
  const controller = new InlineMessageController({
    props,
    callbacks: {
      onStateChanged: () => view?.render(),
    },
  });
  view = new InlineMessageView({ root, controller });
  view.mount();

  return {
    update(nextProps) {
      controller.updateProps(nextProps);
    },
    setStatus(message, isLoading = false) {
      controller.setStatus(message, isLoading);
    },
    show(message, options = {}) {
      controller.show(message, options);
    },
    clearPendingReset() {
      controller.clearPendingReset();
    },
    scheduleClear(delayMs) {
      controller.scheduleClear(delayMs);
    },
    clear() {
      controller.clear();
    },
    destroy() {
      controller.destroy();
      view.destroy();
    },
    getState() {
      return controller.getState();
    },
  };
}

export { createInlineMessageComponent, InlineMessageController, InlineMessageView };
