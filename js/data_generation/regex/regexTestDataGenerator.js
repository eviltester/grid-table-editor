import { dataResponse, errorResponse } from "../ruleResponse.js";

export class RegexTestDataGenerator{

    constructor(aRandExp){
        this.RandExp = aRandExp;
    }

    
    generateFrom(aRule){
        try{
            const data = new this.RandExp(aRule.ruleSpec).gen();
            return dataResponse(data);
        }catch(e){
            return errorResponse("Regex Generation Error " + e);
        }
    }
}