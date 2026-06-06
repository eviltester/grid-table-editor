import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorMountedPageStartupSync } from '../../../js/gui_components/generator/runtime/create-generator-mounted-page-startup-sync.js';

describe('createGeneratorMountedPageStartupSync', () => {
  test('builds the mounted-page startup sync closure around runtime-owned sync behavior', () => {
    const renderSchemaRows = jest.fn();
    const syncGeneratorControlsFormatState = jest.fn();
    const runtime = {
      renderSchemaRows,
      generatorViewState: {
        syncGeneratorControlsFormatState,
      },
    };

    const runMountedPageStartupSync = createGeneratorMountedPageStartupSync({
      runtime,
    });

    runMountedPageStartupSync();

    expect(renderSchemaRows).toHaveBeenCalledTimes(1);
    expect(syncGeneratorControlsFormatState).toHaveBeenCalledWith('csv');
  });
});
