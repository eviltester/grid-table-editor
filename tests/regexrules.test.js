import {RegexRules, RegexRule, removeStartAndEnd} from '../regexRules';

// to get import and export workign from tests
// https://stackoverflow.com/questions/35756479/does-jest-support-es6-import-export

describe("RegexRule is the simple type that underpins the rule processing",()=>{

    test('can instantiate a RegexRule with just a name', () => {
        const regexRule = new RegexRule("just the name");
        expect(regexRule.name).toBe("just the name");
        expect(regexRule.ruleSpec).toBe("");
    });

    test('can instantiate a RegexRule with a rule too', () => {
        const regexRule = new RegexRule("the name","[A-Z]");
        expect(regexRule.name).toBe("the name");
        expect(regexRule.ruleSpec).toBe("[A-Z]");
    });

    test('can instantiate a RegexRule with an empty constructor but it will not help much', () => {
        const regexRule = new RegexRule();
        expect(regexRule.name).toBeUndefined();
        expect(regexRule.ruleSpec).toBe("");
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

    test('can instantiate a RegexRules object', () => {
        const regexRules = new RegexRules();
        expect(regexRules).toBeDefined();
    });
});