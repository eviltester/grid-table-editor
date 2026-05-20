/*
 * Responsibilities:
 * - Manages user-visible status messaging for the test-data grid panel.
 * - Handles delayed status reset timing and lightweight UI-yield helper.
 */

import { createStatusPresenter } from '../../shared/test-data/status-presenter.js';

let testDataStatusPresenter = null;
let testDataStatusPresenterDocument = null;

function getStatusPresenter() {
  const documentObj = typeof document !== 'undefined' ? document : null;
  if (testDataStatusPresenter && testDataStatusPresenterDocument === documentObj) {
    return testDataStatusPresenter;
  }
  if (testDataStatusPresenter && testDataStatusPresenterDocument !== documentObj) {
    testDataStatusPresenter.clearPendingReset();
  }
  testDataStatusPresenter = createStatusPresenter({
    documentObj,
    elementId: 'testdata-status',
    hideWhenEmpty: true,
    visibleDisplay: 'inline-block',
  });
  testDataStatusPresenterDocument = documentObj;
  return testDataStatusPresenter;
}

function setTestDataStatus(message, isLoading) {
  getStatusPresenter().setStatus(message, isLoading);
}

function clearPendingTestDataStatusReset() {
  getStatusPresenter().clearPendingReset();
}

function scheduleTestDataStatusReset(delayMs = 1800) {
  getStatusPresenter().scheduleClear(delayMs);
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
