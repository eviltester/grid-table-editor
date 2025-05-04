import { TestDataRule } from '../../../js/data_generation/testDataRule.js';
import { FakerTestDataRule} from '../../../js/data_generation/fakerTestDataRule.js';
import { faker } from '@faker-js/faker';


describe("Random Data From FakerTestDataRule",()=>{


    test('can determine a invalid FakerTestDataRule', () => {
        const rule = new TestDataRule("Test", "internet.ea");
        rule.type="faker";
        
        const fakerRule = new FakerTestDataRule(rule, faker);
        expect(fakerRule.isValid()).toBe(false);

    });

    test('can determine a invalid FakerTestDataRule does not match faker call', () => {
        const rule = new TestDataRule("Test", "internet");
        rule.type="faker";
        
        const fakerRule = new FakerTestDataRule(rule, faker);
        expect(fakerRule.isValid()).toBe(false);

    });

    test('can determine a syntax error for FakerTestDataRule', () => {
        const rule = new TestDataRule("Test", "internet.email('bob'");
        rule.type="faker";
        
        const fakerRule = new FakerTestDataRule(rule, faker);
        expect(fakerRule.isValid()).toBe(false);

    });

    test('will not process empty FakerTestDataRule', () => {
        const rule = new TestDataRule("Test", "");
        rule.type="faker";
        
        const fakerRule = new FakerTestDataRule(rule, faker);
        expect(fakerRule.isValid()).toBe(false);

    });
});

// TODO: faker 'fake' method which allows chaining methods is being remove so we need a new templating system