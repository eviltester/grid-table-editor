export class PapaWrappa{

    parse(value){
        return Papa.parse(value);
    }

    unparse(value){
        return Papa.unparse(value);
    }
}