import {
  GRID_ENGINE_AG_GRID,
  GRID_ENGINE_TABULATOR,
  normaliseGridEngineName,
  resolveGridEngine,
} from '../../../js/gui_components/data-grid-editor/grid-engine.js';

describe('Grid engine selection', () => {
  test('normalises expected aliases', () => {
    expect(normaliseGridEngineName('ag')).toBe(GRID_ENGINE_AG_GRID);
    expect(normaliseGridEngineName('aggrid')).toBe(GRID_ENGINE_AG_GRID);
    expect(normaliseGridEngineName('tab')).toBe(GRID_ENGINE_TABULATOR);
    expect(normaliseGridEngineName('tabulator')).toBe(GRID_ENGINE_TABULATOR);
    expect(normaliseGridEngineName('unknown')).toBeUndefined();
  });

  test('prefers explicit engine over other sources', () => {
    const engine = resolveGridEngine({
      explicitEngine: 'ag-grid',
      locationSearch: '?grid=tabulator',
      globalObject: {
        localStorage: {
          getItem: () => 'tabulator',
        },
      },
    });

    expect(engine).toBe(GRID_ENGINE_AG_GRID);
  });

  test('uses query parameter when explicit value absent', () => {
    const engine = resolveGridEngine({
      locationSearch: '?grid=ag-grid',
      globalObject: {},
    });
    expect(engine).toBe(GRID_ENGINE_AG_GRID);
  });

  test('falls back to tabulator by default', () => {
    expect(resolveGridEngine({ globalObject: {} })).toBe(GRID_ENGINE_TABULATOR);
  });
});
