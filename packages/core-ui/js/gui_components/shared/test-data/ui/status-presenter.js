import { createInlineMessageComponent } from '../../primitives/inline-message/index.js';

/*
 * Responsibilities:
 * - Presents transient status messages on a target UI element.
 * - Manages loading class toggling and timed clear lifecycle.
 */

function createStatusPresenter({
  documentObj = document,
  elementId,
  loadingClassName = 'is-loading',
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

    component?.destroy?.();
    rootElement = nextRoot;
    component = createInlineMessageComponent({
      root: nextRoot,
      props: {
        hideWhenEmpty,
        visibleDisplay,
        loadingClassName,
      },
    });
    return component;
  };

  const setStatus = (message, isLoading = false) => {
    ensureComponent()?.setStatus(message, isLoading);
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

  return {
    setStatus,
    clearPendingReset,
    scheduleClear,
    clear,
  };
}

export { createStatusPresenter };
