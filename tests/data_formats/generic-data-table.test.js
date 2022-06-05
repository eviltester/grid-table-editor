import {GenericDataTable} from '../../js/data_formats/generic-data-table';


describe("Can convert old data format to Generic Data Table", ()=>{

    test('convert a table with header and rows', () => {
        let data = [];
        data[0]=["header 1", "header 2"];
        data[1]=["row 0, cell 0","row 0, cell 1"];
        data[2]=["row 1, cell 0","row 1, cell 1"];

        let dataTable = new GenericDataTable();
        expect(dataTable.setFromDataArray(data)).toBe(true);
        expect(dataTable.getColumnCount()).toBe(2);
        expect(dataTable.getHeader(0)).toBe("header 1");
        expect(dataTable.getHeader(1)).toBe("header 2");
        expect(dataTable.getRowCount()).toBe(2);
        expect(dataTable.getCell(0,0)).toBe("row 0, cell 0");
        expect(dataTable.getCell(1,1)).toBe("row 1, cell 1");
        expect(dataTable.getRow(0)[1]).toBe("row 0, cell 1");
        expect(dataTable.getRow(1).length).toBe(dataTable.getColumnCount());
    });

    test('undefined leaves data grid alone', () => {
        let data = [];
        data[0]=["header 1", "header 2"];
        data[1]=["row 0, cell 0","row 0, cell 1"];

        let dataTable = new GenericDataTable();
        expect(dataTable.setFromDataArray(data)).toBe(true);
        expect(dataTable.getColumnCount()).toBe(2);

        dataTable.setFromDataArray(undefined);
        expect(dataTable.getColumnCount()).toBe(2);
        expect(dataTable.getHeader(1)).toBe("header 2");
        expect(dataTable.getRowCount()).toBe(1);
        expect(dataTable.getCell(0,0)).toBe("row 0, cell 0");
    });

    test('null clears data grid', () => {
        let data = [];
        data[0]=["header 1", "header 2"];
        data[1]=["row 0, cell 0","row 0, cell 1"];

        let dataTable = new GenericDataTable();
        expect(dataTable.setFromDataArray(data)).toBe(true);
        expect(dataTable.getColumnCount()).toBe(2);
        expect(dataTable.getRowCount()).toBe(1);
        
        dataTable.setFromDataArray(null);
        expect(dataTable.getColumnCount()).toBe(0);
        expect(dataTable.getRowCount()).toBe(0);
    });

});

describe("Can create Generic Data Table from scratch", ()=>{
    test('can add headers', () => {
        let dataTable = new GenericDataTable();
        expect(dataTable.getColumnCount()).toBe(0);
        dataTable.addHeader("header 1");
        expect(dataTable.getColumnCount()).toBe(1);
        dataTable.addHeader("header 2");
        expect(dataTable.getColumnCount()).toBe(2);
        expect(dataTable.getHeader(1)).toBe("header 2");
    });

    test('can add headers in bulk', () => {
        let dataTable = new GenericDataTable();

        dataTable.setHeaders(["header 1", "header 2"]);
        expect(dataTable.getColumnCount()).toBe(2);
        expect(dataTable.getHeader(0)).toBe("header 1");
        expect(dataTable.getHeader(1)).toBe("header 2");
    });
});

/*

TODO: unsupported scenarios

- add header after rows have been added and expand rows - expectation is that headers are set prior to adding data
- setting cells individually, expectation is that this is a bulk operation  adding a row at a time with appendDataRow

*/