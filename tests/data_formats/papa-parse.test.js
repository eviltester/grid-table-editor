import Papa from 'papaparse';

describe("Investigate papa parse with multi char delimiters",()=>{

    test('basic example to check it all works', () => {

        let parsed = Papa.parse("a,b,c",{header: false, delimiter:','});
        expect(parsed.data.length).toBe(1);
        expect(parsed.data[0][0]).toBe("a");
    })

    test(',space example to check', () => {

        let parsed = Papa.parse("a, b, c",{header: false, delimiter:', '});
        console.log(parsed);
        expect(parsed.data.length).toBe(1);
        expect(parsed.data[0][0]).toBe("a");
    })

    test(',space that fails in app', () => {
        let inputData = `"test", "test2"
"123a", "456a"
"123b", "456b"
"123c", "456c"`  
        let parsed = Papa.parse(inputData,{quotes:true, quoteChar: '"', header: false, delimiter:', '});
        console.log(parsed);
        expect(parsed.data.length).toBe(4);
        expect(parsed.data[0][0]).toBe("test");
        expect(parsed.data[1][0]).toBe("123a");
    })

    test(',space that fails in app replicate app options', () => {
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
                            //quoteChar: "\"",
                            //quotes: true
                            transform: false
                        });
        console.log(parsed);
        expect(parsed.data.length).toBe(4);
        expect(parsed.data[0][0]).toBe("test");
        expect(parsed.data[1][0]).toBe("123a");
    })

    test('bob that fails in app', () => {
        let inputData = `"test" bob "test2"
"123a" bob "456a"
"123b" bob "456b"
"123c" bob "456c"`  
        let parsed = Papa.parse(inputData,{quotes:true, quoteChar: '"', header: false, delimiter:' bob '});
        console.log(parsed);
        expect(parsed.data.length).toBe(4);
        expect(parsed.data[0][0]).toBe("test");
        expect(parsed.data[1][0]).toBe("123a");
    })    
  
})