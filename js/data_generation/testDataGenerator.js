import {RulesParser} from "./testDataRules.js";

export class TestDataGenerator{

    constructor(aFaker, aRandExp){
        this.faker = aFaker;
        this.RandExp = aRandExp;
        this.rulesParser = new RulesParser(aFaker, aRandExp);
    }

    importSpec(textContent){
        this.rulesParser.parseText(textContent);
    }

    compile(){
        // validate and assign rules
        this.rulesParser.compile();
    }

    testDataRules(){
        return this.rulesParser.testDataRules.rules;
    }

    isValid(){
        return this.rulesParser.errors.length === 0;
    }

    errors(){
        return this.rulesParser.errors;
    }

    generate(thisMany){
        return this.rulesParser.testDataRules.generate(thisMany, this.faker, this.RandExp);
    }
}