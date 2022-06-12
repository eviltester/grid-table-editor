import {getNumberArrayFrom} from '../../js/utils/number-convertor.js';
// https://www.npmjs.com/package/jest-extended#tobearrayofsize
import {toBeArrayOfSize} from 'jest-extended';

expect.extend({ toBeArrayOfSize });

describe("Can convert string with list of numbers to numbers",()=>{

    test('will return empty array when blank', async () => {

        expect(getNumberArrayFrom(undefined)).toBeArrayOfSize(0);
        expect(getNumberArrayFrom(null)).toBeArrayOfSize(0);
        expect(getNumberArrayFrom("")).toBeArrayOfSize(0);
        expect(getNumberArrayFrom(" ")).toBeArrayOfSize(0);
        expect(getNumberArrayFrom("     ")).toBeArrayOfSize(0);
    });

    test('will ignore non number symbols', async () => {
        expect(getNumberArrayFrom("-- + ( ) pp s . > <")).toBeArrayOfSize(0);
    });

    test('will find buried numbers', async () => {

        let array = getNumberArrayFrom("-- + ( ) 3 pp s . > <");
        expect(array).toBeArrayOfSize(1);
        expect(array[0]).toBe(3);
    });

    test('can handle csv', async () => {

        let array = getNumberArrayFrom("4, 3, 2  ");
        expect(array).toBeArrayOfSize(3);
        expect(array[0]).toBe(4);
        expect(array[1]).toBe(3);
        expect(array[2]).toBe(2);
    });


    test('can handle mixed delims', async () => {

        let array = getNumberArrayFrom("4, 3 - 2 +99");
        expect(array).toBeArrayOfSize(4);
        expect(array[0]).toBe(4);
        expect(array[1]).toBe(3);
        expect(array[2]).toBe(2);
        expect(array[3]).toBe(99);
    });

});