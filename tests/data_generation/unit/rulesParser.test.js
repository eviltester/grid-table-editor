import {RulesParser} from '../../../js/data_generation/testDataRules';
import { faker } from '@faker-js/faker';

const RandExp = require('randexp');

describe("RulesParser parses a block of text to return a collection of rules",()=>{

    test('can parse a valid two line string into rules', () => {
        const inputText = 
`Name
person.fullName`

        const parser = new RulesParser(faker, RandExp);
        parser.parseText(inputText);
        parser.compile();
        expect(parser.isValid()).toBe(true);

        expect(parser.testDataRules.rules[0].name).toBe("Name");
        expect(parser.testDataRules.rules[0].type).toBe("faker");
        expect(parser.testDataRules.rules[0].ruleSpec).toBe("person.fullName");

    });

});

describe("Random Data From Regex",()=>{

    test('can instantiate a RulesParser object and generate Regex', () => {
        const rulesParser = new RulesParser(faker, RandExp);
        // TODO: need to include randexp for node.js usage before we can create tests for the data gen
        rulesParser.parseText("Head\n[A-Z]");
        rulesParser.compile();
        expect(rulesParser.isValid()).toBe(true);
    });
});