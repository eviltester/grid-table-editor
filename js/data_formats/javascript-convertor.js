import { JsonConvertor } from "./json-convertor.js";

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

    toDataTable(textToImport){
        return this.delegateTo.toDataTable(textToImport);
    }

}