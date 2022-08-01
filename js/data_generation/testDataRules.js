// requires randExp
// requires faker.js

//  https://fakerjs.dev/guide/#environments
// https://cdn.skypack.dev/@faker-js/faker

// use a moduleNameMapper in jest to allow importing from https
//import { faker } from '@faker-js/faker';
import { faker } from "https://cdn.skypack.dev/@faker-js/faker@v7.1.0";

class TestDataRules{

    constructor() {
        this.rules = [];
        this.errors = [];
    }

    getRules(){
        return JSON.parse(JSON.stringify(this.rules));
    }

    getRule(aName){
        const retRules = this.rules.filter(name => name==aName.toLowerCase().trim())
        return retRules[0];
    }

    addRule(aName, aRule){
        this.rules.push(new TestDataRule(aName.trim(), aRule));
    }

    generate(thisMany){
        return generateDataFromRules(thisMany, this.rules);
    }

    // TODO: create a validate Rule on each rule
    validateRules(){

        this.errors = [];

        this.rules.forEach((rule)=>{
            // is it a faker function?
            try{
                const whatDidWeGet = generateUsingFaker(rule.ruleSpec);
                if(whatDidWeGet !== undefined && whatDidWeGet !==null){
                    rule.type="faker";
                    return "faker";
                }
            }catch(err){
                // ignore and try as regex
            }

            // does the regex generation work?
            try{
                new RandExp(new RegExp(rule.ruleSpec)).gen();
                rule.type="regex";
                return "regex";
            }catch(err){
                this.errors.push(`Error evaluating _${rule.name}_ as a Regex generator : ` + err);
            }
        });

    }

}

class TestDataRule{

    constructor(aName, aRule="") {
        this.name = aName;
        this.ruleSpec = aRule;
        this.type="regex"; // 'regex' by default, or 'faker'
    }

}

class RulesParser{

    constructor(){
        this.testDataRules = new TestDataRules();
        this.errors = [];
    }

    parseText(textContent){

        const defnLines = textContent.split("\n");

        if(defnLines.length === 0){
            this.errors.push("No Rules Defined")
        }

        if(defnLines.length%2 !==0){
            this.errors.push("Definition should be ColumnName followed by RuleDefinition with an even number of lines")
        }

        // add rules to dataDefn
        for(var index=0; index<defnLines.length; index+=2){

            const name = defnLines[index].trim();

            if(name.length===0){
                this.errors.push(`Missing Name on line ${index+1}`);
                return;
            }

            if(index+1==defnLines.length){
                this.errors.push(`Missing Rule Definition for ${name}`);
                return;
            }

            const rule = defnLines[index+1];

            if(name.length===0){
                this.errors.push(`Missing Rule on line ${index+2}`);
                return;
            }

            this.testDataRules.addRule(name.trim(), rule.trim())
        }

        this.testDataRules.validateRules();
        this.errors = this.errors.concat(this.testDataRules.errors);
    }

    isValid(){
        return this.errors.length === 0;
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

function generateUsingFaker(ruleSpec){

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
        return undefined;
    }

    var command="";
    var callFake=false;
    var callFakeArgs="";


    var fakerThing = faker;
    for(var part of parts){

        const possibleFakerCommandRegex = new RegExp("^([A-Za-z]*)$");
        if(possibleFakerCommandRegex.test(part)){
            command = command + part + ".";
            if(part==="faker"){
                // ignore
                continue;
            }

            // if(part==="helpers"){
            //     // faker helpers not supported
            //     console.log("Faker helpers not supported");
            //     return undefined;
            // }
           // else{
                fakerThing = fakerThing[part];
                if(fakerThing===undefined){
                    return undefined;
                }
            //}
        }

        if(part.startsWith("fake")){
            // it is a call to fake
            callFake=true;
            callFakeArgs = ruleSpec.replace(command+"fake","");
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

        return faker.fake(callFakeArgs);
    }

    if(typeof fakerThing === "function"){
        if(fakerFunctionCallHasArgs){
            var fakerPrefix="this.";
            if(command.startsWith("faker.")){
                command = command.replace("faker.","");
            }
            if(command.endsWith(".")){
                command = command.substring(0,command.length-1);
            }
            const commandToRun = "return "+ fakerPrefix + command + fakerFunctionCallArgs;
            try{
                return Function(commandToRun).bind(faker)();
            }catch(e){
                console.log(commandToRun);
                console.log(e);
                return undefined;
            }
            
        }else{
            // make the call
            return fakerThing();
        }
        
    }

}

function removeStartAndEnd(start, end, from){
    if(from.startsWith(start,0) && from.endsWith(end)){
        return from.substr(1,from.length-2);
    }
    return from;
}

function generateDataFromRules(thisMany, fromRules){

    // given some rules
    // generate thisMany instances
    // data is row of values where the first row is the headers
    const data = [];

    const headers = fromRules.map((rule) => rule.name);
    data.push(headers);

    for(var row=0; row<thisMany; row++){

        const aRow = fromRules.map((rule) => {

            // TODO: move this to a TestRuleDataGenerator to support easier tesitng

            // is faker?
            if(rule.type==="faker"){
                return generateUsingFaker(rule.ruleSpec);
            }

            // TODO: move this to a regex generator
            if(rule.type==="regex"){
                return new RandExp(new RegExp(rule.ruleSpec)).gen();
            }

            return "";

        });
        data.push(aRow);

    }

    return data;
}

export {TestDataRules, TestDataRule, RulesParser, removeStartAndEnd, generateUsingFaker};