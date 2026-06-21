import { validateCommandHelpValue } from '../../../../../../js/command-help/command-help-contract.js';
import { FAKER_HELPER_KEYWORD_DEFINITIONS } from '../../../../../../js/faker/faker-helper-keyword-definitions.js';
import {
  buildValidationContext,
  executeFakerExample,
  isForbiddenFakerCommand,
  normalizeExampleValue,
} from '../../../../command-help/command-help-examples.test-support.js';

function defineFakerHelperKeywordDefinitionTests(command) {
  describe(`faker helper keyword definition ${command}`, () => {
    const definition = FAKER_HELPER_KEYWORD_DEFINITIONS[command];

    test('is registered with structured metadata', () => {
      expect(definition).toBeDefined();
      expect(definition).toEqual(
        expect.objectContaining({
          summary: expect.any(String),
          docsUrl: expect.any(String),
          validator: expect.any(Function),
          returnType: expect.any(String),
          usageExamples: expect.any(Array),
          params: expect.any(Array),
        })
      );
      expect(definition.usageExamples.length).toBeGreaterThan(0);
    });

    if (isForbiddenFakerCommand(command)) {
      test('skips executable sample assertions for unsupported literal signatures', () => {
        expect(isForbiddenFakerCommand(command)).toBe(true);
      });
      return;
    }

    const usageExamples = Array.isArray(definition?.usageExamples) ? definition.usageExamples : [];

    for (const [index, usageExample] of usageExamples.entries()) {
      test(`example ${index + 1} ${usageExample.functionCall} executes, validates, and matches the seeded sample value`, () => {
        const validationContext = buildValidationContext(
          {
            catalog: 'faker',
            command,
            help: {
              validator: definition.validator,
              usageExamples: definition.usageExamples,
              params: definition.params,
              returnType: definition.returnType,
            },
            sourceDefinition: definition,
            sourceValidator: definition.validator,
          },
          usageExample
        );
        const actualValue = executeFakerExample(usageExample.functionCall);

        expect(validateCommandHelpValue(definition.validator, actualValue, validationContext)).toBe(true);
        expect(validateCommandHelpValue(definition.validator, usageExample.sampleReturnValue, validationContext)).toBe(
          true
        );
        expect(normalizeExampleValue(actualValue)).toEqual(normalizeExampleValue(usageExample.sampleReturnValue));
      });
    }
  });
}

export { defineFakerHelperKeywordDefinitionTests };
