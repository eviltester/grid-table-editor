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
  let resetTimeoutId = null;

  const getElement = () => {
    if (!documentObj || !elementId) {
      return null;
    }
    return documentObj.getElementById(elementId);
  };

  const setStatus = (message, isLoading = false) => {
    const statusElement = getElement();
    if (!statusElement) {
      return;
    }
    statusElement.textContent = message || '';
    statusElement.classList.toggle(loadingClassName, isLoading === true && Boolean(message));
    if (hideWhenEmpty) {
      statusElement.style.display = message ? visibleDisplay : 'none';
    }
  };

  const clearPendingReset = () => {
    if (resetTimeoutId === null) {
      return;
    }
    clearTimeout(resetTimeoutId);
    resetTimeoutId = null;
  };

  const scheduleClear = (delayMs = 1800) => {
    clearPendingReset();
    resetTimeoutId = setTimeout(() => {
      setStatus('', false);
      resetTimeoutId = null;
    }, delayMs);
  };

  const clear = () => {
    clearPendingReset();
    setStatus('', false);
  };

  return {
    setStatus,
    clearPendingReset,
    scheduleClear,
    clear,
  };
}

export { createStatusPresenter };
