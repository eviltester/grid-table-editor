import { TestDataRule } from '../../js/data_generation/testDataRule.js';
import {removeStartAndEnd, generateUsingFaker, FakerTestDataRule} from '../../js/data_generation/fakerTestDataRule.js';

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

describe("Random Data From Faker",()=>{

    test('can instantiate a Faker Rule and generate', () => {
        const rule = new TestDataRule("Test", "internet.email");
        rule.type="faker";
        const myData = generateUsingFaker(rule.ruleSpec);
        expect(myData.data.length > 0).toBe(true);
        expect(myData.data.includes("@")).toBe(true);
    });

    test('can instantiate a Faker Rule and generate with a function', () => {
        const rule = new TestDataRule("Test", "random.alpha(5)");
        rule.type="faker";
        const myData = generateUsingFaker(rule.ruleSpec);
        expect(myData.data.length).toBe(5);
    });

    test('can instantiate a Faker Rule and generate with a function which mentions faker', () => {
        const rule = new TestDataRule("Test", "faker.random.alpha(4)");
        rule.type="faker";
        const myData = generateUsingFaker(rule.ruleSpec);
        expect(myData.data.length).toBe(4);
    });

    test('can use mustache helper with functions', () => {
        const rule = new TestDataRule("Test", "helpers.mustache('{{word}}',{word:()=>`${this.random.alpha(15)}`})");
        rule.type="faker";
        const myData = generateUsingFaker(rule.ruleSpec);
        expect(myData.data.length).toBe(15);
    });

});

describe("Random Data From FakerTestDataRule",()=>{

    test('can instantiate a FakerTestDataRule', () => {
        const rule = new TestDataRule("Test", "internet.email");
        rule.type="faker";
        
        const fakerRule = new FakerTestDataRule(rule);
        expect(fakerRule.isValid()).toBe(true);

        const myData = fakerRule.generateData();
        expect(myData.data.length > 0).toBe(true);
        expect(myData.data.includes("@")).toBe(true);
    });


    test('can determine a invalid FakerTestDataRule', () => {
        const rule = new TestDataRule("Test", "internet.ea");
        rule.type="faker";
        
        const fakerRule = new FakerTestDataRule(rule);
        expect(fakerRule.isValid()).toBe(false);

    });

    test('can determine a invalid FakerTestDataRule does not match faker call', () => {
        const rule = new TestDataRule("Test", "internet");
        rule.type="faker";
        
        const fakerRule = new FakerTestDataRule(rule);
        expect(fakerRule.isValid()).toBe(false);

    });

    test('can determine a syntax error for FakerTestDataRule', () => {
        const rule = new TestDataRule("Test", "internet.email('bob'");
        rule.type="faker";
        
        const fakerRule = new FakerTestDataRule(rule);
        expect(fakerRule.isValid()).toBe(false);

    });

    test('will not process empty FakerTestDataRule', () => {
        const rule = new TestDataRule("Test", "");
        rule.type="faker";
        
        const fakerRule = new FakerTestDataRule(rule);
        expect(fakerRule.isValid()).toBe(false);

    });
});

// TODO: faker 'fake' method which allows chaining methods is being remove so we need a new templating system