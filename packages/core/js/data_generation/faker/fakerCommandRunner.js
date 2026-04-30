export function runFakerCommand(thisCommand, theseArguments, usingFaker, propertyAccessors = []) {
  const executionResult = { isError: true, errorMessage: 'Not Executed', data: '' };

  const useArguments = theseArguments ? theseArguments : '()';

  var fakerPrefix = 'this.';

  const commandToRun = 'return ' + fakerPrefix + thisCommand + useArguments;
  try {
    executionResult.isError = false;
    executionResult.errorMessage = '';
    let result = Function(commandToRun).bind(usingFaker)();

    // If we have property accessors, navigate the object properties
    if (propertyAccessors && propertyAccessors.length > 0) {
      for (const accessor of propertyAccessors) {
        result = result[accessor];
        if (result === undefined) {
          throw new Error(`Property accessor '${accessor}' returned undefined`);
        }
      }
    }

    executionResult.data = result;
    return executionResult;
  } catch (e) {
    // console.log(commandToRun);
    // console.log(e);
    executionResult.isError = true;
    executionResult.errorMessage = 'Error running Commmand ' + thisCommand + useArguments + ' ERR: ' + e;
    executionResult.data = '';
    return executionResult;
  }
}
