export function runFakerCommand(thisCommand, theseArguments, usingFaker){

        const executionResult = {isError: true, errorMessage: "Not Executed", data: ""};

        const useArguments = theseArguments ? theseArguments : "()"

        var fakerPrefix="this.";

        const commandToRun = "return "+ fakerPrefix + thisCommand + useArguments;
        try{
            executionResult.isError= false;
            executionResult.errorMessage="";
            executionResult.data = Function(commandToRun).bind(usingFaker)();
            return executionResult;
        }catch(e){
            // console.log(commandToRun);
            // console.log(e);
            executionResult.isError= true;
            executionResult.errorMessage="Error running Commmand " + thisCommand + useArguments + " ERR: " + e;
            executionResult.data = "";
            return executionResult;
        }
        
    }