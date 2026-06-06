import { resolveDocumentObj } from '../../shared/dom/default-objects.js';

class OptionsPreviewSplitLayoutView {
  constructor({ root, controller, documentObj } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = resolveDocumentObj(documentObj, root);
    this.activeSplitDrag = null;
    this.handleSplitterMove = (event) => this.handleSplitterDragMove(event);
    this.handleSplitterEnd = (event) => this.endSplitterDrag(event);
  }

  mount() {
    if (!this.root) {
      throw new Error('OptionsPreviewSplitLayoutView requires a root element');
    }

    this.root.innerHTML = this.template();
    this.bindSplitterEvents();
    this.render();
  }

  template() {
    return `
      <div class="edit-area" data-role="edit-area">
        <div class="options-parent" data-role="options-panel-root" style="display: none"></div>
        <div
          class="options-preview-splitter"
          data-role="options-preview-splitter"
          style="display: none"
          role="separator"
          tabindex="0"
          aria-orientation="vertical"
          aria-label="Resize options panel"
        ></div>
        <div data-role="preview-text-wrapper" data-layout-role="preview-panel-root" style="height: 30%; width:100%;"></div>
      </div>
    `;
  }

  bindSplitterEvents() {
    const splitter = this.getOptionsPreviewSplitter();
    if (!splitter || splitter.dataset.splitterInitialised === 'true') {
      return;
    }

    splitter.dataset.splitterInitialised = 'true';
    splitter.addEventListener('pointerdown', (event) => this.beginSplitterDrag(event));
    splitter.addEventListener('keydown', (event) => this.handleSplitterKeyDown(event));
  }

  render() {
    const state = this.controller.getState();
    const editArea = this.getEditArea();
    const optionsParent = this.getOptionsPanelRoot();
    const splitter = this.getOptionsPreviewSplitter();
    const previewPanelRoot = this.getPreviewPanelRoot();

    if (!editArea || !optionsParent || !splitter || !previewPanelRoot) {
      return;
    }

    editArea.style.width = '100%';
    editArea.style.height = '30%';

    if (!state.optionsSupported) {
      editArea.style.display = 'block';
      optionsParent.style.display = 'none';
      splitter.style.display = 'none';
      previewPanelRoot.style.width = '100%';
      previewPanelRoot.style.height = '100%';
      previewPanelRoot.style.flex = '';
      return;
    }

    editArea.style.display = 'flex';
    previewPanelRoot.style.width = '100%';
    previewPanelRoot.style.height = '100%';
    previewPanelRoot.style.flex = '1 1 auto';
    optionsParent.style.height = '100%';
    optionsParent.style.display = 'block';
    splitter.style.display = 'block';

    const boundedWidth = this.controller.clampOptionsPanelWidth(
      this.controller.getInitialOptionsPanelWidthPx(),
      editArea.getBoundingClientRect?.().width || 0
    );
    this.applyOptionsPanelWidth(boundedWidth);
    this.updateSplitterAriaValues();
  }

  beginSplitterDrag(event) {
    if (!event || event.button > 0 || this.activeSplitDrag) {
      return;
    }

    const optionsParent = this.getOptionsPanelRoot();
    const editArea = this.getEditArea();
    if (!optionsParent || !editArea) {
      return;
    }

    this.activeSplitDrag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startWidth: this.controller.readOptionsPanelWidthPx(optionsParent.style.width),
    };

    event.preventDefault();
    this.documentObj?.body?.classList?.add('is-resizing-split');
    this.documentObj?.addEventListener?.('pointermove', this.handleSplitterMove);
    this.documentObj?.addEventListener?.('pointerup', this.handleSplitterEnd);
    this.documentObj?.addEventListener?.('pointercancel', this.handleSplitterEnd);
  }

  handleSplitterDragMove(event) {
    const dragState = this.activeSplitDrag;
    const editArea = this.getEditArea();
    if (!dragState || !editArea || event.pointerId !== dragState.pointerId) {
      return;
    }

    event.preventDefault();
    const requestedWidth = dragState.startWidth + (event.clientX - dragState.startX);
    const boundedWidth = this.controller.clampOptionsPanelWidth(
      requestedWidth,
      editArea.getBoundingClientRect?.().width || 0
    );
    this.applyOptionsPanelWidth(boundedWidth);
    this.updateSplitterAriaValues();
  }

  endSplitterDrag(event) {
    if (!this.activeSplitDrag) {
      return;
    }
    if (event && event.pointerId !== this.activeSplitDrag.pointerId) {
      return;
    }

    this.documentObj?.removeEventListener?.('pointermove', this.handleSplitterMove);
    this.documentObj?.removeEventListener?.('pointerup', this.handleSplitterEnd);
    this.documentObj?.removeEventListener?.('pointercancel', this.handleSplitterEnd);
    this.documentObj?.body?.classList?.remove('is-resizing-split');
    this.activeSplitDrag = null;
  }

  handleSplitterKeyDown(event) {
    if (!event) {
      return;
    }

    const optionsParent = this.getOptionsPanelRoot();
    const editArea = this.getEditArea();
    if (!optionsParent || !editArea) {
      return;
    }

    const step = event.shiftKey ? 24 : 12;
    let requestedWidth = this.controller.readOptionsPanelWidthPx(optionsParent.style.width);
    let handled = true;

    if (event.key === 'ArrowLeft') {
      requestedWidth -= step;
    } else if (event.key === 'ArrowRight') {
      requestedWidth += step;
    } else if (event.key === 'Home') {
      requestedWidth = this.controller.getState().minOptionsPanelWidthPx;
    } else if (event.key === 'End') {
      requestedWidth = this.controller.getState().maxOptionsPanelWidthPx;
    } else {
      handled = false;
    }

    if (!handled) {
      return;
    }

    event.preventDefault();
    const boundedWidth = this.controller.clampOptionsPanelWidth(
      requestedWidth,
      editArea.getBoundingClientRect?.().width || 0
    );
    this.applyOptionsPanelWidth(boundedWidth);
    this.updateSplitterAriaValues();
  }

  applyOptionsPanelWidth(widthPx) {
    const optionsParent = this.getOptionsPanelRoot();
    if (!optionsParent) {
      return;
    }
    const safeWidth = Math.round(widthPx);
    optionsParent.style.width = `${safeWidth}px`;
    optionsParent.style.minWidth = `${safeWidth}px`;
    optionsParent.style.maxWidth = `${safeWidth}px`;
    optionsParent.style.flex = '0 0 auto';
    this.controller.setCurrentOptionsPanelWidthPx(safeWidth);
  }

  updateSplitterAriaValues() {
    const splitter = this.getOptionsPreviewSplitter();
    const optionsParent = this.getOptionsPanelRoot();
    const editArea = this.getEditArea();
    if (!splitter || !optionsParent || !editArea) {
      return;
    }

    const state = this.controller.getState();
    const now = this.controller.clampOptionsPanelWidth(
      this.controller.readOptionsPanelWidthPx(optionsParent.style.width),
      editArea.getBoundingClientRect?.().width || 0
    );
    const max = this.controller.clampOptionsPanelWidth(
      state.maxOptionsPanelWidthPx,
      editArea.getBoundingClientRect?.().width || 0
    );
    splitter.setAttribute('aria-valuemin', `${state.minOptionsPanelWidthPx}`);
    splitter.setAttribute('aria-valuemax', `${max}`);
    splitter.setAttribute('aria-valuenow', `${now}`);
  }

  destroy() {
    this.documentObj?.removeEventListener?.('pointermove', this.handleSplitterMove);
    this.documentObj?.removeEventListener?.('pointerup', this.handleSplitterEnd);
    this.documentObj?.removeEventListener?.('pointercancel', this.handleSplitterEnd);
    this.documentObj?.body?.classList?.remove('is-resizing-split');
    this.root.replaceChildren();
  }

  getEditArea() {
    return this.root.querySelector('[data-role="edit-area"]');
  }

  getOptionsPanelRoot() {
    return this.root.querySelector('[data-role="options-panel-root"]');
  }

  getOptionsPreviewSplitter() {
    return this.root.querySelector('[data-role="options-preview-splitter"]');
  }

  getPreviewPanelRoot() {
    return this.root.querySelector('[data-layout-role="preview-panel-root"]');
  }
}

export { OptionsPreviewSplitLayoutView };
