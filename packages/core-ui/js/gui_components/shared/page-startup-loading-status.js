import { createLoadingStatusPresenter, createStatusPresenter } from './test-data/ui/index.js';
import { resolveDocumentObj } from './dom/default-objects.js';

function createPageStartupLoadingStatus({
  documentObj,
  rootElement = null,
  elementId,
  message = 'Please Wait, Loading Libraries...',
  statusClassName = 'is-loading',
  visibleDisplay = 'inline-block',
  createStatusPresenterFn = createStatusPresenter,
  createLoadingStatusPresenterFn = createLoadingStatusPresenter,
} = {}) {
  const resolvedDocumentObj = resolveDocumentObj(documentObj, rootElement);
  const statusPresenter = createStatusPresenterFn({
    documentObj: resolvedDocumentObj,
    elementId,
    hideWhenEmpty: false,
    statusClassName,
    visibleDisplay,
  });
  const loadingPresenter = createLoadingStatusPresenterFn({
    documentObj: resolvedDocumentObj,
    elementId,
    hideWhenEmpty: false,
    statusClassName,
    visibleDisplay,
  });

  return {
    show(nextMessage = message) {
      loadingPresenter.setStatus(nextMessage);
    },
    clear() {
      statusPresenter.clear();
      loadingPresenter.clear();
      resolvedDocumentObj?.getElementById?.(elementId)?.remove();
    },
    fail(nextMessage = 'Failed to load libraries. Check console for details.') {
      statusPresenter.setStatus(nextMessage, { severity: 'error' });
    },
  };
}

export { createPageStartupLoadingStatus };
