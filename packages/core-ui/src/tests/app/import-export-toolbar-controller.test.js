import { ImportExportToolbarController } from '../../../js/gui_components/app/import-export-toolbar/import-export-toolbar-controller.js';

describe('ImportExportToolbarController', () => {
  test('preserves includeBom when export encoding updates omit it', () => {
    const controller = new ImportExportToolbarController({
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
