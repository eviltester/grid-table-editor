import {TestDataRules} from "./testDataRules.js";

export class RulesParser{

    constructor(aFaker, RandExp){
        this.faker = aFaker;
        this.RandExp = RandExp;
        this.testDataRules = new TestDataRules();
        this.errors = [];
    }

    parseText(textContent){

        const defnLines = textContent.split("\n");

        if(defnLines.length%2 !==0){
            this.errors.push("ERROR: Specification should be ColumnName followed by RuleDefinition with an even number of lines");
        }

        if(defnLines.length === 0 || (defnLines.length === 1 && defnLines[0].length === 0)){
            this.errors.push("ERROR: No Rules Defined");
            return;
        }

        // add rules to dataDefn
        for(var index=0; index<defnLines.length; index+=2){

            const name = defnLines[index].trim();

            if(name.length===0){
                this.errors.push(`ERROR: Missing Name on line ${index+1}`);
                return;
            }

            if(index+1==defnLines.length){
                this.errors.push(`ERROR: Missing Rule Definition for ${name}`);
                return;
            }

            const rule = defnLines[index+1];

            if(name.length===0){
                this.errors.push(`ERROR: Missing Rule on line ${index+2}`);
                return;
            }

            this.testDataRules.addRule(name.trim(), rule.trim())
        }
    }

    isValid(){
        return this.errors.length === 0;
    }
}
