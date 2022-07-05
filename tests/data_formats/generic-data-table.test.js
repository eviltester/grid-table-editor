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

    test('can get headers in bulk', () => {
        let dataTable = new GenericDataTable();

        dataTable.setHeaders(["header 1", "header 2"]);
        expect(dataTable.getHeaders()[0]).toBe("header 1");
        expect(dataTable.getHeaders()[1]).toBe("header 2");
    });

    test('can get rows as objects', () => {
        let dataTable = new GenericDataTable();

        dataTable.setHeaders(["header 1", "header2"]);
        dataTable.appendDataRow(["bob","eris"]);
        dataTable.appendDataRow(["aleister","william"]);

        let aRow = dataTable.getRowAsObject(0);
        expect(aRow["header 1"]).toBe("bob");
        expect(aRow.header2).toBe("eris");

        let anotherRow = dataTable.getRowAsObjectUsingHeadings(1,["field1","field2"]);
        expect(anotherRow["field1"]).toBe("aleister");
        expect(anotherRow.field2).toBe("william");

    });

});

describe("Can convert Generic Data Table to old data format", ()=>{

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

        let convertedData = dataTable.asDataArray();

        expect(convertedData.length).toBe(3);
        expect(convertedData[0][0]).toBe('header 1');
        expect(convertedData[0][1]).toBe('header 2');
        expect(convertedData[1][0]).toBe('row 0, cell 0');
        expect(convertedData[1][1]).toBe('row 0, cell 1');
        expect(convertedData[2][0]).toBe('row 1, cell 0');
        expect(convertedData[2][1]).toBe('row 1, cell 1');
    });

    test('empty table to empty table', () => {
        let dataTable = new GenericDataTable();
        let convertedData = dataTable.asDataArray();
        expect(convertedData.length).toBe(0);
    });
});

describe("Can create Generic Data Table from Array of Javascript Objects", ()=>{

    // [x] undefined creates empty table
    // [x] null creates empty table
    // [x] empty array creates empty table
    // [x] array with one object with one property creates table with header and one row of data with one cell
    // [x] array with one object creates table with headers and one row of data
    // [x] array with multiple objects with same keys, fills rows and headers
    // [x] array with properties in different order still works
    // todo: array with objects with different headers creates headers as necessary and data items are empty strings

    test('undefined creates empty table', () => {
        let dataTable = new GenericDataTable();
        dataTable.setFromDataObjects();
        expect(dataTable.getHeaders().length).toBe(0);
        expect(dataTable.getRowCount()).toBe(0);
    });

    test('null creates empty table', () => {
        let dataTable = new GenericDataTable();
        dataTable.setFromDataObjects(null);
        expect(dataTable.getHeaders().length).toBe(0);
        expect(dataTable.getRowCount()).toBe(0);
    });

    test('empty array creates empty table', () => {
        let dataTable = new GenericDataTable();
        dataTable.setFromDataObjects([]);
        expect(dataTable.getHeaders().length).toBe(0);
        expect(dataTable.getRowCount()).toBe(0);
    });

    test('array with one object with one property creates table with header and one row of data with one cell', () => {
        let dataTable = new GenericDataTable();
        dataTable.setFromDataObjects([{"header":"cellvalue"}]);
        expect(dataTable.getHeaders().length).toBe(1);
        expect(dataTable.getHeaders()[0]).toBe("header");
        expect(dataTable.getRowCount()).toBe(1);
        expect(dataTable.getCell(0,0)).toBe("cellvalue");
    });

    test('array with one object creates table with headers and one row of data', ()=>{
        let dataTable = new GenericDataTable();
        dataTable.setFromDataObjects([{"header1":"cellvalue1", "header2":"cellvalue2"}]);
        expect(dataTable.getHeaders().length).toBe(2);
        expect(dataTable.getHeaders()[0]).toBe("header1");
        expect(dataTable.getHeaders()[1]).toBe("header2");
        expect(dataTable.getRowCount()).toBe(1);
        expect(dataTable.getCell(0,0)).toBe("cellvalue1");
        expect(dataTable.getCell(0,1)).toBe("cellvalue2");
    })

    test('array with multiple objects with same keys, fills rows and headers', ()=>{
        let dataTable = new GenericDataTable();
        dataTable.setFromDataObjects([
            {"header1":"cellvalue1", "header2":"cellvalue2"},
            {"header1":"cellvalue3", "header2":"cellvalue4"}
        ]);
        expect(dataTable.getHeaders().length).toBe(2);
        expect(dataTable.getHeaders()[0]).toBe("header1");
        expect(dataTable.getHeaders()[1]).toBe("header2");
        expect(dataTable.getRowCount()).toBe(2);
        expect(dataTable.getCell(0,0)).toBe("cellvalue1");
        expect(dataTable.getCell(0,1)).toBe("cellvalue2");
        expect(dataTable.getCell(1,0)).toBe("cellvalue3");
        expect(dataTable.getCell(1,1)).toBe("cellvalue4");
    })

    test('array with properties in different order still works', ()=>{
        let dataTable = new GenericDataTable();
        dataTable.setFromDataObjects([
            {"header1":"cellvalue1", "header2":"cellvalue2"},
            {"header2":"cellvalue4", "header1":"cellvalue3"}
        ]);
        expect(dataTable.getHeaders().length).toBe(2);
        expect(dataTable.getHeaders()[0]).toBe("header1");
        expect(dataTable.getHeaders()[1]).toBe("header2");
        expect(dataTable.getRowCount()).toBe(2);
        expect(dataTable.getCell(0,0)).toBe("cellvalue1");
        expect(dataTable.getCell(0,1)).toBe("cellvalue2");
        expect(dataTable.getCell(1,0)).toBe("cellvalue3");
        expect(dataTable.getCell(1,1)).toBe("cellvalue4");
    })

});

/*

TODO : unsupported scenarios

- add header after rows have been added and expand rows - expectation is that headers are set prior to adding data
- setting cells individually, expectation is that this is a bulk operation  adding a row at a time with appendDataRow

*/