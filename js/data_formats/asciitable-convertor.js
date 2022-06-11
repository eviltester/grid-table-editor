export class AsciiTableConvertor {

    constructor() {
    }

    fromDataTable(dataTable){
        var table = new AsciiTable()
            .setHeading(dataTable.getHeaders())
            .addRowMatrix(dataTable.rows);
            return table.render();
    }

    // toDataTable(textToImport){
    //     return this.delegateTo.toDataTable(textToImport);
    // }

}