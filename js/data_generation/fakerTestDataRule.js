import { FakerTestDataGenerator } from "./faker/fakerTestDataGenerator.js";

// requires faker.js which should be passed in via constructor
// faker can be imported in different ways

//  https://fakerjs.dev/guide/#environments
// https://cdn.skypack.dev/@faker-js/faker

// use a moduleNameMapper in jest to allow importing from https
// see package.json for the jest config
//import { faker } from '@faker-js/faker';
//import { faker } from "https://cdn.skypack.dev/@faker-js/faker@v9.7.0";

class FakerTestDataRule{

    constructor(aTestDataRule, aFaker) {
        this.rule = aTestDataRule;
        this.validationError="";
        this.faker = aFaker;
    }

    isValid(){
        this.validationError="";

        // is it a faker function?
        try{
            const whatDidWeGet = new FakerTestDataGenerator(this.faker).generateFrom(this.rule);
            if(whatDidWeGet !== undefined && whatDidWeGet !==null && whatDidWeGet.isError===false){
                this.rule.type="faker";
                return true;
            }else{
                this.validationError=whatDidWeGet.errorMessage;
                return false;
            }
        }catch(err){
            this.validationError=err;
            console.log(err);
            return false;
        }
    }

    generateData(){
        // faker.js always returns an object
        // we could check for error here
        const value = new FakerTestDataGenerator(this.faker).generateFrom(this.rule);
        return value.data ? value.data : "**ERROR**";
    }

    getValidationError(){
        return this.validationError;
    }
}


export {FakerTestDataRule};