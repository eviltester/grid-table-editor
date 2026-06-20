import { resolveDocumentObj } from '../../shared/dom/default-objects.js';
import { renderGeneratorOutputPreview } from '../generation/data-generator-generation-actions.js';

class GeneratorPreviewView {
  constructor({ root, controller, documentObj, services = {}, ids = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = resolveDocumentObj(documentObj, root);
    this.services = services;
    this.ids = {
      previewButton: '',
      outputPreview: '',
      previewGrid: '',
      rowCountInput: '',
      ...ids,
    };
    this.rowCountControls = [];
    this.previewRowsCountControl = null;
    this.previewGrid = null;
    this.previewTableApi = null;
    this.previewGridAdapter = null;
    this.handlePreviewClick = () => this.controller.triggerPreview();
  }

  buildOptionalIdAttr(id) {
    return id ? ` id="${id}"` : '';
  }

  mount() {
    if (!this.root) {
      return;
    }

    this.root.innerHTML = this.template();
    this.createControls();
    this.bindEvents();
    this.render();
  }

  template() {
    const ids = this.ids;
    return `
      <section class="shared-generator-preview generator-preview" data-section-order="4" aria-label="Preview">
        <div class="shared-generator-preview-head generator-preview-head">
          <strong>Preview</strong>
        </div>
        <div class="shared-generator-preview-controls generator-preview-controls" data-subsection-order="1" aria-label="Preview Controls">
          <div data-role="preview-rows-count-control"></div>
          <span class="shared-button-with-help">
            <button
              type="button"
              class="helpicon"
              data-help-role="help-icon"
              data-help="shared-generator-preview-help"
              aria-label="Show preview help"
            ></button>
            <button${this.buildOptionalIdAttr(ids.previewButton)} data-role="generator-preview-button">Preview</button>
          </span>
        </div>
        <div class="shared-generator-output-preview generator-output-preview" data-subsection-order="2" aria-label="Output Preview">
          <label${ids.outputPreview ? ` for="${ids.outputPreview}"` : ''}>Output Preview</label>
          <textarea${this.buildOptionalIdAttr(ids.outputPreview)} data-role="generator-output-preview" aria-label="Output Preview" readonly spellcheck="false"></textarea>
        </div>
        <div class="shared-generator-data-table-preview generator-data-table-preview" data-subsection-order="3" aria-label="Data Table Preview Section">
          <strong>Data Table Preview</strong>
          <div${this.buildOptionalIdAttr(ids.previewGrid)} data-role="generator-preview-grid" class="ag-theme-alpine" aria-label="Data Table Preview Grid"></div>
        </div>
      </section>
    `;
  }

  createControls() {
    const createRowCountControl = this.services.createRowCountControl;
    const previewRowsRoot = this.root.querySelector('[data-role="preview-rows-count-control"]');
    if (previewRowsRoot && typeof createRowCountControl === 'function') {
      this.previewRowsCountControl = createRowCountControl({
        root: previewRowsRoot,
        documentObj: this.documentObj,
        props: {
          inputId: this.ids.rowCountInput,
          label: 'Preview Items Count',
          min: 0,
          max: 50,
          step: 1,
          value: 10,
          labelClassName: 'shared-row-count-label',
        },
      });
      this.rowCountControls.push(this.previewRowsCountControl);
    }

    const previewGridRoot = this.getPreviewGridRoot();
    const previewGridService = this.services.createPreviewGrid;
    if (previewGridRoot && typeof previewGridService === 'function') {
      const result = previewGridService({
        rootElement: previewGridRoot,
        documentObj: this.documentObj,
      });
      this.previewGridAdapter = result?.adapter || null;
      this.previewTableApi = result?.tableApi || null;
      this.previewGrid = result?.gridApi || null;
    }
  }

  bindEvents() {
    this.getPreviewButton()?.addEventListener('click', this.handlePreviewClick);
  }

  render() {
    const state = this.controller.getState();
    const outputPreview = this.getOutputPreviewElement();
    if (outputPreview && outputPreview.value !== state.outputPreviewText) {
      outputPreview.value = state.outputPreviewText;
    }
    this.services.updateHelpHints?.();
  }

  destroy() {
    this.getPreviewButton()?.removeEventListener('click', this.handlePreviewClick);
    this.rowCountControls.forEach((control) => control?.destroy?.());
    this.rowCountControls = [];
    this.previewGridAdapter?.destroy?.();
    this.previewGridAdapter = null;
    this.root.replaceChildren();
  }

  setOutputPreviewText(outputPreviewText) {
    this.controller.setOutputPreviewText(outputPreviewText);
    this.render();
  }

  clearOutputPreview() {
    this.setOutputPreviewText('');
  }

  setPreviewDataTable(dataTable) {
    this.controller.setPreviewDataTable(dataTable);
    if (!dataTable) {
      this.previewGrid?.clearGrid?.();
      this.previewGridAdapter?.getGridApi?.()?.clearGrid?.();
      return;
    }
    if (this.previewGrid?.setGridFromGenericDataTable) {
      this.previewGrid.setGridFromGenericDataTable(dataTable);
      return;
    }
    this.previewGridAdapter?.setGridFromGenericDataTable?.(dataTable);
  }

  getPreviewGrid() {
    return this.previewGrid;
  }

  getPreviewButton() {
    return this.root.querySelector('[data-role="generator-preview-button"]');
  }

  getOutputPreviewElement() {
    return this.root.querySelector('[data-role="generator-output-preview"]');
  }

  getPreviewGridRoot() {
    return this.root.querySelector('[data-role="generator-preview-grid"]');
  }

  getPreviewTableApi() {
    return this.previewTableApi;
  }

  getPreviewGridAdapter() {
    return this.previewGridAdapter;
  }

  getPreviewDataTable() {
    return this.controller.getState().previewDataTable || null;
  }

  renderOutputPreview(outputType, exporter) {
    renderGeneratorOutputPreview({
      getSelectedOutputType: () => outputType,
      getPreviewDataTable: () => this.getPreviewDataTable(),
      exporter,
      setOutputPreviewText: (text) => this.setOutputPreviewText(text),
    });
  }

  getPreviewRowCount() {
    return this.previewRowsCountControl?.getParsedValue?.();
  }

  whenPreviewGridReady() {
    return this.previewGridAdapter?.whenReady?.() || Promise.resolve(null);
  }
}

export { GeneratorPreviewView };
