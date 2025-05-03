// requires faker.js

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
            const whatDidWeGet = generateUsingFaker(this.rule.ruleSpec, this.faker);
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
        const value = generateUsingFaker(this.rule.ruleSpec, this.faker);
        return value.data ? value.data : "**ERROR**";
    }

    getValidationError(){
        return this.validationError;
    }
}

/*
    Support for much of the faker APi

    http://marak.github.io/faker.js/
    https://github.com/Marak/faker.js

    e.g.

    faker.name.firstName
    faker.fake {{name.lastName}}, {{name.firstName}}
    faker.lorem.paragraph

    faker.helper is deliberately excluded
 */

function generateUsingFaker(ruleSpec, aFaker){

    var returnResult = {isError: false, errorMessage: "", data: ""};

    var parts=[];

    var fakerFunctionCallHasArgs=false;
    var fakerFunctionName;
    var fakerFunctionCallArgs = "";

    if(ruleSpec.includes("(")){
        // it has arguments, get rid of them at the moment
        fakerFunctionName = ruleSpec.split("(")[0];
        fakerFunctionCallHasArgs=true;
        fakerFunctionCallArgs = ruleSpec.substr(fakerFunctionName.length);
        parts=fakerFunctionName.split("\.");
    }else{
        parts = ruleSpec.split("\.");
    }

    if(parts.length===0){
        returnResult.isError= true;
        returnResult.errorMessage="Syntax Error, no faker API command found";
        return returnResult;
    }

    var command="";
    var callFake=false;
    var callFakeArgs="";
    var commandConjoiner = "";


    var fakerThing = aFaker;
    for(var part of parts){

        const possibleFakerCommandRegex = new RegExp("^([A-Za-z]*)$");
        if(possibleFakerCommandRegex.test(part)){
            command = command + commandConjoiner;
            command = command + part;
            commandConjoiner=".";

            if(part==="faker"){
                // ignore
                continue;
            }

            fakerThing = fakerThing[part];
            if(fakerThing===undefined){
                returnResult.isError= true;
                returnResult.errorMessage="Could not find Faker API Command " + command;
                return returnResult;
            }
        }

        if(part.startsWith("fake")){
            // it is a call to fake
            callFake=true;
            callFakeArgs = ruleSpec.replace(command+".fake","");
            break;
        }
    }

    if(callFake){
        callFakeArgs = callFakeArgs.trim();
        // remove ()
        callFakeArgs = removeStartAndEnd("(", ")", callFakeArgs);
        var removeQuote=undefined;
        if(callFakeArgs.startsWith('"')){
            removeQuote='"';
        }
        if(callFakeArgs.startsWith("'")){
            removeQuote="'";
        }
        if(removeQuote!==undefined){
            callFakeArgs = removeStartAndEnd(removeQuote, removeQuote, callFakeArgs);
        }

        try{
            returnResult.isError= false;
            returnResult.errorMessage="";
            returnResult.data =  aFaker.fake(callFakeArgs);
            return returnResult;
        }catch(err){
            returnResult.isError= true;
            returnResult.errorMessage="Call to fake failed " + err;
            returnResult.data = "";
            return returnResult;
        }

    }

    if(typeof fakerThing === "function"){
        if(fakerFunctionCallHasArgs){
            var fakerPrefix="this.";
            if(command.startsWith("faker.")){
                command = command.replace("faker.","");
            }
            const commandToRun = "return "+ fakerPrefix + command + fakerFunctionCallArgs;
            try{
                returnResult.isError= false;
                returnResult.errorMessage="";
                returnResult.data = Function(commandToRun).bind(aFaker)();
                return returnResult;
            }catch(e){
                console.log(commandToRun);
                console.log(e);
                returnResult.isError= true;
                returnResult.errorMessage="Error running Commmand " + command + fakerFunctionCallArgs + " ERR: " + e;
                returnResult.data = "";
                return returnResult;
            }
            
        }else{
            // make the call
            returnResult.isError= false;
            returnResult.errorMessage="";
            returnResult.data =fakerThing();
            return returnResult;
        }
        
    }else{
        returnResult.isError= true;
        returnResult.errorMessage="Invalid Faker API Call " + command;
        returnResult.data = "";
        return returnResult;
    }

}

function removeStartAndEnd(start, end, from){
    if(from.startsWith(start,0) && from.endsWith(end)){
        return from.substr(1,from.length-2);
    }
    return from;
}

export {FakerTestDataRule, removeStartAndEnd, generateUsingFaker};