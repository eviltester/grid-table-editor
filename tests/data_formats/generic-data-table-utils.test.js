import {GenericDataTable} from '../../js/data_formats/generic-data-table';
import {GenericDataTableUtils} from '../../js/data_formats/generic-data-table-utils';


describe("Can convert an array where headers are first array format to Generic Data Table", ()=>{

    test('convert a table with header and rows', () => {
        let data = [];
        data[0]=["header 1", "header 2"];
        data[1]=["row 0, cell 0","row 0, cell 1"];
        data[2]=["row 1, cell 0","row 1, cell 1"];

        let dataTable = new GenericDataTable();
        const utils = new GenericDataTableUtils();
        expect(utils.setGenericDataTableFromDataArray(dataTable, data)).toBe(true);
        expect(dataTable.getColumnCount()).toBe(2);
        expect(dataTable.getHeader(0)).toBe("header 1");
        expect(dataTable.getHeader(1)).toBe("header 2");
        expect(dataTable.getRowCount()).toBe(2);
        expect(dataTable.getCell(0,0)).toBe("row 0, cell 0");
        expect(dataTable.getCell(0,1)).toBe("row 0, cell 1");
        expect(dataTable.getCell(1,0)).toBe("row 1, cell 0");
        expect(dataTable.getCell(1,1)).toBe("row 1, cell 1");

        expect(dataTable.getRow(0)[0]).toBe("row 0, cell 0");
        expect(dataTable.getRow(0)[1]).toBe("row 0, cell 1");
        expect(dataTable.getRow(1)[0]).toBe("row 1, cell 0");
        expect(dataTable.getRow(1)[1]).toBe("row 1, cell 1");
        expect(dataTable.getRow(1).length).toBe(dataTable.getColumnCount());
    });

    test('undefined leaves data grid alone', () => {
        let data = [];
        data[0]=["header 1", "header 2"];
        data[1]=["row 0, cell 0","row 0, cell 1"];

        let dataTable = new GenericDataTable();
        const utils = new GenericDataTableUtils();
        expect(utils.setGenericDataTableFromDataArray(dataTable, data)).toBe(true);
        expect(dataTable.getColumnCount()).toBe(2);

        expect(utils.setGenericDataTableFromDataArray(dataTable, undefined)).toBe(true);
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
        const utils = new GenericDataTableUtils();
        expect(utils.setGenericDataTableFromDataArray(dataTable, data)).toBe(true);
        expect(dataTable.getColumnCount()).toBe(2);
        expect(dataTable.getRowCount()).toBe(1);
        
        expect(utils.setGenericDataTableFromDataArray(dataTable, null)).toBe(true);
        expect(dataTable.getColumnCount()).toBe(0);
        expect(dataTable.getRowCount()).toBe(0);
    });

});

describe("Can create Generic Data Table from Array of Javascript Objects", ()=>{

    // todo: array with objects with different headers creates headers as necessary and data items are empty strings

    test('undefined does nothing', () => {
        let dataTable = new GenericDataTable();
        const utils = new GenericDataTableUtils();

        expect(utils.setGenericDataTableFromDataObjects(dataTable, undefined)).toBe(false);

        expect(dataTable.getHeaders().length).toBe(0);
        expect(dataTable.getRowCount()).toBe(0);
    });

    test('null does nothing', () => {
        let dataTable = new GenericDataTable();
        const utils = new GenericDataTableUtils();

        expect(utils.setGenericDataTableFromDataObjects(dataTable, null)).toBe(false);

        expect(dataTable.getHeaders().length).toBe(0);
        expect(dataTable.getRowCount()).toBe(0);
    });

    test('empty array does nothing', () => {
        let dataTable = new GenericDataTable();
        const utils = new GenericDataTableUtils();

        expect(utils.setGenericDataTableFromDataObjects(dataTable, [])).toBe(false);

        expect(dataTable.getHeaders().length).toBe(0);
        expect(dataTable.getRowCount()).toBe(0);
    });

    test('array with one object with one property creates table with header and one row of data with one cell', () => {
        let dataTable = new GenericDataTable();
        const utils = new GenericDataTableUtils();

        expect(utils.setGenericDataTableFromDataObjects(dataTable, [{"header":"cellvalue"}])).toBe(true);

        expect(dataTable.getHeaders().length).toBe(1);
        expect(dataTable.getHeaders()[0]).toBe("header");
        expect(dataTable.getRowCount()).toBe(1);
        expect(dataTable.getCell(0,0)).toBe("cellvalue");
    });

    test('array with one object creates table with headers and one row of data', ()=>{
        let dataTable = new GenericDataTable();
        const utils = new GenericDataTableUtils();

        expect(utils.setGenericDataTableFromDataObjects(dataTable,[{"header1":"cellvalue1", "header2":"cellvalue2"}])).toBe(true);

        expect(dataTable.getHeaders().length).toBe(2);
        expect(dataTable.getHeaders()[0]).toBe("header1");
        expect(dataTable.getHeaders()[1]).toBe("header2");
        expect(dataTable.getRowCount()).toBe(1);
        expect(dataTable.getCell(0,0)).toBe("cellvalue1");
        expect(dataTable.getCell(0,1)).toBe("cellvalue2");
    })

    test('array with multiple objects with same keys, fills rows and headers', ()=>{
        let dataTable = new GenericDataTable();
        const utils = new GenericDataTableUtils();

        expect(utils.setGenericDataTableFromDataObjects(dataTable,[
            {"header1":"cellvalue1", "header2":"cellvalue2"},
            {"header1":"cellvalue3", "header2":"cellvalue4"}
        ])).toBe(true);


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
        const utils = new GenericDataTableUtils();

        expect(utils.setGenericDataTableFromDataObjects(dataTable,[
            {"header1":"cellvalue1", "header2":"cellvalue2"},
            {"header2":"cellvalue4", "header1":"cellvalue3"}
        ])).toBe(true);

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

