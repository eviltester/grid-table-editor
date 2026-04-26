/*
  Definition data is of the format:

  rulename
  regex
  rulename
  regex

 */

/*
  Useful Regex Templates:

  https://projects.lukehaas.me/regexhub/
  https://www.regular-expressions.info/examples.html
  http://fent.github.io/randexp.js/

 */

// TODO :wrap this as a class and make components
// Also this is too AG Grid specific

import {TestDataGenerator} from '../data_generation/testDataGenerator.js';
import {Debouncer} from '../utils/debouncer.js';
import {GridExtension as AgGridExtension} from './data-grid-editor/ag-grid/gridExtension-ag-grid.js';
import {GridExtension as TabulatorGridExtension} from './data-grid-editor/tabulator/gridExtension-tabulator.js';
import { SelectFilterEditor} from './data-grid-editor/ag-grid/select-filter-editor.js';
import { TEST_DATA_MODES, createAmendedTable, createTableFromGenerator, normaliseCount } from './test-data-amend.js';

import { faker } from "https://cdn.skypack.dev/@faker-js/faker@v9.7.0";

var debouncer = new Debouncer();
let importer=undefined;
let exportControls=undefined;
let mainGridExtras=undefined;
let testDataStatusResetTimeoutId = null;
let activeDefnCellEdit = null;

function getRulesParserFromTextArea(){

    // faker imported in script.js
    // RandExp brought in via index.html script
    const generator = new TestDataGenerator(faker, RandExp);
    const areaText = document.getElementById('testdatadefntext').value;
    generator.importSpec(areaText);
    generator.compile();
    console.log(generator.compilationReport());

    return generator;

}

// https://www.npmjs.com/package/randexp
async function generateTestData(){


    debouncer.clear("populateTestDataGrid");
    syncSchemaTextFromGridBeforeGenerate();
    const generateButton = document.getElementById("generatedata");
    setTestDataStatus("Validating schema...", true);
    if(generateButton){
        generateButton.disabled = true;
    }

    try{
        const desiredRowCountRaw = document.getElementById('generateCount').value;
        const desiredRowCountParsed = Number.parseInt(desiredRowCountRaw, 10);
        const desiredRowCount = normaliseCount(desiredRowCountRaw);
        const generationMode = getGenerationMode();

        const generator = getRulesParserFromTextArea();

        if(!generator.isValid()){
            console.log(generator.errors());
            alert(generator.errors().join("\n"));
            setTestDataStatus("Schema validation failed.", false);
            return;
        }

        if(!Number.isFinite(desiredRowCountParsed) || desiredRowCountParsed < 0){
            alert("Enter how many rows to generate.");
            setTestDataStatus("Invalid row count.", false);
            return;
        }

        await yieldToUi();
        setTestDataStatus(generationMode === TEST_DATA_MODES.NEW_TABLE ? "Generating rows..." : "Preparing table amend...", true);
        await yieldToUi();

        let dataTable;
        if(generationMode === TEST_DATA_MODES.NEW_TABLE){
            dataTable = createTableFromGenerator(desiredRowCount, generator);
        }else{
            const gridExtras = getMainGridExtras();
            if(!gridExtras){
                alert("Grid interface unavailable for amend mode.");
                setTestDataStatus("Grid interface unavailable.", false);
                return;
            }

            const selectedRowIndexes = generationMode === TEST_DATA_MODES.AMEND_SELECTED ?
                gridExtras.getSelectedRowIndexes() :
                [];

            // Fast path for Tabulator (and any engine that supports direct amend):
            // update only targeted rows/columns without full table export/import.
            if(typeof gridExtras.applyGeneratedSchemaAmend === "function"){
                setTestDataStatus("Amending rows...", true);
                await yieldToUi();
                const directAmendResult = await Promise.resolve(gridExtras.applyGeneratedSchemaAmend({
                    mode: generationMode,
                    desiredRowCount,
                    schemaHeaders: generator.generateHeadersArray(),
                    generateRow: () => generator.generateRow(),
                    selectedRowIndexes
                }));

                if(generationMode === TEST_DATA_MODES.AMEND_SELECTED && directAmendResult?.noSelectedRows){
                    alert("No rows selected.");
                    setTestDataStatus("No selected rows to amend.", false);
                    return;
                }

                dataTable = null;
            }else{
                const currentDataTable = gridExtras.getGridAsGenericDataTable();
                const amendResult = createAmendedTable({
                    mode: generationMode,
                    desiredRowCount,
                    generator,
                    currentDataTable,
                    selectedRowIndexes
                });

                if(generationMode === TEST_DATA_MODES.AMEND_SELECTED && amendResult.noSelectedRows){
                    alert("No rows selected.");
                    setTestDataStatus("No selected rows to amend.", false);
                    return;
                }

                dataTable = amendResult.dataTable;
            }
        }

        if(dataTable){
            setTestDataStatus("Applying data to grid...", true);
            await yieldToUi();
            await Promise.resolve(importer.setGridFromGenericDataTable(dataTable));
        }

        const completedModeLabel = generationMode === TEST_DATA_MODES.NEW_TABLE ? "Generate" : "Amend";
        setTestDataStatus(`${completedModeLabel} complete. Refresh text preview if needed.`, false);
    }catch(error){
        console.error("Generate/amend failed", error);
        setTestDataStatus("Generate failed. Check console for details.", false);
        alert("Generate failed. Check console for details.");
    }finally{
        if(generateButton){
            generateButton.disabled = false;
        }
    }

}

async function refreshTestDataPreview(){
    if(!exportControls){
        return;
    }
    const refreshButton = document.getElementById("refreshtestdatapreview");
    clearPendingTestDataStatusReset();
    setTestDataStatus("Refreshing text preview...", true);
    if(refreshButton){
        refreshButton.disabled = true;
    }

    try{
        await yieldToUi();
        await Promise.resolve(exportControls.renderTextFromGrid());
        setTestDataStatus("Text preview refreshed.", false);
        scheduleTestDataStatusReset();
    }catch(error){
        console.error("Failed to refresh text preview", error);
        setTestDataStatus("Text preview refresh failed. Check console for details.", false);
    }finally{
        if(refreshButton){
            refreshButton.disabled = false;
        }
    }
}

function syncSchemaTextFromGridBeforeGenerate(){
    // Tabulator keeps editor value in-flight until edit is committed; blur first so
    // clicking Generate while typing still captures the latest schema values.
    if(typeof document !== "undefined" && typeof document.activeElement?.blur === "function"){
        document.activeElement.blur();
    }

    if(defnGridBridge){
        convertGridToText();
    }
}

function getMainGridExtras(){
    return mainGridExtras || importer?.gridExtensions;
}

function getGenerationMode(){
    const selectedOption = document.querySelector('input[name="testDataGenerationMode"]:checked');
    if(!selectedOption){
        return TEST_DATA_MODES.NEW_TABLE;
    }
    return selectedOption.value;
}

function setGenerateCountToCurrentRows(){
    const gridExtras = getMainGridExtras();
    if(!gridExtras){
        return;
    }
    document.getElementById("generateCount").value = gridExtras.getRowCount();
}

function setGenerateCountToSelectedRows(){
    const gridExtras = getMainGridExtras();
    if(!gridExtras){
        return;
    }
    document.getElementById("generateCount").value = gridExtras.getSelectedRowIndexes().length;
}

function applyModeDefaultRowCount(mode){
    if(mode === TEST_DATA_MODES.AMEND_TABLE){
        setGenerateCountToCurrentRows();
        return;
    }
    if(mode === TEST_DATA_MODES.AMEND_SELECTED){
        setGenerateCountToSelectedRows();
    }
}

function setTestDataStatus(message, isLoading){
    const statusElement = document.getElementById("testdata-status");
    if(!statusElement){
        return;
    }
    statusElement.textContent = message || "";
    statusElement.style.display = message ? "inline-block" : "none";
    statusElement.classList.toggle("is-loading", isLoading === true);
}

function clearPendingTestDataStatusReset(){
    if(testDataStatusResetTimeoutId === null){
        return;
    }
    clearTimeout(testDataStatusResetTimeoutId);
    testDataStatusResetTimeoutId = null;
}

function scheduleTestDataStatusReset(delayMs = 1800){
    clearPendingTestDataStatusReset();
    testDataStatusResetTimeoutId = setTimeout(() => {
        setTestDataStatus("", false);
        testDataStatusResetTimeoutId = null;
    }, delayMs);
}

function yieldToUi(){
    return new Promise((resolve) => {
        if(typeof requestAnimationFrame !== "function"){
            setTimeout(resolve, 0);
            return;
        }
        requestAnimationFrame(() => setTimeout(resolve, 0));
    });
}

function createTestDataGrid(){

    var gridDiv = document.querySelector('#defngrid');
    const editorPaneHeight = '220px';
    gridDiv.style.height = editorPaneHeight;
    gridDiv.style.width = '70%';
    setupTestDataEditGrid(gridDiv);

    var textEdit = document.querySelector(".defn-text-container");
    textEdit.style.width = defnGridApi ? "30%" : "100%";
    textEdit.style.paddingTop = "0";
    textEdit.style.height = editorPaneHeight;
    textEdit.style.display = "flex";
    textEdit.style.flexDirection = "column";

    const textHeading = textEdit.querySelector("p");
    if(textHeading){
        textHeading.style.margin = "0 0 0.4rem 0";
    }

    const textArea = textEdit.querySelector("textarea");
    if(textArea){
        textArea.style.flex = "1";
        textArea.style.width = "100%";
        textArea.style.height = "100%";
        textArea.style.boxSizing = "border-box";
    }

    var zone = document.querySelector(".defn-edit-zone");
    zone.style.height = editorPaneHeight;
    zone.style.display = "flex";
    zone.style.alignItems = "flex-start";
    zone.style.gap = "0.75rem";

}


// todo: this all really needs to be wrapped in a class
var defnGridOptions;
var defnGridApi;
var defnGridExtras;
var defnGridBridge;

// populate Test Data Grid From Rules in Text Area
function populateTestDataGridFromRules(){
    if(!defnGridBridge){
        return;
    }

    const generator = getRulesParserFromTextArea();

    if(!generator.isValid()){
        return;
    }

    // clear data then add rules
    defnGridBridge.clearRows();

    const rowsToAdd = [];
    for(let rule of generator.testDataRules()){
        let data={};
        data.columnName = rule.name;
        if(rule.type=="faker"){
            // remove faker.
            let fakerFreeRule = rule.ruleSpec;
                if(fakerFreeRule.startsWith("faker.")){
                    fakerFreeRule= fakerFreeRule.replace("faker.","");
                }
            const fakerCommand = findFakerCommand(fakerFreeRule);
            if(fakerCommand==""){
                console.log(`Unknown faker command in ruleSpec ${fakerFreeRule}`)
                data.type = "";
                data.value=fakerFreeRule;
            }else{
                data.type = fakerCommand;
                data.value=fakerFreeRule.replace(fakerCommand,"");
            }

        }else{
            data.type = "RegEx";
            data.value = rule.ruleSpec;            
        }

        rowsToAdd.push(data);
    }
    defnGridBridge.addRows(rowsToAdd);
}

const KNOWN_FAKER_COMMANDS = ['RegEx',
            
                // v9.7.0
                //"_randomizer.next","_randomizer.seed",
                "datatype.boolean",
                "date.month","date.weekday","date.timeZone","date.anytime","date.past","date.future","date.between","date.betweens","date.recent","date.soon","date.birthdate",
                // Some helpers work just fine
                "helpers.fake","helpers.mustache","helpers.fromRegExp","helpers.maybe","helpers.arrayElement", "helpers.slugify","helpers.replaceSymbols",
                "helpers.replaceCreditCardSymbols","helpers.shuffle","helpers.uniqueArray",
                "helpers.weightedArrayElement","helpers.arrayElements","helpers.rangeToNumber","helpers.multiple",
                // "helpers.objectKey","helpers.objectValue","helpers.objectEntry","helpers.enumValue",
                "number.int","number.float","number.binary","number.octal","number.hex","number.bigInt","number.romanNumeral",
                "string.fromCharacters","string.alpha","string.alphanumeric","string.binary","string.octal","string.hexadecimal","string.numeric","string.sample","string.uuid","string.ulid","string.nanoid","string.symbol",
                "airline.airport","airline.airline","airline.airplane","airline.recordLocator","airline.seat","airline.aircraftType","airline.flightNumber",
                "animal.dog","animal.cat","animal.snake","animal.bear","animal.lion","animal.cetacean","animal.horse","animal.bird","animal.cow","animal.fish","animal.crocodilia","animal.insect","animal.rabbit","animal.rodent","animal.type","animal.petName",
                "book.author","book.format","book.genre","book.publisher","book.series","book.title",
                "color.human","color.space","color.cssSupportedFunction","color.cssSupportedSpace","color.rgb","color.cmyk","color.hsl","color.hwb","color.lab","color.lch","color.colorByCSSColorSpace",
                "commerce.department","commerce.productName","commerce.price","commerce.productAdjective","commerce.productMaterial","commerce.product","commerce.productDescription","commerce.isbn",
                "company.name","company.catchPhrase","company.buzzPhrase","company.catchPhraseAdjective","company.catchPhraseDescriptor","company.catchPhraseNoun","company.buzzAdjective","company.buzzVerb","company.buzzNoun",
                "database.column","database.type","database.collation","database.engine","database.mongodbObjectId",
                "finance.accountNumber","finance.accountName","finance.routingNumber","finance.maskedNumber","finance.amount","finance.transactionType","finance.currency","finance.currencyCode","finance.currencyName","finance.currencySymbol","finance.currencyNumericCode","finance.bitcoinAddress","finance.litecoinAddress","finance.creditCardNumber","finance.creditCardCVV","finance.creditCardIssuer","finance.pin","finance.ethereumAddress","finance.iban","finance.bic","finance.transactionDescription",
                "food.adjective","food.description","food.dish","food.ethnicCategory","food.fruit","food.ingredient","food.meat","food.spice","food.vegetable",
                "git.branch","git.commitEntry","git.commitMessage","git.commitDate","git.commitSha",
                "hacker.abbreviation","hacker.adjective","hacker.noun","hacker.verb","hacker.ingverb","hacker.phrase",
                "image.avatar","image.avatarGitHub","image.personPortrait","image.avatarLegacy","image.url","image.urlLoremFlickr","image.urlPicsumPhotos","image.urlPlaceholder","image.dataUri",
                "internet.email","internet.exampleEmail","internet.userName","internet.username","internet.displayName","internet.protocol","internet.httpMethod","internet.httpStatusCode","internet.url","internet.domainName","internet.domainSuffix","internet.domainWord","internet.ip","internet.ipv4","internet.ipv6","internet.port","internet.userAgent","internet.color","internet.mac","internet.password","internet.emoji","internet.jwtAlgorithm","internet.jwt",
                "location.zipCode","location.city","location.buildingNumber","location.street","location.streetAddress","location.secondaryAddress","location.county","location.country","location.continent","location.countryCode","location.state","location.latitude","location.longitude","location.direction","location.cardinalDirection","location.ordinalDirection","location.nearbyGPSCoordinate","location.timeZone","location.language",
                "lorem.word","lorem.words","lorem.sentence","lorem.slug","lorem.sentences","lorem.paragraph","lorem.paragraphs","lorem.text","lorem.lines",
                "music.album","music.artist","music.genre","music.songName",
                "person.firstName","person.lastName","person.middleName","person.fullName","person.gender","person.sex","person.sexType","person.bio","person.prefix","person.suffix","person.jobTitle","person.jobDescriptor","person.jobArea","person.jobType","person.zodiacSign",
                "phone.number","phone.imei",
                "science.chemicalElement","science.unit",
                "system.fileName","system.commonFileName","system.mimeType","system.commonFileType","system.commonFileExt","system.fileType","system.fileExt","system.directoryPath","system.filePath","system.semver","system.networkInterface","system.cron",
                "vehicle.vehicle","vehicle.manufacturer","vehicle.model","vehicle.type","vehicle.fuel","vehicle.vin","vehicle.color","vehicle.vrm","vehicle.bicycle",
                "word.adjective","word.adverb","word.conjunction","word.interjection","word.noun","word.preposition","word.verb","word.sample","word.words",
            ];

const FAKER_COMMANDS = []; 

// TODO: add fakerCommand to the TestDataRule already parsed out
function findFakerCommand(aString){
    for(let command of FAKER_COMMANDS){
        if(aString.startsWith(command)){
            return command;
        }
    }
    return null;
}


function identifyFakerCommands(aFaker){
    
   FAKER_COMMANDS.length = 0;

   // add our internal values
   FAKER_COMMANDS.push('RegEx');

   // any classes of commands that do not work? e.g. definitions, helpers used to be bad
   const skipKeys = [];

   // faker commands that we know will not work well for test data generation
   const skipValues = [
        "_randomizer.next","_randomizer.seed",
        "helpers.objectKey","helpers.objectValue","helpers.objectEntry","helpers.enumValue",
    ];

    let fakerKeys = Object.keys(faker);
    fakerKeys.forEach(k=>{
        Object.getOwnPropertyNames(faker[k]).
            filter(item => {return typeof faker[k][item] === 'function'})
            .forEach(
                k2 => {
                    if(skipKeys.includes(k) || skipValues.includes(`${k}.${k2}`)){
                        // ignore this value
                        console.log(`expected: ignoring known faker command ${k}.${k2}`)
                    }else{
                        // add the valid function
                        FAKER_COMMANDS.push(`${k}.${k2}`)
                    }
                }
            )
    });

    // copy paste into KNOWN_FAKER_COMMANDS when updating a faker version after tesitng for new exclusions and removals
    // console.log(FAKER_COMMANDS);

    // Sanity check
    let sanityCheckCommands = KNOWN_FAKER_COMMANDS.slice();
    FAKER_COMMANDS.forEach((command) => {
        let foundIndex = sanityCheckCommands.indexOf(command);
        if(foundIndex == -1){
            // new command found
            console.log("unexpected: Found new Faker command " + command);
        }else{
            sanityCheckCommands[foundIndex] = "";
        }
    });

    sanityCheckCommands.filter(value => {return value.length > 0}).forEach(value => console.log("unexpected: Previously known faker command not present: " + value));
}


function setupTestDataEditGrid(gridDiv){
    const tableDiv = document.createElement("div");
    tableDiv.style.height = "160px";
    tableDiv.style.width = "100%";
    gridDiv.appendChild(tableDiv);

    const addNewRowButton = document.createElement("button");
    addNewRowButton.innerText = "+ Add Column";
    gridDiv.appendChild(addNewRowButton);

    const deleteRowsButton = document.createElement("button");
    deleteRowsButton.innerText = " - Delete Selected";
    gridDiv.appendChild(deleteRowsButton);

    if(typeof agGrid !== "undefined" && typeof agGrid.createGrid === "function"){
        setupAgGridDefnEditor(tableDiv);
    }else if(typeof Tabulator !== "undefined"){
        setupTabulatorDefnEditor(tableDiv);
    }else{
        console.warn("No supported grid library loaded; test data definition grid editor disabled.");
        return;
    }

    addNewRowButton.addEventListener('click', function(){
        if(!defnGridBridge){
            return;
        }
        defnGridBridge.addRows([{columnName: "", type:"RegEx", value:""}]);
        convertGridToText();
    });

    deleteRowsButton.addEventListener('click', function(){
        if(!defnGridExtras){
            return;
        }
        defnGridExtras.deleteSelectedRows();
        convertGridToText();
    });
}

function setupAgGridDefnEditor(tableDiv){
    const defnRowData = [];
    const defnColumnDefs = [
        {field: "columnName"},
        {
            field: "type",
            cellEditor: SelectFilterEditor,
            cellEditorParams: {values: FAKER_COMMANDS}
        },
        {field: "value"}
    ];

    defnGridOptions = {
        columnDefs: defnColumnDefs,
        rowData: defnRowData,
        defaultColDef: {
            wrapText: true,
            autoHeight: true,
            resizable: true,
            editable: true,
            rowDrag: true,
            sortable: false
        },
        suppressMovableColumns: true,
        rowDragManaged: true,
        rowDragMultiRow: true,
        rowSelection: {
            mode: "multiRow",
            checkboxes: false,
            headerCheckbox: false,
            enableClickSelection: true
        },
        onCellEditingStopped: () => { convertGridToText(); },
        onRowDragEnd: () => { convertGridToText(); }
    };

    tableDiv.classList.add("ag-theme-alpine");
    defnGridApi = agGrid.createGrid(tableDiv, defnGridOptions);
    defnGridExtras = new AgGridExtension(defnGridApi);
    defnGridBridge = {
        clearRows: () => defnGridApi.setGridOption("rowData", []),
        addRows: (rows) => {
            if(rows && rows.length>0){
                defnGridApi.applyTransaction({add: rows});
            }
        },
        getRows: () => {
            const rows = [];
            defnGridApi.forEachNode((rowNode) => rows.push({...rowNode.data}));
            return rows;
        }
    };
}

function setupTabulatorDefnEditor(tableDiv){
    defnGridApi = new Tabulator(tableDiv, {
        data: [],
        columns: [
            {title: "columnName", field: "columnName", editor: "input"},
            {
                title: "type",
                field: "type",
                editor: "list",
                editorParams: {values: FAKER_COMMANDS}
            },
            {title: "value", field: "value", editor: "input"}
        ],
        selectableRows: true,
        movableRows: true,
        columnDefaults: {resizable: true},
        cellEditing: (cell) => { beginTabulatorDraftTracking(cell); },
        cellEdited: () => { convertGridToText(); },
        rowMoved: () => { convertGridToText(); }
    });

    tableDiv.addEventListener("focusout", () => {
        setTimeout(() => {
            clearTabulatorDraftTracking();
            convertGridToText();
        }, 0);
    });

    tableDiv.addEventListener("change", () => {
        setTimeout(() => {
            clearTabulatorDraftTracking();
            convertGridToText();
        }, 0);
    });

    defnGridExtras = new TabulatorGridExtension(defnGridApi);
    defnGridBridge = {
        clearRows: () => defnGridApi.setData([]),
        addRows: (rows) => {
            if(rows && rows.length>0){
                defnGridApi.addData(rows);
            }
        },
        getRows: () => defnGridApi.getData()
    };
}

function beginTabulatorDraftTracking(cell){
    setTimeout(() => {
        const editorElement = cell?.getElement?.()?.querySelector?.("input, select, textarea");
        const rowData = cell?.getRow?.()?.getData?.();
        const field = cell?.getField?.() || cell?.getColumn?.()?.getDefinition?.()?.field;
        if(!editorElement || !rowData || !field){
            return;
        }

        activeDefnCellEdit = {
            field,
            rowData,
            value: editorElement.value ?? ""
        };

        const pushDraftValueToText = () => {
            if(activeDefnCellEdit?.rowData !== rowData || activeDefnCellEdit?.field !== field){
                return;
            }
            activeDefnCellEdit.value = editorElement.value ?? "";
            convertGridToText();
        };

        editorElement.addEventListener("input", pushDraftValueToText);
        editorElement.addEventListener("change", pushDraftValueToText);
        pushDraftValueToText();
    }, 0);
}

function clearTabulatorDraftTracking(){
    activeDefnCellEdit = null;
}

function convertGridToText(){
    if(!defnGridBridge){
        return;
    }

    let outputText = "";
    let prefix = "";
    defnGridBridge.getRows().forEach((rowData) => {
        const resolvedRowData = activeDefnCellEdit?.rowData === rowData ?
            {...rowData, [activeDefnCellEdit.field]: activeDefnCellEdit.value} :
            rowData;
        outputText = outputText + prefix;
        outputText = outputText + (resolvedRowData.columnName || "") + "\n";

        switch(resolvedRowData.type){
            case "RegEx":
                outputText = outputText + (resolvedRowData.value || "");
                break;
            // TODO Literal
            default:
                let dataType = resolvedRowData.type || "";
                if(dataType.startsWith("faker.")){
                    dataType= dataType.replace("faker.","");
                }
                if(FAKER_COMMANDS.includes(dataType)){
                    outputText = outputText + dataType + (resolvedRowData.value || "");
                }else{
                    // throw error? ignore? don't know what the command is so it won't parse
                    // ignoring
                    console.log(`UNKNOWN COMMAND: ${dataType} ${resolvedRowData.value}`)
                }
        }
        prefix="\n";
    });

    document.getElementById("testdatadefntext").value = outputText;
}


function enableTestDataGenerationInterface(parentId, anImporter, theExportControls, aGridExtras){


    // dynamically setup the faker commands from loaded library
    // and check for any changes
    identifyFakerCommands(faker);

    importer = anImporter;
    exportControls = theExportControls;
    mainGridExtras = aGridExtras;

    let parentElem = document.getElementById(parentId);
    parentElem.innerHTML = `
        <div>
            <button id="generatedata">Generate</button>
            <button id="refreshtestdatapreview">Refresh Text Preview</button>
            <label> How Many?<input type="number" id="generateCount"/></label>
            <label><input type="radio" name="testDataGenerationMode" value="${TEST_DATA_MODES.NEW_TABLE}" checked>New Table</label>
            <label><input type="radio" name="testDataGenerationMode" value="${TEST_DATA_MODES.AMEND_TABLE}">Amend Table</label>
            <label><input type="radio" name="testDataGenerationMode" value="${TEST_DATA_MODES.AMEND_SELECTED}">Amend Selected</label>
            <span id="testdata-status" class="import-progress-status" style="display:none;" aria-live="polite"></span>
        </div>
        <div class="defn-edit-zone">
            <div class="defn-grid-container" id="defngrid" class="ag-theme-alpine">
            </div>
            <div class="defn-text-container">
                <p>Test Data Text Schema</p>
                <textarea class="testDataDefn" name="testdatadefntext" id="testdatadefntext"></textarea>
            </div>
        </div>
    `;

    var element = document.querySelector("#generatedata");
    element.addEventListener('click', generateTestData, false);
    document.querySelector("#refreshtestdatapreview").addEventListener("click", refreshTestDataPreview, false);

    const generateCountInput = document.getElementById("generateCount");
    generateCountInput.value = "1";

    parentElem.querySelectorAll('input[name="testDataGenerationMode"]').forEach((modeRadio) => {
        modeRadio.addEventListener("change", () => {
            if(!modeRadio.checked){
                return;
            }
            applyModeDefaultRowCount(modeRadio.value);
        });
    });

    createTestDataGrid();

    var inputarea = document.getElementById('testdatadefntext');
    // https://stackoverflow.com/questions/2823733/textarea-onchange-detection/14029861?noredirect=1#comment19596202_14029861

    inputarea.addEventListener('input', function() {
          // debounce a call to set the grid from the text area
          debouncer.debounce("populateTestDataGrid", populateTestDataGridFromRules, 1000);
    }, false);
};

export {enableTestDataGenerationInterface}
