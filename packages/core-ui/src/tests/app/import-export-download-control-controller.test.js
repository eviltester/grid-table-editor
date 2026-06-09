import { ImportExportDownloadControlController } from '../../../js/gui_components/app/import-export-download-control/import-export-download-control-controller.js';

describe('ImportExportDownloadControlController', () => {
  test('preserves includeBom when export encoding updates omit it', () => {
    const controller = new ImportExportDownloadControlController({
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
