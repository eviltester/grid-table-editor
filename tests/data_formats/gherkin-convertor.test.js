import { GenericDataTable } from '../../js/data_formats/generic-data-table.js';
import {GherkinConvertor, GherkinOptions} from '../../js/data_formats/gherkin-convertor.js';

describe("can get values from a markdown table row", ()=>{

    test('even if malformed with no start', () => {

        let values = new GherkinConvertor().getOutputCellsFromTableRow("1|2|");

        expect(values).toEqual(expect.arrayContaining([1,2].map(s => s.toString())));
        expect(values.length).toBe(2);
    });

    test('even if malformed with no end', () => {

        let values = new GherkinConvertor().getOutputCellsFromTableRow("|1|2");

        expect(values).toEqual(expect.arrayContaining([1,2].map(s => s.toString())));
        expect(values.length).toBe(2);
    });

    test('even if malformed with no start or end', () => {

        let values = new GherkinConvertor().getOutputCellsFromTableRow("1|2");

        expect(values).toEqual(expect.arrayContaining([1,2].map(s => s.toString())));
        expect(values.length).toBe(2);
    });

    test('surrounding spaces are ignored', () => {

        let values = new GherkinConvertor().getOutputCellsFromTableRow(" |  1    |   2    |    ");

        expect(values).toEqual(expect.arrayContaining([1,2].map(s => s.toString())));
        expect(values.length).toBe(2);
    });

    test('spaces in a cell are significant', () => {

        let values = new GherkinConvertor().getOutputCellsFromTableRow("|1|2 3|");

        expect(values).toEqual(expect.arrayContaining(["1","2 3"]));
        expect(values.length).toBe(2);
    });

    test('blank values are processed', () => {

        let values = new GherkinConvertor().getOutputCellsFromTableRow("||2 3|");

        expect(values).toEqual(expect.arrayContaining(["","2 3"]));
        expect(values.length).toBe(2);
    });

});

describe("Can convert markdown tables to data suitable for a data grid",()=>{

    test('can convert a simple 2x3 table', () => {
        const basicTable =
`|heading 1|heading 2|
|row 0 cell 0|row 0 cell 1|
|row 1 cell 0|row 1 cell 1|
`    

        let table = new GherkinConvertor().toDataTable(basicTable);

        expect(table.getRowCount()).toBe(2);
        expect(table.getHeader(0)).toBe('heading 1');
        expect(table.getHeader(1)).toBe('heading 2');
        expect(table.getCell(0,0)).toBe('row 0 cell 0');
        expect(table.getCell(0,1)).toBe('row 0 cell 1');
        expect(table.getCell(1,0)).toBe('row 1 cell 0');
        expect(table.getCell(1,1)).toBe('row 1 cell 1');

        let data = new GherkinConvertor().gherkinTableToDataRows(basicTable);

        expect(data.length).toBe(3);
        expect(data[0][0]).toBe('heading 1');
        expect(data[0][1]).toBe('heading 2');
        expect(data[1][0]).toBe('row 0 cell 0');
        expect(data[1][1]).toBe('row 0 cell 1');
        expect(data[2][0]).toBe('row 1 cell 0');
        expect(data[2][1]).toBe('row 1 cell 1');

    });

    test('can handle embedded bars', () => {
        const basicTable =
`|head\\|ing 1|heading 2|
|row 0\\| cell 0|row 0 cell 1|
|row 1 cell 0|row 1 \\|cell 1|
`    
        let table = new GherkinConvertor().toDataTable(basicTable);

        expect(table.getRowCount()).toBe(2);
        expect(table.getHeader(0)).toBe('head|ing 1');
        expect(table.getHeader(1)).toBe('heading 2');
        expect(table.getCell(0,0)).toBe('row 0| cell 0');
        expect(table.getCell(0,1)).toBe('row 0 cell 1');
        expect(table.getCell(1,0)).toBe('row 1 cell 0');
        expect(table.getCell(1,1)).toBe('row 1 |cell 1');

        let data = new GherkinConvertor().gherkinTableToDataRows(basicTable);

        expect(data.length).toBe(3);
        expect(data[0][0]).toBe('head|ing 1');
        expect(data[0][1]).toBe('heading 2');
        expect(data[1][0]).toBe('row 0| cell 0');
        expect(data[1][1]).toBe('row 0 cell 1');
        expect(data[2][0]).toBe('row 1 cell 0');
        expect(data[2][1]).toBe('row 1 |cell 1');
    });

    test('empty table returns empty array', () => {
        const basicTable = "";

        let table = new GherkinConvertor().toDataTable(basicTable);

        expect(table.getRowCount()).toBe(0);
        expect(table.getColumnCount()).toBe(0);

        let data = new GherkinConvertor().gherkinTableToDataRows(basicTable);

        expect(data.length).toBe(0);
    });


    test('skips empty rows at start', () => {
        const basicTable =
`


|heading 1|heading 2|
|row 0 cell 0|row 0 cell 1|
|row 1 cell 0|row 1 cell 1|
`    

        let table = new GherkinConvertor().toDataTable(basicTable);

        expect(table.getRowCount()).toBe(2);
        expect(table.getHeader(0)).toBe('heading 1');
        expect(table.getHeader(1)).toBe('heading 2');
        expect(table.getCell(0,0)).toBe('row 0 cell 0');
        expect(table.getCell(0,1)).toBe('row 0 cell 1');
        expect(table.getCell(1,0)).toBe('row 1 cell 0');
        expect(table.getCell(1,1)).toBe('row 1 cell 1');

        let data = new GherkinConvertor().gherkinTableToDataRows(basicTable);

        expect(data.length).toBe(3);
        expect(data[0][0]).toBe('heading 1');
        expect(data[0][1]).toBe('heading 2');
        expect(data[1][0]).toBe('row 0 cell 0');
        expect(data[1][1]).toBe('row 0 cell 1');
        expect(data[2][0]).toBe('row 1 cell 0');
        expect(data[2][1]).toBe('row 1 cell 1');

    });

    test('skips empty rows at end', () => {
        const basicTable =
`|heading 1|heading 2|
|row 0 cell 0|row 0 cell 1|
|row 1 cell 0|row 1 cell 1|



`    

        let table = new GherkinConvertor().toDataTable(basicTable);

        expect(table.getRowCount()).toBe(2);
        expect(table.getHeader(0)).toBe('heading 1');
        expect(table.getHeader(1)).toBe('heading 2');
        expect(table.getCell(0,0)).toBe('row 0 cell 0');
        expect(table.getCell(0,1)).toBe('row 0 cell 1');
        expect(table.getCell(1,0)).toBe('row 1 cell 0');
        expect(table.getCell(1,1)).toBe('row 1 cell 1');

        let data = new GherkinConvertor().gherkinTableToDataRows(basicTable);

        expect(data.length).toBe(3);
        expect(data[0][0]).toBe('heading 1');
        expect(data[0][1]).toBe('heading 2');
        expect(data[1][0]).toBe('row 0 cell 0');
        expect(data[1][1]).toBe('row 0 cell 1');
        expect(data[2][0]).toBe('row 1 cell 0');
        expect(data[2][1]).toBe('row 1 cell 1');

    });


    test('terminate processing if empty rows in middle', () => {
        const basicTable =
`|heading -1|heading -2|
|row 0 cell 0|row 0 cell 1|


|row 1 cell 0|row 1 cell 1|
`    
        

        let table = new GherkinConvertor().toDataTable(basicTable);

        expect(table.getRowCount()).toBe(1);
        expect(table.getHeader(0)).toBe('heading -1');
        expect(table.getHeader(1)).toBe('heading -2');
        expect(table.getCell(0,0)).toBe('row 0 cell 0');
        expect(table.getCell(0,1)).toBe('row 0 cell 1');

        let data = new GherkinConvertor().gherkinTableToDataRows(basicTable);

        expect(data.length).toBe(2);
        expect(data[0][0]).toBe('heading -1');
        expect(data[0][1]).toBe('heading -2');
        expect(data[1][0]).toBe('row 0 cell 0');
        expect(data[1][1]).toBe('row 0 cell 1');
    });


    test('handle new line formats', () => {
        const basicTable =
"\r\n"+        
"|heading -1|heading -2|\r\n"+
"|row 0 cell 0|row 0 cell 1|\r\n"+
"\r\n"+
"\r\n"+
"|row 1 cell 0|row 1 cell 1|\r\n"
    
        

        let table = new GherkinConvertor().toDataTable(basicTable);

        expect(table.getRowCount()).toBe(1);
        expect(table.getHeader(0)).toBe('heading -1');
        expect(table.getHeader(1)).toBe('heading -2');
        expect(table.getCell(0,0)).toBe('row 0 cell 0');
        expect(table.getCell(0,1)).toBe('row 0 cell 1');

        let data = new GherkinConvertor().gherkinTableToDataRows(basicTable);

        expect(data.length).toBe(2);
        expect(data[0][0]).toBe('heading -1');
        expect(data[0][1]).toBe('heading -2');
        expect(data[1][0]).toBe('row 0 cell 0');
        expect(data[1][1]).toBe('row 0 cell 1');
    });

    test('handle empty column on left', () => {
        const basicTable =
`|heading 1|heading 2|
| |row 0 cell 1|
||row 1 cell 1|
`    
        

        let table = new GherkinConvertor().toDataTable(basicTable);

        expect(table.getRowCount()).toBe(2);
        expect(table.getHeader(0)).toBe('heading 1');
        expect(table.getHeader(1)).toBe('heading 2');
        expect(table.getCell(0,0)).toBe('');
        expect(table.getCell(0,1)).toBe('row 0 cell 1');
        expect(table.getCell(1,0)).toBe('');
        expect(table.getCell(1,1)).toBe('row 1 cell 1');

        let data = new GherkinConvertor().gherkinTableToDataRows(basicTable);

        expect(data.length).toBe(3);
        expect(data[0][0]).toBe('heading 1');
        expect(data[0][1]).toBe('heading 2');
        expect(data[1][0]).toBe('');
        expect(data[1][1]).toBe('row 0 cell 1');
        expect(data[2][0]).toBe('');
        expect(data[2][1]).toBe('row 1 cell 1');
    });



    describe("Can convert generic data grids to gherkin tables",()=>{

        test('can convert a simple 2x3 table to gherkin table', () => {
            const basicTable =
`|heading 1|heading 2|
|row 0 cell 0|row 0 cell 1|
|row 1 cell 0|row 1 cell 1|
`    
    
            let table = new GherkinConvertor().toDataTable(basicTable);

            let output = new GherkinConvertor().fromDataTable(table);

            expect(output).toBe(basicTable);
        });

        test('can a table and escape bars', () => {
            const expected =
`|heading\\| 1|heading 2|h3|h4|
|\\|start bar|data \\| bar|end bar\\||\\|start and end bar\\||
`    
    
            let table = new GenericDataTable();
            table.setHeaders(["heading| 1", "heading 2", "h3", "h4"]);
            table.appendDataRow(["|start bar","data | bar", "end bar|", "|start and end bar|"])

            let output = new GherkinConvertor().fromDataTable(table);

            expect(output).toBe(expected);
        });

    });
});


describe("can pad cells", ()=>{


    test('pad a cell', ()=>{
        let convertor = new GherkinConvertor();

        expect(convertor.padCell("h1",4)).toEqual("h1  ");
        expect(convertor.padCell("h1",10)).toEqual("h1        ");
        expect(convertor.padCell("h1",1)).toEqual("h1");
    })
});


describe("can apply options to Gherkin Table Generation", ()=>{

    const table = new GenericDataTable();
    table.setHeaders(["h1","h2"]);
    table.appendDataRow(["r0c0","r0c1"]);
    table.appendDataRow(["r1c0","r1c1"]);

    test('can hide headings', () => {
        const expected =
`|r0c0|r0c1|
|r1c0|r1c1|
`;

        let convertorOptions = new GherkinOptions();
        convertorOptions.options.showHeadings=false;

        let convertor =  new GherkinConvertor();
        convertor.setOptions(convertorOptions);
        let output = convertor.fromDataTable(table);
        expect(output).toEqual(expected);
    });

    test('can indent table from left', () => {
        const expected =
` |h1|h2|
 |r0c0|r0c1|
 |r1c0|r1c1|
`;

        let convertorOptions = new GherkinOptions();
        convertorOptions.options.leftIndent=" ";

        let convertor =  new GherkinConvertor();
        convertor.setOptions(convertorOptions);
        let output = convertor.fromDataTable(table);
        expect(output).toEqual(expected);
    });

    test('can pad in cell on left', () => {
        const expected =
`| h1| h2|
| r0c0| r0c1|
| r1c0| r1c1|
`;

        let convertorOptions = new GherkinOptions();
        convertorOptions.options.inCellPadding="left";

        let convertor =  new GherkinConvertor();
        convertor.setOptions(convertorOptions);
        let output = convertor.fromDataTable(table);

        expect(output).toEqual(expected);
    }); 
    
    test('can pad in cell on both sides', () => {
        const expected =
`| h1 | h2 |
| r0c0 | r0c1 |
| r1c0 | r1c1 |
`;

        let convertorOptions = new GherkinOptions();
        convertorOptions.options.inCellPadding="both";

        let convertor =  new GherkinConvertor();
        convertor.setOptions(convertorOptions);
        let output = convertor.fromDataTable(table);

        expect(output).toEqual(expected);
    });     


    test('can pad in cell on right sides', () => {
        const expected =
`|h1 |h2 |
|r0c0 |r0c1 |
|r1c0 |r1c1 |
`;

        let convertorOptions = new GherkinOptions();
        convertorOptions.options.inCellPadding="right";

        let convertor =  new GherkinConvertor();
        convertor.setOptions(convertorOptions);
        let output = convertor.fromDataTable(table);

        expect(output).toEqual(expected);
    });       

    test('can pretty print table', () => {
        const expected =
`|h1  |h2  |
|r0c0|r0c1|
|r1c0|r1c1|
`;

        let convertorOptions = new GherkinOptions();
        convertorOptions.options.prettyPrint=true;

        let convertor =  new GherkinConvertor();
        convertor.setOptions(convertorOptions);
        let output = convertor.fromDataTable(table);

        expect(output).toEqual(expected);
    });

    test('can pretty print table with row cell length mix', () => {
        const expected =
`|title is            |author is             |
|quite a long title  |the longer author name|
|an even longer title|the author name       |
`;

        let authortable = new GenericDataTable();
        authortable.setHeaders(["title is", "author is"]);
        authortable.appendDataRow(["quite a long title","the longer author name"])
        authortable.appendDataRow(["an even longer title","the author name"])

        let convertorOptions = new GherkinOptions();
        convertorOptions.options.prettyPrint=true;

        let convertor =  new GherkinConvertor();
        convertor.setOptions(convertorOptions);
        let output = convertor.fromDataTable(authortable);
        expect(output).toEqual(expected);
    });   
    
    test('can combine formatting options', () => {
        const expected =
` | title              | author          |
 | quite a long title | the author name |
`;

        let authortable = new GenericDataTable();
        authortable.setHeaders(["title", "author"]);
        authortable.appendDataRow(["quite a long title","the author name"])

        let convertorOptions = new GherkinOptions();
        convertorOptions.options.prettyPrint=true;
        convertorOptions.options.leftIndent=" ";
        convertorOptions.options.inCellPadding="both";
        convertorOptions.options.inCellPadder=" ";

        let convertor =  new GherkinConvertor(convertorOptions);

        let output = convertor.fromDataTable(authortable);

        expect(output).toEqual(expected);
    });    
});

// TODO: cover character escaping and cell formatting implemented by getValidTableCellValueFromInputFormatCell