import { TestDataGenerator} from '../../js/data_generation/testDataGenerator.js';
import { faker } from '@faker-js/faker';

const RandExp = require('randexp');

/*

Acceptance tests to check the external interface for Test Data Generation.

- We should have a single class that we can instantiate.
- Ask it to parse a multiline String containing a spec of test data
- Ask it to validate a multiline spec (compile)
- Ask it to generate data from a multi-line spec
- Ask it to generate multiple lines of data from a multi-line spec

This allows us to refactor the Test Data Generation library at a lower level without worrying
about the impact on external tooling.

*/

describe("TestDataGenerator meets Acceptance Criteria",()=>{

    describe("TestDataGenerator can parse a block of text to return a collection of rules",()=>{

        test('can parse a valid two line string into faker rule', () => {
            const inputText = 
    `Name
    person.fullName`
            const generator = new TestDataGenerator(faker, RandExp);

            generator.importSpec(inputText);
            generator.compile();

            expect(generator.isValid()).toBe(true);
            expect(generator.testDataRules()[0].name).toBe("Name");
            expect(generator.testDataRules()[0].type).toBe("faker");
            expect(generator.testDataRules()[0].ruleSpec).toBe("person.fullName");
            expect(generator.testDataRules().length).toBe(1)

        });

        
        test('can parse a valid two line spec and identify Regex rule', () => {
            const generator = new TestDataGenerator(faker, RandExp);

            generator.importSpec("Head\n[A-Z]");
            generator.compile();

            expect(generator.isValid()).toBe(true);
            expect(generator.testDataRules()[0].name).toBe("Head");
            expect(generator.testDataRules()[0].type).toBe("regex");
            expect(generator.testDataRules()[0].ruleSpec).toBe("[A-Z]");
            expect(generator.testDataRules().length).toBe(1)
        });

        test('can have a spec with empty value for column', () => {
            const generator = new TestDataGenerator(faker, RandExp);

            generator.importSpec("Column1\n");
            generator.compile();

            expect(generator.isValid()).toBe(true);
            expect(generator.testDataRules()[0].name).toBe("Column1");
            expect(generator.testDataRules()[0].type).toBe("regex");
            expect(generator.testDataRules()[0].ruleSpec).toBe("");
            expect(generator.testDataRules().length).toBe(1)
        });

        test('can parse multi-column spec with faker, regex and literal', () => {
            const generator = new TestDataGenerator(faker, RandExp);
            generator.importSpec(
                `Faker
                string.alpha(10)
                Regex
                [A-Z]{4}
                Literal
                Bob`
            );

            generator.compile();

            expect(generator.isValid()).toBe(true);
            expect(generator.testDataRules()[0].name).toBe("Faker");
            expect(generator.testDataRules()[0].type).toBe("faker");
            expect(generator.testDataRules()[0].ruleSpec).toBe("string.alpha(10)");
            expect(generator.testDataRules()[1].name).toBe("Regex");
            expect(generator.testDataRules()[1].type).toBe("regex");
            expect(generator.testDataRules()[1].ruleSpec).toBe("[A-Z]{4}");
            expect(generator.testDataRules()[2].name).toBe("Literal");
            expect(generator.testDataRules()[2].type).toBe("regex");
            expect(generator.testDataRules()[2].ruleSpec).toBe("Bob");
            expect(generator.testDataRules().length).toBe(3)
        });
    });

    describe("TestDataGenerator can generate data from a spec",()=>{

        test('can generate data from a faker rule', () => {
            const inputText = 
                `Name
                person.fullName`;

            const generator = new TestDataGenerator(faker, RandExp);
            generator.importSpec(inputText);
            generator.compile();

            const data = generator.generate(1);

            expect(data[0]).toStrictEqual(["Name"]);
            expect(data[1][0].length>4).toBe(true);
            expect(data[1][0].includes(" ")).toBe(true);

        });

        
        test('can generate data from a Regex rule', () => {
            const generator = new TestDataGenerator(faker, RandExp);
            generator.importSpec("Head\n[A-Z]");
            generator.compile();

            const data = generator.generate(1);

            expect(data[0]).toStrictEqual(["Head"]);
            expect(data[1][0].length).toBe(1);
            expect(data[1][0].match(/[A-Z]/g).length).toBe(1);
        });

        test('can generate a field with empty string data', () => {
            const generator = new TestDataGenerator(faker, RandExp);
            generator.importSpec("Column1\n");

            generator.compile();

            const data = generator.generate(1);

            expect(data).toStrictEqual([["Column1"],[""]]);
        });


        test('can generate data from a multi-column spec with faker, regex and literal', () => {
            const generator = new TestDataGenerator(faker, RandExp);
            generator.importSpec(
                `Faker
                string.alpha(10)
                Regex
                [A-Z]{4}
                Literal
                Bob`
            );

            generator.compile();

            const data = generator.generate(1);

            expect(data[0]).toStrictEqual(["Faker","Regex", "Literal"]);
            expect(data[1][0].length).toBe(10);
            expect(data[1][1].length).toBe(4);
            expect(data[1][2]).toStrictEqual("Bob");
        });
    });

    describe("TestDataGenerator parsing detects errors in spec",()=>{

        test('can identify empty file', () => {
            const generator = new TestDataGenerator(faker, RandExp);
            generator.importSpec("");

            generator.compile();

            expect(generator.isValid()).toBe(false);
            expect(generator.errors()[0]).toBe(
                "ERROR: Specification should be ColumnName followed by RuleDefinition with an even number of lines"
            );
            expect(generator.errors()[1]).toBe(
                "ERROR: No Rules Defined"
            );
            expect(generator.errors().length).toBe(2);
        });

        test('can identify malformed file', () => {
            const generator = new TestDataGenerator(faker, RandExp);
            generator.importSpec("Field1");

            generator.compile();

            expect(generator.isValid()).toBe(false);
            expect(generator.errors()[0]).toBe(
                "ERROR: Specification should be ColumnName followed by RuleDefinition with an even number of lines"
            );
            expect(generator.errors()[1]).toBe(
                "ERROR: Missing Rule Definition for Field1"
            );
            expect(generator.errors().length).toBe(2);
        });

        test('can identify Rule with a missing definition', () => {
            const generator = new TestDataGenerator(faker, RandExp);
            generator.importSpec("Field1\nvalue1\nField2");

            generator.compile();

            expect(generator.isValid()).toBe(false);
            expect(generator.errors()[0]).toBe(
                "ERROR: Specification should be ColumnName followed by RuleDefinition with an even number of lines"
            );
            expect(generator.errors()[1]).toBe(
                "ERROR: Missing Rule Definition for Field2"
            );
            expect(generator.errors().length).toBe(2);
        });

        test('can identify Rule with a missing name', () => {
            const generator = new TestDataGenerator(faker, RandExp);
            generator.importSpec("Field1\nvalue1\n\n");

            generator.compile();

            expect(generator.isValid()).toBe(false);
            expect(generator.errors()[0]).toBe(
                "ERROR: Missing Name on line 3"
            );
            expect(generator.errors().length).toBe(1);
        });
    });
});