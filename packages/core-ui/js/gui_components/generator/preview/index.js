import { createRowCountControl } from '../../shared/row-count-control/index.js';
import { createUpdateHelpHints } from '../../../help/help-tooltips.js';
import { createTabulatorGridAdapter } from './tabulator-grid-adapter.js';
import { GeneratorPreviewController } from './generator-preview-controller.js';
import { GeneratorPreviewView } from './generator-preview-view.js';
import { resolveDocumentObj } from '../../shared/dom/default-objects.js';

function createDefaultPreviewGridFactory({ TabulatorCtor, GridExtensionClass } = {}) {
  return function createPreviewGrid({ rootElement }) {
    if (typeof TabulatorCtor !== 'function') {
      return { tableApi: null, gridApi: null };
    }

    const adapter = createTabulatorGridAdapter({
      rootElement,
      TabulatorCtor,
      GridExtensionClass,
      tabulatorOptions: {
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
      },
    });
    return {
      adapter,
      tableApi: adapter.getTableApi(),
      gridApi: adapter.getGridApi(),
    };
  };
}

function createGeneratorPreviewComponent({ root, props = {}, services = {}, callbacks = {}, documentObj } = {}) {
  const resolvedDocumentObj = resolveDocumentObj(documentObj, root);
  const controller = new GeneratorPreviewController({ props, callbacks });
  const view = new GeneratorPreviewView({
    root,
    controller,
    documentObj: resolvedDocumentObj,
    ids: props.ids || {},
    services: {
      createRowCountControl: services.createRowCountControl || createRowCountControl,
      createPreviewGrid:
        services.createPreviewGrid ||
        createDefaultPreviewGridFactory({
          TabulatorCtor: services.TabulatorCtor,
          GridExtensionClass: services.GridExtensionClass,
        }),
      updateHelpHints: services.updateHelpHints || createUpdateHelpHints(resolvedDocumentObj, root),
    },
  });

  view.mount();

  return {
    update(nextProps) {
      controller.updateProps(nextProps);
      view.render();
    },
    destroy() {
      view.destroy();
    },
    setOutputPreviewText(outputPreviewText) {
      view.setOutputPreviewText(outputPreviewText);
    },
    clearOutputPreview() {
      view.clearOutputPreview();
    },
    setPreviewDataTable(dataTable) {
      view.setPreviewDataTable(dataTable);
    },
    getPreviewGrid() {
      return view.getPreviewGrid();
    },
    getPreviewTableApi() {
      return view.getPreviewTableApi();
    },
    whenReady() {
      return view.whenPreviewGridReady();
    },
    getState() {
      return controller.getState();
    },
  };
}

export {
  createDefaultPreviewGridFactory,
  createGeneratorPreviewComponent,
  GeneratorPreviewController,
  GeneratorPreviewView,
  createTabulatorGridAdapter,
};
