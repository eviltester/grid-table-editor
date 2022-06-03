import { ConvertGridToCsv } from "./exports/convert_grid_to_csv.js";

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

    // https://www.markdownguide.org/extended-syntax/
    getGridAsMarkdown(){
        
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
                vals.push(node.data[property] ? node.data[property] : ' ');
            }
            gridRowData.push(vals);
        });

        return this.formatAsMarkdownTable(headers, gridRowData);
    }

    formatAsMarkdownTable(headers, data){
        // headers is an array of 'headers' and 
        // data is an array of nested arrays matching the header values

        // display a pipe (|) character in a table by using its HTML character code (&#124;).

        var renderHeaders = headers.map(header => header.replaceAll("|","&#124;"))
        var markdownTable =  '|' + renderHeaders.join('|') + '|' + '\n';

        markdownTable =
            markdownTable + '|' + headers.map(name => '-----').join('|') + '|' + '\n';
        data.forEach(values => {                
            var renderValues = values.map(value => value.replaceAll("|","&#124;"))
            markdownTable = markdownTable + '|' + renderValues.join('|') + '|' + '\n';
        });

        return markdownTable;
    }

    getGridAsGherkin(){
        
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
                vals.push(node.data[property] ? node.data[property] : ' ');
            }
            gridRowData.push(vals);
        });

        return this.formatAsGherkinTable(headers, gridRowData);
    }

    validGherkinCellValue(data){
        return data.replaceAll('\\','\\\\').replaceAll("|","\\|")
    }

    formatAsGherkinTable(headers, data){
        // headers is an array of 'headers' and 
        // data is an array of nested arrays matching the header values

        // display a pipe (|) character in a table by using its HTML character code (&#124;).

        var renderHeaders = headers.map(header => this.validGherkinCellValue(header));
        var markdownTable =  '|' + renderHeaders.join('|') + '|' + '\n';

        data.forEach(values => {                
            var renderValues = values.map(value => this.validGherkinCellValue(value));
            markdownTable = markdownTable + '|' + renderValues.join('|') + '|' + '\n';
        });

        return markdownTable;
    }

    getGridAsHTML(){
        
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
                vals.push(node.data[property] ? node.data[property] : ' ');
            }
            gridRowData.push(vals);
        });

        return this.formatAsHTMLTable(headers, gridRowData);
    }

    validHTMLCellValue(data){
        return data.replaceAll('<','&lt;').replaceAll(">","&gt;")
    }

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