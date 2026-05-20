/*
 * Responsibilities:
 * - Manages user-visible status messaging for the test-data grid panel.
 * - Handles delayed status reset timing and lightweight UI-yield helper.
 */

let testDataStatusResetTimeoutId = null;

function setTestDataStatus(message, isLoading) {
  const statusElement = document.getElementById('testdata-status');
  if (!statusElement) {
    return;
  }
  statusElement.textContent = message || '';
  statusElement.style.display = message ? 'inline-block' : 'none';
  statusElement.classList.toggle('is-loading', isLoading === true);
}

function clearPendingTestDataStatusReset() {
  if (testDataStatusResetTimeoutId === null) {
    return;
  }
  clearTimeout(testDataStatusResetTimeoutId);
  testDataStatusResetTimeoutId = null;
}

function scheduleTestDataStatusReset(delayMs = 1800) {
  clearPendingTestDataStatusReset();
  testDataStatusResetTimeoutId = setTimeout(() => {
    setTestDataStatus('', false);
    testDataStatusResetTimeoutId = null;
  }, delayMs);
}

function yieldToUi() {
  return new Promise((resolve) => {
    if (typeof requestAnimationFrame !== 'function') {
      setTimeout(resolve, 0);
      return;
    }
    requestAnimationFrame(() => setTimeout(resolve, 0));
  });
}

export { setTestDataStatus, clearPendingTestDataStatusReset, scheduleTestDataStatusReset, yieldToUi };
