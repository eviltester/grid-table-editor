import { createLoadingStatusPresenter, createStatusPresenter } from './test-data/ui/status-presenter.js';
import { resolveDocumentObj } from './dom/default-objects.js';

function createPageStartupLoadingStatus({
  documentObj,
  rootElement = null,
  resolveElement = null,
  message = 'Please Wait, Loading Libraries...',
  statusClassName = 'is-loading',
  visibleDisplay = 'inline-block',
  createStatusPresenterFn = createStatusPresenter,
  createLoadingStatusPresenterFn = createLoadingStatusPresenter,
} = {}) {
  const resolvedDocumentObj = resolveDocumentObj(documentObj, rootElement);
  const resolveStatusElement = typeof resolveElement === 'function' ? resolveElement : () => null;
  const statusPresenter = createStatusPresenterFn({
    documentObj: resolvedDocumentObj,
    resolveElement: resolveStatusElement,
    hideWhenEmpty: false,
    statusClassName,
    visibleDisplay,
  });
  const loadingPresenter = createLoadingStatusPresenterFn({
    documentObj: resolvedDocumentObj,
    resolveElement: resolveStatusElement,
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
      resolveStatusElement()?.remove?.();
    },
    fail(nextMessage = 'Failed to load libraries. Check console for details.') {
      statusPresenter.setStatus(nextMessage, { severity: 'error' });
    },
  };
}

export { createPageStartupLoadingStatus };
