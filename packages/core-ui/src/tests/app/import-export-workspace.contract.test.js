import * as importExportWorkspaceExports from '../../../js/gui_components/app/import-export-workspace/index.js';
import { createImportExportWorkspaceComponent } from '../../../js/gui_components/app/import-export-workspace/index.js';

describe('ImportExportWorkspace contract', () => {
  test('public barrel is component-factory-only', () => {
    expect(importExportWorkspaceExports.createImportExportWorkspaceComponent).toBe(
      createImportExportWorkspaceComponent
    );
    expect(importExportWorkspaceExports.ImportExportWorkspaceController).toBeUndefined();
    expect(importExportWorkspaceExports.ImportExportWorkspaceView).toBeUndefined();
  });
});
