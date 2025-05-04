import { TestDataRule } from '../../../../js/data_generation/testDataRule.js';
import {FakerTestDataGenerator} from '../../../../js/data_generation/faker/fakerTestDataGenerator.js';
import { faker } from '@faker-js/faker';


describe("Can generate Random Data using Faker",()=>{

    describe("Valid rules generate data",()=>{
        test('can generate from simple direct faker api command', () => {

            const fakerGenerator = new FakerTestDataGenerator(faker);
            
            const rule = new TestDataRule("Test", "internet.email");
            rule.type="faker";

            const myData = fakerGenerator.generateFrom(rule);

            expect(myData.data.length > 0).toBe(true);
            expect(myData.data.includes("@")).toBe(true);
        });

        test('can generate with a faker api that is a function with arguments', () => {
            const rule = new TestDataRule("Test", "string.alpha(5)");
            rule.type="faker";
            const myData = new FakerTestDataGenerator(faker).generateFrom(rule);
            expect(myData.data.length).toBe(5);
        });

        test('can generate with a function which is prefixed with faker', () => {
            const rule = new TestDataRule("Test", "faker.string.alpha(4)");
            rule.type="faker";
            const myData = new FakerTestDataGenerator(faker).generateFrom(rule);
            expect(myData.data.length).toBe(4);
        });

        test('can use mustache helper with functions', () => {
            const rule = new TestDataRule("Test", "helpers.mustache('{{word}}',{word:()=>`${this.string.alpha(15)}`})");
            rule.type="faker";
            const myData = new FakerTestDataGenerator(faker).generateFrom(rule);
            expect(myData.data.length).toBe(15);
        });

    });

    describe("Invalid rules generate error response",()=>{
        test('can determine a invalid TestDataRule', () => {
            const rule = new TestDataRule("Test", "internet.ea");
            rule.type="faker";
            
            const result = new FakerTestDataGenerator(faker).generateFrom(rule);
            expect(result.isError).toBe(true);
            expect(result.errorMessage).toBe("Could not find Faker API Command internet.ea");

        });
    });
});