import { JSDOM } from "jsdom";
import { bootstrapApp } from "../js/script.js";

describe("script bootstrap", () => {
    let dom;

    beforeEach(() => {
        dom = new JSDOM(`<!doctype html><html><body>
            <div id="main-grid-view"></div>
            <div id="import-export-controls"></div>
            <div id="tabbedTextArea"></div>
            <div id="testDataGeneratorContainer"></div>
            <div class="instructions"><details><ul><li>One</li></ul></details></div>
        </body></html>`);
        global.document = dom.window.document;
        global.window = dom.window;
    });

    afterEach(() => {
        dom.window.close();
        jest.restoreAllMocks();
    });

    test("awaits grid library loader before creating grid", async () => {
        const calls = [];

        const ensureGridLibraryLoadedFn = jest.fn(() => {
            calls.push("ensureGridLibraryLoaded");
            return Promise.resolve();
        });

        class ImportExportControlsClass {
            addHTMLtoGui() {}
            setExporter() {}
            setImporter() {}
            renderTextFromGrid() {}
            setFileFormatType() {}
            setOptionsViewForFormatType() {}
            getExportControls() { return {}; }
        }
        class TabbedTextControlClass {
            addToGui() {}
        }
        class ExporterClass {}
        class ImporterClass {}

        class ExtendedDataGridClass {
            createChildGrid() {
                calls.push("createChildGrid");
            }
            getGridExtras() {
                return {
                    clearGrid: jest.fn(),
                    setGridFromGenericDataTable: jest.fn(),
                    getGridAsGenericDataTable: jest.fn(() => ({ getHeaders: () => [] })),
                    getHeadersFromGrid: jest.fn(() => [])
                };
            }
            sizeColumnsToFit() {}
        }

        await bootstrapApp({
            documentObj: dom.window.document,
            ensureGridLibraryLoadedFn,
            activeGridEngineName: "tabulator",
            ExtendedDataGridClass,
            ImportExportControlsClass,
            TabbedTextControlClass,
            ExporterClass,
            ImporterClass,
            enableTestDataGenerationInterfaceFn: () => {},
            scheduleInitialInstructions: false
        });

        expect(calls[0]).toBe("ensureGridLibraryLoaded");
        expect(calls[1]).toBe("createChildGrid");
    });

    test("returns early when grid library fails to load", async () => {
        const calls = [];
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        const ensureGridLibraryLoadedFn = jest.fn(() => Promise.reject(new Error("load failed")));

        class ExtendedDataGridClass {
            createChildGrid() {
                calls.push("createChildGrid");
            }
            getGridExtras() {
                return {};
            }
        }

        await bootstrapApp({
            documentObj: dom.window.document,
            ensureGridLibraryLoadedFn,
            activeGridEngineName: "tabulator",
            ExtendedDataGridClass,
            ImportExportControlsClass: class {},
            TabbedTextControlClass: class {},
            ExporterClass: class {},
            ImporterClass: class {},
            enableTestDataGenerationInterfaceFn: () => {},
            scheduleInitialInstructions: false
        });

        expect(calls).toEqual([]);
        expect(consoleSpy).toHaveBeenCalled();
    });
});
