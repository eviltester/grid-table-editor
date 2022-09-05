class TestDataRule{

    constructor(aName, aRule="") {
        this.name = aName;
        this.ruleSpec = aRule;
        this.type="regex"; // 'regex' by default, or 'faker'
    }

}

export {TestDataRule};