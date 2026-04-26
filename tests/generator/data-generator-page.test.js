import { JSDOM } from "jsdom";
import {
    DataGeneratorPage,
    buildRuleSpecFromSchemaRow,
    schemaRowsToSpec,
    validateSchemaRows
} from "../../js/gui_components/data-generator-page.js";

class FakeTabulator {
    constructor(element, options) {
        this.element = element;
        this.options = options;
    }
}

class FakeGridExtension {
    constructor() {
        this.setGridFromGenericDataTable = jest.fn();
        FakeGridExtension.lastInstance = this;
    }
}

class FakeExporter {
    constructor() {}

    canExport(type) {
        return ["csv", "json", "markdown"].includes(type);
    }

    getFileExtensionFor(type) {
        if (type === "json") {
            return ".json";
        }
        if (type === "markdown") {
            return ".md";
        }
        return ".csv";
    }

    getDataTableAs(type, dataTable) {
        return `${type}:${dataTable.getRowCount()}`;
    }
}

class FakeDownload {
    constructor(filename) {
        this.filename = filename;
    }

    downloadFile(text) {
        FakeDownload.lastDownload = { filename: this.filename, text };
    }
}

class FakeTestDataGenerator {
    constructor() {
        this.rules = [];
        this._errors = [];
        this.compiler = {
            validate: () => {}
        };
    }

    importSpec(text) {
        const lines = text.split("\n");
        this.rules = [];
        for (let i = 0; i < lines.length; i += 2) {
            if (lines[i] === undefined || lines[i + 1] === undefined) {
                continue;
            }
            this.rules.push({
                name: lines[i],
                ruleSpec: lines[i + 1],
                type: ""
            });
        }
    }

    compile() {}

    testDataRules() {
        return this.rules;
    }

    isValid() {
        return this._errors.length === 0;
    }

    errors() {
        return this._errors;
    }

    generateHeadersArray() {
        return this.rules.map((rule) => rule.name);
    }

    generateRow() {
        return this.rules.map((rule) => `${rule.type}:${rule.ruleSpec}`);
    }
}

describe("DataGeneratorPage", () => {
    let dom;
    let alertFn;

    beforeEach(() => {
        dom = new JSDOM(`<!doctype html><html><body><div id="app"></div></body></html>`);
        global.document = dom.window.document;
        global.window = dom.window;
        alertFn = jest.fn();
        FakeDownload.lastDownload = undefined;
        FakeGridExtension.lastInstance = undefined;
    });

    afterEach(() => {
        dom.window.close();
    });

    test("schema helper mapping supports faker, regex and literal", () => {
        expect(buildRuleSpecFromSchemaRow({ sourceType: "faker", command: "faker.person.firstName", params: "()" }))
            .toBe("person.firstName()");
        expect(buildRuleSpecFromSchemaRow({ sourceType: "regex", value: "[A-Z]{3}" }))
            .toBe("[A-Z]{3}");
        expect(buildRuleSpecFromSchemaRow({ sourceType: "literal", value: "Fixed" }))
            .toBe("Fixed");

        const spec = schemaRowsToSpec([
            { name: "A", sourceType: "faker", command: "word.noun", params: "()" },
            { name: "B", sourceType: "literal", value: "x" }
        ]);
        expect(spec).toBe("A\nword.noun()\nB\nx");
    });

    test("schema validation reports missing column names and faker command", () => {
        const result = validateSchemaRows([
            { name: "", sourceType: "regex", value: "[0-9]" },
            { name: "First", sourceType: "faker", command: "" }
        ]);
        expect(result.errors).toContain("Row 1: column name is required.");
        expect(result.errors).toContain("Row 2: faker command is required.");
    });

    test("preview generates data into tabulator grid extension", () => {
        const page = new DataGeneratorPage({
            parentElement: document.getElementById("app"),
            documentObj: document,
            alertFn,
            faker: { word: { noun: () => "x" } },
            RandExp: function RandExp() {},
            TabulatorCtor: FakeTabulator,
            GridExtensionClass: FakeGridExtension,
            ExporterClass: FakeExporter,
            DownloadClass: FakeDownload,
            TestDataGeneratorClass: FakeTestDataGenerator
        });
        page.init();

        page.schemaRows = [
            { id: "1", name: "Name", sourceType: "faker", command: "word.noun", params: "()", value: "" },
            { id: "2", name: "Code", sourceType: "regex", command: "", params: "", value: "[A-Z]{3}" }
        ];
        page.renderSchemaRows();
        document.getElementById("previewRowsCount").value = "3";

        document.getElementById("previewDataButton").click();

        expect(alertFn).not.toHaveBeenCalled();
        expect(FakeGridExtension.lastInstance.setGridFromGenericDataTable).toHaveBeenCalledTimes(1);
        const tableArg = FakeGridExtension.lastInstance.setGridFromGenericDataTable.mock.calls[0][0];
        expect(tableArg.getRowCount()).toBe(3);
        expect(tableArg.getHeaders()).toEqual(["Name", "Code"]);
    });

    test("generate downloads file using selected output format", () => {
        const page = new DataGeneratorPage({
            parentElement: document.getElementById("app"),
            documentObj: document,
            alertFn,
            faker: { word: { noun: () => "x" } },
            RandExp: function RandExp() {},
            TabulatorCtor: FakeTabulator,
            GridExtensionClass: FakeGridExtension,
            ExporterClass: FakeExporter,
            DownloadClass: FakeDownload,
            TestDataGeneratorClass: FakeTestDataGenerator
        });
        page.init();

        page.schemaRows = [
            { id: "1", name: "Name", sourceType: "literal", command: "", params: "", value: "fixed" }
        ];
        page.renderSchemaRows();
        document.getElementById("generateRowsCount").value = "4";
        document.getElementById("generatorOutputFormat").value = "json";

        document.getElementById("generateDataButton").click();

        expect(alertFn).not.toHaveBeenCalled();
        expect(FakeDownload.lastDownload).toEqual({
            filename: "generated-data.json",
            text: "json:4"
        });
    });

    test("shows faker fields only for faker source and value only for regex/literal", () => {
        const page = new DataGeneratorPage({
            parentElement: document.getElementById("app"),
            documentObj: document,
            alertFn,
            faker: { word: { noun: () => "x" } },
            RandExp: function RandExp() {},
            TabulatorCtor: FakeTabulator,
            GridExtensionClass: FakeGridExtension,
            ExporterClass: FakeExporter,
            DownloadClass: FakeDownload,
            TestDataGeneratorClass: FakeTestDataGenerator
        });
        page.init();

        page.schemaRows = [
            { id: "1", name: "A", sourceType: "regex", command: "word.noun", params: "()", value: "[A-Z]" }
        ];
        page.renderSchemaRows();

        let rowElem = document.querySelector(".generator-schema-row");
        expect(rowElem.querySelector('[data-field="command"]').hidden).toBe(true);
        expect(rowElem.querySelector('[data-field="params"]').hidden).toBe(true);
        expect(rowElem.querySelector('[data-field="value"]').hidden).toBe(false);

        rowElem.querySelector('[data-field="sourceType"]').value = "faker";
        rowElem.querySelector('[data-field="sourceType"]').dispatchEvent(new dom.window.Event("change", { bubbles: true }));

        rowElem = document.querySelector(".generator-schema-row");
        expect(rowElem.querySelector('[data-field="command"]').hidden).toBe(false);
        expect(rowElem.querySelector('[data-field="params"]').hidden).toBe(false);
        expect(rowElem.querySelector('[data-field="value"]').hidden).toBe(true);
    });

    test("default alert invocation does not throw on validation errors", () => {
        dom.window.alert = jest.fn();
        const page = new DataGeneratorPage({
            parentElement: document.getElementById("app"),
            documentObj: document,
            faker: { word: { noun: () => "x" } },
            RandExp: function RandExp() {},
            TabulatorCtor: FakeTabulator,
            GridExtensionClass: FakeGridExtension,
            ExporterClass: FakeExporter,
            DownloadClass: FakeDownload,
            TestDataGeneratorClass: FakeTestDataGenerator
        });
        page.init();
        page.schemaRows = [{ id: "1", name: "", sourceType: "regex", command: "", params: "", value: "" }];
        page.renderSchemaRows();

        expect(() => page.previewData()).not.toThrow();
        expect(dom.window.alert).toHaveBeenCalled();
    });
});
