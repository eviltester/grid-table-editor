class Exporter {

    constructor(gridApi) {
        this.gridApi = gridApi;
    }

    csvExport(){
        this.gridApi.exportDataAsCsv();
    }

    getMarkdown(){
        var markdownTable='';
        //console.log(gridOptions.api.getColumnDefs())
        // output headers
        var headers = this.gridApi.getColumnDefs().map(col => col.headerName);
        //console.log(headers);

        var fieldnames = this.gridApi.getColumnDefs().map(col => col.field);
        //console.log(fieldnames);

        // output rows
        //console.log(rowData);
        var gridRowData = [];
        this.gridApi.forEachNode(node => {
            var vals = [];
            //console.log(node.data);

            for (const propertyid in fieldnames) {
                var property = fieldnames[propertyid];
                //console.log(property);
                //console.log(`- ${property}: ${node.data[property]}`);
                vals.push(node.data[property] ? node.data[property] : ' ');
            }
            gridRowData.push(vals);
        });
        //console.log(gridRowData);

        markdownTable = markdownTable + '|' + headers.join('|') + '|' + '\n';
        markdownTable =
            markdownTable + '|' + headers.map(name => '-----').join('|') + '|' + '\n';
        //console.log(gridRowData);
        gridRowData.forEach(values => {
            markdownTable = markdownTable + '|' + values.join('|') + '|' + '\n';
        });

        return markdownTable;
    }

    getDataAsObjectArray(){

        var colDefs = this.gridApi.getColumnDefs();

        var gridRowData = [];
        this.gridApi.forEachNode(node => {
            var vals = {};
            //console.log(node.data);

            colDefs.forEach(colDef => {
                    var property = colDef.field;
                    //console.log(property);
                    //console.log(`- ${property}: ${node.data[property]}`);
                    var jsonHeaderName = colDef.headerName.
                                        replace(/[^A-Za-z0-9_]/g, '_');
                    vals[jsonHeaderName] = node.data[property] ? node.data[property] : '';
                }
            );
            gridRowData.push(vals);

        });

        return gridRowData;

    }

    getGridAsJson(){
        return JSON.stringify(this.getDataAsObjectArray(), null, "\t");
    }
}