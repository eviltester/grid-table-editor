class ConvertGridToCsv {

    constructor(gridApi) {
        this.gridApi = gridApi;
    }

    get(){
        return this.gridApi.getDataAsCsv();
    }
}

export {ConvertGridToCsv}