import {MarkdownConvertor, MarkdownOptions} from '../../js/data_formats/markdown-convertor.js';
import { GenericDataTable } from '../../js/data_formats/generic-data-table.js';

describe("can get values from a markdown table cell", ()=>{

    test("cell contents are trimmed",()=>{
        let input = "  contents   ";
        let output = "contents";
        let value = new MarkdownConvertor().getValidTableCellValueFromInputFormatCell(input);
        expect(value).toEqual(output);
    });

    test("escape bars are transformed",()=>{
        let input =  "con&#124;ten&#124;ts";
        let output ="con|ten|ts";
        let value = new MarkdownConvertor().getValidTableCellValueFromInputFormatCell(input);
        expect(value).toEqual(output);
    });

    // emphasis
    it.each([
        ['normalise inline emphasis',  "word _emphasised_ inline", "word emphasised inline"],
        ['normalise inline emphasis start',  "_emphasised_ at start", "emphasised at start"],
        ['normalise inline emphasis end',  "at end _emphasised_", "at end emphasised"],
        ['normalise only emphasis',  "_emphasised_", "emphasised"],
        ['padded emphasis',  "  _emphasised_  ", "emphasised"],
        ['incomplete emphasis',  "  _emphasis  ", "_emphasis"],
        ['not started emphasis',  " emphasis_  ", "emphasis_"],
        ['not emphasis',  " _ emphasis_  ", "_ emphasis_"],
        ['not emphasis either',  "  _emphasis _  ", "_emphasis _"],
        ['not emphasis without contents',  " __ test  ", "__ test"],
    ])
        ("emphasis markdown: %s - `%s` to `%s`",(when, input,output)=>{
        let value = new MarkdownConvertor().getValidTableCellValueFromInputFormatCell(input);
        expect(value).toEqual(output);
    });

    // bold
    it.each([
        ['normalise inline bold',  "word **bold** inline", "word bold inline"],
        ['normalise inline bold start',  "**bold** at start", "bold at start"],
        ['normalise inline bold end',  "at end **bold**", "at end bold"],
        ['normalise only bold',  "**bold**", "bold"],
        ['padded bold',  "  **bold**  ", "bold"],
        ['incomplete bold',  "  **bold  ", "**bold"],
        ['not started bold',  "  bold**  ", "bold**"],
        ['not bold',  "  ** bold**  ", "** bold**"],
        ['not bold either',  "  **bold **  ", "**bold **"],
        ['not bold without contents',  "  ****  ", "****"],
    ])
        ("emphasis markdown: %s - `%s` to `%s`",(when, input,output)=>{
        let value = new MarkdownConvertor().getValidTableCellValueFromInputFormatCell(input);
        expect(value).toEqual(output);
    });

});

describe("can get values from a markdown table row", ()=>{

    test('even if malformed with no start', () => {

        let values = new MarkdownConvertor().getOutputCellsFromTableRow("1|2|");

        expect(values).toEqual(expect.arrayContaining([1,2].map(s => s.toString())));
        expect(values.length).toBe(2);
    });

    test('even if malformed with no end', () => {

        let values = new MarkdownConvertor().getOutputCellsFromTableRow("|1|2");

        expect(values).toEqual(expect.arrayContaining([1,2].map(s => s.toString())));
        expect(values.length).toBe(2);
    });

    test('even if malformed with no start or end', () => {

        let values = new MarkdownConvertor().getOutputCellsFromTableRow("1|2");

        expect(values).toEqual(expect.arrayContaining([1,2].map(s => s.toString())));
        expect(values.length).toBe(2);
    });

    test('surrounding spaces are ignored', () => {

        let values = new MarkdownConvertor().getOutputCellsFromTableRow(" |  1    |   2    |    ");

        expect(values).toEqual(expect.arrayContaining([1,2].map(s => s.toString())));
        expect(values.length).toBe(2);
    });

    test('spaces in a cell are significant', () => {

        let values = new MarkdownConvertor().getOutputCellsFromTableRow("|1|2 3|");

        expect(values).toEqual(expect.arrayContaining(["1","2 3"]));
        expect(values.length).toBe(2);
    });

});

describe("a valid header is a minimum of |---|---| but we also support :", ()=>{

    test('when only - it fails', () => {
        expect(new MarkdownConvertor().isMarkdownTableSeparatorRowValid("|-|-|")).toBe(false);
    });

    test('when only -- it fails', () => {
        expect(new MarkdownConvertor().isMarkdownTableSeparatorRowValid("|--|--|")).toBe(false);
    });

    test('when empty it fails', () => {
        expect(new MarkdownConvertor().isMarkdownTableSeparatorRowValid("|  |  |")).toBe(false);
    });

    test('when very empty it fails', () => {
        expect(new MarkdownConvertor().isMarkdownTableSeparatorRowValid("|||")).toBe(false);
    });

    test('when only - single column', () => {
        expect(new MarkdownConvertor().isMarkdownTableSeparatorRowValid("|--|")).toBe(false);
    });

    test('when ---  it passes', () => {
        expect(new MarkdownConvertor().isMarkdownTableSeparatorRowValid("|---|")).toBe(true);
    });

    test('when missing start bar - it fails', () => {
        expect(new MarkdownConvertor().isMarkdownTableSeparatorRowValid("---|---|")).toBe(false);
    });


    test('when missing end bar - it fails', () => {
        expect(new MarkdownConvertor().isMarkdownTableSeparatorRowValid("|---|---")).toBe(false);
    });

    test('when missing start and end bars - it fails', () => {
        expect(new MarkdownConvertor().isMarkdownTableSeparatorRowValid("---|---")).toBe(false);
    });

    test('when mix of valid  it passes', () => {
        expect(new MarkdownConvertor().isMarkdownTableSeparatorRowValid("|---|----|-----|------|")).toBe(true);
    });

    test('in theory there is npt a limit to length', () => {
        expect(new MarkdownConvertor().isMarkdownTableSeparatorRowValid("|---|-----------------------------------------------------|-----|------|")).toBe(true);
    });

    test('preceding and trailing spaces are ignored', () => {
        expect(new MarkdownConvertor().isMarkdownTableSeparatorRowValid("   | --- | ----|----- | ------|     ")).toBe(true);
    });

    test('alignment values are allowed', () => {
        expect(new MarkdownConvertor().isMarkdownTableSeparatorRowValid("   | :---        |    :----:   |          ---: |     ")).toBe(true);
    });

    test('alignment values are validated', () => {
        expect(new MarkdownConvertor().isMarkdownTableSeparatorRowValid("   | ::---        |    :----:   |          ---: |     ")).toBe(false);
    });
});

describe("Can convert markdown tables to data suitable for a data grid",()=>{

    test('can convert a simple 2x3 table', () => {
        const basicTable =
`|heading 1|heading 2|
|-------|-------|
|row 0 cell 0|row 0 cell 1|
|row 1 cell 0|row 1 cell 1|
`    

        let table = new MarkdownConvertor().toDataTable(basicTable);

        expect(table.getRowCount()).toBe(2);
        expect(table.getHeader(0)).toBe('heading 1');
        expect(table.getHeader(1)).toBe('heading 2');
        expect(table.getCell(0,0)).toBe('row 0 cell 0');
        expect(table.getCell(0,1)).toBe('row 0 cell 1');
        expect(table.getCell(1,0)).toBe('row 1 cell 0');
        expect(table.getCell(1,1)).toBe('row 1 cell 1');

        let data = new MarkdownConvertor().markdownTableToDataRows(basicTable);

        //TODO : convert data to a GenericDataTable here and use that in all our tests, then migrate the code to use GenericDataTable
        //console.log(data);

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
`|head&#124;ing 1|heading 2|
|-------|-------|
|row 0&#124; cell 0|row 0 cell 1|
|row 1 cell 0|row 1 &#124;cell 1|
`    

        let table = new MarkdownConvertor().toDataTable(basicTable);

        expect(table.getRowCount()).toBe(2);
        expect(table.getHeader(0)).toBe('head|ing 1');
        expect(table.getHeader(1)).toBe('heading 2');
        expect(table.getCell(0,0)).toBe('row 0| cell 0');
        expect(table.getCell(0,1)).toBe('row 0 cell 1');
        expect(table.getCell(1,0)).toBe('row 1 cell 0');
        expect(table.getCell(1,1)).toBe('row 1 |cell 1');

        let data = new MarkdownConvertor().markdownTableToDataRows(basicTable);

        //TODO : convert data to a GenericDataTable here and use that in all our tests, then migrate the code to use GenericDataTable
        //console.log(data);

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

        let table = new MarkdownConvertor().toDataTable(basicTable);

        expect(table.getRowCount()).toBe(0);
        expect(table.getColumnCount()).toBe(0);

        let data = new MarkdownConvertor().markdownTableToDataRows(basicTable);

        //TODO : convert data to a GenericDataTable here and use that in all our tests, then migrate the code to use GenericDataTable
        //console.log(data);

        expect(data.length).toBe(0);
    });


    test('skips empty rows at start', () => {
        const basicTable =
`


|heading 1|heading 2|
|-------|-------|
|row 0 cell 0|row 0 cell 1|
|row 1 cell 0|row 1 cell 1|
`    

        let table = new MarkdownConvertor().toDataTable(basicTable);

        expect(table.getRowCount()).toBe(2);
        expect(table.getHeader(0)).toBe('heading 1');
        expect(table.getHeader(1)).toBe('heading 2');
        expect(table.getCell(0,0)).toBe('row 0 cell 0');
        expect(table.getCell(0,1)).toBe('row 0 cell 1');
        expect(table.getCell(1,0)).toBe('row 1 cell 0');
        expect(table.getCell(1,1)).toBe('row 1 cell 1');

        let data = new MarkdownConvertor().markdownTableToDataRows(basicTable);

        //TODO : convert data to a GenericDataTable here and use that in all our tests, then migrate the code to use GenericDataTable
        //console.log(data);

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
|-------|-------|
|row 0 cell 0|row 0 cell 1|
|row 1 cell 0|row 1 cell 1|



`    

        let table = new MarkdownConvertor().toDataTable(basicTable);

        expect(table.getRowCount()).toBe(2);
        expect(table.getHeader(0)).toBe('heading 1');
        expect(table.getHeader(1)).toBe('heading 2');
        expect(table.getCell(0,0)).toBe('row 0 cell 0');
        expect(table.getCell(0,1)).toBe('row 0 cell 1');
        expect(table.getCell(1,0)).toBe('row 1 cell 0');
        expect(table.getCell(1,1)).toBe('row 1 cell 1');

        let data = new MarkdownConvertor().markdownTableToDataRows(basicTable);

        //TODO : convert data to a GenericDataTable here and use that in all our tests, then migrate the code to use GenericDataTable
        //console.log(data);

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
|-------|-------|
|row 0 cell 0|row 0 cell 1|


|row 1 cell 0|row 1 cell 1|
`    

        let table = new MarkdownConvertor().toDataTable(basicTable);

        expect(table.getRowCount()).toBe(1);
        expect(table.getHeader(0)).toBe('heading -1');
        expect(table.getHeader(1)).toBe('heading -2');
        expect(table.getCell(0,0)).toBe('row 0 cell 0');
        expect(table.getCell(0,1)).toBe('row 0 cell 1');

        let data = new MarkdownConvertor().markdownTableToDataRows(basicTable);

        //TODO : convert data to a GenericDataTable here and use that in all our tests, then migrate the code to use GenericDataTable
        expect(data.length).toBe(2);
        expect(data[0][0]).toBe('heading -1');
        expect(data[0][1]).toBe('heading -2');
        expect(data[1][0]).toBe('row 0 cell 0');
        expect(data[1][1]).toBe('row 0 cell 1');
    });


    test('table should have 3 or more - 1 is not valid', () => {
        const basicTable =
`|heading -1|heading -2|
|-|-|
|row 0 cell 0|row 0 cell 1|
`    

        let options = new MarkdownOptions();
        options.validateSeparatorLength=true;

        let table = new MarkdownConvertor(options).toDataTable(basicTable);

        expect(table.getColumnCount()).toBe(0);
        expect(table.getRowCount()).toBe(0);

        let data = new MarkdownConvertor(options).markdownTableToDataRows(basicTable);

        //TODO : convert data to a GenericDataTable here and use that in all our tests, then migrate the code to use GenericDataTable

        expect(data.length).toBe(0);
    });


    test('handle new line formats', () => {
        const basicTable =
"\r\n"+        
"|heading -1|heading -2|\r\n"+
"|-------|-------|\r\n"+
"|row 0 cell 0|row 0 cell 1|\r\n"+
"\r\n"+
"\r\n"+
"|row 1 cell 0|row 1 cell 1|\r\n"
    

        let table = new MarkdownConvertor().toDataTable(basicTable);

        expect(table.getRowCount()).toBe(1);
        expect(table.getHeader(0)).toBe('heading -1');
        expect(table.getHeader(1)).toBe('heading -2');
        expect(table.getCell(0,0)).toBe('row 0 cell 0');
        expect(table.getCell(0,1)).toBe('row 0 cell 1');

        let data = new MarkdownConvertor().markdownTableToDataRows(basicTable);

        //TODO : convert data to a GenericDataTable here and use that in all our tests, then migrate the code to use GenericDataTable
        expect(data.length).toBe(2);
        expect(data[0][0]).toBe('heading -1');
        expect(data[0][1]).toBe('heading -2');
        expect(data[1][0]).toBe('row 0 cell 0');
        expect(data[1][1]).toBe('row 0 cell 1');
    });

    test('handle empty column on left', () => {
        const basicTable =
`|heading 1|heading 2|
|-------|-------|
| |row 0 cell 1|
||row 1 cell 1|
`    

        let table = new MarkdownConvertor().toDataTable(basicTable);

        expect(table.getRowCount()).toBe(2);
        expect(table.getHeader(0)).toBe('heading 1');
        expect(table.getHeader(1)).toBe('heading 2');
        expect(table.getCell(0,0)).toBe('');
        expect(table.getCell(0,1)).toBe('row 0 cell 1');
        expect(table.getCell(1,0)).toBe('');
        expect(table.getCell(1,1)).toBe('row 1 cell 1');

        let data = new MarkdownConvertor().markdownTableToDataRows(basicTable);

        //TODO : convert data to a GenericDataTable here and use that in all our tests, then migrate the code to use GenericDataTable
        //console.log(data);

        expect(data.length).toBe(3);
        expect(data[0][0]).toBe('heading 1');
        expect(data[0][1]).toBe('heading 2');
        expect(data[1][0]).toBe('');
        expect(data[1][1]).toBe('row 0 cell 1');
        expect(data[2][0]).toBe('');
        expect(data[2][1]).toBe('row 1 cell 1');

    });


    describe("Can convert generic data grids to markdown tables",()=>{

        test('can convert a simple 2x3 table to markdown table', () => {
            const basicTable =
`|heading 1|heading 2|
|-----|-----|
|row 0 cell 0|row 0 cell 1|
|row 1 cell 0|row 1 cell 1|
`    
    
            let table = new MarkdownConvertor().toDataTable(basicTable);

            let output = new MarkdownConvertor().fromDataTable(table);

            expect(output).toBe(basicTable);
        });

        test('convert a table and escape bars', () => {
            const expected =
`|heading&#124; 1|heading 2|h3|h4|
|-----|-----|-----|-----|
|&#124;start bar|data &#124; bar|end bar&#124;|&#124;start and end bar&#124;|
`    
    
            let table = new GenericDataTable();
            table.setHeaders(["heading| 1", "heading 2", "h3", "h4"]);
            table.appendDataRow(["|start bar","data | bar", "end bar|", "|start and end bar|"])

            let output = new MarkdownConvertor().fromDataTable(table);

            expect(output).toBe(expected);
        });

    });

    describe("Can use options to configure output of markdown",()=>{

        const basicInputTable =
`|heading 1|heading 2|
|-----|-----|
|row 0 cell 0|row 0 cell 1|
|row 1 cell 0|row 1 cell 1|
` 

        test('can create markdown table without borders', () => {
            const expectedOutputTable =
`heading 1|heading 2
-----|-----
row 0 cell 0|row 0 cell 1
row 1 cell 0|row 1 cell 1
`    
    
            let table = new MarkdownConvertor().toDataTable(basicInputTable);
            let markdownOptions = new MarkdownOptions();
            markdownOptions.options.borderBars=false;
            let output = new MarkdownConvertor(markdownOptions).fromDataTable(table);
            expect(output).toBe(expectedOutputTable);
        });

        test('can create markdown table with emboldened headers', () => {
            const expectedOutputTable =
`|**heading 1**|**heading 2**|
|-----|-----|
|row 0 cell 0|row 0 cell 1|
|row 1 cell 0|row 1 cell 1|
`    
    
            let table = new MarkdownConvertor().toDataTable(basicInputTable);
            let markdownOptions = new MarkdownOptions();
            markdownOptions.options.emboldenHeaders=true;
            let output = new MarkdownConvertor(markdownOptions).fromDataTable(table);
            expect(output).toBe(expectedOutputTable);
        });

        test('can create markdown table with emphasised headers', () => {
            const expectedOutputTable =
`|_heading 1_|_heading 2_|
|-----|-----|
|row 0 cell 0|row 0 cell 1|
|row 1 cell 0|row 1 cell 1|
`    
    
            let table = new MarkdownConvertor().toDataTable(basicInputTable);
            let markdownOptions = new MarkdownOptions();
            markdownOptions.options.emphasisHeaders=true;
            let output = new MarkdownConvertor(markdownOptions).fromDataTable(table);
            expect(output).toBe(expectedOutputTable);
        });

        test('can create markdown table with space padding to left', () => {
            const expectedOutputTable =
`| heading 1| heading 2|
| -----| -----|
| row 0 cell 0| row 0 cell 1|
| row 1 cell 0| row 1 cell 1|
`    
    
            let table = new MarkdownConvertor().toDataTable(basicInputTable);
            let markdownOptions = new MarkdownOptions();
            markdownOptions.options.spacePadding='left';
            let output = new MarkdownConvertor(markdownOptions).fromDataTable(table);
            expect(output).toBe(expectedOutputTable);
        });

        test('can create markdown table with space padding to right', () => {
            const expectedOutputTable =
`|heading 1 |heading 2 |
|----- |----- |
|row 0 cell 0 |row 0 cell 1 |
|row 1 cell 0 |row 1 cell 1 |
`    
    
            let table = new MarkdownConvertor().toDataTable(basicInputTable);
            let markdownOptions = new MarkdownOptions();
            markdownOptions.options.spacePadding='right';
            let output = new MarkdownConvertor(markdownOptions).fromDataTable(table);
            expect(output).toBe(expectedOutputTable);
        });

        test('can create markdown table with space padding to left and right', () => {
            const expectedOutputTable =
`| heading 1 | heading 2 |
| ----- | ----- |
| row 0 cell 0 | row 0 cell 1 |
| row 1 cell 0 | row 1 cell 1 |
`    
    
            let table = new MarkdownConvertor().toDataTable(basicInputTable);
            let markdownOptions = new MarkdownOptions();
            markdownOptions.options.spacePadding='both';
            let output = new MarkdownConvertor(markdownOptions).fromDataTable(table);
            expect(output).toBe(expectedOutputTable);
        });

        test('can create markdown table with tab padding to left', () => {
            const expectedOutputTable =
`|\theading 1|\theading 2|
|\t-----|\t-----|
|\trow 0 cell 0|\trow 0 cell 1|
|\trow 1 cell 0|\trow 1 cell 1|
`    
    
            let table = new MarkdownConvertor().toDataTable(basicInputTable);
            let markdownOptions = new MarkdownOptions();
            markdownOptions.options.tabPadding='left';
            let output = new MarkdownConvertor(markdownOptions).fromDataTable(table);
            expect(output).toBe(expectedOutputTable);
        });

        test('can create markdown table with tab padding to left and right', () => {
            const expectedOutputTable =
`|\theading 1\t|\theading 2\t|
|\t-----\t|\t-----\t|
|\trow 0 cell 0\t|\trow 0 cell 1\t|
|\trow 1 cell 0\t|\trow 1 cell 1\t|
`    
    
            let table = new MarkdownConvertor().toDataTable(basicInputTable);
            let markdownOptions = new MarkdownOptions();
            markdownOptions.options.tabPadding='both';
            let output = new MarkdownConvertor(markdownOptions).fromDataTable(table);
            expect(output).toBe(expectedOutputTable);
        });

        test('can create markdown table with tab padding to right', () => {
            const expectedOutputTable =
`|heading 1\t|heading 2\t|
|-----\t|-----\t|
|row 0 cell 0\t|row 0 cell 1\t|
|row 1 cell 0\t|row 1 cell 1\t|
`    
    
            let table = new MarkdownConvertor().toDataTable(basicInputTable);
            let markdownOptions = new MarkdownOptions();
            markdownOptions.options.tabPadding='right';
            let output = new MarkdownConvertor(markdownOptions).fromDataTable(table);
            expect(output).toBe(expectedOutputTable);
        });

        test('can create markdown table with emboldend columns', () => {
            const expectedOutputTable =
`|**heading 1**|heading 2|
|-----|-----|
|**row 0 cell 0**|row 0 cell 1|
|**row 1 cell 0**|row 1 cell 1|
`    
    
            let table = new MarkdownConvertor().toDataTable(basicInputTable);
            let markdownOptions = new MarkdownOptions();
            markdownOptions.options.emboldenColumns=[1];
            let output = new MarkdownConvertor(markdownOptions).fromDataTable(table);
            expect(output).toBe(expectedOutputTable);
        });

        test('can create markdown table with ephasised columns', () => {
            const expectedOutputTable =
`|heading 1|_heading 2_|
|-----|-----|
|row 0 cell 0|_row 0 cell 1_|
|row 1 cell 0|_row 1 cell 1_|
`    
    
            let table = new MarkdownConvertor().toDataTable(basicInputTable);
            let markdownOptions = new MarkdownOptions();
            markdownOptions.options.emphasisColumns=[2];
            let output = new MarkdownConvertor(markdownOptions).fromDataTable(table);
            expect(output).toBe(expectedOutputTable);
        });

        test('can align columns at global level by default nothing happens', () => {
            const expectedOutputTable =
`|heading 1|heading 2|
|-----|-----|
|row 0 cell 0|row 0 cell 1|
|row 1 cell 0|row 1 cell 1|
`    
    
            let table = new MarkdownConvertor().toDataTable(basicInputTable);
            let markdownOptions = new MarkdownOptions();
            markdownOptions.options.globalColumnAlign='default';
            let output = new MarkdownConvertor(markdownOptions).fromDataTable(table);
            expect(output).toBe(expectedOutputTable);
        });

        test('can align columns at global level to left align', () => {
            const expectedOutputTable =
`|heading 1|heading 2|
|:-----|:-----|
|row 0 cell 0|row 0 cell 1|
|row 1 cell 0|row 1 cell 1|
`    
    
            let table = new MarkdownConvertor().toDataTable(basicInputTable);
            let markdownOptions = new MarkdownOptions();
            markdownOptions.options.globalColumnAlign='left';
            let output = new MarkdownConvertor(markdownOptions).fromDataTable(table);
            expect(output).toBe(expectedOutputTable);
        });

        test('can align columns at global level to right align', () => {
            const expectedOutputTable =
`|heading 1|heading 2|
|-----:|-----:|
|row 0 cell 0|row 0 cell 1|
|row 1 cell 0|row 1 cell 1|
`    
    
            let table = new MarkdownConvertor().toDataTable(basicInputTable);
            let markdownOptions = new MarkdownOptions();
            markdownOptions.options.globalColumnAlign='right';
            let output = new MarkdownConvertor(markdownOptions).fromDataTable(table);
            expect(output).toBe(expectedOutputTable);
        });

        test('can align columns at global level to center align', () => {
            const expectedOutputTable =
`|heading 1|heading 2|
|:-----:|:-----:|
|row 0 cell 0|row 0 cell 1|
|row 1 cell 0|row 1 cell 1|
`    
    
            let table = new MarkdownConvertor().toDataTable(basicInputTable);
            let markdownOptions = new MarkdownOptions();
            markdownOptions.options.globalColumnAlign='center';
            let output = new MarkdownConvertor(markdownOptions).fromDataTable(table);
            expect(output).toBe(expectedOutputTable);
        });

        test('can pretty print a table', () => {
            const basicTable =
`|heading 1|heading 2|
|-------|-------|
|row 0 cell 0|row 0 cell 1|
|row 1 cell 0|row 1 cell 1|
`    
    
            let table = new MarkdownConvertor().toDataTable(basicTable);
    
 

            let markdownOptions = new MarkdownOptions();
            markdownOptions.options.prettyPrint=true;
           
            let convertor = new MarkdownConvertor(markdownOptions);

            let output = convertor.fromDataTable(table);
    
            const expected =
`|heading 1   |heading 2   |
|------------|------------|
|row 0 cell 0|row 0 cell 1|
|row 1 cell 0|row 1 cell 1|
`
            expect(output).toBe(expected);
        });
    });


    test('can center a pretty printed ', () => {
        const basicTable =
`|heading 1|heading 2|
|-------|-------|
|row 0 c 0|row 0 and in cell 1|
|row of the 1 cell 0|row1cell1|
`    

        let table = new MarkdownConvertor().toDataTable(basicTable);

        let markdownOptions = new MarkdownOptions();
        markdownOptions.options.prettyPrint=true;
        markdownOptions.options.globalColumnAlign="center";
       
        let convertor = new MarkdownConvertor(markdownOptions);

        let output = convertor.fromDataTable(table);

        const expected =
`|     heading 1     |     heading 2     |
|:-----------------:|:-----------------:|
|     row 0 c 0     |row 0 and in cell 1|
|row of the 1 cell 0|     row1cell1     |
`
        expect(output).toBe(expected);
    });    


    test('can right align a pretty printed ', () => {
        const basicTable =
`|heading 1|heading 2|
|-------|-------|
|row 0 c 0|row 0 and in cell 1|
|row of the 1 cell 0|row1cell1|
`    

        let table = new MarkdownConvertor().toDataTable(basicTable);

        let markdownOptions = new MarkdownOptions();
        markdownOptions.options.prettyPrint=true;
        markdownOptions.options.globalColumnAlign="right";
       
        let convertor = new MarkdownConvertor(markdownOptions);

        let output = convertor.fromDataTable(table);

        const expected =
`|          heading 1|          heading 2|
|------------------:|------------------:|
|          row 0 c 0|row 0 and in cell 1|
|row of the 1 cell 0|          row1cell1|
`
        expect(output).toBe(expected);
    });   

});