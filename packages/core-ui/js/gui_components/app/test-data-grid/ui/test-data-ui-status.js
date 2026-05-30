/*
 * Responsibilities:
 * - Manages user-visible status messaging for the test-data grid panel.
 * - Handles delayed status reset timing and lightweight UI-yield helper.
 */

import { createLoadingStatusPresenter, createStatusPresenter } from '../../../shared/test-data/ui/index.js';

let testDataStatusPresenter = null;
let testDataLoadingStatusPresenter = null;
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

function getLoadingStatusPresenter() {
  const documentObj = typeof document !== 'undefined' ? document : null;
  if (testDataLoadingStatusPresenter && testDataStatusPresenterDocument === documentObj) {
    return testDataLoadingStatusPresenter;
  }
  if (testDataLoadingStatusPresenter && testDataStatusPresenterDocument !== documentObj) {
    testDataLoadingStatusPresenter.clearPendingReset();
  }
  testDataLoadingStatusPresenter = createLoadingStatusPresenter({
    documentObj,
    elementId: 'testdata-status',
    hideWhenEmpty: true,
    visibleDisplay: 'inline-block',
  });
  testDataStatusPresenterDocument = documentObj;
  return testDataLoadingStatusPresenter;
}

function setTestDataStatus(message, options = {}) {
  getStatusPresenter().setStatus(message, options);
}

function setTestDataLoadingStatus(message) {
  getLoadingStatusPresenter().setStatus(message);
}

function clearPendingTestDataStatusReset() {
  getStatusPresenter().clearPendingReset();
  getLoadingStatusPresenter().clearPendingReset();
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

export {
  setTestDataStatus,
  setTestDataLoadingStatus,
  clearPendingTestDataStatusReset,
  scheduleTestDataStatusReset,
  yieldToUi,
};
