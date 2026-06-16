import { createStoredSchemasStorage } from '../../../js/gui_components/shared/stored-schemas/stored-schemas-storage.js';

describe('stored-schemas storage', () => {
  function createStorage() {
    const values = new Map();
    return {
      getItem: (key) => (values.has(key) ? values.get(key) : null),
      setItem: (key, value) => values.set(key, value),
      removeItem: (key) => values.delete(key),
      clear: () => values.clear(),
    };
  }

  test('draft save skips empty schema text', () => {
    const storage = createStoredSchemasStorage({ storage: createStorage(), now: () => '2026-06-16T10:00:00.000Z' });

    const result = storage.saveDraft('');

    expect(result.ok).toBe(true);
    expect(result.skipped).toBe(true);
    expect(storage.getSummaryState().hasDraft).toBe(false);
  });

  test('recoverDraft returns saved draft', () => {
    const storage = createStoredSchemasStorage({ storage: createStorage(), now: () => '2026-06-16T10:00:00.000Z' });
    storage.saveDraft('Name\nliteral(Ada)');

    const result = storage.recoverDraft();

    expect(result.draft.schemaText).toBe('Name\nliteral(Ada)');
  });

  test('recordLastUsed dedupes by schema text and rotates to the front', () => {
    const storage = createStoredSchemasStorage({ storage: createStorage(), now: () => '2026-06-16T10:00:00.000Z' });

    storage.recordLastUsed('Name\nliteral(Ada)');
    storage.recordLastUsed('Name\nliteral(Bob)');
    storage.recordLastUsed('Name\nliteral(Ada)');

    expect(storage.getSummaryState().lastUsed).toHaveLength(2);
    expect(storage.getSummaryState().lastUsed[0].schemaText).toBe('Name\nliteral(Ada)');
  });

  test('recordLastUsed caps history at 10 items', () => {
    const storage = createStoredSchemasStorage({ storage: createStorage(), now: () => '2026-06-16T10:00:00.000Z' });

    Array.from({ length: 12 }, (_, index) => storage.recordLastUsed(`Name\nliteral(${index})`));

    expect(storage.getSummaryState().lastUsed).toHaveLength(10);
  });

  test('saveNamedSchema blocks when more than 50 saved schemas would exist', () => {
    const storage = createStoredSchemasStorage({ storage: createStorage(), now: () => '2026-06-16T10:00:00.000Z' });

    Array.from({ length: 50 }, (_, index) => storage.saveNamedSchema(`Schema ${index}`, `Name\nliteral(${index})`));
    const result = storage.saveNamedSchema('Too many', 'Name\nliteral(overflow)');

    expect(result.ok).toBe(false);
    expect(result.errorCode).toBe('too_many_saved');
  });

  test('renameSavedSchema and deleteSavedSchema update saved entries', () => {
    const storage = createStoredSchemasStorage({ storage: createStorage(), now: () => '2026-06-16T10:00:00.000Z' });
    const saved = storage.saveNamedSchema('Original', 'Name\nliteral(Ada)').entry;

    storage.renameSavedSchema(saved.id, 'Renamed');
    expect(storage.loadSavedSchemas().saved[0].name).toBe('Renamed');

    storage.deleteSavedSchema(saved.id);
    expect(storage.loadSavedSchemas().saved).toHaveLength(0);
  });

  test('malformed storage falls back to a safe empty state', () => {
    const rawStorage = createStorage();
    rawStorage.setItem('anywaydata:stored-schemas:v1', '{not-json');
    const storage = createStoredSchemasStorage({ storage: rawStorage });

    const result = storage.getSummaryState();

    expect(result.ok).toBe(false);
    expect(result.saved).toEqual([]);
    expect(result.lastUsed).toEqual([]);
  });
});
