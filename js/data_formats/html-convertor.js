import { GenericDataTable } from "./generic-data-table.js";

// todo: import by creating the html table in a hidden div then iterating over the table to create the data
// todo: expand import by sanitising the cell values to remove html - possibly make this an option
// todo: options - compact - no line breaks or indents
// todo: options - formatted - indent HTML and add new lines
// todo: options - add thead - add a thead as parent for tr, with th items for header
// todo: options - add tbody - add a tbody as parent for tr, with td items for cells
//     without thead and tbody it is just a list of tr within a table element
// todo: options - divs - use nested divs with classes "table", "header", "heading", "row", "cell"
// todo: options - configurable div class names by user
export class HtmlConvertor {

    constructor(params) {
    }

    validHTMLCellValue(data){
        return data.replaceAll('<','&lt;').replaceAll(">","&gt;")
    }

    formatAsHTMLTable(dataTable){

        var html = "<table>\n";

        html = html + "<tr>\n";
        var renderHeaders = dataTable.getHeaders().map(header => this.validHTMLCellValue(header));
        html +=  '<th>' + renderHeaders.join('</th><th>') + '</th>' + '\n';
        html = html + "</tr>\n";

        for(let rowIndex=0; rowIndex<dataTable.getRowCount(); rowIndex++){
            let row = dataTable.getRow(rowIndex);              
            html = html + "<tr>\n";       
            var renderValues = row.map(value => this.validHTMLCellValue(value));
            html = html + '<td>' + renderValues.join('</td><td>') + '</td>' + '\n';
            html = html + "</tr>\n";
        };

        html += "</table>";

        return html;
    }

}