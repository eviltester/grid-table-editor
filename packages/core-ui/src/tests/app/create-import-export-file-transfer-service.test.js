import { describe, expect, jest, test } from '@jest/globals';
import { ImportExportWorkspaceController } from '../../../js/gui_components/app/import-export-workspace/import-export-workspace-controller.js';
import { createImportExportFileTransferService } from '../../../js/gui_components/app/import-export-workspace/create-import-export-file-transfer-service.js';

function createHarness({ props = {}, importer = {}, exporter = {}, services = {}, viewOverrides = {} } = {}) {
  const controller = new ImportExportWorkspaceController({ props });
  const view = {
    textValue: '',
    setTextValue: jest.fn((value) => {
      view.textValue = value;
    }),
    getTextValue: jest.fn(() => view.textValue),
    getTextArea: jest.fn(() => ({ tagName: 'TEXTAREA' })),
    setCopyButtonText: jest.fn(),
    ...viewOverrides,
  };
  const render = jest.fn();
  const setTextFromString = jest.fn((value) => {
    view.textValue = value;
  });
  const setImportStatus = jest.fn((message = '', isLoading = false) => {
    controller.setImportStatus(message, isLoading);
  });
  const setExportStatus = jest.fn((message = '', isLoading = false) => {
    controller.setExportStatus(message, isLoading);
  });
  const setCurrentTypeOptions = jest.fn();
  const workflow = createImportExportFileTransferService({
    controller,
    getState: () => controller.getState(),
    getType: () => controller.getState().selectedFormat,
    view: () => view,
    importer: () => importer,
    exporter: () => exporter,
    fileReadService: services.fileReadService || { readText: jest.fn(async () => '') },
    clipboardService: services.clipboardService || { copyFromTextArea: jest.fn(), readText: jest.fn(async () => '') },
    downloadService: services.downloadService || { downloadText: jest.fn() },
    yieldToUi: services.yieldToUi || (async () => {}),
    scheduleTimeoutFn: services.scheduleTimeoutFn || jest.fn(),
    render,
    setTextFromString,
    setImportStatus,
    setExportStatus,
    setCurrentTypeOptions,
    showError: services.showError || jest.fn(),
  });

  return {
    controller,
    render,
    setCurrentTypeOptions,
    setExportStatus,
    setImportStatus,
    setTextFromString,
    view,
    workflow,
  };
}

describe('createImportExportFileTransferService', () => {
  test('loads files through the injected reader and populates preview text', async () => {
    const importer = {
      canImport: jest.fn(() => true),
      setGridFromGenericDataTable: jest.fn(() => Promise.resolve()),
      toGenericDataTable: jest.fn(() => ({
        getHeaders: () => ['Name'],
        getRowCount: () => 3,
        getRow: (index) => [`Name ${index + 1}`],
      })),
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
    const harness = createHarness({
      props: { mode: 'preview', previewRowLimit: 2 },
      importer,
      exporter,
      services: {
        fileReadService,
        scheduleTimeoutFn: jest.fn(),
      },
    });

    await harness.workflow.loadFile({ name: 'sample.csv' });

    expect(harness.setCurrentTypeOptions).toHaveBeenCalledTimes(1);
    expect(fileReadService.readText).toHaveBeenCalledTimes(1);
    expect(importer.setGridFromGenericDataTable).toHaveBeenCalledTimes(1);
    expect(harness.setTextFromString).toHaveBeenCalledWith('preview rows', { previewTextDirty: false });
    expect(harness.controller.getState().importBusy).toBe(false);
    expect(harness.controller.getState().importStatusMessage).toBe('Import complete.');
  });

  test('downloads exported text through the injected download service', async () => {
    const downloadService = { downloadText: jest.fn() };
    const exporter = {
      canExport: jest.fn(() => true),
      getFileExtensionFor: jest.fn(() => '.json'),
      getGridAs: jest.fn(() => '{"rows":2}'),
    };
    const harness = createHarness({
      props: { selectedFormat: 'json' },
      exporter,
      services: {
        downloadService,
      },
    });

    await harness.workflow.fileDownload();

    expect(downloadService.downloadText).toHaveBeenCalledWith('export.json', '{"rows":2}');
    expect(harness.controller.getState().exportBusy).toBe(false);
    expect(harness.controller.getState().exportStatusMessage).toBe('Download started.');
  });

  test('imports clipboard text through the injected clipboard service', async () => {
    const clipboardService = {
      copyFromTextArea: jest.fn(),
      readText: jest.fn(async () => '\uFEFF"Name","Role"\r\n"Ada","Engineer"'),
    };
    const importer = {
      canImport: jest.fn(() => true),
      importText: jest.fn(() => Promise.resolve()),
    };
    const exporter = {
      getDataTableAs: jest.fn(() => 'preview rows'),
    };
    const harness = createHarness({
      props: { mode: 'preview', previewRowLimit: 2 },
      importer,
      exporter,
      services: {
        clipboardService,
        scheduleTimeoutFn: jest.fn(),
      },
    });

    await harness.workflow.importFromClipboard();

    expect(clipboardService.readText).toHaveBeenCalledTimes(1);
    expect(importer.importText).toHaveBeenCalledWith('csv', '"Name","Role"\n"Ada","Engineer"');
    expect(harness.setTextFromString).toHaveBeenCalledWith('"Name","Role"\n"Ada","Engineer"', {
      previewTextDirty: false,
    });
    expect(harness.controller.getState().importStatusMessage).toBe('Import complete.');
  });
});
