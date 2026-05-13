import { jest } from '@jest/globals';
describe('Main display grid engine selection wrapper', () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  async function loadModuleForEngine(engine) {
    const agGridClass = class AgGridExtendedDataGrid {};
    const tabulatorClass = class TabulatorExtendedDataGrid {};

    jest.unstable_mockModule('../../../js/gui_components/data-grid-editor/ag-grid/main-display-grid.js', () => ({
      ExtendedDataGrid: agGridClass,
    }));
    jest.unstable_mockModule('../../../js/gui_components/data-grid-editor/tabulator/main-display-grid.js', () => ({
      ExtendedDataGrid: tabulatorClass,
    }));
    jest.unstable_mockModule('../../../js/gui_components/data-grid-editor/grid-engine.js', () => ({
      GRID_ENGINE_AG_GRID: 'ag-grid',
      GRID_ENGINE_TABULATOR: 'tabulator',
      resolveGridEngine: jest.fn(() => engine),
    }));

    const moduleUnderTest = await import('../../../js/gui_components/data-grid-editor/main-display-grid.js');

    return { moduleUnderTest, agGridClass, tabulatorClass };
  }

  test('exports the AG Grid implementation when AG Grid is active', async () => {
    const { moduleUnderTest, agGridClass } = await loadModuleForEngine('ag-grid');

    expect(moduleUnderTest.activeGridEngine).toBe('ag-grid');
    expect(moduleUnderTest.ExtendedDataGrid).toBe(agGridClass);
  });

  test('exports the Tabulator implementation when Tabulator is active', async () => {
    const { moduleUnderTest, tabulatorClass } = await loadModuleForEngine('tabulator');

    expect(moduleUnderTest.activeGridEngine).toBe('tabulator');
    expect(moduleUnderTest.ExtendedDataGrid).toBe(tabulatorClass);
  });

  test('falls back to Tabulator when the resolved engine is unknown', async () => {
    const { moduleUnderTest, tabulatorClass } = await loadModuleForEngine('unknown-engine');

    expect(moduleUnderTest.activeGridEngine).toBe('unknown-engine');
    expect(moduleUnderTest.ExtendedDataGrid).toBe(tabulatorClass);
  });
});
