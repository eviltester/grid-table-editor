import { StoredSchemasManagerController } from '../../../js/gui_components/shared/stored-schemas-manager/stored-schemas-manager-controller.js';

describe('StoredSchemasManagerController', () => {
  test('builds disabled/enabled states from storage summary', () => {
    const controller = new StoredSchemasManagerController({
      props: {
        currentSchemaText: 'Name\nliteral(Ada)',
        summary: {
          draft: { schemaText: 'Name\nliteral(Ada)' },
          lastUsed: [{ id: 'recent-1', name: 'last used - now', schemaText: 'Name\nliteral(Ada)' }],
          saved: [{ id: 'saved-1', name: 'Important', schemaText: 'Name\nliteral(Ada)' }],
          counts: { lastUsed: 1, saved: 1 },
          hasDraft: true,
          errorMessage: '',
        },
      },
    });

    const viewModel = controller.getViewModel();

    expect(viewModel.summaryLabel).toBe('Managed Stored Schemas (1)');
    expect(viewModel.saveAsDisabled).toBe(false);
    expect(viewModel.recoverDraftDisabled).toBe(false);
    expect(viewModel.loadLastUsedDisabled).toBe(false);
    expect(viewModel.clearLastUsedDisabled).toBe(false);
    expect(viewModel.loadSavedDisabled).toBe(false);
  });

  test('tracks selected last used entry and preview text', () => {
    const controller = new StoredSchemasManagerController({
      props: {
        summary: {
          draft: null,
          lastUsed: [
            { id: 'first', name: 'first', schemaText: 'Name\nliteral(Ada)' },
            { id: 'second', name: 'second', schemaText: 'Name\nliteral(Bob)' },
          ],
          saved: [],
          counts: { lastUsed: 2, saved: 0 },
          hasDraft: false,
          errorMessage: '',
        },
      },
    });

    controller.updateProps({
      summary: controller.getState().summary,
    });
    controller.setSelectedLastUsedId('second');

    expect(controller.getSelectedLastUsedEntry().name).toBe('second');
    expect(controller.getViewModel().selectedLastUsedPreview).toContain('literal(Bob)');
  });
});
