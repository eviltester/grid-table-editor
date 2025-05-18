import { runFakerCommand } from "./fakerCommandRunner.js";

export class FakerCommand{

    constructor(aCommand){
        this.givenCommand = aCommand;

        this.fakerFunctionCallHasArgs=false;
        this.fakerFunctionName="";
        this.fakerFunctionCallArgs = "";

        this.validationResult = {isError: true, errorMessage: "Not Parsed", data: ""};
    }

    parse(){
        // split into function name and arguments
        var parts=[];

        this.fakerFunctionCallHasArgs=false;
        this.fakerFunctionName;
        this.fakerFunctionCallArgs = "";

        var parsedCommand = this.givenCommand;
        if(parsedCommand.startsWith("faker.")){
            parsedCommand = parsedCommand.replace("faker.","");
        }

        if(parsedCommand.includes("(")){
            // it has arguments, get rid of them at the moment
            // parsed command name
            this.fakerFunctionName = parsedCommand.split("(")[0];
            this.fakerFunctionCallHasArgs=true;
            this.fakerFunctionCallArgs = parsedCommand.substr(this.fakerFunctionName.length);
            parts=this.fakerFunctionName.split("\.");
        }else{
            parts = parsedCommand.split("\.");
            this.fakerFunctionName = parsedCommand;
            this.fakerFunctionCallHasArgs=false;
            this.fakerFunctionCallArgs = "";
        }

        if(parts.length===0 || parts[0].length===0){
            this.validationResult.isError= true;
            this.validationResult.errorMessage="Syntax Error: No faker API command found";
            return this.validationResult;
        }
        
        if(parts.length===1){
            this.validationResult.isError= true;
            this.validationResult.errorMessage="Syntax Error: No faker API command found - commands have a minimum of two parts module.command";
            return this.validationResult;
        }
        
       
        this.validationResult.isError= false;
        this.validationResult.errorMessage="Parsed but Not Compiled";
        return this.validationResult;
    
    }

    compile(withFaker){

        // we can only compile if we parsed it successfully
        if(this.validationResult.isError){
            return this.validationResult;
        }

        const fakerFunction = this.findFakerFunction(this.fakerFunctionName, withFaker);

        if(fakerFunction.fakerFunction===undefined){
            this.validationResult.isError= true;
            this.validationResult.errorMessage="Could not find Faker API Command " + this.fakerFunctionName + ` {${fakerFunction.commandName}}`;
            return this.validationResult;
        }

        if(typeof fakerFunction.fakerFunction === "function"){
            this.validationResult.isError= false;
            this.validationResult.errorMessage="";
            // compiled command name
            this.fakerFunctionName = fakerFunction.commandName;
            return this.validationResult;
        }
    }

    // returns an object {fakerFunction: theFunctionFound, commandName: theFakerCommandMatchingTheFunction}
    findFakerFunction(forCommand, withFaker){

        var fakerThing = withFaker;
        var parts = forCommand.split("\.");

        var command = "";
        var commandConjoiner = "";

        for(var part of parts){

            const possibleFakerCommandRegex = new RegExp("^([A-Za-z]*)$");
            if(possibleFakerCommandRegex.test(part)){
                command = command + commandConjoiner;
                command = command + part;
                commandConjoiner=".";

                fakerThing = fakerThing[part];
                if(fakerThing===undefined){
                    break;
                }
            }else{
                fakerThing = undefined;
                break;
            }
        }

        return {fakerFunction: fakerThing, commandName: command};
    }

    validate(againstFaker){

        // if it failed parsing and compilation then fail it automatically
        if(this.validationResult.isError){
            return this.validationResult;
        }

        const executionResult = this.execute(againstFaker);
            
        this.validationResult.isError = executionResult.isError;
        this.validationResult.errorMessage = "Invalid Faker API Call " + executionResult.errorMessage;
        this.validationResult.data = executionResult.data;
        return this.validationResult;
    }

    execute(usingFaker){

        if(this.validationResult.isError){
            return this.validationResult;
        }

        return runFakerCommand(
            this.fakerFunctionName,
            this.fakerFunctionCallHasArgs ? this.fakerFunctionCallArgs : null,
            usingFaker
        );
    }


    isValid(){
        return !this.isError();
    }

    isError(){
        return this.validationResult.isError;
    }

    validationError(){
        return this.validationResult.errorMessage;
    }

}