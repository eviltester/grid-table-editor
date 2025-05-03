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

import {RulesParser} from '../data_generation/testDataRules.js';
import {Debouncer} from '../utils/debouncer.js';
import {GridExtension} from '../grid/gridExtension.js';
import { SelectFilterEditor} from '../grid/select-filter-editor.js';

import { faker } from "https://cdn.skypack.dev/@faker-js/faker@v9.7.0";

var debouncer = new Debouncer();
let importer=undefined;
let exportControls=undefined;

function getRulesParserFromTextArea(){

    // faker imported in script.js
    // RandExp brought in via index.html script
    const rulesParser = new RulesParser(faker, RandExp);
    const areaText = document.getElementById('testdatadefntext').value;
    rulesParser.parseText(areaText);

    return rulesParser;

}

// https://www.npmjs.com/package/randexp
function generateTestData(){


    debouncer.clear("populateTestDataGrid");

    const desiredRowCount = document.getElementById('generateCount').value;

    const rulesParser = getRulesParserFromTextArea();
    if(!rulesParser.isValid()){
        console.log(rulesParser.errors);
        alert(rulesParser.errors.join("\n"));
        return;
    }

    if(desiredRowCount<0){
        alert("Enter how many rows to generate.");
        return;
    }

    // TODO : it would lower memory requirements if we did
    // this in tranches of 100 and appended the transaction as we go

    
    // generate
    const data = rulesParser.generate(desiredRowCount);

    // add data to table
    importer.setGridFromData(data);

    // and refresh the export
    exportControls.renderTextFromGrid();

    // set the grid to use the rules
    populateTestDataGridFromRules();

}

function createTestDataGrid(){

    var gridDiv = document.querySelector('#defngrid');
    gridDiv.style.height = '200px';
    gridDiv.style.width = '70%';
    gridDiv.classList.add("ag-theme-alpine");
    setupTestDataEditGrid(gridDiv);

    var textEdit = document.querySelector(".defn-text-container");
    textEdit.style.width="30%";

    var zone = document.querySelector(".defn-edit-zone");
    zone.style.height = "250px";

}


var defnGridOptions;

// populate Test Data Grid From Rules in Text Area
function populateTestDataGridFromRules(){

    const rulesParser = getRulesParserFromTextArea();

    if(!rulesParser.isValid()){
        return;
    }

    // clear data
    // now add the rules
    defnGridOptions.api.setRowData([]);

    for(let rule of rulesParser.testDataRules.rules){
        let data={};
        data.columnName = rule.name;
        if(rule.type=="faker"){
            if(rule.ruleSpec.startsWith("fake ")){
                data.type = "fake";
                data.value= rule.ruleSpec.replace("fake ","");
            }else{
                data.type = rule.ruleSpec;
                data.value="";
            }

        }else{
            data.type = "RegEx";
            data.value = rule.ruleSpec;            
        }

        // todo, should be a bigger transaction for efficiency
        defnGridOptions.api.applyTransaction({add: [data]},)
    }

}

function setupTestDataEditGrid(gridDiv){


    const defnRowData = [];

    /* for version 9 use https://fakerjs.dev/playground/

    let codegen="";
    let lastK="";
    let skipKeys = ["definitions", "helpers"];
    let skipValues = ["mersenne.seed", "mersenne.seed_array"];
    let fakerKeys = Object.keys(faker);
    fakerKeys.forEach(k=>{
        Object.getOwnPropertyNames(faker[k]).
             filter(item => {return typeof faker[k][item] === 'function'})
             .forEach(
                 k2 => {
                     if(lastK!=k){
                         codegen=codegen+"\n";
                         lastK=k;
                         if(skipKeys.includes(k)){
                             codegen=codegen+"// ";
                         }
                     }
                     let eol = "";
                     if(skipValues.includes(`${k}.${k2}`)){
                         codegen=codegen+"\n// ";
                         eol = "\n";
                     }
                     codegen=codegen+`"${k}.${k2}",${eol}`;
                    }
             )
    });
    console.log(codegen);

    */
    const defnColumnDefs = [
        {
            field: 'columnName',

        },
        {   field: 'type',
            cellEditor: SelectFilterEditor,
            cellEditorParams: {
                values: ['RegEx', "fake",
                // "mersenne.rand",
                // // "mersenne.seed",
                // // "mersenne.seed_array",
                // "random.word","random.words","random.locale","random.alpha","random.alphaNumeric","random.numeric",
                // // "helpers.slugify","helpers.replaceSymbolWithNumber","helpers.replaceSymbols","helpers.replaceCreditCardSymbols","helpers.repeatString","helpers.regexpStyleStringParse","helpers.shuffle","helpers.uniqueArray","helpers.mustache","helpers.maybe","helpers.objectKey","helpers.objectValue","helpers.arrayElement","helpers.arrayElements",
                // "datatype.number","datatype.float","datatype.datetime","datatype.string","datatype.uuid","datatype.boolean","datatype.hexadecimal","datatype.json","datatype.array","datatype.bigInt",
                // "address.zipCode","address.zipCodeByState","address.city","address.cityPrefix","address.citySuffix","address.cityName","address.buildingNumber","address.street","address.streetName","address.streetAddress","address.streetSuffix","address.streetPrefix","address.secondaryAddress","address.county","address.country","address.countryCode","address.state","address.stateAbbr","address.latitude","address.longitude","address.direction","address.cardinalDirection","address.ordinalDirection","address.nearbyGPSCoordinate","address.timeZone",
                // "animal.dog","animal.cat","animal.snake","animal.bear","animal.lion","animal.cetacean","animal.horse","animal.bird","animal.cow","animal.fish","animal.crocodilia","animal.insect","animal.rabbit","animal.type",
                // "color.human","color.space","color.cssSupportedFunction","color.cssSupportedSpace","color.rgb","color.cmyk","color.hsl","color.hwb","color.lab","color.lch","color.colorByCSSColorSpace",
                // "commerce.color","commerce.department","commerce.productName","commerce.price","commerce.productAdjective","commerce.productMaterial","commerce.product","commerce.productDescription",
                // "company.suffixes","company.companyName","company.companySuffix","company.catchPhrase","company.bs","company.catchPhraseAdjective","company.catchPhraseDescriptor","company.catchPhraseNoun","company.bsAdjective","company.bsBuzz","company.bsNoun",
                // "database.column","database.type","database.collation","database.engine","database.mongodbObjectId",
                // "date.past","date.future","date.between","date.betweens","date.recent","date.soon","date.month","date.weekday","date.birthdate",
                // "finance.account","finance.accountName","finance.routingNumber","finance.mask","finance.amount","finance.transactionType","finance.currencyCode","finance.currencyName","finance.currencySymbol","finance.bitcoinAddress","finance.litecoinAddress","finance.creditCardNumber","finance.creditCardCVV","finance.creditCardIssuer","finance.pin","finance.ethereumAddress","finance.iban","finance.bic","finance.transactionDescription",
                // "git.branch","git.commitEntry","git.commitMessage","git.commitSha","git.shortSha",
                // "hacker.abbreviation","hacker.adjective","hacker.noun","hacker.verb","hacker.ingverb","hacker.phrase",
                // "image.image","image.avatar","image.imageUrl","image.abstract","image.animals","image.business","image.cats","image.city","image.food","image.nightlife","image.fashion","image.people","image.nature","image.sports","image.technics","image.transport","image.dataUri",
                // "internet.avatar","internet.email","internet.exampleEmail","internet.userName","internet.protocol","internet.httpMethod","internet.httpStatusCode","internet.url","internet.domainName","internet.domainSuffix","internet.domainWord","internet.ip","internet.ipv4","internet.ipv6","internet.port","internet.userAgent","internet.color","internet.mac","internet.password","internet.emoji",
                // "lorem.word","lorem.words","lorem.sentence","lorem.slug","lorem.sentences","lorem.paragraph","lorem.paragraphs","lorem.text","lorem.lines",
                // "music.genre","music.songName",
                // "name.firstName","name.lastName","name.middleName","name.findName","name.gender","name.prefix","name.suffix","name.jobTitle","name.jobDescriptor","name.jobArea","name.jobType",
                // "phone.phoneNumber","phone.phoneNumberFormat","phone.phoneFormats","phone.imei",
                // "system.fileName","system.commonFileName","system.mimeType","system.commonFileType","system.commonFileExt","system.fileType","system.fileExt","system.directoryPath","system.filePath","system.semver",
                // "vehicle.vehicle","vehicle.manufacturer","vehicle.model","vehicle.type","vehicle.fuel","vehicle.vin","vehicle.color","vehicle.vrm","vehicle.bicycle",
                // "word.adjective","word.adverb","word.conjunction","word.interjection","word.noun","word.preposition","word.verb",
            
            
                // v9.7.0
                //"_randomizer.next","_randomizer.seed",
                "datatype.boolean",
                "date.month","date.weekday","date.timeZone","date.anytime","date.past","date.future","date.between","date.betweens","date.recent","date.soon","date.birthdate",
                // "helpers.fake","helpers.slugify","helpers.replaceSymbols","helpers.replaceCreditCardSymbols","helpers.fromRegExp","helpers.shuffle","helpers.uniqueArray","helpers.mustache","helpers.maybe","helpers.objectKey","helpers.objectValue","helpers.objectEntry","helpers.arrayElement","helpers.weightedArrayElement","helpers.arrayElements","helpers.enumValue","helpers.rangeToNumber","helpers.multiple",
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
            ]},
        },
        {field: 'value'}
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
        },

        rowDragManaged: true,
        rowDragMultiRow: true,
        rowSelection: 'multiple',
        onCellEditingStopped: ( e => { convertGridToText();}),
        onRowDragEnd:  ( e => { convertGridToText();})
    };

    const addNewRowButton = document.createElement("button");
    addNewRowButton.innerText="+ Add Row";
    gridDiv.appendChild(addNewRowButton);


    const deleteRowsButton = document.createElement("button");
    deleteRowsButton.innerText=" - Delete Selected";
    gridDiv.appendChild(deleteRowsButton);


    new agGrid.Grid(gridDiv, defnGridOptions);

    const defnGridExtras = new GridExtension(defnGridOptions.api, defnGridOptions.columnApi);

    addNewRowButton.addEventListener('click', function(){
        defnGridOptions.api.applyTransaction({ add: [{columnName: "", type:"RegEx", value:""}] });
    });

    deleteRowsButton.addEventListener('click', function(){
        defnGridExtras.deleteSelectedRows();
    });
}

function convertGridToText(){

    let outputText = "";
    let prefix = "";
    defnGridOptions.api.forEachNode((rowNode, index) => {
        outputText = outputText + prefix;
        outputText = outputText + rowNode.data.columnName + "\n";
        if( rowNode.data.type == "RegEx"){
            outputText = outputText + rowNode.data.value;
        }else{
            if(rowNode.data.type == "fake") {
                outputText = outputText + rowNode.data.type + " " + rowNode.data.value;
            }else{
                outputText = outputText + rowNode.data.type;
            }
        }
        prefix="\n";
    });

    document.getElementById("testdatadefntext").value = outputText;
}


function enableTestDataGenerationInterface(parentId, anImporter, theExportControls){

    importer = anImporter;
    exportControls = theExportControls;

    let parentElem = document.getElementById(parentId);
    parentElem.innerHTML = `
        <div>
            <button id="generatedata">Generate</button><label> How Many?<input type="number" id="generateCount"/></label>
        </div>
        <div class="defn-edit-zone">
            <div class="defn-grid-container" id="defngrid" class="ag-theme-alpine" style="float:left">
            </div>
            <div class="defn-text-container" style="float:right;padding-top:2em">
                <p>Test Data Text Schema</p>
                <textarea class="testDataDefn" name="testdatadefntext" id="testdatadefntext"></textarea>
            </div>
        </div>
    `;

    var element = document.querySelector("#generatedata");
    element.addEventListener('click', generateTestData, false);

    createTestDataGrid();

    var inputarea = document.getElementById('testdatadefntext');
    // https://stackoverflow.com/questions/2823733/textarea-onchange-detection/14029861?noredirect=1#comment19596202_14029861

    inputarea.addEventListener('input', function() {
          // debounce a call to set the grid from the text area
          debouncer.debounce("populateTestDataGrid", populateTestDataGridFromRules, 1000);
    }, false);
};

export {enableTestDataGenerationInterface}