import { StoredSchemasDialogController } from '../../../js/gui_components/shared/stored-schemas-dialog/stored-schemas-dialog-controller.js';

describe('StoredSchemasDialogController', () => {
  test('rename state truncates values to 50 characters', () => {
    const controller = new StoredSchemasDialogController();
    const longName = 'x'.repeat(60);

    controller.startRename('saved-1', longName);
    controller.setRenameValue('y'.repeat(55));

    const state = controller.getState();
    expect(state.renameValue).toBe('y'.repeat(50));
  });
});
