import { dataResponse } from "../ruleResponse.js";

export class LiteralTestDataGenerator{

    constructor(){
    }

    
    generateFrom(aRule){
        return dataResponse(aRule.ruleSpec);
    }
}