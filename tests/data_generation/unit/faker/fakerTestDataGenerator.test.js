import { TestDataRule } from '../../../../js/data_generation/testDataRule.js';
import {FakerTestDataGenerator} from '../../../../js/data_generation/faker/fakerTestDataGenerator.js';
import { faker } from '@faker-js/faker';


describe("Can generate Random Data using Faker",()=>{

    test('can instantiate a Faker Rule and generate', () => {

        const fakerGenerator = new FakerTestDataGenerator(faker);
        
        const rule = new TestDataRule("Test", "internet.email");
        rule.type="faker";

        const myData = fakerGenerator.generateFrom(rule);

        expect(myData.data.length > 0).toBe(true);
        expect(myData.data.includes("@")).toBe(true);
    });

    test('can instantiate a Faker Rule and generate with a function', () => {
        const rule = new TestDataRule("Test", "string.alpha(5)");
        rule.type="faker";
        const myData = new FakerTestDataGenerator(faker).generateFrom(rule);
        expect(myData.data.length).toBe(5);
    });

    test('can instantiate a Faker Rule and generate with a function which mentions faker', () => {
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