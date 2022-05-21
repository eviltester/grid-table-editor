import {RegexRules} from '../regexRules';

// to get import and export workign from tests
// https://stackoverflow.com/questions/35756479/does-jest-support-es6-import-export

describe("Random Data From Regex",()=>{

    test('can instantiate a RegexRules object', () => {
        const regexRules = new RegexRules();
        expect(regexRules).toBeDefined();
    });
});