class TabulatorGridAdapter {
  constructor({ rootElement, TabulatorCtor, GridExtensionClass } = {}) {
    this.rootElement = rootElement;
    this.TabulatorCtor = TabulatorCtor;
    this.GridExtensionClass = GridExtensionClass;
    this.tableApi = null;
    this.gridApi = null;
  }

  mount() {
    if (!this.rootElement || typeof this.TabulatorCtor !== 'function') {
      return;
    }

    this.tableApi = new this.TabulatorCtor(this.rootElement, {
      data: [],
      columns: [{ title: '~preview', field: 'column1', sorter: 'string' }],
      autoColumns: false,
      headerSort: true,
      selectableRows: true,
      selectableRowsRangeMode: 'click',
      layout: 'fitDataStretch',
      columnDefaults: {
        resizable: true,
        headerFilter: 'input',
        headerFilterFunc: 'like',
        sorter: 'string',
      },
    });

    this.gridApi = this.GridExtensionClass ? new this.GridExtensionClass(this.tableApi) : null;
  }

  getTableApi() {
    return this.tableApi;
  }

  getGridApi() {
    return this.gridApi;
  }

  setGridFromGenericDataTable(dataTable) {
    this.gridApi?.setGridFromGenericDataTable?.(dataTable);
  }

  destroy() {
    this.gridApi?.destroy?.();
    this.gridApi = null;
    if (typeof this.tableApi?.destroy === 'function') {
      this.tableApi.destroy();
    }
    this.tableApi = null;
  }
}

function createTabulatorGridAdapter({ rootElement, TabulatorCtor, GridExtensionClass } = {}) {
  const adapter = new TabulatorGridAdapter({
    rootElement,
    TabulatorCtor,
    GridExtensionClass,
  });
  adapter.mount();
  return adapter;
}

export { createTabulatorGridAdapter, TabulatorGridAdapter };
