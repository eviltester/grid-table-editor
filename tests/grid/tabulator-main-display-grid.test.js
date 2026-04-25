import { ExtendedDataGrid } from "../../js/gui_components/data-grid-editor/tabulator/main-display-grid.js";
import { JSDOM } from "jsdom";

describe("Tabulator main display grid", () => {
    let dom;

    beforeEach(() => {
        dom = new JSDOM(`<!doctype html><html><body></body></html>`);
        global.window = dom.window;
        global.document = dom.window.document;

        document.body.innerHTML = `<div id="host"></div>`;
        global.Tabulator = jest.fn(() => {
            return {
                getColumnDefinitions: jest.fn(() => [{ title: "Existing", field: "column1" }]),
                addColumn: jest.fn(),
                getRows: jest.fn(() => []),
                getSelectedRows: jest.fn(() => []),
                deleteRow: jest.fn(),
                getDataCount: jest.fn(() => 0),
                addData: jest.fn(),
                clearData: jest.fn(),
                setColumns: jest.fn(() => Promise.resolve()),
                setData: jest.fn(() => Promise.resolve()),
                getData: jest.fn(() => []),
                getColumns: jest.fn(() => []),
                clearFilter: jest.fn(),
                setFilter: jest.fn(),
                setSort: jest.fn(),
                clearSort: jest.fn()
            };
        });
        global.prompt = jest.fn();
        global.alert = jest.fn();
        global.confirm = jest.fn(() => true);
    });

    afterEach(() => {
        dom.window.close();
    });

    test("uses non-auto columns and builds custom header formatter", () => {
        const grid = new ExtendedDataGrid();
        expect(grid.gridOptions.autoColumns).toBe(false);

        const formatter = grid.gridOptions.columnDefaults.titleFormatter;
        const html = formatter({ getValue: () => "Instructions <unsafe>" });
        expect(html).toContain("headerbuttons");
        expect(html).toContain("Instructions &lt;unsafe&gt;");
    });

    test("createChildGrid instantiates Tabulator with #myGrid", () => {
        const grid = new ExtendedDataGrid();
        const host = document.getElementById("host");
        grid.createChildGrid(host);

        expect(global.Tabulator).toHaveBeenCalledTimes(1);
        expect(global.Tabulator).toHaveBeenCalledWith("#myGrid", expect.any(Object));
        expect(grid.getGridExtras()).toBeDefined();
    });

    test("header click action rename updates the column definition", () => {
        const grid = new ExtendedDataGrid();
        global.prompt.mockReturnValue("Instructions");

        const columnDefinition = { title: "Old Name", field: "column1" };
        const column = {
            getTable: () => ({
                getColumnDefinitions: () => [columnDefinition],
                getColumns: () => [column],
                setSort: jest.fn(),
                clearSort: jest.fn()
            }),
            getDefinition: () => columnDefinition,
            getField: () => "column1",
            updateDefinition: jest.fn()
        };
        const event = {
            target: { dataset: { action: "rename" } },
            preventDefault: jest.fn(),
            stopPropagation: jest.fn()
        };

        grid.gridOptions.columnDefaults.headerClick(event, column);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
        expect(column.updateDefinition).toHaveBeenCalledWith({
            title: "Instructions",
            headerName: "Instructions"
        });
    });

    test("header click add-right delegates to table addColumn", () => {
        const grid = new ExtendedDataGrid();
        global.prompt.mockReturnValue("Added");

        const columnDefinition = { title: "Old Name", field: "column1", colId: "column1" };
        const column = {
            getTable: () => table,
            getDefinition: () => columnDefinition,
            getField: () => "column1"
        };
        const table = {
            getColumnDefinitions: () => [columnDefinition],
            getColumns: () => [column],
            addColumn: jest.fn(),
            setSort: jest.fn(),
            clearSort: jest.fn()
        };

        grid.gridOptions.columnDefaults.headerClick(
            {
                target: { dataset: { action: "add-right" } },
                preventDefault: jest.fn(),
                stopPropagation: jest.fn()
            },
            column
        );

        expect(table.addColumn).toHaveBeenCalledWith(
            expect.objectContaining({ title: "Added" }),
            false,
            column
        );
    });

    test("header click sort actions delegate to table sorting", () => {
        const grid = new ExtendedDataGrid();
        const table = {
            getColumnDefinitions: () => [],
            getColumns: () => [],
            addColumn: jest.fn(),
            setSort: jest.fn(),
            clearSort: jest.fn()
        };
        const column = {
            getTable: () => table,
            getDefinition: () => ({ field: "column1", colId: "column1", title: "Col" }),
            getField: () => "column1"
        };

        grid.gridOptions.columnDefaults.headerClick(
            { target: { dataset: { action: "sort-asc" } }, preventDefault: jest.fn(), stopPropagation: jest.fn() },
            column
        );
        grid.gridOptions.columnDefaults.headerClick(
            { target: { dataset: { action: "sort-desc" } }, preventDefault: jest.fn(), stopPropagation: jest.fn() },
            column
        );
        grid.gridOptions.columnDefaults.headerClick(
            { target: { dataset: { action: "sort-none" } }, preventDefault: jest.fn(), stopPropagation: jest.fn() },
            column
        );

        expect(table.setSort).toHaveBeenNthCalledWith(1, "column1", "asc");
        expect(table.setSort).toHaveBeenNthCalledWith(2, "column1", "desc");
        expect(table.clearSort).toHaveBeenCalledTimes(1);
    });
});
