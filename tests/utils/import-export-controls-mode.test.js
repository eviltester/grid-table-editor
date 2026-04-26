import { JSDOM } from "jsdom";
import { ImportExportControls } from "../../js/gui_components/import-export-controls.js";
import { GenericDataTable } from "../../js/data_formats/generic-data-table.js";

function makeDataTable(rowCount) {
    const table = new GenericDataTable();
    table.setHeaders(["A", "B"]);
    for (let index = 0; index < rowCount; index++) {
        table.appendDataRow([`a${index}`, `b${index}`]);
    }
    return table;
}

describe("ImportExportControls preview/edit mode", () => {
    let dom;
    let controls;
    let importExportRoot;

    beforeEach(() => {
        dom = new JSDOM(`<!doctype html><html><body>
            <ul><li class="active-type"><a data-type="csv" href="#">CSV</a></li></ul>
            <textarea id="markdownarea"></textarea>
            <div id="importExportRoot"></div>
        </body></html>`);
        global.window = dom.window;
        global.document = dom.window.document;
        global.alert = jest.fn();
        global.confirm = jest.fn(() => true);

        controls = new ImportExportControls();
        importExportRoot = document.getElementById("importExportRoot");
        controls.addHTMLtoGui(importExportRoot);
        controls.exportControls = {
            setTextFromString: jest.fn(),
            renderTextFromGrid: jest.fn()
        };
        controls.exporter = {
            getGridAsGenericDataTable: jest.fn((maxRows) => {
                if(typeof maxRows === "number"){
                    return makeDataTable(maxRows);
                }
                return makeDataTable(12);
            }),
            getDataTableAs: jest.fn((_type, dataTable) => `rows:${dataTable.getRowCount()}`),
            getOptionsForType: jest.fn(() => ({})),
            setOptionsForType: jest.fn()
        };
        controls.importer = {
            importText: jest.fn(),
            toGenericDataTable: jest.fn(() => makeDataTable(25)),
            setGridFromGenericDataTable: jest.fn(),
            setOptionsForType: jest.fn()
        };
        controls.optionsPanels = {
            csv: {
                getOptionsFromGui: () => ({})
            }
        };
    });

    afterEach(() => {
        dom.window.close();
    });

    test("blocks Set Grid From Text in preview mode", () => {
        controls.importTextArea();
        expect(global.alert).toHaveBeenCalledWith("Grid to Text only availalable in Edit mode");
        expect(controls.importer.importText).not.toHaveBeenCalled();
    });

    test("renders only first 10 rows when previewing from grid", () => {
        controls.renderTextFromGrid();
        expect(controls.exporter.getDataTableAs).toHaveBeenCalled();
        const previewTable = controls.exporter.getDataTableAs.mock.calls[0][1];
        expect(previewTable.getRowCount()).toBe(10);
        expect(controls.exportControls.setTextFromString).toHaveBeenCalledWith("rows:10");
    });

    test("toggle to edit with no-confirm clears textarea for manual editing", () => {
        global.confirm = jest.fn(() => false);
        controls.toggleTextEditMode();
        expect(controls.isPreviewTextMode()).toBe(false);
        expect(controls.exportControls.setTextFromString).toHaveBeenCalledWith("");
    });

    test("Set Grid From Text button is disabled in preview mode and enabled in edit mode", () => {
        const button = document.querySelector("#setgridfromtextbutton");
        expect(button.disabled).toBe(true);

        controls.toggleTextEditMode();
        expect(button.disabled).toBe(false);

        controls.toggleTextEditMode();
        expect(button.disabled).toBe(true);
    });

    test("preview mode import renders preview and still loads full data into grid", async () => {
        const fullTable = makeDataTable(25);
        controls.importer.toGenericDataTable.mockReturnValue(fullTable);

        await controls._previewThenImportToGrid("csv", "sample-text");

        const previewTable = controls.exporter.getDataTableAs.mock.calls[0][1];
        expect(previewTable.getRowCount()).toBe(10);
        expect(controls.importer.setGridFromGenericDataTable).toHaveBeenCalledWith(fullTable);
        expect(controls.exportControls.setTextFromString).toHaveBeenCalledWith("rows:10");
    });
});
