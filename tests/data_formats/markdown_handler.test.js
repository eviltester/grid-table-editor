import {MarkdownConvertor} from '../../data_formats/markdown_handler';

describe("Can convert markdown tables to data suitable for a data grid",()=>{

    test('can convert a simple 2x3 table', () => {
        const basicTable =
`|heading 1|heading 2|
|-------|-------|
|row 0 cell 0|row 0 cell 1|
|row 1 cell 0|row 1 cell 1|
`    
        let data = new MarkdownConvertor().markdownTableToDataRows(basicTable);

        //todo: convert data to a GenericDataTable here and use that in all our tests, then migrate the code to use GenericDataTable
        //console.log(data);

        expect(data.length).toBe(3);
        expect(data[0][0]).toBe('heading 1');
        expect(data[0][1]).toBe('heading 2');
        expect(data[1][0]).toBe('row 0 cell 0');
        expect(data[1][1]).toBe('row 0 cell 1');
        expect(data[2][0]).toBe('row 1 cell 0');
        expect(data[2][1]).toBe('row 1 cell 1');

    });

    test('empty table returns empty array', () => {
        const basicTable = "";

        let data = new MarkdownConvertor().markdownTableToDataRows(basicTable);

        //todo: convert data to a GenericDataTable here and use that in all our tests, then migrate the code to use GenericDataTable
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
        let data = new MarkdownConvertor().markdownTableToDataRows(basicTable);

        //todo: convert data to a GenericDataTable here and use that in all our tests, then migrate the code to use GenericDataTable
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
        let data = new MarkdownConvertor().markdownTableToDataRows(basicTable);

        //todo: convert data to a GenericDataTable here and use that in all our tests, then migrate the code to use GenericDataTable
        //console.log(data);

        expect(data.length).toBe(3);
        expect(data[0][0]).toBe('heading 1');
        expect(data[0][1]).toBe('heading 2');
        expect(data[1][0]).toBe('row 0 cell 0');
        expect(data[1][1]).toBe('row 0 cell 1');
        expect(data[2][0]).toBe('row 1 cell 0');
        expect(data[2][1]).toBe('row 1 cell 1');

    });


    // todo: split is removing blank lines in the middle rather than stopping processing early
    // we should fix this
    test.skip('terminate processing if empty rows in middle', () => {
        const basicTable =
`|heading -1|heading -2|
|-------|-------|
|row 0 cell 0|row 0 cell 1|


|row 1 cell 0|row 1 cell 1|
`    
        let data = new MarkdownConvertor().markdownTableToDataRows(basicTable);

        //todo: convert data to a GenericDataTable here and use that in all our tests, then migrate the code to use GenericDataTable
        //console.log(data);

        console.log(data);
        expect(data.length).toBe(2);
        expect(data[0][0]).toBe('heading -1');
        expect(data[0][1]).toBe('heading -2');
        expect(data[1][0]).toBe('row 0 cell 0');
        expect(data[1][1]).toBe('row 0 cell 1');
    });
});