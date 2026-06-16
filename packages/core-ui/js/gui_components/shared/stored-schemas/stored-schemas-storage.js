const STORED_SCHEMAS_STORAGE_KEY = 'anywaydata:stored-schemas:v1';
const STORED_SCHEMAS_VERSION = 1;
const MAX_SAVED_SCHEMAS = 50;
const MAX_LAST_USED_SCHEMAS = 10;

function getDefaultStorageState() {
  return {
    version: STORED_SCHEMAS_VERSION,
    draft: null,
    lastUsed: [],
    saved: [],
  };
}

function createEntryId() {
  return `stored-schema-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function sanitizeEntry(entry, fallbackName = 'stored schema') {
  if (!entry || typeof entry !== 'object') {
    return null;
  }
  const schemaText = String(entry.schemaText || '');
  if (schemaText.trim().length === 0) {
    return null;
  }
  return {
    id: String(entry.id || createEntryId()),
    name: String(entry.name || fallbackName),
    schemaText,
    updatedAt: String(entry.updatedAt || new Date().toISOString()),
  };
}

function sanitizeState(rawState) {
  const state = rawState && typeof rawState === 'object' ? rawState : {};
  return {
    version: STORED_SCHEMAS_VERSION,
    draft: sanitizeEntry(state.draft, 'ldraft'),
    lastUsed: Array.isArray(state.lastUsed)
      ? state.lastUsed
          .map((entry) => sanitizeEntry(entry, 'last used'))
          .filter(Boolean)
          .slice(0, MAX_LAST_USED_SCHEMAS)
      : [],
    saved: Array.isArray(state.saved)
      ? state.saved
          .map((entry) => sanitizeEntry(entry, 'saved schema'))
          .filter(Boolean)
          .slice(0, MAX_SAVED_SCHEMAS)
      : [],
  };
}

function normalizeName(name, fallbackName) {
  const normalized = String(name || '').trim();
  return normalized || fallbackName;
}

function createStoredSchemasStorage({
  storage,
  storageKey = STORED_SCHEMAS_STORAGE_KEY,
  now = () => new Date().toISOString(),
  createId = createEntryId,
} = {}) {
  function readState() {
    if (!storage?.getItem) {
      return {
        ok: false,
        state: getDefaultStorageState(),
        errorMessage: 'Local storage is unavailable.',
      };
    }
    try {
      const rawValue = storage.getItem(storageKey);
      if (!rawValue) {
        return { ok: true, state: getDefaultStorageState(), errorMessage: '' };
      }
      return {
        ok: true,
        state: sanitizeState(JSON.parse(rawValue)),
        errorMessage: '',
      };
    } catch {
      return {
        ok: false,
        state: getDefaultStorageState(),
        errorMessage: 'Stored schemas could not be read. Local storage was reset for this feature.',
      };
    }
  }

  function writeState(nextState) {
    if (!storage?.setItem) {
      return {
        ok: false,
        state: sanitizeState(nextState),
        errorMessage: 'Local storage is unavailable.',
      };
    }
    try {
      const sanitized = sanitizeState(nextState);
      storage.setItem(storageKey, JSON.stringify(sanitized));
      return { ok: true, state: sanitized, errorMessage: '' };
    } catch {
      return {
        ok: false,
        state: sanitizeState(nextState),
        errorMessage: 'Stored schemas could not be saved to local storage.',
      };
    }
  }

  function buildSummary(result) {
    const state = sanitizeState(result?.state);
    return {
      ok: result?.ok !== false,
      errorMessage: result?.errorMessage || '',
      draft: state.draft,
      lastUsed: state.lastUsed.slice(),
      saved: state.saved.slice(),
      counts: {
        lastUsed: state.lastUsed.length,
        saved: state.saved.length,
      },
      hasDraft: Boolean(state.draft?.schemaText),
    };
  }

  function getSummaryState() {
    return buildSummary(readState());
  }

  function saveDraft(schemaText) {
    const normalizedText = String(schemaText || '');
    if (normalizedText.trim().length === 0) {
      return {
        ok: true,
        skipped: true,
        errorMessage: '',
        draft: getSummaryState().draft,
      };
    }
    const readResult = readState();
    const nextState = {
      ...readResult.state,
      draft: {
        id: readResult.state.draft?.id || createId(),
        name: 'ldraft',
        schemaText: normalizedText,
        updatedAt: now(),
      },
    };
    const writeResult = writeState(nextState);
    return {
      ok: writeResult.ok,
      skipped: false,
      errorMessage: writeResult.errorMessage || readResult.errorMessage || '',
      draft: writeResult.state.draft,
    };
  }

  function recoverDraft() {
    const summary = getSummaryState();
    return {
      ok: summary.ok,
      errorMessage: summary.errorMessage,
      draft: summary.draft,
    };
  }

  function recordLastUsed(schemaText) {
    const normalizedText = String(schemaText || '');
    if (normalizedText.trim().length === 0) {
      return {
        ok: true,
        skipped: true,
        errorMessage: '',
        entry: null,
      };
    }
    const readResult = readState();
    const previousEntries = readResult.state.lastUsed.filter((entry) => entry.schemaText !== normalizedText);
    const nextEntry = {
      id: readResult.state.lastUsed.find((entry) => entry.schemaText === normalizedText)?.id || createId(),
      name: `last used - ${now()}`,
      schemaText: normalizedText,
      updatedAt: now(),
    };
    const nextState = {
      ...readResult.state,
      lastUsed: [nextEntry, ...previousEntries].slice(0, MAX_LAST_USED_SCHEMAS),
    };
    const writeResult = writeState(nextState);
    return {
      ok: writeResult.ok,
      skipped: false,
      errorMessage: writeResult.errorMessage || readResult.errorMessage || '',
      entry: nextEntry,
    };
  }

  function clearLastUsed() {
    const readResult = readState();
    const writeResult = writeState({
      ...readResult.state,
      lastUsed: [],
    });
    return {
      ok: writeResult.ok,
      errorMessage: writeResult.errorMessage || readResult.errorMessage || '',
    };
  }

  function loadSavedSchemas() {
    return getSummaryState();
  }

  function saveNamedSchema(name, schemaText) {
    const normalizedText = String(schemaText || '');
    if (normalizedText.trim().length === 0) {
      return {
        ok: false,
        errorCode: 'empty_schema',
        errorMessage: 'Cannot save an empty schema.',
      };
    }
    const readResult = readState();
    if (readResult.state.saved.length >= MAX_SAVED_SCHEMAS) {
      return {
        ok: false,
        errorCode: 'too_many_saved',
        errorMessage: 'Too many existing saved schemas.',
      };
    }
    const nextEntry = {
      id: createId(),
      name: normalizeName(name, 'saved schema'),
      schemaText: normalizedText,
      updatedAt: now(),
    };
    const writeResult = writeState({
      ...readResult.state,
      saved: [nextEntry, ...readResult.state.saved],
    });
    return {
      ok: writeResult.ok,
      errorCode: writeResult.ok ? '' : 'storage_unavailable',
      errorMessage: writeResult.errorMessage || readResult.errorMessage || '',
      entry: nextEntry,
    };
  }

  function renameSavedSchema(id, name) {
    const readResult = readState();
    const nextSaved = readResult.state.saved.map((entry) =>
      entry.id === id
        ? {
            ...entry,
            name: normalizeName(name, entry.name),
            updatedAt: now(),
          }
        : entry
    );
    const writeResult = writeState({
      ...readResult.state,
      saved: nextSaved,
    });
    return {
      ok: writeResult.ok,
      errorMessage: writeResult.errorMessage || readResult.errorMessage || '',
    };
  }

  function deleteSavedSchema(id) {
    const readResult = readState();
    const writeResult = writeState({
      ...readResult.state,
      saved: readResult.state.saved.filter((entry) => entry.id !== id),
    });
    return {
      ok: writeResult.ok,
      errorMessage: writeResult.errorMessage || readResult.errorMessage || '',
    };
  }

  return {
    MAX_SAVED_SCHEMAS,
    MAX_LAST_USED_SCHEMAS,
    STORED_SCHEMAS_STORAGE_KEY,
    getSummaryState,
    saveDraft,
    recoverDraft,
    recordLastUsed,
    clearLastUsed,
    saveNamedSchema,
    loadSavedSchemas,
    renameSavedSchema,
    deleteSavedSchema,
  };
}

export { STORED_SCHEMAS_STORAGE_KEY, MAX_SAVED_SCHEMAS, MAX_LAST_USED_SCHEMAS, createStoredSchemasStorage };
