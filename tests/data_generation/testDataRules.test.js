import {TestDataRule} from  '../../js/data_generation/testDataRule.js';
import {TestDataRules, RulesParser} from '../../js/data_generation/testDataRules';

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


describe("Random Data From Regex",()=>{

    test('can instantiate a RulesParser object and generate Regex', () => {
        const rulesParser = new RulesParser();
        // TODO: need to include randexp for node.js usage before we can create tests for the data gen
        // rulesParser.parseText("Head\n[A-Z]");
        // expect(rulesParser.isValid()).toBe(true);
    });
});