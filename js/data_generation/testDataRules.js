import {TestDataRule} from "./testDataRule.js";

class TestDataRules{

    constructor() {
        this.rules = [];
        this.errors = [];
    }

    getRules(){
        return JSON.parse(JSON.stringify(this.rules));
    }

    getRule(aName){
        const retRules = this.rules.filter(name => name==aName.toLowerCase().trim())
        return retRules[0];
    }

    addRule(aName, aRule){
        this.rules.push(new TestDataRule(aName.trim(), aRule));
    }
}



export {TestDataRules};