// requires randExp
// requires faker.js

class RegexRules{

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
        this.rules.push(new RegexRule(aName.trim(), aRule));
    }

    generate(thisMany){
        return generateRegex(thisMany, this.rules);
    }

    validateRules(){

        this.errors = [];

        this.rules.forEach((rule)=>{
            // is it a faker function?

            // does the regex generation work?
            try{
                new RandExp(new RegExp(rule.ruleSpec)).gen();
            }catch(err){
                this.errors.push(`Error evaluating _${rule.name}_ as a Regex generator : ` + err);
            }
        });

    }

}

class RegexRule{

    constructor(aName, aRule="") {
        this.name = aName;
        this.ruleSpec = aRule;
    }

}

class RulesParser{

    constructor(){
        this.regexRules = new RegexRules();
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

            this.regexRules.addRule(name.trim(), rule.trim())
        }

        this.regexRules.validateRules();
        this.errors = this.errors.concat(this.regexRules.errors);
    }

    isValid(){
        return this.errors.length === 0;
    }
}

function generateRegex(thisMany, fromRules){

    // given some rules
    // generate thisMany instances
    // data is row of values where the first row is the headers
    const data = [];

    const headers = fromRules.map((rule) => rule.name);
    data.push(headers);

    for(row=0; row<thisMany; row++){

        const aRow = fromRules.map((rule) => new RandExp(new RegExp(rule.ruleSpec)).gen());
        data.push(aRow);

    }

    return data;
}

