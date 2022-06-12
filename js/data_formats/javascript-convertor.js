import { JsonConvertor } from "./json-convertor.js";

// todo: combine Json and Javascript and make the name conversion an option from the GUI

function convertStringToJavaScriptValidName(aString){
    return aString.replace(/[^A-Za-z0-9_]/g, '_');
}

export class JavascriptConvertor {

    constructor() {
        this.delegateTo = new JsonConvertor({headerNameConvertor: convertStringToJavaScriptValidName});
    }

    formatAsObjects(dataTable){
        return this.delegateTo.formatAsObjects(dataTable);
    }

    fromDataTable(dataTable){
        return this.delegateTo.fromDataTable(dataTable);
    }

    toDataTable(textToImport){
        return this.delegateTo.toDataTable(textToImport);
    }

}