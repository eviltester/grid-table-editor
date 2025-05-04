import {removeStartAndEnd} from '../../../../js/data_generation/faker/parsingUtils.js';

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