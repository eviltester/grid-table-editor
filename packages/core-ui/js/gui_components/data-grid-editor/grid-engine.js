const GRID_ENGINE_AG_GRID = 'ag-grid';
const GRID_ENGINE_TABULATOR = 'tabulator';
const GRID_ENGINE_STORAGE_KEY = 'anywaydata:grid-engine';

function normaliseGridEngineName(engineName) {
  if (!engineName || typeof engineName !== 'string') {
    return undefined;
  }

  const trimmed = engineName.trim().toLowerCase();
  if (trimmed === 'ag' || trimmed === 'aggrid' || trimmed === GRID_ENGINE_AG_GRID) {
    return GRID_ENGINE_AG_GRID;
  }
  if (trimmed === 'tab' || trimmed === 'tabulator' || trimmed === 'tab-grid') {
    return GRID_ENGINE_TABULATOR;
  }

  return undefined;
}

function resolveGridEngine(context = {}) {
  const globalObj = context.globalObject || globalThis;
  const locationSearch = context.locationSearch ?? globalObj?.location?.search;
  const explicitEngine = normaliseGridEngineName(context.explicitEngine);

  if (explicitEngine) {
    return explicitEngine;
  }

  const searchParams = new URLSearchParams(locationSearch || '');
  const queryEngine = normaliseGridEngineName(searchParams.get('grid'));
  if (queryEngine) {
    return queryEngine;
  }

  let storedEngine;
  try {
    storedEngine = globalObj?.localStorage?.getItem(GRID_ENGINE_STORAGE_KEY);
  } catch {
    storedEngine = undefined;
  }
  const storageEngine = normaliseGridEngineName(storedEngine);
  if (storageEngine) {
    return storageEngine;
  }

  const windowEngine = normaliseGridEngineName(globalObj?.ANYWAYDATA_GRID_ENGINE);
  if (windowEngine) {
    return windowEngine;
  }

  return GRID_ENGINE_TABULATOR;
}

export {
  GRID_ENGINE_AG_GRID,
  GRID_ENGINE_TABULATOR,
  GRID_ENGINE_STORAGE_KEY,
  normaliseGridEngineName,
  resolveGridEngine,
};
