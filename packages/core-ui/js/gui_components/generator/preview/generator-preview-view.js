class GeneratorPreviewView {
  constructor({ root, controller, documentObj = document, services = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = documentObj;
    this.services = services;
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
    return `
      <section class="generator-preview" id="generatorPreviewSection" data-section-order="4" aria-labelledby="generatorPreviewHeading">
        <div class="generator-preview-head">
          <strong id="generatorPreviewHeading">Preview</strong>
        </div>
        <div class="generator-preview-controls" id="generatorPreviewControlsSection" data-subsection-order="1" aria-label="Preview Controls">
          <div id="previewRowsCountControl"></div>
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
            <button id="previewDataButton">Preview</button>
          </span>
        </div>
        <div class="generator-output-preview" id="generatorOutputPreviewSection" data-subsection-order="2" aria-label="Output Preview">
          <label for="generatorOutputPreview">Output Preview</label>
          <textarea id="generatorOutputPreview" readonly spellcheck="false"></textarea>
        </div>
        <div
          class="generator-data-table-preview"
          id="generatorDataTablePreviewSection"
          data-subsection-order="3"
          aria-labelledby="generatorDataTablePreviewHeading"
        >
          <strong id="generatorDataTablePreviewHeading">Data Table Preview</strong>
          <div id="generator-preview-grid" class="ag-theme-alpine" aria-label="Data Table Preview Grid"></div>
        </div>
      </section>
    `;
  }

  createControls() {
    const createRowCountControl = this.services.createRowCountControl;
    const previewRowsRoot = this.root.querySelector('#previewRowsCountControl');
    if (previewRowsRoot && typeof createRowCountControl === 'function') {
      this.rowCountControls.push(
        createRowCountControl({
          root: previewRowsRoot,
          documentObj: this.documentObj,
          props: {
            inputId: 'previewRowsCount',
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

    const previewGridRoot = this.root.querySelector('#generator-preview-grid');
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
    this.root.querySelector('#previewDataButton')?.addEventListener('click', this.handlePreviewClick);
  }

  render() {
    const state = this.controller.getState();
    const outputPreview = this.root.querySelector('#generatorOutputPreview');
    if (outputPreview && outputPreview.value !== state.outputPreviewText) {
      outputPreview.value = state.outputPreviewText;
    }
    this.services.updateHelpHints?.();
  }

  destroy() {
    this.root.querySelector('#previewDataButton')?.removeEventListener('click', this.handlePreviewClick);
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
}

export { GeneratorPreviewView };
