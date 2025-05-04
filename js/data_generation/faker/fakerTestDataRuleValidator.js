import { FakerTestDataGenerator } from "./fakerTestDataGenerator.js";

// requires faker.js which should be passed in via constructor
// faker can be imported in different ways

//  https://fakerjs.dev/guide/#environments
// https://cdn.skypack.dev/@faker-js/faker

// use a moduleNameMapper in jest to allow importing from https
// see package.json for the jest config
//import { faker } from '@faker-js/faker';
//import { faker } from "https://cdn.skypack.dev/@faker-js/faker@v9.7.0";

class FakerTestDataRuleValidator{

    constructor(aFaker) {
        this.validationError="";
        this.faker = aFaker;
    }

    validate(aTestDataRule){
        this.validationError="";

        // is it a faker function?
        try{
            const whatDidWeGet = new FakerTestDataGenerator(this.faker).generateFrom(aTestDataRule);
            if(whatDidWeGet !== undefined && whatDidWeGet !==null && whatDidWeGet.isError===false){
                aTestDataRule.type="faker";
                return true;
            }else{
                this.validationError=whatDidWeGet.errorMessage;
                return false;
            }
        }catch(err){
            this.validationError=err;
            return false;
        }
    }

    isValid(){
        return this.validationError.length == 0;
    }

    getValidationError(){
        return this.validationError;
    }
}


export {FakerTestDataRuleValidator};