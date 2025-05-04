class TestDataRule{

    constructor(aName, aRule="") {
        this.name = aName;
        this.ruleSpec = aRule;
        this.type="";   // by default no type,
                        // can be assigned 'regex' or 'faker' or 'literal'
                        // in future more types can be created
    }

}

export {TestDataRule};