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

// todo wrap this as a class and make components

import {RulesParser} from './data_generation/testDataRules.js';
import {Debouncer} from './utils/debouncer.js';
import {GridExtension} from './grid/gridExtension.js';

var debouncer = new Debouncer();
let importer=undefined;
let renderTextCallback = undefined;

function getRulesParserFromTextArea(){

    const rulesParser = new RulesParser();
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

    // generate
    const data = rulesParser.testDataRules.generate(desiredRowCount);

    // add data to table
    importer.setGridFromData(data);

    // and refresh the export
    renderTextCallback();

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


// create a simple editor that shows the list of values but with a search component
// https://www.ag-grid.com/javascript-data-grid/component-cell-editor/
/* <input list="values">
<datalist id="values">
  <option value="Value 1">
  <option value="Value 2">
  <option value="Value 3">
</datalist>   */

class SelectFilterEditor {
   init(params) {
       this.value = params.value;

       this.gui = document.createElement('div');
       this.input = document.createElement('input');
       this.gui.appendChild(this.input);
       this.input.setAttribute("list", 'selectionValuesDataList');
       let datalist = document.createElement('datalist');
       datalist.id="selectionValuesDataList";
       this.gui.appendChild(datalist);
       //console.log(params.values);
       params.values.forEach((value)=>{
           var option = document.createElement("option");
           option.setAttribute("value",value);
           datalist.appendChild(option);
       })
       this.validValues = params.values;

       this.input.addEventListener('input', (event) => {
           this.value = event.target.value;
       });
   }

   /* Component Editor Lifecycle methods */
   // gets called once when grid ready to insert the element
   getGui() {
       return this.gui;
   }

   // the final value to send to the grid, on completion of editing
   getValue() {
       return this.value;
   }

   // Gets called once before editing starts, to give editor a chance to
   // cancel the editing before it even starts.
   isCancelBeforeStart() {
       return false;
   }

   // Gets called once when editing is finished (eg if Enter is pressed).
   // If you return true, then the result of the edit will be ignored.
   isCancelAfterEnd() {
       // value must be from the list
       return !this.validValues.includes(this.value);
   }

   // after this component has been created and inserted into the grid
   afterGuiAttached() {
       this.input.focus();
   }
}

function setupTestDataEditGrid(gridDiv){


    const defnRowData = [];

    /* generate faker APi calls https://rawgit.com/Marak/faker.js/master/examples/browser/index.html
    let codegen="";
    Object.keys(faker).forEach(k=>{Object.getOwnPropertyNames(faker[k]).filter(item => typeof faker[k][item] === 'function').forEach(k2 => codegen=codegen+`"${k}.${k2}",`)});
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
                    "mersenne.rand",
                    //"mersenne.seed",
                    //"mersenne.seed_array",
                    "random.number","random.float","random.arrayElement","random.arrayElements","random.objectElement","random.uuid","random.boolean","random.word","random.words","random.image","random.locale","random.alpha","random.alphaNumeric","random.hexaDecimal",
                    //"helpers.randomize","helpers.slugify","helpers.replaceSymbolWithNumber","helpers.replaceSymbols","helpers.replaceCreditCardSymbols","helpers.repeatString","helpers.regexpStyleStringParse","helpers.shuffle","helpers.mustache","helpers.createCard","helpers.contextualCard","helpers.userCard","helpers.createTransaction",
                "name.firstName","name.lastName","name.middleName","name.findName","name.jobTitle","name.gender","name.prefix","name.suffix","name.title","name.jobDescriptor","name.jobArea","name.jobType","address.zipCode","address.zipCodeByState","address.city","address.cityPrefix","address.citySuffix","address.cityName","address.streetName","address.streetAddress","address.streetSuffix","address.streetPrefix","address.secondaryAddress","address.county","address.country","address.countryCode","address.state","address.stateAbbr","address.latitude","address.longitude","address.direction","address.cardinalDirection","address.ordinalDirection","address.nearbyGPSCoordinate","address.timeZone","animal.dog","animal.cat","animal.snake","animal.bear","animal.lion","animal.cetacean","animal.horse","animal.bird","animal.cow","animal.fish","animal.crocodilia","animal.insect","animal.rabbit","animal.type","company.suffixes","company.companyName","company.companySuffix","company.catchPhrase","company.bs","company.catchPhraseAdjective","company.catchPhraseDescriptor","company.catchPhraseNoun","company.bsAdjective","company.bsBuzz","company.bsNoun","finance.account","finance.accountName","finance.routingNumber","finance.mask","finance.amount","finance.transactionType","finance.currencyCode","finance.currencyName","finance.currencySymbol","finance.bitcoinAddress","finance.litecoinAddress","finance.creditCardNumber","finance.creditCardCVV","finance.ethereumAddress","finance.iban","finance.bic","finance.transactionDescription","image.image","image.avatar","image.imageUrl","image.abstract","image.animals","image.business","image.cats","image.city","image.food","image.nightlife","image.fashion","image.people","image.nature","image.sports","image.technics","image.transport","image.dataUri","lorem.word","lorem.words","lorem.sentence","lorem.slug","lorem.sentences","lorem.paragraph","lorem.paragraphs","lorem.text","lorem.lines","hacker.abbreviation","hacker.adjective","hacker.noun","hacker.verb","hacker.ingverb","hacker.phrase","internet.avatar","internet.email","internet.exampleEmail","internet.userName","internet.protocol","internet.httpMethod","internet.url","internet.domainName","internet.domainSuffix","internet.domainWord","internet.ip","internet.ipv6","internet.port","internet.userAgent","internet.color","internet.mac","internet.password","database.column","database.type","database.collation","database.engine","phone.phoneNumber","phone.phoneNumberFormat","phone.phoneFormats","date.past","date.future","date.between","date.betweens","date.recent","date.soon","date.month","date.weekday","time.recent","commerce.color","commerce.department","commerce.productName","commerce.price","commerce.productAdjective","commerce.productMaterial","commerce.product","commerce.productDescription","system.fileName","system.commonFileName","system.mimeType","system.commonFileType","system.commonFileExt","system.fileType","system.fileExt","system.directoryPath","system.filePath","system.semver","git.branch","git.commitEntry","git.commitMessage","git.commitSha","git.shortSha","vehicle.vehicle","vehicle.manufacturer","vehicle.model","vehicle.type","vehicle.fuel","vehicle.vin","vehicle.color","vehicle.vrm","vehicle.bicycle","music.genre","datatype.number","datatype.float","datatype.datetime","datatype.string","datatype.uuid","datatype.boolean","datatype.hexaDecimal","datatype.json","datatype.array",],
            },
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


function enableTestDataGenerationInterface(parentId, anImporter, renderTextCallbackFunction){

    importer = anImporter;
    renderTextCallback = renderTextCallbackFunction;

    let parentElem = document.getElementById(parentId);
    parentElem.innerHTML = `
        <div>
            <button id="generatedata">Generate</button><label id="howmanygenerate" for="generateCount"> How Many?</label><input type="number" id="generateCount"/>
        </div>
        <div class="defn-edit-zone">
            <div class="defn-grid-container" id="defngrid" class="ag-theme-alpine" style="float:left">
            </div>
            <div class="defn-text-container" style="float:right;padding-top:2em">
                <p>Test Data Text Schema</p>
                <textarea class="testDataDefn" name="testdatadefntext" id="testdatadefntext">
                </textarea>
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