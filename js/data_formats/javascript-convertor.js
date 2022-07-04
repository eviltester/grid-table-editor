import { JsonConvertor, JsonConvertorOptions } from "./json-convertor.js";

function convertStringToJavaScriptValidName(aString){
    return aString.replace(/[^A-Za-z0-9_]/g, '_');
}

export class JavascriptConvertorOptions{

    constructor(){
        this.jsonoptions = new JsonConvertorOptions();

        // get the jsonoptions defaults
        this.options = this.jsonoptions.options;
        this.delimiterMappings = this.jsonoptions.delimiterMappings;
        this.headerNameConvertor = convertStringToJavaScriptValidName;
    }


    mergeOptions(newoptions){
        if(newoptions.options){
            this.options = {...this.options, ...newoptions.options}
        }else{
            this.options = {...this.options, ...newoptions}
        }

        if(newoptions.headerNameConvertor){
          this.headerNameConvertor = newoptions.headerNameConvertor;
        }
    }
}

export class JavascriptConvertor {

    constructor() {
        this.delegateTo = new JsonConvertor(new JavascriptConvertorOptions());
    }

    setOptions(newOptions){
        this.delegateTo.config.mergeOptions(newOptions);
    }

    formatAsObjects(dataTable){
        return this.delegateTo.formatAsObjects(dataTable);
    }

    setPapaParse(papaparse){
        this.papaparse=papaparse;
        this.delegateTo.setPapaParse(papaparse)
    }

    // TODO: these regex conversions are all a little 'delicate'
    // am using regex because under covers the JSON.stringify and parse functions are used
    // which require quoted keys, but the javascript is non-quoted keys
    // make more robust and report errors on screen
    fromDataTable(dataTable){
        let json= this.delegateTo.fromDataTable(dataTable);

        //TODO: handle object name
        const arrayNameRegex = /(\s|^]*){([\s]*)"([a-zA-Z0-9_ ]+)"( ?):( ?)\[/g
        if(this.delegateTo.config.options.asObject){
            json=json.replace(arrayNameRegex, '$1{$2$3$4:$5[');
        }

        // regex replace all to convert json keys to javascript literals
        // initial implementation
        // const regex = /("(.*)"):/g
        // more robust implementation
        // to match json keys
        const regex = /"([a-zA-Z0-9_]*)":( ?)"/g
        // convert to non-quoted javascript
        let javascript = json.replaceAll(regex,`$1:$2"`);


        //TODO: consider only doing number regex replace when option "Number Convert" is tru
        // handle number convert e.g. this_key: 3
        const numberRegex = /"([a-zA-Z0-9_]*)"( ?):( ?)([0-9]*[,}\n])/g
        javascript = javascript.replace(numberRegex, '$1$2:$3$4');

        return javascript;
    }

    toDataTable(textToImport){

        let json = textToImport;

        // TODO: handle object name
        const arrayNameRegex = /(\s|^]*){([\s]*)([a-zA-Z0-9_]+)( ?):( ?)\[/g
        if(this.delegateTo.config.options.asObject){
            json=json.replace(arrayNameRegex, '$1{$2"$3"$4:$5[');
        }

        // match javascript keys
        // [\t ]* optional leading white spaces
        // ([a-zA-Z0-9_]*) the text of the key
        // ( ?):   optional space followed by :
        // ( ?)"   optional space followed by start of value 

        const regex = /([\t ]*)([a-zA-Z0-9_]*)( ?):( ?)"/g
        // convert matched keys to json
        json = json.replace(regex, '"$2"$3:$4"');

        //TODO: consider only doing number regex replace when option "Number Convert" is tru
        // handle number convert e.g. this_key: 3
        const numberRegex = /([\t ]*)([a-zA-Z0-9_]*)( ?):( ?)([0-9]*[,}\n])/g
        json = json.replace(numberRegex, '"$2"$3:$4$5');

        // TODO: add an import option to replace _ in key with " "

        return this.delegateTo.toDataTable(json);
    }

}