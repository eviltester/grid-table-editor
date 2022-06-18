import { GenericDataTable } from "./generic-data-table.js";

// TODO : expand import by sanitising the cell values to remove html - possibly make this an option
// TODO : options - divs - use nested divs with classes "table", "header", "heading", "row", "cell"
// TODO : options - configurable div class names by user

class HtmlConvertorOptions{

    constructor(){

        this.delimiterMappings ={
            "tab": "\t",
            "space": " ",
        };

        this.options = {
            compact: false, // - no line breaks or indents
            prettyPrint: false, // formatted - indent HTML and add new lines
            prettyPrintDelimiter: "\t", // can configure delimiter to pad for pretty print
            // without thead and tbody it is just a list of tr within a table element
            addTheadToTable: false, // add a thead as parent for tr, with th items for header
            addTbodyToTable: false, //add a tbody as parent for tr, with td items for cells
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
        this.amIndenting=true;
    }

    activateIndentation(onOff){
        this.amIndenting=onOff;

        // at the moment if we switch of indenting it goes back to no indenting
        // currently no use case where we would want to 'stick' at current level
        // of indentation
        if(!this.amIndenting){
            this.currIndent=0;
        }
    }

    indent(){

        if(!this.amIndenting){return;}

        this.currIndent++;
    }

    outdent(){
        if(!this.amIndenting){return;}

        if(this.currIndent>0){
            this.currIndent--;
        }
    }

    getIndent(){

        if(!this.amIndenting){return "";}

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

    // TODO: this might be cleaner with factory methods that also control indent with an 'addChildElement'
    // without factory methods indent before a <openelement> and outdent before a </closelement>
    // TODO: the pretty print controlling here is overly complicated, need to simplify and probably pretty print 'after' the HTML is created
    fromDataTable(dataTable){

        let delim = "\n";
        let indenter = new Indent(this.exportOptions.options.prettyPrintDelimiter);
        indenter.activateIndentation(this.exportOptions.options.prettyPrint);

       if(this.exportOptions.options.compact){
            delim="";
       }

        // start table
        var html = indenter.getIndent() + "<table>" + delim;
       
        // process headers

        // thead
        if(this.exportOptions.options.addTheadToTable){
            indenter.indent();
            html += indenter.getIndent() + "<thead>" + delim;
        }

        // tr
        indenter.indent();
        html = html + indenter.getIndent() + "<tr>" + delim;
        var renderHeaders = dataTable.getHeaders().map(header => this.validHTMLCellValue(header));


        // th
        indenter.indent();
        renderHeaders.forEach((header)=>{
            html +=  indenter.getIndent() + '<th>' + header + `</th>${delim}`;
        });
        // /th was inline so no need to outdent

        // /tr
        indenter.outdent();
        html = html + indenter.getIndent() + "</tr>" + delim;
        
        // thead
        if(this.exportOptions.options.addTheadToTable){
            indenter.outdent();
            html += indenter.getIndent() + "</thead>" + delim;
        }

        // process table body

        // tbody
        if(this.exportOptions.options.addTbodyToTable){
            // would only need to indent if there were no headers
            // currently we don't support that option
            // indenter.indent(); 
            html += indenter.getIndent() + "<tbody>" + delim;

            // need to indent the <tr>
            indenter.indent();
        }

        for(let rowIndex=0; rowIndex<dataTable.getRowCount(); rowIndex++){
            let row = dataTable.getRow(rowIndex);
            
            // no need to indent because tr at same level as before
            html = html + indenter.getIndent() + "<tr>" + delim;
            
            indenter.indent();
            var renderValues = row.map(value => this.validHTMLCellValue(value));
            renderValues.forEach((value)=>{
                html +=  indenter.getIndent() + '<td>' + value + `</td>${delim}`;
            })
            // /td was inline so no need to outdent

            indenter.outdent();
            html = html + indenter.getIndent() +"</tr>" + delim;
        };

        // tbody
        if(this.exportOptions.options.addTbodyToTable){
            indenter.outdent();
            html += indenter.getIndent() + "</tbody>" + delim;
        }

        indenter.outdent();
        html += indenter.getIndent() +"</table>";
        
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