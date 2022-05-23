import {Debouncer} from '../../utils/debouncer.js';

describe("Debouncer will call a function after a delay",()=>{

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    test('will only call debouncer once', async () => {

        let countOfCalls = 0;

        function makeCall(){
            countOfCalls++;
        }

        let debouncer = new Debouncer();

        for(let x=0;x<100;x++){
            debouncer.debounce("makecall", makeCall, 50);
        }

        await delay(200);
        expect(countOfCalls).toBe(1);
    });

    test('can clear debounce and it will not fire', async () => {

        let countOfCalls = 0;

        function makeCall(){
            countOfCalls++;
        }

        let debouncer = new Debouncer();

        for(let x=0;x<100;x++){
            debouncer.debounce("makecall", makeCall, 50);
        }

        debouncer.clear("makecall");

        await delay(200);
        expect(countOfCalls).toBe(0);
    });
});