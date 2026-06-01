class TabulatorGridAdapter {
  constructor({
    rootElement,
    TabulatorCtor,
    GridExtensionClass,
    tabulatorOptions = {},
    documentObj = document,
    windowObj = documentObj?.defaultView || globalThis.window,
  } = {}) {
    this.rootElement = rootElement;
    this.TabulatorCtor = TabulatorCtor;
    this.GridExtensionClass = GridExtensionClass;
    this.tabulatorOptions = tabulatorOptions;
    this.documentObj = documentObj;
    this.windowObj = windowObj;
    this.tableApi = null;
    this.gridApi = null;
    this.isDestroyed = false;
    this.mountFrame = null;
    this.readyPromise = null;
    this.resolveReady = null;
  }

  mount() {
    if (this.readyPromise) {
      return this.readyPromise;
    }

    this.readyPromise = new Promise((resolve) => {
      this.resolveReady = resolve;
      this._attemptMount();
    });
    return this.readyPromise;
  }

  _attemptMount() {
    if (this.isDestroyed) {
      this.resolveReady?.(null);
      return;
    }

    if (!this.rootElement || typeof this.TabulatorCtor !== 'function') {
      this.resolveReady?.(null);
      return;
    }

    if (!this.rootElement.isConnected) {
      this._queueNextMountAttempt();
      return;
    }

    this.tableApi = new this.TabulatorCtor(this.rootElement, this.tabulatorOptions);
    this.gridApi = this.GridExtensionClass ? new this.GridExtensionClass(this.tableApi) : null;

    if (typeof this.tableApi?.on === 'function') {
      const handleTableBuilt = () => {
        if (typeof this.tableApi?.off === 'function') {
          this.tableApi.off('tableBuilt', handleTableBuilt);
        }
        this.resolveReady?.(this);
        this.resolveReady = null;
      };
      this.tableApi.on('tableBuilt', handleTableBuilt);
      return;
    }

    this.resolveReady?.(this);
    this.resolveReady = null;
  }

  _queueNextMountAttempt() {
    if (this.mountFrame !== null) {
      return;
    }

    const requestAnimationFrameFn =
      this.windowObj?.requestAnimationFrame?.bind(this.windowObj) || ((callback) => globalThis.setTimeout(callback, 0));
    this.mountFrame = requestAnimationFrameFn(() => {
      this.mountFrame = null;
      this._attemptMount();
    });
  }

  whenReady() {
    return this.mount();
  }

  getTableApi() {
    return this.tableApi;
  }

  getGridApi() {
    return this.gridApi;
  }

  async setGridFromGenericDataTable(dataTable) {
    await this.whenReady();
    return this.gridApi?.setGridFromGenericDataTable?.(dataTable);
  }

  destroy() {
    this.isDestroyed = true;
    const cancelAnimationFrameFn =
      this.windowObj?.cancelAnimationFrame?.bind(this.windowObj) || ((handle) => globalThis.clearTimeout(handle));
    if (this.mountFrame !== null) {
      cancelAnimationFrameFn(this.mountFrame);
      this.mountFrame = null;
    }
    this.gridApi?.destroy?.();
    this.gridApi = null;
    if (typeof this.tableApi?.destroy === 'function') {
      this.tableApi.destroy();
    }
    this.tableApi = null;
    if (this.resolveReady) {
      this.resolveReady(null);
      this.resolveReady = null;
    }
  }
}

function createTabulatorGridAdapter({
  rootElement,
  TabulatorCtor,
  GridExtensionClass,
  tabulatorOptions,
  documentObj,
  windowObj,
} = {}) {
  const adapter = new TabulatorGridAdapter({
    rootElement,
    TabulatorCtor,
    GridExtensionClass,
    tabulatorOptions,
    documentObj,
    windowObj,
  });
  adapter.mount();
  return adapter;
}

export { createTabulatorGridAdapter, TabulatorGridAdapter };
