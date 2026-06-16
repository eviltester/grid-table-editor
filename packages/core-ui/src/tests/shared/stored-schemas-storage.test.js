import { jest } from '@jest/globals';
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

  test('recordLastUsed reuses one captured timestamp for name and updatedAt', () => {
    const storage = createStoredSchemasStorage({
      storage: createStorage(),
      now: jest.fn().mockReturnValueOnce('2026-06-16T10:00:00.000Z').mockReturnValueOnce('2026-06-16T10:00:00.001Z'),
    });

    const result = storage.recordLastUsed('Name\nliteral(Ada)');

    expect(result.entry).toMatchObject({
      name: 'last used - 2026-06-16T10:00:00.000Z',
      updatedAt: '2026-06-16T10:00:00.000Z',
    });
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

  test('save and rename truncate names to 50 characters', () => {
    const storage = createStoredSchemasStorage({ storage: createStorage(), now: () => '2026-06-16T10:00:00.000Z' });
    const longName = 'x'.repeat(60);

    const saved = storage.saveNamedSchema(longName, 'Name\nliteral(Ada)').entry;
    storage.renameSavedSchema(saved.id, 'y'.repeat(55));

    const renamed = storage.loadSavedSchemas().saved[0];
    expect(saved.name).toBe('x'.repeat(50));
    expect(renamed.name).toBe('y'.repeat(50));
  });

  test('legacy overlong saved names are truncated when storage is loaded', () => {
    const rawStorage = createStorage();
    const longName = 'Long name '.repeat(8);
    rawStorage.setItem(
      'anywaydata:stored-schemas:v1',
      JSON.stringify({
        version: 1,
        draft: null,
        lastUsed: [],
        saved: [
          {
            id: 'saved-1',
            name: longName,
            schemaText: 'Name\nliteral(Ada)',
            updatedAt: '2026-06-16T10:00:00.000Z',
          },
        ],
      })
    );
    const storage = createStoredSchemasStorage({ storage: rawStorage });

    expect(storage.loadSavedSchemas().saved[0].name).toBe(longName.trim().slice(0, 50).trim());
  });

  test('malformed storage falls back to a safe empty state', () => {
    const rawStorage = createStorage();
    rawStorage.setItem('anywaydata:stored-schemas:v1', '{not-json');
    const storage = createStoredSchemasStorage({ storage: rawStorage });

    const result = storage.getSummaryState();

    expect(result.ok).toBe(false);
    expect(result.saved).toEqual([]);
    expect(result.lastUsed).toEqual([]);
    expect(rawStorage.getItem('anywaydata:stored-schemas:v1')).toBeNull();
  });
});
