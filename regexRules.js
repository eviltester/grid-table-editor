class RegexRules{

    constructor() {
        this.rules = [];
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

}

class RegexRule{

    constructor(aName, aRule="") {
        this.name = aName;
        this.ruleSpec = aRule;
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

