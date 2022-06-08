import { GenericDataTable } from "./generic-data-table.js";
import { GherkinConvertor } from "./gherkin-convertor.js";
import { MarkdownConvertor } from "./markdown-convertor.js";
import { HtmlConvertor } from "./html-convertor.js";
import { JsonConvertor } from "./json-convertor.js";
import { JavascriptConvertor } from "./javascript-convertor.js";
import { CsvConvertor } from "./csv-convertor.js";
import { DelimiterConvertor } from "./delimiter-convertor.js";


// ascii table libraries
// https://github.com/sorensen/ascii-table

// https://www.npmjs.com/package/ascii-table3
// https://openbase.com/js/ascii-data-table/documentation
// https://ozh.github.io/ascii-tables/


// bugs
// the options are not persisted between tab changes
// removing use-header deletes header so we should remember what the header is and restore it so we can add back into the grid, or use existing headers if column count matches
// delimited doesn't fully survive setting the grid text e.g. : merges

class Exporter {

    constructor(gridApi) {
        this.gridApi = gridApi;

        this.csvDelimiter={};
        this.csvDelimiter.options = {
            quotes: true, //or array of booleans
            quoteChar: '"',
            escapeChar: '"',
            delimiter: ",",
            header: true,
            newline: "\n",
        }

        this.delimiter={};
        this.delimiter.options = {
            quotes: true, //or array of booleans
            quoteChar: '"',
            escapeChar: '"',
            delimiter: "\t",
            header: true,
            newline: "\n",
        }
    }

    canExport(type){
        const supportedTypes = ["markdown", "csv", "dsv", "json", "javascript", "gherkin", "html"]
        return supportedTypes.includes(type);
    }

    getGridAs(type){

        if(type=="markdown") {
          return this.getGridAsMarkdown();
        }
      
        if(type=="csv") {
            return this.getGridAsCsv();
        }

        if(type=="dsv") {
            return this.getGridAsDsv();
        }
      
        if(type=="json") {
            return this.getGridAsJson();
        }
      
        if(type=="javascript") {
            return this.getGridAsJavaScriptJson();
        }
      
        if(type=="gherkin") {
            return this.getGridAsGherkin();
        }
      
        if(type=="html") {
            return this.getGridAsHTML();
        }

        return "";
    }

    getGridAsGenericDataTable(){
        let dataTable = new GenericDataTable();
        dataTable.setHeaders(this.gridApi.getColumnDefs().map(col => col.headerName));

        var fieldnames = this.gridApi.getColumnDefs().map(col => col.field);
    
        // since we can filter and sort...
        // if we use forEachNode then it ignores the filter and does not honour the sorting
        this.gridApi.forEachNodeAfterFilterAndSort(node => {
            var vals = [];

            for (const propertyid in fieldnames) {
                var property = fieldnames[propertyid];
                vals.push(node.data[property] ? String(node.data[property]) : '');
            }
            dataTable.appendDataRow(vals);
        });

        return dataTable;
    }

    getGridAsMarkdown(){       
        return new MarkdownConvertor().formatAsMarkdownTable(this.getGridAsGenericDataTable());
    }

    getGridAsGherkin(){
        return new GherkinConvertor().formatAsGherkinTable(this.getGridAsGenericDataTable());
    }

    getGridAsHTML(){
        return new HtmlConvertor().formatAsHTMLTable(this.getGridAsGenericDataTable());
    }

    getGridAsJavaScriptJson(){
        return JSON.stringify(new JavascriptConvertor().formatAsObjects(this.getGridAsGenericDataTable()), null, "\t");
    }

    getGridAsJson(){
        return JSON.stringify(new JsonConvertor().formatAsObjects(this.getGridAsGenericDataTable()), null, "\t");
    }

    setCsvDelimiterOptions(options){
        this.csvDelimiter.options = {...this.csvDelimiter.options, ...options};
    }

    setDelimiterOptions(options){
        this.delimiter.options = {...this.delimiter.options, ...options};
    }

    getGridAsCsv(){
        return new CsvConvertor({options : this.csvDelimiter.options}).convertFrom(this.getGridAsGenericDataTable());
    }

    getGridAsDsv(){
        return new DelimiterConvertor({options : this.delimiter.options}).convertFrom(this.getGridAsGenericDataTable());
    }
}

export {Exporter}