/**
 * Safer alternative to fakerCommandRunner.js that avoids using Function() constructor
 */

function parseArguments(argString) {
  if (!argString || argString === '()') {
    return [];
  }

  // Remove outer parentheses
  const trimmed = argString.trim();
  if (!trimmed.startsWith('(') || !trimmed.endsWith(')')) {
    throw new Error('Invalid argument format: must be enclosed in parentheses');
  }

  const argsBody = trimmed.slice(1, -1).trim();
  if (argsBody.length === 0) {
    return [];
  }

  try {
    // For simple cases, try to parse as JSON array
    const jsonArray = `[${argsBody}]`;
    return JSON.parse(jsonArray);
  } catch (error) {
    // If JSON parsing fails, we'd need a more sophisticated parser
    // For now, throw an error indicating unsafe syntax
    throw new Error(`Cannot safely parse arguments: ${argString}. Use simple literal values.`);
  }
}

function navigateToFunction(commandPath, fakerInstance) {
  const parts = commandPath.split('.');
  let current = fakerInstance;

  for (const part of parts) {
    if (current === undefined || current === null) {
      return undefined;
    }
    current = current[part];
  }

  return current;
}

export function runFakerCommandSafely(thisCommand, theseArguments, usingFaker, propertyAccessors = []) {
  const executionResult = { isError: true, errorMessage: 'Not Executed', data: '' };

  try {
    // Navigate to the faker function
    const fakerFunction = navigateToFunction(thisCommand, usingFaker);

    if (typeof fakerFunction !== 'function') {
      executionResult.errorMessage = `Could not find function: ${thisCommand}`;
      return executionResult;
    }

    // Parse arguments safely
    const args = parseArguments(theseArguments);

    // Call the function directly
    let result = fakerFunction.apply(usingFaker, args);

    // Handle property accessors
    if (propertyAccessors && propertyAccessors.length > 0) {
      for (const accessor of propertyAccessors) {
        result = result[accessor];
        if (result === undefined) {
          throw new Error(`Property accessor '${accessor}' returned undefined`);
        }
      }
    }

    executionResult.isError = false;
    executionResult.errorMessage = '';
    executionResult.data = result;
    return executionResult;
  } catch (error) {
    executionResult.isError = true;
    executionResult.errorMessage = `Error running command ${thisCommand}${theseArguments || ''}: ${error.message}`;
    executionResult.data = '';
    return executionResult;
  }
}
