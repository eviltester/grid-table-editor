/*
 * Responsibilities:
 * - Manages user-visible status messaging for the test-data grid panel.
 * - Handles delayed status reset timing and lightweight UI-yield helper.
 */

import { createLoadingStatusPresenter, createStatusPresenter } from '../../../shared/test-data/ui/index.js';
import { resolveDocumentObj, resolveWindowObj } from '../../../shared/dom/default-objects.js';

let defaultStatusService = null;
let defaultStatusServiceDocument = null;
let defaultStatusServiceWindow = null;

function createYieldToUi({ documentObj, windowObj, requestAnimationFrameFn, setTimeoutFn } = {}) {
  const resolvedWindowObj = resolveWindowObj(windowObj, documentObj);
  const resolvedRequestAnimationFrameFn =
    requestAnimationFrameFn || resolvedWindowObj?.requestAnimationFrame?.bind(resolvedWindowObj);
  const resolvedSetTimeoutFn =
    setTimeoutFn || resolvedWindowObj?.setTimeout?.bind(resolvedWindowObj) || globalThis.setTimeout;

  return () =>
    new Promise((resolve) => {
      if (typeof resolvedRequestAnimationFrameFn !== 'function') {
        resolvedSetTimeoutFn(resolve, 0);
        return;
      }
      resolvedRequestAnimationFrameFn(() => resolvedSetTimeoutFn(resolve, 0));
    });
}

function createTestDataUiStatusService({
  documentObj,
  windowObj,
  createStatusPresenterFn = createStatusPresenter,
  createLoadingStatusPresenterFn = createLoadingStatusPresenter,
  requestAnimationFrameFn,
  setTimeoutFn,
  getStatusElement,
} = {}) {
  const resolvedDocumentObj = resolveDocumentObj(documentObj, null);
  const resolvedWindowObj = resolveWindowObj(windowObj, resolvedDocumentObj);
  const yieldToUi = createYieldToUi({
    documentObj: resolvedDocumentObj,
    windowObj: resolvedWindowObj,
    requestAnimationFrameFn,
    setTimeoutFn,
  });

  let statusPresenter = null;
  let loadingStatusPresenter = null;
  const resolveStatusElement = () =>
    getStatusElement?.() || resolvedDocumentObj?.querySelector?.('[data-role="population-status"]') || null;

  function getStatusPresenter() {
    if (!statusPresenter) {
      statusPresenter = createStatusPresenterFn({
        documentObj: resolvedDocumentObj,
        resolveElement: resolveStatusElement,
        hideWhenEmpty: true,
        visibleDisplay: 'inline-block',
      });
    }
    return statusPresenter;
  }

  function getLoadingStatusPresenter() {
    if (!loadingStatusPresenter) {
      loadingStatusPresenter = createLoadingStatusPresenterFn({
        documentObj: resolvedDocumentObj,
        resolveElement: resolveStatusElement,
        hideWhenEmpty: true,
        visibleDisplay: 'inline-block',
      });
    }
    return loadingStatusPresenter;
  }

  function destroy() {
    statusPresenter?.clearPendingReset?.();
    loadingStatusPresenter?.clearPendingReset?.();
    statusPresenter = null;
    loadingStatusPresenter = null;
  }

  return {
    getStatusPresenter,
    getLoadingStatusPresenter,
    setTestDataStatus(message, options = {}) {
      getStatusPresenter().setStatus(message, options);
    },
    setTestDataLoadingStatus(message) {
      getLoadingStatusPresenter().setStatus(message);
    },
    clearPendingTestDataStatusReset() {
      getStatusPresenter().clearPendingReset();
      getLoadingStatusPresenter().clearPendingReset();
    },
    scheduleTestDataStatusReset(delayMs = 1800) {
      getStatusPresenter().scheduleClear(delayMs);
    },
    yieldToUi,
    destroy,
  };
}

function getDefaultStatusService() {
  const documentObj = resolveDocumentObj(null, null);
  const windowObj = resolveWindowObj(null, documentObj);
  if (
    defaultStatusService &&
    defaultStatusServiceDocument === documentObj &&
    defaultStatusServiceWindow === windowObj
  ) {
    return defaultStatusService;
  }
  defaultStatusService?.destroy?.();
  defaultStatusService = createTestDataUiStatusService({
    documentObj,
    windowObj,
  });
  defaultStatusServiceDocument = documentObj;
  defaultStatusServiceWindow = windowObj;
  return defaultStatusService;
}

function setTestDataStatus(message, options = {}) {
  getDefaultStatusService().setTestDataStatus(message, options);
}

function setTestDataLoadingStatus(message) {
  getDefaultStatusService().setTestDataLoadingStatus(message);
}

function clearPendingTestDataStatusReset() {
  getDefaultStatusService().clearPendingTestDataStatusReset();
}

function scheduleTestDataStatusReset(delayMs = 1800) {
  getDefaultStatusService().scheduleTestDataStatusReset(delayMs);
}

function yieldToUi() {
  return getDefaultStatusService().yieldToUi();
}

export {
  createTestDataUiStatusService,
  createYieldToUi,
  setTestDataStatus,
  setTestDataLoadingStatus,
  clearPendingTestDataStatusReset,
  scheduleTestDataStatusReset,
  yieldToUi,
};
