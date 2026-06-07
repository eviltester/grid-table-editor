import { jest } from '@jest/globals';
import { ImportExportWorkspaceController } from '../../../js/gui_components/app/import-export-workspace/import-export-workspace-controller.js';
import { createImportExportWorkspaceWorkflowService } from '../../../js/gui_components/app/import-export-workspace/create-import-export-workspace-workflow-service.js';

function createHarness({ props = {}, importer = {}, exporter = {}, viewOverrides = {}, services = {} } = {}) {
  const controller = new ImportExportWorkspaceController({ props });
  const view = {
    textValue: '',
    options: null,
    setTextValue: jest.fn((value) => {
      view.textValue = value;
    }),
    getTextValue: jest.fn(() => view.textValue),
    renderOptionsPanel: jest.fn(),
    getOptionsFromGui: jest.fn(() => view.options),
    getTextArea: jest.fn(() => ({ tagName: 'TEXTAREA' })),
    setCopyButtonText: jest.fn(),
    ...viewOverrides,
  };
  const render = jest.fn();
  const workflow = createImportExportWorkspaceWorkflowService({
    controller,
    getView: () => view,
    getImporter: () => importer,
    getExporter: () => exporter,
    fileReadService: services.fileReadService || { readText: jest.fn(async () => '') },
    requestConfirm: services.requestConfirm || jest.fn(async () => true),
    clipboardService: services.clipboardService || { copyFromTextArea: jest.fn() },
    downloadService: services.downloadService || { downloadText: jest.fn() },
    yieldToUi: services.yieldToUi || (async () => {}),
    scheduleTimeoutFn: services.scheduleTimeoutFn || jest.fn(),
    render,
  });

  return {
    controller,
    exporter,
    importer,
    render,
    view,
    workflow,
  };
}

describe('createImportExportWorkspaceWorkflowService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('requires a controller', () => {
    expect(() => createImportExportWorkspaceWorkflowService()).toThrow(
      'createImportExportWorkspaceWorkflowService requires a controller'
    );
  });

  test('syncs support state and renders preview text through the workflow service', () => {
    const importer = {
      canImport: jest.fn(() => true),
      getFileExtensionFor: jest.fn(() => '.json'),
    };
    const exporter = {
      canExport: jest.fn(() => true),
      getFileExtensionFor: jest.fn(() => '.json'),
      getGridAsGenericDataTable: jest.fn(() => ({ getRowCount: () => 2, getHeaders: () => [], getRow: () => [] })),
      getDataTableAs: jest.fn(() => '{"rows":2}'),
      getOptionsForType: jest.fn(() => ({ indent: 2 })),
    };
    const { controller, render, view, workflow } = createHarness({
      props: { selectedFormat: 'csv', previewRowLimit: 2 },
      importer,
      exporter,
    });

    workflow.handleFormatChange('json');

    expect(controller.getState().selectedFormat).toBe('json');
    expect(controller.getState().supportsImport).toBe(true);
    expect(controller.getState().supportsExport).toBe(true);
    expect(controller.getState().fileExtension).toBe('.json');
    expect(view.renderOptionsPanel).toHaveBeenCalledWith({
      selectedFormat: 'json',
      currentOptions: { indent: 2 },
    });
    expect(view.setTextValue).toHaveBeenCalledWith('{"rows":2}');
    expect(render).toHaveBeenCalled();
  });

  test('loads files through the injected file service and populates preview mode text', async () => {
    const importer = {
      canImport: jest.fn(() => true),
      toGenericDataTable: jest.fn(() => ({
        getHeaders: () => ['Name'],
        getRowCount: () => 3,
        getRow: (index) => [`Name ${index + 1}`],
      })),
      setGridFromGenericDataTable: jest.fn(() => Promise.resolve()),
    };
    const exporter = {
      getDataTableAs: jest.fn(() => 'preview rows'),
    };
    const fileReadService = {
      readText: jest.fn(async (_file, callbacks = {}) => {
        callbacks.onProgress?.({ loaded: 3, total: 6, lengthComputable: true });
        return 'Name\nAda';
      }),
    };
    const scheduleTimeoutFn = jest.fn();
    const { controller, render, view, workflow } = createHarness({
      props: { mode: 'preview', previewRowLimit: 2 },
      importer,
      exporter,
      services: {
        fileReadService,
        scheduleTimeoutFn,
      },
    });

    await workflow.loadFile({ name: 'sample.csv' });

    expect(fileReadService.readText).toHaveBeenCalledTimes(1);
    expect(importer.setGridFromGenericDataTable).toHaveBeenCalledTimes(1);
    expect(view.setTextValue).toHaveBeenCalledWith('preview rows');
    expect(controller.getState().importBusy).toBe(false);
    expect(controller.getState().importStatusMessage).toBe('Import complete.');
    expect(scheduleTimeoutFn).toHaveBeenCalled();
    expect(render).toHaveBeenCalled();
  });

  test('toggles into edit mode and clears text when confirm rejects grid text', async () => {
    const requestConfirm = jest.fn(async () => false);
    const exporter = {
      canExport: jest.fn(() => true),
      getGridAs: jest.fn(() => 'full:csv'),
    };
    const { controller, view, workflow } = createHarness({
      props: { mode: 'preview' },
      exporter,
      services: {
        requestConfirm,
      },
    });

    const mode = await workflow.toggleTextEditMode();

    expect(mode).toBe('edit');
    expect(controller.getState().mode).toBe('edit');
    expect(requestConfirm).toHaveBeenCalledWith({
      title: 'Set Text From Grid',
      message: 'Do you want to Set Text From Grid?',
    });
    expect(view.setTextValue).toHaveBeenCalledWith('');
  });
});
