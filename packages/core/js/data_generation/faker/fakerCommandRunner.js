/**
 * Hybrid approach: Try safe direct function calls first, fallback to Function() with security checks
 */

import { errorResponse } from '../ruleResponse.js';

function parseArgumentsSafely(argString) {
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
    // If JSON parsing fails, indicate we need fallback
    throw new Error('NEEDS_FALLBACK');
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

function runFakerCommandSafely(thisCommand, theseArguments, usingFaker, propertyAccessors = []) {
  const executionResult = { isError: true, errorMessage: 'Not Executed', data: '' };

  // Navigate to the faker function
  const fakerFunction = navigateToFunction(thisCommand, usingFaker);

  if (typeof fakerFunction !== 'function') {
    throw new Error(`Could not find function: ${thisCommand}`);
  }

  // Parse arguments safely
  const args = parseArgumentsSafely(theseArguments);

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
}

function runFakerCommandWithFallback(thisCommand, theseArguments, usingFaker, propertyAccessors = [], options = {}) {
  const executionResult = { isError: true, errorMessage: 'Not Executed', data: '' };
  const useArguments = theseArguments ? theseArguments : '()';

  // Check for dangerous patterns before using Function() constructor
  // Always block genuinely dangerous patterns regardless of unsafeFakerExpressions
  const alwaysDangerousPatterns = [
    /require\s*\(/,
    /process\./,
    /globalThis\./,
    /constructor/,
    /__proto__/,
    /prototype\./,
    /eval\s*\(/,
    /Function\s*\(/,
    /import\s*\(/,
    /document\./,
    /window\./,
    /location\./,
    /history\./,
    /navigator\./,
    /console\.(log|error|warn|info)/,
    /setTimeout|setInterval/,
    /XMLHttpRequest/,
    /fetch\s*\(/,
    /Promise\s*\(/,
    /async\s+/,
    /await\s+/,
  ];

  for (const pattern of alwaysDangerousPatterns) {
    if (pattern.test(useArguments) || pattern.test(thisCommand)) {
      executionResult.errorMessage = `Security: Potentially unsafe pattern detected`;
      return executionResult;
    }
  }

  // Additional string-based checks for always dangerous content
  const argStr = String(useArguments || '');
  const cmdStr = String(thisCommand || '');

  if (
    argStr.includes('require(') ||
    argStr.includes('process.') ||
    argStr.includes('eval(') ||
    cmdStr.includes('require(') ||
    cmdStr.includes('process.') ||
    cmdStr.includes('eval(')
  ) {
    executionResult.errorMessage = `Security: Dangerous function call detected`;
    return executionResult;
  }

  // Only apply additional restrictions if unsafeFakerExpressions is not explicitly enabled
  if (!options.unsafeFakerExpressions) {
    const additionalPatterns = [
      /=>/, // Arrow functions
      /`/, // Template literals
      /\bthis\b/, // 'this' keyword
      /\bfunction\b/, // Function keyword
      /;/, // Semicolons (command separation)
    ];

    for (const pattern of additionalPatterns) {
      if (pattern.test(useArguments) || pattern.test(thisCommand)) {
        executionResult.errorMessage = `Security: Potentially unsafe pattern detected`;
        return executionResult;
      }
    }
  }

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
    executionResult.isError = true;
    executionResult.errorMessage = 'Error running Command ' + thisCommand + useArguments + ' ERR: ' + e;
    executionResult.data = '';
    return executionResult;
  }
}

export function runFakerCommand(thisCommand, theseArguments, usingFaker, propertyAccessors = [], options = {}) {
  try {
    // First, try the safe approach (direct function calls)
    return runFakerCommandSafely(thisCommand, theseArguments, usingFaker, propertyAccessors);
  } catch (error) {
    // If the safe approach fails, handle different error types appropriately
    if (options.unsafeFakerExpressions !== true) {
      // For parse failures, check if it's due to dangerous patterns that should be properly handled
      if (error?.message === 'NEEDS_FALLBACK') {
        // Check if the arguments contain dangerous patterns - if so, let fallback handle them
        const useArguments = theseArguments || '';
        const dangerousPatterns = [
          /require\s*\(/,
          /process\./,
          /eval\s*\(/,
          /Function\s*\(/,
          /constructor/,
          /__proto__/,
          /prototype\./,
        ];

        const hasDangerousPattern = dangerousPatterns.some(
          (pattern) => pattern.test(useArguments) || pattern.test(thisCommand)
        );

        // Check if it's likely just simple arguments that should be allowed (like faker templates and arrays)
        // These should be allowed even without unsafeFakerExpressions
        const looksLikeSimpleArgs =
          // Simple string arguments: ('string') or ('str1', 'str2')
          /^\(\s*['"][^'"]*['"]\s*(?:,\s*['"][^'"]*['"]\s*)*\)$/.test(useArguments) ||
          // Simple array arguments: (['item1', 'item2'])
          /^\(\s*\[\s*['"][^'"]*['"]\s*(?:,\s*['"][^'"]*['"]\s*)*\s*\]\s*\)$/.test(useArguments) ||
          // Simple number arguments: (42) or (1, 2, 3)
          /^\(\s*\d+\s*(?:,\s*\d+\s*)*\)$/.test(useArguments) ||
          // Empty arguments: ()
          /^\(\s*\)$/.test(useArguments);

        if (hasDangerousPattern) {
          // Let the fallback function handle dangerous patterns properly
          return runFakerCommandWithFallback(thisCommand, theseArguments, usingFaker, propertyAccessors, options);
        } else if (looksLikeSimpleArgs) {
          // Allow simple arguments (strings, arrays, numbers) to use fallback even without unsafe mode
          return runFakerCommandWithFallback(thisCommand, theseArguments, usingFaker, propertyAccessors, options);
        }

        // For other complex syntax, return unsafe syntax error
        return errorResponse(`Unsafe faker rule syntax detected: requires complex argument parsing`);
      }
      // For other errors (missing functions, bad property accessors), return original error
      return errorResponse(error?.message || 'Error running faker command');
    }
    // If unsafe expressions are explicitly allowed, fall back to Function() with enhanced security
    return runFakerCommandWithFallback(thisCommand, theseArguments, usingFaker, propertyAccessors, options);
  }
}
