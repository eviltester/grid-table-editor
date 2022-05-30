import {TestDataRules, TestDataRule, removeStartAndEnd} from '../../js/data_generation/testDataRules';

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

    test('can instantiate a TestDataRules object', () => {
        const testDataRules = new TestDataRules();
        expect(testDataRules).toBeDefined();
    });
});