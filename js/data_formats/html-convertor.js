import { GenericDataTable } from "./generic-data-table.js";

// TODO : expand import by sanitising the cell values to remove html - possibly make this an option
// TODO : options - add thead - add a thead as parent for tr, with th items for header
// TODO : options - add tbody - add a tbody as parent for tr, with td items for cells
//     without thead and tbody it is just a list of tr within a table element
// TODO : options - divs - use nested divs with classes "table", "header", "heading", "row", "cell"
// TODO : options - configurable div class names by user

class HtmlConvertorOptions{

    constructor(){
        this.options = {
            compact: false, // - no line breaks or indents
            prettyPrint: false, // formatted - indent HTML and add new lines
            prettyPrintDelimiter: "\t" // can configure delimiter to pad for pretty print
        }
    }

    mergeOptions(newOptions){

        if(newOptions.options){
            this.options = {...this.options, ...newOptions.options}
        }else{
            this.options = {...this.options, ...newOptions}
        }
    }
}

class Indent{
    constructor(indentChar) {
        this.currIndent=0;
        this.indentChar = indentChar ? indentChar : "\t";
    }

    indent(){
        this.currIndent++;
    }

    outdent(){
        if(this.currIndent>0){
            this.currIndent--;
        }
    }

    getIndent(){
        let retString = "";
        for(let x=0; x<this.currIndent; x++){
            retString+=this.indentChar;
        }
        return retString;
    }

}


class HtmlConvertor {

    constructor(params) {
        this.exportOptions = new HtmlConvertorOptions();
    }

    validHTMLCellValue(data){
        return data.replaceAll('<','&lt;').replaceAll(">","&gt;")
    }

    setOptions(newOptions){
        this.exportOptions.mergeOptions(newOptions);
    }

    fromDataTable(dataTable){

        let delim = "\n";
        let indenter = new Indent(this.exportOptions.options.prettyPrintDelimiter);

       if(this.exportOptions.options.compact){
            delim="";
       }

        var html = indenter.getIndent() + "<table>" + delim;

        if(this.exportOptions.options.prettyPrint){
            indenter.indent();
        }
       
        html = html + indenter.getIndent() + "<tr>" + delim;
        var renderHeaders = dataTable.getHeaders().map(header => this.validHTMLCellValue(header));

        if(this.exportOptions.options.prettyPrint){
            indenter.indent();
        }

        renderHeaders.forEach((header)=>{
            html +=  indenter.getIndent() + '<th>' + header + `</th>${delim}`;

        })
        //html +=  indenter.getIndent() + '<th>' + renderHeaders.join(`</th>${delim}${indenter.indent()}<th>`) + '</th>' + delim;

        if(this.exportOptions.options.prettyPrint){
            indenter.outdent();
        }

        html = html + indenter.getIndent() + "</tr>" + delim;
        
        if(this.exportOptions.options.prettyPrint){
            indenter.outdent();
        }

        for(let rowIndex=0; rowIndex<dataTable.getRowCount(); rowIndex++){
            let row = dataTable.getRow(rowIndex);
            
            if(this.exportOptions.options.prettyPrint){
                indenter.indent();
            }

            html = html + indenter.getIndent() + "<tr>" + delim;
            
            if(this.exportOptions.options.prettyPrint){
                indenter.indent();
            }

            var renderValues = row.map(value => this.validHTMLCellValue(value));
            renderValues.forEach((value)=>{
                html +=  indenter.getIndent() + '<td>' + value + `</td>${delim}`;
            })

            //html = html + indenter.getIndent() +'<td>' + renderValues.join('</td><td>') + '</td>' + delim;

            if(this.exportOptions.options.prettyPrint){
                indenter.outdent();
            }

            html = html + indenter.getIndent() +"</tr>" + delim;

            if(this.exportOptions.options.prettyPrint){
                indenter.outdent();
            }
        };

        if(this.exportOptions.options.prettyPrint){
            indenter.outdent();
        }

        html += indenter.getIndent() +"</table>";

        console.log(html);
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
            // TODO : create some error surfacing protocol
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

export {HtmlConvertor, HtmlConvertorOptions, Indent}