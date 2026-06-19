import {
  DOMAIN_INVOCATION_PARSER,
  buildCommandCases,
  getHelperExampleArgCount,
  getOptionalCompanionNames,
  isRequiredParam,
} from './command-help-examples.test-support.js';

describe('command help usage examples', () => {
  const { fakerCases, commandCases } = buildCommandCases();

  test('all commands expose at least one structured usage example', () => {
    const missing = commandCases
      .filter((entry) => !Array.isArray(entry.help?.usageExamples) || entry.help.usageExamples.length === 0)
      .map((entry) => `${entry.catalog}:${entry.command}`);

    expect(missing).toEqual([]);
  });

  test('commands expose at least one usage example per optional param, plus a zero-arg example when all params are optional', () => {
    const missingCoverage = commandCases
      .map((entry) => {
        const optionalCount = entry.params.filter((param) => !isRequiredParam(param)).length;
        const allParamsOptional = entry.params.length > 0 && optionalCount === entry.params.length;
        const minimumExampleCount = Math.max(1, optionalCount + (allParamsOptional ? 1 : 0));
        return {
          ...entry,
          optionalCount,
          minimumExampleCount,
        };
      })
      .filter((entry) => (entry.help?.usageExamples?.length || 0) < entry.minimumExampleCount)
      .map((entry) => ({
        command: `${entry.catalog}:${entry.command}`,
        optionalParamCount: entry.optionalCount,
        minimumExampleCount: entry.minimumExampleCount,
        usageExampleCount: entry.help?.usageExamples?.length || 0,
      }));

    expect(missingCoverage).toEqual([]);
  });

  test('each optional parameter has a focused usage example and all-optional commands include a zero-arg example', () => {
    const failures = commandCases.flatMap((entry) => {
      const usageExamples = Array.isArray(entry.help?.usageExamples) ? entry.help.usageExamples : [];
      const optionalParams = entry.params
        .map((param, index) => ({ ...param, index }))
        .filter((param) => !isRequiredParam(param));
      const requiredParamNames = new Set(entry.params.filter(isRequiredParam).map((param) => param.name));
      const lastRequiredIndex = entry.params.reduce(
        (current, param, index) => (isRequiredParam(param) ? index : current),
        -1
      );
      const entryFailures = [];

      if (entry.params.length > 0 && optionalParams.length === entry.params.length) {
        const hasZeroArgExample = usageExamples.some((usageExample) => {
          if (entry.command.startsWith('helpers.')) {
            return getHelperExampleArgCount(usageExample.functionCall) === 0;
          }
          const parsed = DOMAIN_INVOCATION_PARSER.parse(usageExample.functionCall);
          return parsed.ok && (parsed.arguments || []).length === 0;
        });

        if (!hasZeroArgExample) {
          entryFailures.push({
            command: `${entry.catalog}:${entry.command}`,
            reason: 'missing zero-arg example for all-optional params',
          });
        }
      }

      for (const optionalParam of optionalParams) {
        if (entry.command.startsWith('helpers.')) {
          const requiredArgCount = Math.max(optionalParam.index + 1, lastRequiredIndex + 1);
          const hasFocusedExample = usageExamples.some(
            (usageExample) => getHelperExampleArgCount(usageExample.functionCall) === requiredArgCount
          );

          if (!hasFocusedExample) {
            entryFailures.push({
              command: `${entry.catalog}:${entry.command}`,
              param: optionalParam.name,
              reason: `missing focused positional example with ${requiredArgCount} argument(s)`,
            });
          }

          continue;
        }

        const hasFocusedExample = usageExamples.some((usageExample) => {
          const parsed = DOMAIN_INVOCATION_PARSER.parse(usageExample.functionCall);
          if (!parsed.ok || parsed.keyword !== entry.command) {
            return false;
          }

          const namedArgs = (parsed.arguments || [])
            .filter((argument) => argument.kind === 'named')
            .map((arg) => arg.name);
          if (!namedArgs.includes(optionalParam.name)) {
            return false;
          }

          const optionalArgNames = namedArgs.filter((name) => !requiredParamNames.has(name));
          const allowedOptionalArgNames = new Set([
            optionalParam.name,
            ...getOptionalCompanionNames(entry.params, optionalParam),
          ]);

          return optionalArgNames.every((name) => allowedOptionalArgNames.has(name));
        });

        if (!hasFocusedExample) {
          entryFailures.push({
            command: `${entry.catalog}:${entry.command}`,
            param: optionalParam.name,
            reason: 'missing focused named example for optional param',
          });
        }
      }

      return entryFailures;
    });

    expect(failures).toEqual([]);
  });

  test('all structured usage examples include functionCall, sampleReturnValue, and description', () => {
    const invalidExamples = commandCases.flatMap((entry) => {
      const usageExamples = Array.isArray(entry.help?.usageExamples) ? entry.help.usageExamples : [];
      return usageExamples
        .map((usageExample, index) => {
          const hasFunctionCall =
            typeof usageExample?.functionCall === 'string' && usageExample.functionCall.trim().length > 0;
          const hasDescription =
            typeof usageExample?.description === 'string' && usageExample.description.trim().length > 0;
          const hasSampleReturnValue = Object.prototype.hasOwnProperty.call(usageExample || {}, 'sampleReturnValue');
          if (
            hasFunctionCall &&
            hasDescription &&
            hasSampleReturnValue &&
            typeof usageExample.sampleReturnValue !== 'undefined'
          ) {
            return null;
          }
          return {
            command: `${entry.catalog}:${entry.command}`,
            exampleIndex: index + 1,
            usageExample,
          };
        })
        .filter(Boolean);
    });

    expect(invalidExamples).toEqual([]);
  });

  test('runtime command help objects do not expose legacy example fields', () => {
    const legacyFieldFailures = commandCases
      .map((entry) => ({
        command: `${entry.catalog}:${entry.command}`,
        legacyFields: ['example', 'examples', 'exampleReturnValues'].filter((fieldName) =>
          Object.prototype.hasOwnProperty.call(entry.help || {}, fieldName)
        ),
      }))
      .filter((entry) => entry.legacyFields.length > 0);

    expect(legacyFieldFailures).toEqual([]);
  });

  test('non-helper command help examples use domain named-parameter syntax', () => {
    const invalidExamples = commandCases.flatMap((entry) => {
      if (entry.command.startsWith('helpers.')) {
        return [];
      }

      const usageExamples = Array.isArray(entry.help?.usageExamples) ? entry.help.usageExamples : [];
      return usageExamples
        .map((usageExample, index) => {
          const parsed = DOMAIN_INVOCATION_PARSER.parse(usageExample.functionCall);
          const hasOnlyNamedArgs = (parsed.arguments || []).every((argument) => argument.kind === 'named');
          if (parsed.ok && parsed.keyword === entry.command && hasOnlyNamedArgs) {
            return null;
          }
          return {
            command: `${entry.catalog}:${entry.command}`,
            exampleIndex: index + 1,
            functionCall: usageExample.functionCall,
          };
        })
        .filter(Boolean);
    });

    expect(invalidExamples).toEqual([]);
  });

  test('faker-style usage examples remain scoped to helpers only', () => {
    const invalidExamples = fakerCases.flatMap((entry) => {
      const usageExamples = Array.isArray(entry.help?.usageExamples) ? entry.help.usageExamples : [];
      return usageExamples
        .filter((usageExample) => {
          const functionCall = String(usageExample.functionCall || '').trim();
          return functionCall !== entry.command && !functionCall.startsWith(`${entry.command}(`);
        })
        .map((usageExample) => ({
          command: entry.command,
          functionCall: usageExample.functionCall,
        }));
    });

    expect(invalidExamples).toEqual([]);
  });
});
