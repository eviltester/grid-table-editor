import { ExtendedDataGrid as AgGridExtendedDataGrid } from "./ag-grid/main-display-grid.js";
import { ExtendedDataGrid as TabulatorExtendedDataGrid } from "./tabulator/main-display-grid.js";
import {
    GRID_ENGINE_AG_GRID,
    GRID_ENGINE_TABULATOR,
    resolveGridEngine
} from "./grid-engine.js";

const gridImplementations = {};
gridImplementations[GRID_ENGINE_AG_GRID] = AgGridExtendedDataGrid;
gridImplementations[GRID_ENGINE_TABULATOR] = TabulatorExtendedDataGrid;

const activeGridEngine = resolveGridEngine();
const ExtendedDataGrid = gridImplementations[activeGridEngine] || TabulatorExtendedDataGrid;

export { ExtendedDataGrid, activeGridEngine };
