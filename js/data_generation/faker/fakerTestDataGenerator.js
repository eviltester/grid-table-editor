export class FakerTestDataGenerator{

    constructor(aFaker){
        this.faker = aFaker;
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

    generateFrom(aRule){

        var returnResult = {isError: false, errorMessage: "", data: ""};

        var parts=[];

        var fakerFunctionCallHasArgs=false;
        var fakerFunctionName;
        var fakerFunctionCallArgs = "";

        const ruleSpec = aRule.ruleSpec;

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


        var fakerThing = this.faker;
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
                returnResult.data =  this.faker.fake(callFakeArgs);
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
                    returnResult.data = Function(commandToRun).bind(this.faker)();
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
}