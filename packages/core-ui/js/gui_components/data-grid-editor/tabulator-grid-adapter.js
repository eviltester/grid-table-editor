import { resolveDocumentObj, resolveWindowObj } from '../shared/dom/default-objects.js';

class TabulatorGridAdapter {
  constructor({
    rootElement,
    TabulatorCtor,
    GridExtensionClass,
    tabulatorOptions = {},
    documentObj,
    windowObj,
    requestAnimationFrameFn,
    cancelAnimationFrameFn,
  } = {}) {
    this.rootElement = rootElement;
    this.TabulatorCtor = TabulatorCtor;
    this.GridExtensionClass = GridExtensionClass;
    this.tabulatorOptions = tabulatorOptions;
    this.documentObj = resolveDocumentObj(documentObj, rootElement);
    this.windowObj = resolveWindowObj(windowObj, this.documentObj);
    this.requestAnimationFrameFn =
      requestAnimationFrameFn || this.windowObj?.requestAnimationFrame?.bind(this.windowObj) || null;
    this.cancelAnimationFrameFn =
      cancelAnimationFrameFn || this.windowObj?.cancelAnimationFrame?.bind(this.windowObj) || null;
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

    if (typeof this.requestAnimationFrameFn !== 'function') {
      this._attemptMount();
      return;
    }

    const requestAnimationFrameFn = this.requestAnimationFrameFn;
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
    if (this.mountFrame !== null) {
      this.cancelAnimationFrameFn?.(this.mountFrame);
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
  requestAnimationFrameFn,
  cancelAnimationFrameFn,
} = {}) {
  const adapter = new TabulatorGridAdapter({
    rootElement,
    TabulatorCtor,
    GridExtensionClass,
    tabulatorOptions,
    documentObj,
    windowObj,
    requestAnimationFrameFn,
    cancelAnimationFrameFn,
  });
  adapter.mount();
  return adapter;
}

export { createTabulatorGridAdapter, TabulatorGridAdapter };
