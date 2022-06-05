import { GenericDataTable } from "./generic-data-table.js";

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