describe('Main display grid engine selection wrapper', () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  function loadModuleForEngine(engine) {
    const agGridClass = class AgGridExtendedDataGrid {};
    const tabulatorClass = class TabulatorExtendedDataGrid {};

    jest.doMock('../../js/gui_components/data-grid-editor/ag-grid/main-display-grid.js', () => ({
      ExtendedDataGrid: agGridClass,
    }));
    jest.doMock('../../js/gui_components/data-grid-editor/tabulator/main-display-grid.js', () => ({
      ExtendedDataGrid: tabulatorClass,
    }));
    jest.doMock('../../js/gui_components/data-grid-editor/grid-engine.js', () => ({
      GRID_ENGINE_AG_GRID: 'ag-grid',
      GRID_ENGINE_TABULATOR: 'tabulator',
      resolveGridEngine: jest.fn(() => engine),
    }));

    const moduleUnderTest = require('../../js/gui_components/data-grid-editor/main-display-grid.js');

    return { moduleUnderTest, agGridClass, tabulatorClass };
  }

  test('exports the AG Grid implementation when AG Grid is active', () => {
    const { moduleUnderTest, agGridClass } = loadModuleForEngine('ag-grid');

    expect(moduleUnderTest.activeGridEngine).toBe('ag-grid');
    expect(moduleUnderTest.ExtendedDataGrid).toBe(agGridClass);
  });

  test('exports the Tabulator implementation when Tabulator is active', () => {
    const { moduleUnderTest, tabulatorClass } = loadModuleForEngine('tabulator');

    expect(moduleUnderTest.activeGridEngine).toBe('tabulator');
    expect(moduleUnderTest.ExtendedDataGrid).toBe(tabulatorClass);
  });

  test('falls back to Tabulator when the resolved engine is unknown', () => {
    const { moduleUnderTest, tabulatorClass } = loadModuleForEngine('unknown-engine');

    expect(moduleUnderTest.activeGridEngine).toBe('unknown-engine');
    expect(moduleUnderTest.ExtendedDataGrid).toBe(tabulatorClass);
  });
});