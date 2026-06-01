import { DataGridComponentController } from './data-grid-component-controller.js';
import { DataGridComponentView } from './data-grid-component-view.js';

function createDataGridComponent({ root, props = {}, services = {}, documentObj = document } = {}) {
  let gridExtras = null;
  const controller = new DataGridComponentController({
    props,
    documentObj,
    services: {
      ...services,
      getGridExtras: () => gridExtras,
    },
  });
  const view = new DataGridComponentView({
    root,
    controller,
    documentObj,
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
    sizeColumnsToFit() {},
    getState() {
      return controller.getState();
    },
  };
}

export { createDataGridComponent, DataGridComponentController, DataGridComponentView };
