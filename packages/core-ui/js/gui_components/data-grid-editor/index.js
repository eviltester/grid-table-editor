import { DataGridComponentController } from './data-grid-component-controller.js';
import { DataGridComponentView } from './data-grid-component-view.js';
import { resolveDocumentObj } from '../shared/dom/default-objects.js';

function createDataGridComponent({ root, props = {}, services = {}, documentObj } = {}) {
  let gridExtras = null;
  const resolvedDocumentObj = resolveDocumentObj(documentObj, root);
  const controller = new DataGridComponentController({
    props,
    documentObj: resolvedDocumentObj,
    services: {
      ...services,
      getGridExtras: () => gridExtras,
    },
  });
  const view = new DataGridComponentView({
    root,
    controller,
    documentObj: resolvedDocumentObj,
    services,
  });
  view.mount();
  view.whenGridReady().then(() => {
    gridExtras = view.getGridExtras();
  });

  return {
    update(nextProps) {
      controller.updateProps(nextProps);
      view.render();
    },
    destroy() {
      view.destroy();
      gridExtras = null;
    },
    getGridExtras() {
      return view.getGridExtras();
    },
    getTableApi() {
      return view.getTableApi();
    },
    whenReady() {
      return view.whenGridReady();
    },
    sizeColumnsToFit() {
      controller.sizeColumnsToFit();
    },
    getState() {
      return controller.getState();
    },
  };
}

export { createDataGridComponent };
