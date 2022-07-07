import { GenericDataTable } from '../../js/data_formats/generic-data-table.js';
import {JavascriptConvertor, JavascriptConvertorOptions} from '../../js/data_formats/javascript-convertor.js';


// because Javascript convertor wraps JSON convertor we mainly test the Javascript specific formatting

describe("Can convert to javascript output",()=>{

    const basicInputTable = new GenericDataTable();
    basicInputTable.setHeaders(["h 1", "h2"]);
    basicInputTable.appendDataRow(["r0c0", "r0c1"]);
    basicInputTable.appendDataRow(["r1c0", "r1c1"]);

    test('can create javascript from default config', () => {
        const expectedJson =
`[
\t{
\t\th_1: "r0c0",
\t\th2: "r0c1"
\t},
\t{
\t\th_1: "r1c0",
\t\th2: "r1c1"
\t}
]`    
        let config = new JavascriptConvertorOptions();
        let output = new JavascriptConvertor(config).fromDataTable(basicInputTable);
        expect(output).toBe(expectedJson);
    });

    test('can create javascript table using space delimiter', () => {
        const expectedJson =
`[
 {
  h_1: "r0c0",
  h2: "r0c1"
 },
 {
  h_1: "r1c0",
  h2: "r1c1"
 }
]`    
        let config = new JavascriptConvertorOptions();
        config.options.prettyPrintDelimiter=1;
        let output = new JavascriptConvertor(config).fromDataTable(basicInputTable);
        expect(output).toBe(expectedJson);
    });

    test('can create javascript table using string delimiter', () => {
        const expectedJson =
`[
-{
--h_1: "r0c0",
--h2: "r0c1"
-},
-{
--h_1: "r1c0",
--h2: "r1c1"
-}
]`    
        let config = new JavascriptConvertorOptions();
        config.options.prettyPrintDelimiter="-";
        let output = new JavascriptConvertor(config).fromDataTable(basicInputTable);
        expect(output).toBe(expectedJson);
    });

    test('can create javas table using numeric delimiter', () => {
        const expectedJson =
`[
    {
        h_1: "r0c0",
        h2: "r0c1"
    },
    {
        h_1: "r1c0",
        h2: "r1c1"
    }
]`    
        let config = new JavascriptConvertorOptions();
        config.options.prettyPrintDelimiter="4";
        let output = new JavascriptConvertor(config).fromDataTable(basicInputTable);
        expect(output).toBe(expectedJson);
    });

    test('can create javascript table minified', () => {
        const expectedJson =`[{h_1:"r0c0",h2:"r0c1"},{h_1:"r1c0",h2:"r1c1"}]`;

        let config = new JavascriptConvertorOptions();
        config.options.prettyPrint=false;
        let output = new JavascriptConvertor(config).fromDataTable(basicInputTable);
        expect(output).toBe(expectedJson);
    });

    test('can create javascript object from default config', () => {
        const expectedJson =
`{data:[{h_1:"r0c0",h2:"r0c1"},{h_1:"r1c0",h2:"r1c1"}]}`    
        let config = new JavascriptConvertorOptions();
        config.options.prettyPrint=false;
        config.options.asObject=true;
        let output = new JavascriptConvertor(config).fromDataTable(basicInputTable);
        expect(output).toBe(expectedJson);
    });

    test('can create javascript object with custom property', () => {
        const expectedJson =
`{tab_le:[{h_1:"r0c0",h2:"r0c1"},{h_1:"r1c0",h2:"r1c1"}]}`    
        let config = new JavascriptConvertorOptions();
        config.options.prettyPrint=false;
        config.options.asObject=true;
        config.options.asPropertyNamed="tab le";
        let output = new JavascriptConvertor(config).fromDataTable(basicInputTable);
        expect(output).toBe(expectedJson);
    });



    test('can create javascript using numbers', () => {

        const inputTable = new GenericDataTable();
        inputTable.setHeaders(["h 1", "h  2"]);
        inputTable.appendDataRow(["0.0", "r0c1"]);
        inputTable.appendDataRow(["r1c0", 3]);

        const expectedJson =
`[
 {
  h_1: 0,
  h__2: "r0c1"
 },
 {
  h_1: "r1c0",
  h__2: 3
 }
]`    
        let config = new JavascriptConvertorOptions();
        config.options.prettyPrintDelimiter=1;
        config.options.makeNumbersNumeric=true;
        let output = new JavascriptConvertor(config).fromDataTable(inputTable);
        expect(output).toBe(expectedJson);
    });



    describe("Can convert from javascript to data table",()=>{

        const basicInputTable = new GenericDataTable();
        basicInputTable.setHeaders(["h1", "h2"]);
        basicInputTable.appendDataRow(["r0c0", "r0c1"]);
        basicInputTable.appendDataRow(["r1c0", "r1c1"]);

        // these test methods make the assumption that we can convert to data table
        test('can convert javascript with default asObject property to data table', () => {


            // TODO: the h_1 should become "h 1"
            // TODO: allow configuring this as an option for Javascript
            const expectedJson =
    `{data:[{h_1:"r0c0",h2:"r0c1"},{h_1:"r1c0",h2:"r1c1"}]}`    
            let config = new JavascriptConvertorOptions();
            config.options.prettyPrint=false;
            config.options.asObject=true;
            let convertor = new JavascriptConvertor(config);
            let table = convertor.toDataTable(expectedJson);
            let js = convertor.fromDataTable(table);
            expect(js).toBe(expectedJson);
        });


        test('can convert javascript with custom property to data table', () => {
            const expectedJson =
    `{tab_le:[{h1:"r0c0",h2:"r0c1"},{h1:"r1c0",h2:"r1c1"}]}`    
            let config = new JavascriptConvertorOptions();
            config.options.prettyPrint=false;
            config.options.asObject=true;
            config.options.asPropertyNamed="tab_le";
            let convertor = new JavascriptConvertor(config);
            let table = convertor.toDataTable(expectedJson);
            let js = convertor.fromDataTable(table);
            expect(js).toBe(expectedJson);
        });

    });

});
