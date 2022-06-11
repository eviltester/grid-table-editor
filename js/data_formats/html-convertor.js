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

    toDataTable(aString){

        // create a dom element
        // inject the html table into the dom element
        // traverse and create a GenericDataTable

        const dataTable = new GenericDataTable();

        let container = document.createElement("div");
        container.innerHTML=aString;

        // find the table
        let table = container.querySelector("table");

        if(table===undefined){
            // todo: create some error surfacing protocol
            console.log("Error: could not find table in the HTML import");
            return dataTable;
        }

        // get the rows
        let rows = table.querySelectorAll("tr");

        if(rows===undefined){
            console.log("Error: could not find any rows in the table");
            return dataTable;
        }

        // header is the first row - handle th or td
        let header = rows[0];

        let headerCells = header.querySelectorAll("td, th");
        if(headerCells===undefined || headerCells.length===0){
            console.log("Error: could not find any headers in the table");
            return dataTable;
        }

        // add header row to table
        //console.log("Header");
        //console.log(header);
        dataTable.setHeaders(this.getCellContentsArrayFromNodeList(headerCells));

        //console.log("Rows");
        for(let rowCount=1; rowCount<rows.length; rowCount++){
            // add row to table
            let cells = rows[rowCount].querySelectorAll("td");

            //console.log(cells);
            dataTable.appendDataRow(this.getCellContentsArrayFromNodeList(cells));
        }

        container.innerHTML="";
        container=undefined;

        return dataTable;
    }

    getCellContentsArrayFromNodeList(aNodeList){
        return [...aNodeList].map(contents => this.getTableCellContents(contents));
    }

    // get the text, not the HTML and remove any characters that might mess up the data conversion
    getTableCellContents(tableCell){
        return tableCell.innerText.replaceAll("\n"," ").trim();
    }

}