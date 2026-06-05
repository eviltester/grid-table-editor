import { resolveDocumentObj } from '../../shared/dom/default-objects.js';

const TOOLBAR_ROOT_ROLE = 'import-export-toolbar-root';
const TEXT_PREVIEW_EDITOR_ROOT_ROLE = 'text-preview-editor-root';

class ImportExportWorkspaceView {
  constructor({ root, controller, documentObj, services = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = resolveDocumentObj(documentObj, root);
    this.services = services;
    this.toolbar = null;
    this.textPreviewEditor = null;
    this.formatSelector = null;
    this.formatOptionsPanel = null;
    this.currentOptionsPanelWidthPx = null;
    this.defaultOptionsPanelWidthPx = 272;
    this.minOptionsPanelWidthPx = 180;
    this.maxOptionsPanelWidthPx = 520;
    this.minPreviewPanelWidthPx = 220;
    this.activeSplitDrag = null;
    this.handleSplitterMove = (event) => this.handleSplitterDragMove(event);
    this.handleSplitterEnd = (event) => this.endSplitterDrag(event);
  }

  mount() {
    if (!this.root) {
      throw new Error('ImportExportWorkspaceView requires a root element');
    }

    this.root.innerHTML = this.template();
    this.createFeatures();
    this.render();
  }

  template() {
    return `
      <section class="import-export-workspace" aria-label="Import Export Workspace">
        <div class="importexport" id="importExportToolbarRoot" data-role="${TOOLBAR_ROOT_ROLE}"></div>
        <div class="tabbedTextArea" id="tabbedTextArea" data-role="${TEXT_PREVIEW_EDITOR_ROOT_ROLE}"></div>
      </section>
    `;
  }

  createFeatures() {
    const state = this.controller.getState();
    this.toolbar = this.services.createImportExportToolbarComponent?.({
      root: this.getElementByRole(TOOLBAR_ROOT_ROLE),
      documentObj: this.documentObj,
      props: state,
      callbacks: {
        onSetTextFromGrid: this.services.onSetTextFromGrid,
        onSetGridFromText: this.services.onSetGridFromText,
        onDownload: this.services.onDownload,
        onFileSelected: this.services.onFileSelected,
      },
      services: {
        createFileImportBindingsAdapter: this.services.createFileImportBindingsAdapter,
      },
    });

    this.textPreviewEditor = this.services.createTextPreviewEditorComponent?.({
      root: this.getElementByRole(TEXT_PREVIEW_EDITOR_ROOT_ROLE),
      documentObj: this.documentObj,
      props: {
        mode: state.mode,
        previewRowLimit: state.previewRowLimit,
        autoPreviewEnabled: state.autoPreviewEnabled,
      },
      callbacks: {
        onToggleMode: this.services.onToggleMode,
        onAutoPreviewChange: this.services.onAutoPreviewChange,
        onPreviewRowLimitChange: this.services.onPreviewRowLimitChange,
        onTextInput: this.services.onTextInput,
        onCopyText: this.services.onCopyText,
      },
    });

    this.formatSelector = this.services.createFormatSelectorComponent?.({
      root: this.textPreviewEditor?.getFormatSelectorRoot?.(),
      subtasksRoot: this.textPreviewEditor?.getFormatSubtasksRoot?.(),
      documentObj: this.documentObj,
      props: {
        selectedFormat: state.selectedFormat,
      },
      callbacks: {
        onFormatChange: this.services.onFormatChange,
      },
    });
  }

  getElementByRole(role) {
    return this.root?.querySelector?.(`[data-role="${role}"]`) || null;
  }

  render() {
    const state = this.controller.getState();
    this.toolbar?.update?.(state);
    this.textPreviewEditor?.update?.({
      mode: state.mode,
      previewRowLimit: state.previewRowLimit,
      autoPreviewEnabled: state.autoPreviewEnabled,
    });
    this.formatSelector?.update?.({
      selectedFormat: state.selectedFormat,
    });
  }

  destroy() {
    this.documentObj?.removeEventListener?.('pointermove', this.handleSplitterMove);
    this.documentObj?.removeEventListener?.('pointerup', this.handleSplitterEnd);
    this.documentObj?.removeEventListener?.('pointercancel', this.handleSplitterEnd);
    this.documentObj?.body?.classList?.remove('is-resizing-split');
    this.formatOptionsPanel?.destroy?.();
    this.formatSelector?.destroy?.();
    this.textPreviewEditor?.destroy?.();
    this.toolbar?.destroy?.();
    this.root.replaceChildren();
  }

  getTextValue() {
    return this.textPreviewEditor?.getTextValue?.() || '';
  }

  setTextValue(value) {
    this.textPreviewEditor?.setTextValue?.(value);
  }

  getTextArea() {
    return this.textPreviewEditor?.getTextArea?.() || null;
  }

  setCopyButtonText(value) {
    this.textPreviewEditor?.setCopyButtonText?.(value);
  }

  getOptionsFromGui() {
    return this.formatOptionsPanel?.getOptionsFromGui?.() || null;
  }

  isOptionsPanelSupported() {
    return this.formatOptionsPanel?.isSupported?.() === true;
  }

  renderOptionsPanel({ selectedFormat, currentOptions } = {}) {
    const editArea = this.textPreviewEditor?.getEditArea?.();
    const optionsParent = this.textPreviewEditor?.getOptionsPanelRoot?.();
    const splitter = this.textPreviewEditor?.getOptionsPreviewSplitter?.();
    const textAreaWrapper = this.textPreviewEditor?.getTextAreaWrapper?.();

    if (!editArea || !optionsParent || !textAreaWrapper) {
      return;
    }

    editArea.style.width = '100%';
    editArea.style.height = '30%';

    if (!this.formatOptionsPanel) {
      this.formatOptionsPanel = this.services.createFormatOptionsPanel?.({
        root: optionsParent,
        documentObj: this.documentObj,
        props: {
          selectedFormat,
          currentOptions,
        },
        callbacks: {
          onApplyOptions: this.services.onApplyOptions,
        },
      });
    }

    this.formatOptionsPanel?.update?.({
      selectedFormat,
      currentOptions,
    });

    if (!this.formatOptionsPanel?.isSupported?.()) {
      editArea.style.display = 'block';
      optionsParent.style.display = 'none';
      if (splitter) {
        splitter.style.display = 'none';
      }
      textAreaWrapper.style.width = '100%';
      textAreaWrapper.style.height = '100%';
      return;
    }

    editArea.style.display = 'flex';
    textAreaWrapper.style.width = '100%';
    textAreaWrapper.style.height = '100%';

    const initialWidth = this.clampOptionsPanelWidth(this.getInitialOptionsPanelWidthPx(), editArea);
    this.setOptionsPanelWidth(optionsParent, initialWidth);
    optionsParent.style.height = '100%';
    optionsParent.style.display = 'block';
    this.configureOptionsPreviewSplitter(editArea, optionsParent, splitter, textAreaWrapper);
  }

  configureOptionsPreviewSplitter(editArea, optionsParent, splitter, textAreaWrapper) {
    if (!splitter || !editArea || !optionsParent || !textAreaWrapper) {
      return;
    }

    splitter.style.display = 'block';
    textAreaWrapper.style.flex = '1 1 auto';
    this.updateSplitterAriaValues(splitter, optionsParent, editArea);

    if (splitter.dataset.splitterInitialised === 'true') {
      return;
    }

    splitter.dataset.splitterInitialised = 'true';
    splitter.addEventListener('pointerdown', (event) => this.beginSplitterDrag(event, editArea, optionsParent));
    splitter.addEventListener('keydown', (event) =>
      this.handleSplitterKeyDown(event, optionsParent, editArea, splitter)
    );
  }

  beginSplitterDrag(event, editArea, optionsParent) {
    if (!event || event.button > 0 || this.activeSplitDrag) {
      return;
    }

    this.activeSplitDrag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startWidth: this.readOptionsPanelWidthPx(optionsParent),
      editArea,
      optionsParent,
    };

    event.preventDefault();
    this.documentObj?.body?.classList?.add('is-resizing-split');
    this.documentObj?.addEventListener?.('pointermove', this.handleSplitterMove);
    this.documentObj?.addEventListener?.('pointerup', this.handleSplitterEnd);
    this.documentObj?.addEventListener?.('pointercancel', this.handleSplitterEnd);
  }

  handleSplitterDragMove(event) {
    const dragState = this.activeSplitDrag;
    if (!dragState || event.pointerId !== dragState.pointerId) {
      return;
    }

    event.preventDefault();
    const requestedWidth = dragState.startWidth + (event.clientX - dragState.startX);
    const boundedWidth = this.clampOptionsPanelWidth(requestedWidth, dragState.editArea);
    this.setOptionsPanelWidth(dragState.optionsParent, boundedWidth);
    const splitter = this.textPreviewEditor?.getOptionsPreviewSplitter?.();
    if (splitter) {
      this.updateSplitterAriaValues(splitter, dragState.optionsParent, dragState.editArea);
    }
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

  setOptionsPanelWidth(optionsParent, widthPx) {
    const safeWidth = Math.round(widthPx);
    optionsParent.style.width = `${safeWidth}px`;
    optionsParent.style.minWidth = `${safeWidth}px`;
    optionsParent.style.maxWidth = `${safeWidth}px`;
    optionsParent.style.flex = '0 0 auto';
    this.currentOptionsPanelWidthPx = safeWidth;
  }

  handleSplitterKeyDown(event, optionsParent, editArea, splitter) {
    if (!event) {
      return;
    }

    const step = event.shiftKey ? 24 : 12;
    let requestedWidth = this.readOptionsPanelWidthPx(optionsParent);
    let handled = true;

    if (event.key === 'ArrowLeft') {
      requestedWidth -= step;
    } else if (event.key === 'ArrowRight') {
      requestedWidth += step;
    } else if (event.key === 'Home') {
      requestedWidth = this.minOptionsPanelWidthPx;
    } else if (event.key === 'End') {
      requestedWidth = this.maxOptionsPanelWidthPx;
    } else {
      handled = false;
    }

    if (!handled) {
      return;
    }

    event.preventDefault();
    const boundedWidth = this.clampOptionsPanelWidth(requestedWidth, editArea);
    this.setOptionsPanelWidth(optionsParent, boundedWidth);
    this.updateSplitterAriaValues(splitter, optionsParent, editArea);
  }

  readOptionsPanelWidthPx(optionsParent) {
    const parsed = Number.parseFloat(optionsParent?.style?.width || '');
    return Number.isFinite(parsed) ? parsed : this.getInitialOptionsPanelWidthPx();
  }

  getInitialOptionsPanelWidthPx() {
    return Number.isFinite(this.currentOptionsPanelWidthPx)
      ? this.currentOptionsPanelWidthPx
      : this.defaultOptionsPanelWidthPx;
  }

  clampOptionsPanelWidth(widthPx, editArea) {
    const editWidth = editArea?.getBoundingClientRect?.().width || 0;
    const maxByContainer =
      editWidth > 0
        ? Math.max(this.minOptionsPanelWidthPx, editWidth - this.minPreviewPanelWidthPx)
        : this.maxOptionsPanelWidthPx;
    const maxAllowed = Math.min(this.maxOptionsPanelWidthPx, maxByContainer);
    return Math.min(Math.max(widthPx, this.minOptionsPanelWidthPx), maxAllowed);
  }

  updateSplitterAriaValues(splitter, optionsParent, editArea) {
    if (!splitter) {
      return;
    }
    const min = this.minOptionsPanelWidthPx;
    const max = this.clampOptionsPanelWidth(this.maxOptionsPanelWidthPx, editArea);
    const now = this.clampOptionsPanelWidth(this.readOptionsPanelWidthPx(optionsParent), editArea);
    splitter.setAttribute('aria-valuemin', `${min}`);
    splitter.setAttribute('aria-valuemax', `${max}`);
    splitter.setAttribute('aria-valuenow', `${now}`);
  }
}

export { ImportExportWorkspaceView };
