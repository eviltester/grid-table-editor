import { createDataGridComponent } from '../index.js';
import { GridExtension as TabulatorGridExtension } from './gridExtension-tabulator.js';

/*
 * Intentional compatibility facade for the app runtime's grid-engine selector.
 *
 * New code should prefer `createDataGridComponent(...)` directly. This class keeps
 * the older `ExtendedDataGrid#createChildGrid(...)` contract alive while the app
 * bootstrap still supports interchangeable grid engines.
 */
class ExtendedDataGrid {
  constructor({
    documentObj = document,
    TabulatorCtor = globalThis.Tabulator,
    GridExtensionClass = TabulatorGridExtension,
    createDataGridComponentFn = createDataGridComponent,
  } = {}) {
    this.documentObj = documentObj;
    this.TabulatorCtor = TabulatorCtor;
    this.GridExtensionClass = GridExtensionClass;
    this.createDataGridComponentFn = createDataGridComponentFn;
    this.component = null;
    this.gridOptions = {
      autoColumns: false,
      columnDefaults: {},
    };
  }

  createChildGrid(parentGridDiv) {
    this.component?.destroy?.();
    this.component = this.createDataGridComponentFn({
      root: parentGridDiv,
      documentObj: this.documentObj,
      services: {
        TabulatorCtor: this.TabulatorCtor,
        GridExtensionClass: this.GridExtensionClass,
      },
    });
    return this.component;
  }

  sizeColumnsToFit() {}

  getGridExtras() {
    return this.component?.getGridExtras?.();
  }

  getTableApi() {
    return this.component?.getTableApi?.();
  }

  whenReady() {
    return this.component?.whenReady?.() || Promise.resolve(null);
  }

  destroy() {
    this.component?.destroy?.();
    this.component = null;
  }
}

export { ExtendedDataGrid };
