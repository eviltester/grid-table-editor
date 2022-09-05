// requires randExp
import {TestDataRule} from "./testDataRule.js";
import {FakerTestDataRule} from "./fakerTestDataRule.js";

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

    generate(thisMany){
        return generateDataFromRules(thisMany, this.rules);
    }

    // TODO: create a validate Rule on each rule
    validateRules(){

        this.errors = [];

        this.rules.forEach((rule)=>{
            // is it a faker function?
            const fakerRule = new FakerTestDataRule(rule);
            if(fakerRule.isValid()){
                rule.type="faker";
            }else{
                // does the regex generation work?
                try{
                    new RandExp(new RegExp(rule.ruleSpec)).gen();
                    rule.type="regex";
                    return "regex";
                }catch(err){
                    this.errors.push(`Error evaluating _${rule.name}_ as a Regex generator or Faker : ` + err);
                }
            }
        });
    }
}



class RulesParser{

    constructor(){
        this.testDataRules = new TestDataRules();
        this.errors = [];
    }

    parseText(textContent){

        const defnLines = textContent.split("\n");

        if(defnLines.length === 0){
            this.errors.push("No Rules Defined")
        }

        if(defnLines.length%2 !==0){
            this.errors.push("Definition should be ColumnName followed by RuleDefinition with an even number of lines")
        }

        // add rules to dataDefn
        for(var index=0; index<defnLines.length; index+=2){

            const name = defnLines[index].trim();

            if(name.length===0){
                this.errors.push(`Missing Name on line ${index+1}`);
                return;
            }

            if(index+1==defnLines.length){
                this.errors.push(`Missing Rule Definition for ${name}`);
                return;
            }

            const rule = defnLines[index+1];

            if(name.length===0){
                this.errors.push(`Missing Rule on line ${index+2}`);
                return;
            }

            this.testDataRules.addRule(name.trim(), rule.trim())
        }

        this.testDataRules.validateRules();
        this.errors = this.errors.concat(this.testDataRules.errors);
    }

    isValid(){
        return this.errors.length === 0;
    }
}



function generateDataFromRules(thisMany, fromRules){

    // given some rules
    // generate thisMany instances
    // data is row of values where the first row is the headers
    const data = [];

    const headers = fromRules.map((rule) => rule.name);
    data.push(headers);

    for(var row=0; row<thisMany; row++){

        const aRow = fromRules.map((rule) => {

            // is faker?
            if(rule.type==="faker"){
                return new FakerTestDataRule(rule).generateData();
            }

            // TODO: move this to a regex generator
            if(rule.type==="regex"){
                return new RandExp(new RegExp(rule.ruleSpec)).gen();
            }

            return "";

        });
        data.push(aRow);

    }

    return data;
}

export {TestDataRules, RulesParser};