// since papaparse is global
// a class allows us to use a mock/stub during testing instantiated to a node version
// or mock it completely
// and at run time, instantiate using the window.Papa version
export class PapaWrappa{

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