import { createInlineMessageComponent } from './primitives/inline-message/index.js';
import { getDefaultDocumentObj } from './dom/default-objects.js';

function createTimedStatusPresenter({ documentObj = getDefaultDocumentObj(), elementId, timeoutMs = 5000 } = {}) {
  let component = null;
  let rootElement = null;

  const getComponent = () => {
    const nextRoot = documentObj?.getElementById?.(elementId);
    if (!nextRoot) {
      return null;
    }

    if (component && rootElement === nextRoot && nextRoot.isConnected !== false) {
      return component;
    }

    component?.destroy?.();
    rootElement = nextRoot;
    component = createInlineMessageComponent({
      root: nextRoot,
      props: {
        timeoutMs,
        hideWhenEmpty: true,
      },
    });
    return component;
  };

  getComponent();

  return {
    clear() {
      getComponent()?.clear();
    },
    destroy() {
      component?.destroy?.();
      component = null;
      rootElement = null;
    },
    show(message, { severity = 'error', timeoutMs: nextTimeoutMs = timeoutMs } = {}) {
      getComponent()?.show(message, { severity, timeoutMs: nextTimeoutMs });
    },
  };
}

class TimedStatusDisplay {
  constructor(options = {}) {
    this.presenter = createTimedStatusPresenter(options);
  }

  clear() {
    this.presenter.clear();
  }

  destroy() {
    this.presenter.destroy();
  }

  show(message, options = {}) {
    this.presenter.show(message, options);
  }
}

export { createTimedStatusPresenter, TimedStatusDisplay };
