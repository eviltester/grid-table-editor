import Papa from 'papaparse';

describe("Check papa parse can meet multi char delimiter requirements",()=>{

    test('basic one char example to check it all works', () => {

        let parsed = Papa.parse("a,b,c",{header: false, delimiter:','});
        expect(parsed.data.length).toBe(1);
        expect(parsed.data[0][0]).toBe("a");
    })

    test(',space as simple delimiter', () => {

        let parsed = Papa.parse("a, b, c",{header: false, delimiter:', '});
        expect(parsed.data.length).toBe(1);
        expect(parsed.data[0][0]).toBe("a");
    })

    test(',space as simple delmiter with multi line input', () => {
        let inputData = `"test", "test2"
"123a", "456a"
"123b", "456b"
"123c", "456c"`  
        let parsed = Papa.parse(inputData,{quotes:true, quoteChar: '"', header: false, delimiter:', '});
        expect(parsed.data.length).toBe(4);
        expect(parsed.data[0][0]).toBe("test");
        expect(parsed.data[1][0]).toBe("123a");
    })

    test(',space as delimiter and experiment with options', () => {
        let inputData = `"test", "test2"
"123a", "456a"
"123b", "456b"
"123c", "456c"`  
        let parsed = Papa.parse(inputData,
                        {   quotes:true, 
                            quoteChar: '"',
                            header: false,
                            delimiter:', ',
                            delimiter: ", ",
                            dynamicTyping: false,
                            escapeChar: "\"",
                            newline: "\n",
                            transform: false
                        });
        expect(parsed.data.length).toBe(4);
        expect(parsed.data[0][0]).toBe("test");
        expect(parsed.data[1][0]).toBe("123a");
    })

    test('string as arbitrary delimiter', () => {
        let inputData = `"test" bob "test2"
"123a" bob "456a"
"123b" bob "456b"
"123c" bob "456c"`  
        let parsed = Papa.parse(inputData,{quotes:true, quoteChar: '"', header: false, delimiter:' bob '});
        expect(parsed.data.length).toBe(4);
        expect(parsed.data[0][0]).toBe("test");
        expect(parsed.data[1][0]).toBe("123a");
    })    
  
})