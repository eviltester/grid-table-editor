import { JSDOM } from "jsdom";
import { enableTestDataGenerationInterface } from "../../js/gui_components/testdatadefn.js";

describe("test data definition editor engine compatibility", () => {
    let dom;

    beforeEach(() => {
        dom = new JSDOM(`<!doctype html><html><body><div id="host"></div></body></html>`);
        global.window = dom.window;
        global.document = dom.window.document;
        global.Event = dom.window.Event;
        global.agGrid = undefined;
        global.RandExp = function RandExp() {};
    });

    afterEach(() => {
        dom.window.close();
        delete global.agGrid;
    });

    test("does not throw when AG Grid library is unavailable", () => {
        expect(() => {
            enableTestDataGenerationInterface("host", {
                setGridFromGenericDataTable: jest.fn()
            }, {
                renderTextFromGrid: jest.fn()
            });
        }).not.toThrow();

        expect(document.querySelector("#generatedata")).toBeTruthy();
        expect(document.querySelector("#testdatadefntext")).toBeTruthy();
    });

    test("uses tabulator path when ag-grid is unavailable", () => {
        class TabulatorMock {
            constructor() {
                this.rows = [];
            }
            setData(data) { this.rows = data.map((row) => ({ ...row })); return Promise.resolve(); }
            addData(rows) { this.rows.push(...rows.map((row) => ({ ...row }))); return Promise.resolve(); }
            getData() { return this.rows; }
            getSelectedRows() { return []; }
            deleteRow() {}
            getColumnDefinitions() { return [{ title: "columnName", field: "columnName" }]; }
            getRows() { return []; }
            clearFilter() {}
            setFilter() {}
            addColumn() {}
            getDataCount() { return this.rows.length; }
            getColumns() { return []; }
            blockRedraw() {}
            restoreRedraw() {}
            redraw() {}
        }

        global.Tabulator = TabulatorMock;

        expect(() => {
            enableTestDataGenerationInterface("host", {
                setGridFromGenericDataTable: jest.fn()
            }, {
                renderTextFromGrid: jest.fn()
            });
        }).not.toThrow();

        expect(document.querySelector("#defngrid button")).toBeTruthy();
        delete global.Tabulator;
    });
});
