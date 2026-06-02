import { createInlineMessageComponent } from '../../primitives/inline-message/index.js';

/*
 * Responsibilities:
 * - Presents transient status messages on a target UI element.
 * - Manages loading class toggling and timed clear lifecycle.
 */

const inlineMessageRegistry = new WeakMap();

function getDefaultDocumentObj() {
  return typeof document !== 'undefined' ? document : null;
}

function createBaseStatusPresenter({
  documentObj = getDefaultDocumentObj(),
  elementId,
  statusClassName = 'is-loading',
  loadingClassName,
  visibleDisplay = 'inline-block',
  hideWhenEmpty = false,
} = {}) {
  let component = null;
  let rootElement = null;

  const getElement = () => {
    if (!documentObj || !elementId) {
      return null;
    }
    return documentObj.getElementById(elementId);
  };

  const ensureComponent = () => {
    const nextRoot = getElement();
    if (!nextRoot) {
      return null;
    }

    if (component && rootElement === nextRoot && nextRoot.isConnected !== false) {
      return component;
    }

    rootElement = nextRoot;
    component = inlineMessageRegistry.get(nextRoot);
    if (!component) {
      component = createInlineMessageComponent({
        root: nextRoot,
        props: {
          hideWhenEmpty,
          visibleDisplay,
          loadingClassName: loadingClassName || statusClassName,
        },
      });
      inlineMessageRegistry.set(nextRoot, component);
    } else {
      component.update({
        hideWhenEmpty,
        visibleDisplay,
        loadingClassName: loadingClassName || statusClassName,
      });
    }
    return component;
  };

  const setStatus = (message, options = {}) => {
    ensureComponent()?.setStatus(message, options);
  };

  const clearPendingReset = () => {
    ensureComponent()?.clearPendingReset();
  };

  const scheduleClear = (delayMs = 1800) => {
    ensureComponent()?.scheduleClear(delayMs);
  };

  const clear = () => {
    ensureComponent()?.clear();
  };

  const destroy = () => {
    component?.destroy?.();
    component = null;
    rootElement = null;
  };

  return {
    setStatus,
    clearPendingReset,
    scheduleClear,
    clear,
    destroy,
  };
}

function createStatusPresenter(options = {}) {
  const presenter = createBaseStatusPresenter(options);

  return {
    clear: presenter.clear,
    clearPendingReset: presenter.clearPendingReset,
    destroy: presenter.destroy,
    scheduleClear: presenter.scheduleClear,
    setStatus(message, options = {}) {
      presenter.setStatus(message, {
        severity: options?.severity || '',
        dismissable: options?.dismissable === true,
        isLoading: false,
      });
    },
  };
}

function createLoadingStatusPresenter(options = {}) {
  const presenter = createBaseStatusPresenter(options);

  return {
    clear: presenter.clear,
    clearPendingReset: presenter.clearPendingReset,
    destroy: presenter.destroy,
    scheduleClear: presenter.scheduleClear,
    setStatus(message) {
      presenter.setStatus(message, { isLoading: true });
    },
  };
}

export { createStatusPresenter, createLoadingStatusPresenter };
