function getDefaultDocumentObj() {
  return typeof document !== 'undefined' ? document : null;
}

class GridRowVisibilitySummaryView {
  constructor({ root, controller, documentObj = getDefaultDocumentObj() } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = documentObj;
  }

  mount() {
    if (!this.root) {
      throw new Error('GridRowVisibilitySummaryView requires a root element');
    }
    this.render();
  }

  render() {
    const state = this.controller.getState();
    this.root.className = state.className;
    this.root.setAttribute('data-role', state.roleName);
    this.root.setAttribute('aria-live', 'polite');
    this.root.setAttribute('role', 'status');
    this.root.textContent = this.controller.getDisplayText();
  }

  destroy() {
    this.root.className = '';
    this.root.removeAttribute('aria-live');
    this.root.removeAttribute('role');
    this.root.removeAttribute('data-role');
    this.root.textContent = '';
  }
}

export { GridRowVisibilitySummaryView };
