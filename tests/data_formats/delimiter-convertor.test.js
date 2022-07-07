import Papa from "papaparse";

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

describe("Can test stuff",()=>{

    test('can assert stuff', () => {
        // TODO: now that we can stub Papaparse we can test the convertor
    })
})