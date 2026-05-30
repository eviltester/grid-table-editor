import { createLoadingStatusPresenter, createStatusPresenter } from './test-data/ui/index.js';

function createPageStartupLoadingStatus({
  documentObj = document,
  elementId,
  message = 'Please Wait, Loading Libraries...',
  statusClassName = 'is-loading',
  visibleDisplay = 'inline-block',
} = {}) {
  const statusPresenter = createStatusPresenter({
    documentObj,
    elementId,
    hideWhenEmpty: false,
    statusClassName,
    visibleDisplay,
  });
  const loadingPresenter = createLoadingStatusPresenter({
    documentObj,
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
      documentObj.getElementById(elementId)?.remove();
    },
    fail(nextMessage = 'Failed to load libraries. Check console for details.') {
      statusPresenter.setStatus(nextMessage);
    },
  };
}

export { createPageStartupLoadingStatus };
