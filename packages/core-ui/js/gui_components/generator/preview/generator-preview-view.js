import { resolveDocumentObj } from '../../shared/dom/default-objects.js';

class GeneratorPreviewView {
  constructor({ root, controller, documentObj, services = {}, ids = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = resolveDocumentObj(documentObj, root);
    this.services = services;
    this.ids = {
      previewButton: 'previewDataButton',
      outputPreview: 'generatorOutputPreview',
      previewGrid: 'generator-preview-grid',
      rowCountInput: 'previewRowsCount',
      ...ids,
    };
    this.rowCountControls = [];
    this.previewGrid = null;
    this.previewTableApi = null;
    this.previewGridAdapter = null;
    this.handlePreviewClick = () => this.controller.triggerPreview();
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
      <section class="generator-preview" data-section-order="4" aria-label="Preview">
        <div class="generator-preview-head">
          <strong>Preview</strong>
        </div>
        <div class="generator-preview-controls" data-subsection-order="1" aria-label="Preview Controls">
          <div data-role="preview-rows-count-control"></div>
          <span class="generator-button-with-help">
            <button
              type="button"
              class="helpicon"
              data-help="generator-preview-help"
              aria-label="Show preview help"
              data-help-text='
                <p>Show a preview of the defined items count in the Output Preview area.</p>
              '
            ></button>
            <button id="${ids.previewButton}">Preview</button>
          </span>
        </div>
        <div class="generator-output-preview" data-subsection-order="2" aria-label="Output Preview">
          <label for="${ids.outputPreview}">Output Preview</label>
          <textarea id="${ids.outputPreview}" readonly spellcheck="false"></textarea>
        </div>
        <div class="generator-data-table-preview" data-subsection-order="3" aria-label="Data Table Preview Section">
          <strong>Data Table Preview</strong>
          <div id="${ids.previewGrid}" class="ag-theme-alpine" aria-label="Data Table Preview Grid"></div>
        </div>
      </section>
    `;
  }

  createControls() {
    const createRowCountControl = this.services.createRowCountControl;
    const previewRowsRoot = this.root.querySelector('[data-role="preview-rows-count-control"]');
    if (previewRowsRoot && typeof createRowCountControl === 'function') {
      this.rowCountControls.push(
        createRowCountControl({
          root: previewRowsRoot,
          documentObj: this.documentObj,
          props: {
            inputId: this.ids.rowCountInput,
            label: 'Preview Items Count',
            min: 0,
            max: 50,
            step: 1,
            value: 10,
            labelClassName: 'generator-preview-count-label',
          },
        })
      );
    }

    const previewGridRoot = this.root.querySelector(`#${this.ids.previewGrid}`);
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
    this.root.querySelector(`#${this.ids.previewButton}`)?.addEventListener('click', this.handlePreviewClick);
  }

  render() {
    const state = this.controller.getState();
    const outputPreview = this.root.querySelector(`#${this.ids.outputPreview}`);
    if (outputPreview && outputPreview.value !== state.outputPreviewText) {
      outputPreview.value = state.outputPreviewText;
    }
    this.services.updateHelpHints?.();
  }

  destroy() {
    this.root.querySelector(`#${this.ids.previewButton}`)?.removeEventListener('click', this.handlePreviewClick);
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
    if (this.previewGridAdapter?.setGridFromGenericDataTable) {
      this.previewGridAdapter.setGridFromGenericDataTable(dataTable);
      return;
    }
    this.previewGrid?.setGridFromGenericDataTable?.(dataTable);
  }

  getPreviewGrid() {
    return this.previewGrid;
  }

  getPreviewTableApi() {
    return this.previewTableApi;
  }

  getPreviewGridAdapter() {
    return this.previewGridAdapter;
  }

  whenPreviewGridReady() {
    return this.previewGridAdapter?.whenReady?.() || Promise.resolve(null);
  }
}

export { GeneratorPreviewView };
