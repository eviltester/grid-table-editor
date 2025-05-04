import { TestDataRule } from '../../../../js/data_generation/testDataRule.js';
import { FakerTestDataRuleValidator} from '../../../../js/data_generation/faker/fakerTestDataRuleValidator.js';
import { faker } from '@faker-js/faker';


describe("Can validate Faker TestDataRules using FakerTestDataRuleValidator",()=>{


    test('can determine a invalid Faker TestDataRule', () => {
        const rule = new TestDataRule("Test", "internet.ea");
        rule.type="faker";
        
        const validator = new FakerTestDataRuleValidator(faker);
        validator.validate(rule);
        expect(validator.isValid()).toBe(false);

    });

    test('can determine a invalid Faker TestDataRule does not match faker call', () => {
        const rule = new TestDataRule("Test", "internet");
        rule.type="faker";
        
        const validator = new FakerTestDataRuleValidator(faker);
        validator.validate(rule);
        expect(validator.isValid()).toBe(false);

    });

    test('can determine a syntax error for Faker TestDataRule', () => {
        const rule = new TestDataRule("Test", "internet.email('bob'");
        rule.type="faker";
        
        const validator = new FakerTestDataRuleValidator(faker);
        validator.validate(rule);
        expect(validator.isValid()).toBe(false);

    });

    test('will not process empty Faker TestDataRule', () => {
        const rule = new TestDataRule("Test", "");
        rule.type="faker";
        
        const validator = new FakerTestDataRuleValidator(faker);
        validator.validate(rule);
        expect(validator.isValid()).toBe(false);

    });
});

