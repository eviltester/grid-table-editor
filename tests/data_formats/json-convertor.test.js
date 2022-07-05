import { GenericDataTable } from '../../js/data_formats/generic-data-table.js';
import {JsonConvertor, JsonConvertorOptions} from '../../js/data_formats/json-convertor.js';
import Papa from "papaparse";


describe("Can use options to configure json output",()=>{

    const basicInputTable = new GenericDataTable();
    basicInputTable.setHeaders(["h1", "h2"]);
    basicInputTable.appendDataRow(["r0c0", "r0c1"]);
    basicInputTable.appendDataRow(["r1c0", "r1c1"]);

    test('can create json table from default config', () => {
        const expectedJson =
`[
\t{
\t\t"h1": "r0c0",
\t\t"h2": "r0c1"
\t},
\t{
\t\t"h1": "r1c0",
\t\t"h2": "r1c1"
\t}
]`    
        let config = new JsonConvertorOptions();
        let output = new JsonConvertor(config).fromDataTable(basicInputTable);
        expect(output).toBe(expectedJson);
    });

    test('can create json table using space delimiter', () => {
        const expectedJson =
`[
 {
  "h1": "r0c0",
  "h2": "r0c1"
 },
 {
  "h1": "r1c0",
  "h2": "r1c1"
 }
]`    
        let config = new JsonConvertorOptions();
        config.options.prettyPrintDelimiter=1;
        let output = new JsonConvertor(config).fromDataTable(basicInputTable);
        expect(output).toBe(expectedJson);
    });

    test('can create json table using string delimiter', () => {
        const expectedJson =
`[
-{
--"h1": "r0c0",
--"h2": "r0c1"
-},
-{
--"h1": "r1c0",
--"h2": "r1c1"
-}
]`    
        let config = new JsonConvertorOptions();
        config.options.prettyPrintDelimiter="-";
        let output = new JsonConvertor(config).fromDataTable(basicInputTable);
        expect(output).toBe(expectedJson);
    });

    test('can create json table using numeric delimiter', () => {
        const expectedJson =
`[
    {
        "h1": "r0c0",
        "h2": "r0c1"
    },
    {
        "h1": "r1c0",
        "h2": "r1c1"
    }
]`    
        let config = new JsonConvertorOptions();
        config.options.prettyPrintDelimiter="4";
        let output = new JsonConvertor(config).fromDataTable(basicInputTable);
        expect(output).toBe(expectedJson);
    });

    test('can create json table minified', () => {
        const expectedJson =`[{"h1":"r0c0","h2":"r0c1"},{"h1":"r1c0","h2":"r1c1"}]`;

        let config = new JsonConvertorOptions();
        config.options.prettyPrint=false;
        let output = new JsonConvertor(config).fromDataTable(basicInputTable);
        expect(output).toBe(expectedJson);
    });

    test('can create json object from default config', () => {
        const expectedJson =
`{"data":[{"h1":"r0c0","h2":"r0c1"},{"h1":"r1c0","h2":"r1c1"}]}`    
        let config = new JsonConvertorOptions();
        config.options.prettyPrint=false;
        config.options.asObject=true;
        let output = new JsonConvertor(config).fromDataTable(basicInputTable);
        expect(output).toBe(expectedJson);
    });

    test('can create json object with custom property', () => {
        const expectedJson =
`{"table":[{"h1":"r0c0","h2":"r0c1"},{"h1":"r1c0","h2":"r1c1"}]}`    
        let config = new JsonConvertorOptions();
        config.options.prettyPrint=false;
        config.options.asObject=true;
        config.options.asPropertyNamed="table";
        let output = new JsonConvertor(config).fromDataTable(basicInputTable);
        expect(output).toBe(expectedJson);
    });



    test('can supply a header name converter intended for javascript naming', () => {
        const expectedJson =
`[
\t{
\t\t"bobh1": "r0c0",
\t\t"bobh2": "r0c1"
\t},
\t{
\t\t"bobh1": "r1c0",
\t\t"bobh2": "r1c1"
\t}
]`    
        let config = new JsonConvertorOptions();
        config.headerNameConvertor = (x)=> "bob"+x;
        let output = new JsonConvertor(config).fromDataTable(basicInputTable);
        expect(output).toBe(expectedJson);
    });

    test('can create json table using numbers', () => {

        const inputTable = new GenericDataTable();
        inputTable.setHeaders(["h1", "h2"]);
        inputTable.appendDataRow(["0.0", "r0c1"]);
        inputTable.appendDataRow(["r1c0", 3]);

        const expectedJson =
`[
 {
  "h1": 0,
  "h2": "r0c1"
 },
 {
  "h1": "r1c0",
  "h2": 3
 }
]`    
        let config = new JsonConvertorOptions();
        config.options.prettyPrintDelimiter=1;
        config.options.makeNumbersNumeric=true;
        let output = new JsonConvertor(config).fromDataTable(inputTable);
        expect(output).toBe(expectedJson);
    });

    class PapaWrappa{

        parse(value, options){
            if(options){
                return Papa.parse(value, options);
            }
            return Papa.parse(value);
        }
    
        unparse(value, options){
            if(options){
                return Papa.unparse(value, options);
            }
            return Papa.unparse(value);
        }
    }

    //TODO: wrap papaparse to allow it to be mocked and used in tests
    describe("Can convert from data table to json output",()=>{

        const basicInputTable = new GenericDataTable();
        basicInputTable.setHeaders(["h1", "h2"]);
        basicInputTable.appendDataRow(["r0c0", "r0c1"]);
        basicInputTable.appendDataRow(["r1c0", "r1c1"]);

        // these test methods make the assumption that we can conver to data table
        test('can convert json with default asObject property to data table', () => {


            const expectedJson =
    `{"data":[{"h1":"r0c0","h2":"r0c1"},{"h1":"r1c0","h2":"r1c1"}]}`    
            let config = new JsonConvertorOptions();
            config.options.prettyPrint=false;
            config.options.asObject=true;
            let convertor = new JsonConvertor(config);
            convertor.setPapaParse(new PapaWrappa());
            let table = convertor.toDataTable(expectedJson);
            let json = convertor.fromDataTable(table);
            expect(json).toBe(expectedJson);
        });

        test('can convert json with default asObject property to data table', () => {
            const expectedJson =
    `{"data":[{"h1":"r0c0","h2":"r0c1"},{"h1":"r1c0","h2":"r1c1"}]}`    
            let config = new JsonConvertorOptions();
            config.options.prettyPrint=false;
            config.options.asObject=true;
            config.options.asPropertyNamed="data";
            let convertor = new JsonConvertor(config);
            convertor.setPapaParse(new PapaWrappa());
            let table = convertor.toDataTable(expectedJson);
            let json = convertor.fromDataTable(table);
            expect(json).toBe(expectedJson);
        });

        test('can convert json with custom property to data table', () => {
            const expectedJson =
    `{"table":[{"h1":"r0c0","h2":"r0c1"},{"h1":"r1c0","h2":"r1c1"}]}`    
            let config = new JsonConvertorOptions();
            config.options.prettyPrint=false;
            config.options.asObject=true;
            config.options.asPropertyNamed="table";
            let convertor = new JsonConvertor(config);
            convertor.setPapaParse(new PapaWrappa());
            let table = convertor.toDataTable(expectedJson);
            let json = convertor.fromDataTable(table);
            expect(json).toBe(expectedJson);
        });

        test('can convert json with custom property spaced to data table', () => {
            const expectedJson =
    `{"tab le":[{"h1":"r0c0","h2":"r0c1"},{"h1":"r1c0","h2":"r1c1"}]}`    
            let config = new JsonConvertorOptions();
            config.options.prettyPrint=false;
            config.options.asObject=true;
            config.options.asPropertyNamed="tab le";
            let convertor = new JsonConvertor(config);
            convertor.setPapaParse(new PapaWrappa());
            let table = convertor.toDataTable(expectedJson);
            let json = convertor.fromDataTable(table);
            expect(json).toBe(expectedJson);
        });
    });

    //TODO : if pretty print delimiter is a number then convert to an actual number to pass to stringify

});
