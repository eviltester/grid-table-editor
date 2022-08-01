import {TestDataRules, TestDataRule, removeStartAndEnd, RulesParser, generateUsingFaker} from '../../js/data_generation/testDataRules';

// to get import and export workign from tests
// https://stackoverflow.com/questions/35756479/does-jest-support-es6-import-export

describe("TestDataRule is the simple type that underpins the rule processing",()=>{

    test('can instantiate a TestDataRule with just a name', () => {
        const testDataRule = new TestDataRule("just the name");
        expect(testDataRule.name).toBe("just the name");
        expect(testDataRule.ruleSpec).toBe("");
    });

    test('can instantiate a TestDataRule with a rule too', () => {
        const testDataRule = new TestDataRule("the name","[A-Z]");
        expect(testDataRule.name).toBe("the name");
        expect(testDataRule.ruleSpec).toBe("[A-Z]");
    });

    test('can instantiate a TestDataRule with an empty constructor but it will not help much', () => {
        const testDataRule = new TestDataRule();
        expect(testDataRule.name).toBeUndefined();
        expect(testDataRule.ruleSpec).toBe("");
    });

});

describe("removeStartAndEnd is a function to help with parsing",()=>{

    test('can find content in single quotes', () => {
        const result = removeStartAndEnd("'","'","'bob'");
        expect(result).toBe("bob");
    });
    test('leave alone if not fully matching', () => {
        const result = removeStartAndEnd("'",")","'bob'");
        expect(result).toBe("'bob'");
    });
    test('only removes the first and last character', () => {
        const result = removeStartAndEnd(" '","' "," 'bob' ");
        expect(result).toBe("'bob'");
    });
});

describe("Random Data From Regex",()=>{

    test('can instantiate a RulesParser object and generate Regex', () => {
        const rulesParser = new RulesParser();
        // TODO: need to include randexp for node.js usage before we can create tests for the data gen
        // rulesParser.parseText("Head\n[A-Z]");
        // expect(rulesParser.isValid()).toBe(true);
    });
});

describe("Random Data From Faker",()=>{

    test('can instantiate a Faker Rule and generate', () => {
        const rule = new TestDataRule("Test", "internet.email");
        rule.type="faker";
        debugger;
        const myData = generateUsingFaker(rule.ruleSpec);
        expect(myData.length > 0).toBe(true);
        expect(myData.includes("@")).toBe(true);
    });

    test('can instantiate a Faker Rule and generate with a function', () => {
        const rule = new TestDataRule("Test", "random.alpha(5)");
        rule.type="faker";
        const myData = generateUsingFaker(rule.ruleSpec);
        expect(myData.length).toBe(5);
    });

    test('can instantiate a Faker Rule and generate with a function which mentions faker', () => {
        const rule = new TestDataRule("Test", "faker.random.alpha(4)");
        rule.type="faker";
        const myData = generateUsingFaker(rule.ruleSpec);
        expect(myData.length).toBe(4);
    });

    test('can use mustache helper with functions', () => {
        const rule = new TestDataRule("Test", "helpers.mustache('{{word}}',{word:()=>`${this.random.alpha(15)}`})");
        rule.type="faker";
        const myData = generateUsingFaker(rule.ruleSpec);
        expect(myData.length).toBe(15);
    });

});

// TODO: faker 'fake' method which allows chaining methods is being remove so we need a new templating system