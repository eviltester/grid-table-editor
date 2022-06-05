import { ConvertGridToCsv } from "./exports/convert_grid_to_csv.js";
import { GenericDataTable } from "./generic-data-table.js";
import { GherkinConvertor } from "./gherkin-convertor.js";
import { MarkdownConvertor } from "./markdown-convertor.js";

class Exporter {

    constructor(gridApi) {
        this.gridApi = gridApi;
    }

    // https://www.ag-grid.com/javascript-grid/csv-export/
    csvExport(){
        this.gridApi.exportDataAsCsv();
    }

    canExport(type){
        const supportedTypes = ["markdown", "csv", "json", "javascript", "gherkin", "html"]
        return supportedTypes.includes(type);
    }

    getGridAs(type){

        if(type=="markdown") {
          return this.getGridAsMarkdown();
        }
      
        if(type=="csv") {
            return new ConvertGridToCsv(this.gridApi).get();
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

    // todo: phase out the old data array format and use the GenericDataTable instead
    getGridAsHeadersAndRows(){
        var headers = this.gridApi.getColumnDefs().map(col => col.headerName);
        var fieldnames = this.gridApi.getColumnDefs().map(col => col.field);
    
        // output rows
        var gridRowData = [];
        // since we can filter and sort...
        // if we use forEachNode then it ignores the filter and does not honour the sorting
        this.gridApi.forEachNodeAfterFilterAndSort(node => {
            var vals = [];
            //console.log(node.data);

            for (const propertyid in fieldnames) {
                var property = fieldnames[propertyid];
                vals.push(node.data[property] ? String(node.data[property]) : ' ');
            }
            gridRowData.push(vals);
        });

        return [headers,  gridRowData];
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
                vals.push(node.data[property] ? String(node.data[property]) : ' ');
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
        var [headers, gridRowData] = this.getGridAsHeadersAndRows();
        return this.formatAsHTMLTable(headers, gridRowData);
    }

    validHTMLCellValue(data){
        return data.replaceAll('<','&lt;').replaceAll(">","&gt;")
    }

    // todo: move to html-convertor and convert to use GenericDataTable as input
    formatAsHTMLTable(headers, data){
        // headers is an array of 'headers' and 
        // data is an array of nested arrays matching the header values

        // display a pipe (|) character in a table by using its HTML character code (&#124;).

        var markdownTable = "<table>\n";

        markdownTable = markdownTable + "<tr>\n";
        var renderHeaders = headers.map(header => this.validGherkinCellValue(header));
        markdownTable +=  '<th>' + renderHeaders.join('</th><th>') + '</th>' + '\n';
        markdownTable = markdownTable + "</tr>\n";

        data.forEach(values => {         
            markdownTable = markdownTable + "<tr>\n";       
            var renderValues = values.map(value => this.validGherkinCellValue(value));
            markdownTable = markdownTable + '<td>' + renderValues.join('</td><td>') + '</td>' + '\n';
            markdownTable = markdownTable + "</tr>\n";
        });

        markdownTable += "</table>";

        return markdownTable;
    }
   

    convertStringToJavaScriptValidName(aString){
        return aString.replace(/[^A-Za-z0-9_]/g, '_');
    }

    getDataAsObjectArray(headerNameConvertor){

        var convertor=headerNameConvertor;
        if(headerNameConvertor===undefined){
            convertor = function (header){
                return header;
            }
        }

        var colDefs = this.gridApi.getColumnDefs();

        var objectArray = [];
        // since we can filter and sort...
        // if we use forEachNode then it ignores the filter and does not honour the sorting
        this.gridApi.forEachNodeAfterFilterAndSort(node => {
            var anObject = {};
            //console.log(node.data);

            colDefs.forEach(colDef => {
                    var property = colDef.field;
                    var jsonHeaderName = convertor(colDef.headerName);
                    anObject[jsonHeaderName] = node.data[property] ? node.data[property] : '';
                }
            );
            objectArray.push(anObject);

        });

        return objectArray;
    }


    getGridAsJavaScriptJson(){
        return JSON.stringify(this.getDataAsObjectArray(this.convertStringToJavaScriptValidName), null, "\t");
    }

    getGridAsJson(){
        return JSON.stringify(this.getDataAsObjectArray(), null, "\t");
    }
}

export {Exporter}