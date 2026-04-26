import { GenericDataTable } from "../data_formats/generic-data-table.js";
import { TestDataGenerator } from "../data_generation/testDataGenerator.js";
import { Exporter } from "../grid/exporter.js";
import { Download } from "./download.js";
import { GridExtension as TabulatorGridExtension } from "./data-grid-editor/tabulator/gridExtension-tabulator.js";

const SOURCE_TYPE_FAKER = "faker";
const SOURCE_TYPE_REGEX = "regex";
const SOURCE_TYPE_LITERAL = "literal";

const FAKER_SKIP_VALUES = [
    "_randomizer.next",
    "_randomizer.seed",
    "helpers.objectKey",
    "helpers.objectValue",
    "helpers.objectEntry",
    "helpers.enumValue"
];

function normaliseFakerCommand(commandValue){
    const command = String(commandValue || "").trim();
    if(command.startsWith("faker.")){
        return command.replace("faker.", "");
    }
    return command;
}

function normaliseSourceType(sourceType){
    const normalised = String(sourceType || "").trim().toLowerCase();
    if(normalised === SOURCE_TYPE_FAKER || normalised === SOURCE_TYPE_REGEX || normalised === SOURCE_TYPE_LITERAL){
        return normalised;
    }
    return SOURCE_TYPE_REGEX;
}

function buildRuleSpecFromSchemaRow(row){
    const sourceType = normaliseSourceType(row?.sourceType);
    if(sourceType === SOURCE_TYPE_FAKER){
        const command = normaliseFakerCommand(row?.command);
        const params = String(row?.params ?? "").trim();
        return `${command}${params}`;
    }
    return String(row?.value ?? "").trim();
}

function schemaRowsToSpec(schemaRows){
    const lines = [];
    (schemaRows || []).forEach((row) => {
        lines.push(String(row?.name ?? "").trim());
        lines.push(buildRuleSpecFromSchemaRow(row));
    });
    return lines.join("\n");
}

function validateSchemaRows(schemaRows){
    const errors = [];
    const rows = (schemaRows || []).map((row, index) => {
        return {
            id: row?.id ?? `row-${index + 1}`,
            name: String(row?.name ?? "").trim(),
            sourceType: normaliseSourceType(row?.sourceType),
            command: normaliseFakerCommand(row?.command),
            params: String(row?.params ?? "").trim(),
            value: String(row?.value ?? "").trim(),
            order: index
        };
    });

    if(rows.length === 0){
        errors.push("Add at least one schema row.");
    }

    rows.forEach((row, index) => {
        if(row.name.length === 0){
            errors.push(`Row ${index + 1}: column name is required.`);
        }
        if(row.sourceType === SOURCE_TYPE_FAKER && row.command.length === 0){
            errors.push(`Row ${index + 1}: faker command is required.`);
        }
    });

    return { errors, rows };
}

function buildFakerCommands(fakerObj){
    const commands = [];
    if(!fakerObj || typeof fakerObj !== "object"){
        return commands;
    }

    Object.keys(fakerObj).forEach((domainKey) => {
        const domain = fakerObj[domainKey];
        if(!domain || typeof domain !== "object"){
            return;
        }

        Object.getOwnPropertyNames(domain)
            .filter((methodName) => typeof domain[methodName] === "function")
            .forEach((methodName) => {
                const command = `${domainKey}.${methodName}`;
                if(FAKER_SKIP_VALUES.includes(command)){
                    return;
                }
                commands.push(command);
            });
    });

    commands.sort();
    return commands;
}

class DataGeneratorPage {
    constructor({
        parentElement,
        documentObj = document,
        alertFn,
        faker,
        RandExp,
        TabulatorCtor = globalThis?.Tabulator,
        GridExtensionClass = TabulatorGridExtension,
        ExporterClass = Exporter,
        DownloadClass = Download,
        TestDataGeneratorClass = TestDataGenerator
    } = {}){
        this.parentElement = parentElement;
        this.documentObj = documentObj;
        this.alertFn = typeof alertFn === "function" ? alertFn : (message) => {
            const windowAlert = this.documentObj?.defaultView?.alert || globalThis?.alert;
            if(typeof windowAlert === "function"){
                windowAlert.call(this.documentObj?.defaultView || globalThis, message);
                return;
            }
            console.error(message);
        };
        this.faker = faker;
        this.RandExp = RandExp;
        this.TabulatorCtor = TabulatorCtor;
        this.GridExtensionClass = GridExtensionClass;
        this.ExporterClass = ExporterClass;
        this.DownloadClass = DownloadClass;
        this.TestDataGeneratorClass = TestDataGeneratorClass;

        this.rowIdCounter = 1;
        this.schemaRows = [];
        this.fakerCommands = buildFakerCommands(this.faker);
        this.fakerCommandsLongestFirst = [...this.fakerCommands].sort((a, b) => b.length - a.length);
        this.isTextMode = false;
    }

    init(){
        if(!this.parentElement){
            throw new Error("DataGeneratorPage requires a parentElement");
        }
        if(typeof this.TabulatorCtor !== "function"){
            throw new Error("Tabulator library is not available");
        }

        this.renderPageShell();
        this.schemaRows = [this.createBlankSchemaRow()];
        this.renderSchemaRows();
        this.updateSchemaEditModeView();

        this.previewTableApi = new this.TabulatorCtor(this.documentObj.getElementById("generator-preview-grid"), {
            data: [],
            columns: [{ title: "~preview", field: "column1", sorter: "string" }],
            autoColumns: false,
            headerSort: true,
            selectableRows: true,
            selectableRowsRangeMode: "click",
            layout: "fitDataStretch",
            columnDefaults: {
                resizable: true,
                editor: "input",
                editorParams: { selectContents: true },
                headerFilter: "input",
                headerFilterFunc: "like",
                sorter: "string"
            }
        });
        this.previewGrid = new this.GridExtensionClass(this.previewTableApi);
        this.exporter = new this.ExporterClass(this.previewGrid);

        this.attachEventHandlers();
    }

    createBlankSchemaRow(){
        return {
            id: `schema-row-${this.rowIdCounter++}`,
            name: "",
            sourceType: SOURCE_TYPE_REGEX,
            command: "",
            params: "",
            value: ""
        };
    }

    renderPageShell(){
        this.parentElement.innerHTML = `
            <section class="generator-page">
                <div class="generator-controls">
                    <label>Generate Rows
                        <input type="number" id="generateRowsCount" min="0" value="1000">
                    </label>
                    <label>Output Format
                        <select id="generatorOutputFormat"></select>
                    </label>
                    <button id="generateDataButton">Generate Data</button>
                </div>
                <div class="generator-schema">
                    <div class="generator-schema-head">
                        <strong>Schema</strong>
                        <button id="schemaModeToggleButton" class="icon-button" title="Toggle schema text mode">Edit as Text</button>
                    </div>
                    <div id="generatorSchemaRows" class="generator-schema-rows"></div>
                    <div id="generatorSchemaTextContainer" class="generator-schema-text">
                        <textarea id="generatorSchemaText" class="testDataDefn" placeholder="Column Name&#10;rule&#10;Column Name&#10;rule"></textarea>
                    </div>
                    <div class="generator-schema-footer">
                        <button id="addSchemaRowButton" title="Add field">+ Add Field</button>
                    </div>
                </div>
                <div class="generator-preview">
                    <div class="generator-preview-head">
                        <strong>Preview</strong>
                        <div class="generator-preview-controls">
                            <label>Preview Rows
                                <input type="number" id="previewRowsCount" min="0" value="50">
                            </label>
                            <button id="previewDataButton">Preview</button>
                        </div>
                    </div>
                    <div id="generator-preview-grid" class="ag-theme-alpine"></div>
                </div>
            </section>
        `;

        this.populateFormatOptions();
    }

    populateFormatOptions(){
        const outputSelect = this.documentObj.getElementById("generatorOutputFormat");
        if(!outputSelect){
            return;
        }

        const orderedTypes = ["csv", "json", "markdown", "javascript", "dsv", "html", "gherkin", "asciitable"];
        orderedTypes.forEach((type) => {
            if(!this.exporter?.canExport?.(type) && this.exporter){
                return;
            }
            const option = this.documentObj.createElement("option");
            option.value = type;
            option.textContent = type.toUpperCase();
            outputSelect.appendChild(option);
        });
        outputSelect.value = "csv";
    }

    attachEventHandlers(){
        const addSchemaRowButton = this.documentObj.getElementById("addSchemaRowButton");
        addSchemaRowButton.addEventListener("click", () => {
            this.addRowAfter(this.schemaRows.length - 1);
        });

        const schemaModeToggleButton = this.documentObj.getElementById("schemaModeToggleButton");
        schemaModeToggleButton.addEventListener("click", () => this.toggleSchemaEditMode());

        const previewDataButton = this.documentObj.getElementById("previewDataButton");
        previewDataButton.addEventListener("click", () => this.previewData());

        const generateDataButton = this.documentObj.getElementById("generateDataButton");
        generateDataButton.addEventListener("click", () => this.generateDataFile());

        const schemaRowsContainer = this.documentObj.getElementById("generatorSchemaRows");
        schemaRowsContainer.addEventListener("input", (event) => this.handleRowInputChange(event));
        schemaRowsContainer.addEventListener("change", (event) => this.handleRowInputChange(event));
        schemaRowsContainer.addEventListener("click", (event) => this.handleRowButtonClick(event));
    }

    toggleSchemaEditMode(){
        if(this.isTextMode){
            const textArea = this.documentObj.getElementById("generatorSchemaText");
            const parsed = this.parseSchemaTextToRows(textArea?.value || "");
            if(parsed.errors.length > 0){
                this.alertFn(parsed.errors.join("\n"));
                return;
            }
            this.schemaRows = parsed.rows.length > 0 ? parsed.rows : [this.createBlankSchemaRow()];
            this.renderSchemaRows();
            this.isTextMode = false;
            this.updateSchemaEditModeView();
            return;
        }

        const textArea = this.documentObj.getElementById("generatorSchemaText");
        textArea.value = schemaRowsToSpec(this.schemaRows);
        this.isTextMode = true;
        this.updateSchemaEditModeView();
    }

    updateSchemaEditModeView(){
        const rowsContainer = this.documentObj.getElementById("generatorSchemaRows");
        const textContainer = this.documentObj.getElementById("generatorSchemaTextContainer");
        const footer = this.documentObj.querySelector(".generator-schema-footer");
        const toggleButton = this.documentObj.getElementById("schemaModeToggleButton");

        const inTextMode = this.isTextMode === true;
        rowsContainer.style.display = inTextMode ? "none" : "flex";
        textContainer.style.display = inTextMode ? "block" : "none";
        footer.style.display = inTextMode ? "none" : "block";
        toggleButton.textContent = inTextMode ? "Edit as Schema" : "Edit as Text";
    }

    parseSchemaTextToRows(schemaText){
        const text = String(schemaText ?? "");
        if(text.trim().length === 0){
            return { rows: [], errors: [] };
        }

        const generator = new this.TestDataGeneratorClass(this.faker, this.RandExp);
        generator.importSpec(text);
        generator.compile();
        if(!generator.isValid()){
            return { rows: [], errors: generator.errors() };
        }

        const rows = generator.testDataRules().map((rule) => this.ruleToSchemaRow(rule));
        return { rows, errors: [] };
    }

    ruleToSchemaRow(rule){
        const row = this.createBlankSchemaRow();
        row.name = String(rule?.name ?? "");
        row.sourceType = normaliseSourceType(rule?.type);

        if(row.sourceType === SOURCE_TYPE_FAKER){
            const parts = this.extractFakerCommandAndParams(rule?.ruleSpec);
            row.command = parts.command;
            row.params = parts.params;
            row.value = "";
            return row;
        }

        row.value = String(rule?.ruleSpec ?? "");
        row.command = "";
        row.params = "";
        return row;
    }

    extractFakerCommandAndParams(ruleSpec){
        const normalisedSpec = normaliseFakerCommand(String(ruleSpec ?? "").trim());
        for(const command of this.fakerCommandsLongestFirst){
            if(normalisedSpec === command){
                return { command, params: "" };
            }
            if(normalisedSpec.startsWith(command)){
                return {
                    command,
                    params: normalisedSpec.slice(command.length)
                };
            }
        }

        return { command: "", params: normalisedSpec };
    }

    renderSchemaRows(){
        const container = this.documentObj.getElementById("generatorSchemaRows");
        if(!container){
            return;
        }

        container.innerHTML = "";

        this.schemaRows.forEach((row, index) => {
            const isFakerSource = row.sourceType === SOURCE_TYPE_FAKER;
            const rowElem = this.documentObj.createElement("div");
            rowElem.className = "generator-schema-row";
            rowElem.setAttribute("data-row-id", row.id);
            rowElem.innerHTML = `
                <input type="text" data-field="name" placeholder="Column Name" value="${this.escapeHtml(row.name)}">
                <select data-field="sourceType">
                    <option value="${SOURCE_TYPE_FAKER}" ${row.sourceType === SOURCE_TYPE_FAKER ? "selected" : ""}>faker</option>
                    <option value="${SOURCE_TYPE_REGEX}" ${row.sourceType === SOURCE_TYPE_REGEX ? "selected" : ""}>regex</option>
                    <option value="${SOURCE_TYPE_LITERAL}" ${row.sourceType === SOURCE_TYPE_LITERAL ? "selected" : ""}>literal</option>
                </select>
                <select data-field="command" ${isFakerSource ? "" : "hidden disabled"}>
                    <option value="">Select faker command</option>
                    ${this.fakerCommands.map((command) => {
                        const selected = command === row.command ? "selected" : "";
                        return `<option value="${this.escapeHtml(command)}" ${selected}>${this.escapeHtml(command)}</option>`;
                    }).join("")}
                </select>
                <input type="text" data-field="params" placeholder="Params e.g. (10)" value="${this.escapeHtml(row.params)}" ${isFakerSource ? "" : "hidden disabled"}>
                <input type="text" data-field="value" placeholder="Value / Regex" value="${this.escapeHtml(row.value)}" ${isFakerSource ? "hidden disabled" : ""}>
                <div class="generator-row-actions">
                    <button class="icon-button" data-action="add" data-row-id="${row.id}" title="Add field">+</button>
                    <button class="icon-button" data-action="remove" data-row-id="${row.id}" title="Remove field">-</button>
                    <button class="icon-button" data-action="up" data-row-id="${row.id}" title="Move up" ${index === 0 ? "disabled" : ""}>↑</button>
                    <button class="icon-button" data-action="down" data-row-id="${row.id}" title="Move down" ${index === this.schemaRows.length - 1 ? "disabled" : ""}>↓</button>
                </div>
            `;
            container.appendChild(rowElem);
        });
    }

    handleRowInputChange(event){
        const rowElem = event.target.closest(".generator-schema-row");
        if(!rowElem){
            return;
        }

        const rowId = rowElem.getAttribute("data-row-id");
        const row = this.schemaRows.find((entry) => entry.id === rowId);
        if(!row){
            return;
        }

        const fieldName = event.target.getAttribute("data-field");
        if(!fieldName){
            return;
        }

        row[fieldName] = event.target.value;
        if(fieldName === "sourceType"){
            row.sourceType = normaliseSourceType(row.sourceType);
            this.renderSchemaRows();
        }
    }

    handleRowButtonClick(event){
        const action = event.target.getAttribute("data-action");
        if(!action){
            return;
        }

        const rowId = event.target.getAttribute("data-row-id");
        const index = this.schemaRows.findIndex((row) => row.id === rowId);
        if(index < 0){
            return;
        }

        if(action === "add"){
            this.addRowAfter(index);
            return;
        }
        if(action === "remove"){
            this.removeRow(index);
            return;
        }
        if(action === "up"){
            this.moveRow(index, -1);
            return;
        }
        if(action === "down"){
            this.moveRow(index, 1);
        }
    }

    addRowAfter(index){
        const insertAt = Math.min(Math.max(index + 1, 0), this.schemaRows.length);
        this.schemaRows.splice(insertAt, 0, this.createBlankSchemaRow());
        this.renderSchemaRows();
    }

    removeRow(index){
        if(this.schemaRows.length <= 1){
            this.schemaRows = [this.createBlankSchemaRow()];
        }else{
            this.schemaRows.splice(index, 1);
        }
        this.renderSchemaRows();
    }

    moveRow(index, direction){
        const targetIndex = index + direction;
        if(targetIndex < 0 || targetIndex >= this.schemaRows.length){
            return;
        }
        const [row] = this.schemaRows.splice(index, 1);
        this.schemaRows.splice(targetIndex, 0, row);
        this.renderSchemaRows();
    }

    parseRowCount(inputId){
        const inputElem = this.documentObj.getElementById(inputId);
        const rawValue = Number.parseInt(inputElem?.value, 10);
        if(Number.isNaN(rawValue) || rawValue < 0){
            return { value: 0, errors: [`${inputId} must be a number greater than or equal to zero.`] };
        }
        return { value: rawValue, errors: [] };
    }

    createConfiguredGenerator(){
        const { errors, rows } = validateSchemaRows(this.schemaRows);
        if(errors.length > 0){
            return { errors };
        }

        const generator = new this.TestDataGeneratorClass(this.faker, this.RandExp);
        generator.importSpec(schemaRowsToSpec(rows));
        generator.compile();

        const rules = generator.testDataRules();
        rows.forEach((row, index) => {
            const rule = rules[index];
            if(!rule){
                return;
            }
            if(row.sourceType === SOURCE_TYPE_FAKER){
                rule.type = SOURCE_TYPE_FAKER;
                rule.ruleSpec = buildRuleSpecFromSchemaRow(row);
                return;
            }
            if(row.sourceType === SOURCE_TYPE_LITERAL){
                rule.type = SOURCE_TYPE_LITERAL;
                rule.ruleSpec = row.value;
                return;
            }
            rule.type = SOURCE_TYPE_REGEX;
            rule.ruleSpec = row.value;
        });

        generator.compiler.validate();
        if(!generator.isValid()){
            return { errors: generator.errors() };
        }

        return { generator };
    }

    buildDataTable(generator, rowCount){
        const dataTable = new GenericDataTable();
        dataTable.setHeaders(generator.generateHeadersArray());
        for(let row = 0; row < rowCount; row++){
            dataTable.appendDataRow(generator.generateRow());
        }
        return dataTable;
    }

    previewData(){
        const rowCount = this.parseRowCount("previewRowsCount");
        if(rowCount.errors.length > 0){
            this.alertFn(rowCount.errors.join("\n"));
            return;
        }

        const configured = this.createConfiguredGenerator();
        if(configured.errors?.length > 0){
            this.alertFn(configured.errors.join("\n"));
            return;
        }

        const dataTable = this.buildDataTable(configured.generator, rowCount.value);
        this.previewGrid.setGridFromGenericDataTable(dataTable);
    }

    generateDataFile(){
        const rowCount = this.parseRowCount("generateRowsCount");
        if(rowCount.errors.length > 0){
            this.alertFn(rowCount.errors.join("\n"));
            return;
        }

        const configured = this.createConfiguredGenerator();
        if(configured.errors?.length > 0){
            this.alertFn(configured.errors.join("\n"));
            return;
        }

        const type = this.documentObj.getElementById("generatorOutputFormat").value;
        if(!this.exporter.canExport(type)){
            this.alertFn(`Output format ${type} is not supported.`);
            return;
        }

        const dataTable = this.buildDataTable(configured.generator, rowCount.value);
        const text = this.exporter.getDataTableAs(type, dataTable);
        const filename = `generated-data${this.exporter.getFileExtensionFor(type)}`;
        const downloader = new this.DownloadClass(filename);
        downloader.downloadFile(text);
    }

    escapeHtml(value){
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll("\"", "&quot;");
    }
}

export {
    DataGeneratorPage,
    buildRuleSpecFromSchemaRow,
    schemaRowsToSpec,
    validateSchemaRows,
    normaliseFakerCommand
};
