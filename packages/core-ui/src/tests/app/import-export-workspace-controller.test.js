import { ImportExportWorkspaceController } from '../../../js/gui_components/app/import-export-workspace/import-export-workspace-controller.js';

describe('ImportExportWorkspaceController', () => {
  test('normalizes preview row limits on construction and updates', () => {
    const controller = new ImportExportWorkspaceController({
      props: {
        previewRowLimit: 0,
      },
    });

    expect(controller.getState().previewRowLimit).toBe(1);

    controller.updateProps({ previewRowLimit: 999 });
    expect(controller.getState().previewRowLimit).toBe(50);

    controller.updateProps({ previewRowLimit: 'not-a-number' });
    expect(controller.getState().previewRowLimit).toBe(50);
  });

  test('tracks mode, dirty state, busy state, and status transitions', () => {
    const controller = new ImportExportWorkspaceController();

    expect(controller.canSetGridFromText()).toBe(false);

    controller.markPreviewTextDirty(true);
    expect(controller.canSetGridFromText()).toBe(true);

    controller.setBusyState({ importBusy: true });
    expect(controller.canSetGridFromText()).toBe(false);

    controller.setBusyState({ importBusy: false });
    controller.updateProps({ mode: 'edit', previewTextDirty: false });
    expect(controller.canSetGridFromText()).toBe(true);

    controller.setImportStatus('Importing...', true);
    controller.setExportStatus('Downloading...', true);
    controller.setSupportState({
      supportsImport: false,
      supportsExport: false,
      fileExtension: '.json',
    });

    expect(controller.getState()).toEqual(
      expect.objectContaining({
        importStatusMessage: 'Importing...',
        importStatusLoading: true,
        exportStatusMessage: 'Downloading...',
        exportStatusLoading: true,
        supportsImport: false,
        supportsExport: false,
        fileExtension: '.json',
      })
    );
    expect(controller.canSetGridFromText()).toBe(false);
  });

  test('preserves includeBom when export encoding updates omit it', () => {
    const controller = new ImportExportWorkspaceController({
      props: {
        exportEncodingSettings: {
          lineEnding: 'lf',
          includeBom: true,
        },
      },
    });

    controller.updateProps({
      exportEncodingSettings: {
        lineEnding: 'crlf',
      },
    });

    expect(controller.getState().exportEncodingSettings).toEqual({
      lineEnding: 'crlf',
      includeBom: true,
    });
  });
});
