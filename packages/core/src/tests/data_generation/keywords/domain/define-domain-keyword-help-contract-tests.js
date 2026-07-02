import { validateCommandHelpValue } from '../../../../../js/command-help/command-help-contract.js';
import { DOMAIN_KEYWORD_DEFINITIONS } from '../../../../../js/domain/domain-keyword-definitions.js';
import {
  buildValidationContext,
  executeDomainExample,
  normalizeExampleValue,
} from '../../../command-help/command-help-examples.test-support.js';

function getDomainKeywordDefinition(keyword) {
  return DOMAIN_KEYWORD_DEFINITIONS.find((definition) => definition.keyword === keyword) || null;
}

function checkKeywordIsRegisteredWithHelpMetadata(keyword, definition) {
  test('is registered with structured help metadata', () => {
    expect(definition).toBeDefined();
    expect(definition).toEqual(
      expect.objectContaining({
        keyword,
        delegate: expect.objectContaining({
          type: expect.any(String),
          target: expect.any(String),
        }),
        help: expect.objectContaining({
          summary: expect.any(String),
          docsUrl: expect.any(String),
          fakerDocsUrl: expect.any(String),
          validator: expect.any(Function),
          returnType: expect.any(String),
          usageExamples: expect.any(Array),
          args: expect.any(Array),
        }),
      })
    );
    expect(definition.help.usageExamples.length).toBeGreaterThan(0);
  });
}

function checkKeywordUsageExamplesExecuteAndValidate(keyword, definition) {
  const usageExamples = Array.isArray(definition?.help?.usageExamples) ? definition.help.usageExamples : [];

  for (const [index, usageExample] of usageExamples.entries()) {
    test(`example ${index + 1} ${usageExample.functionCall} executes, validates, and matches the seeded sample value`, () => {
      const validationContext = buildValidationContext(
        {
          catalog: 'domain',
          command: keyword,
          help: definition.help,
          sourceDefinition: definition,
          sourceValidator: definition.help.validator,
        },
        usageExample
      );
      const actualValue = executeDomainExample(usageExample.functionCall);

      expect(validateCommandHelpValue(definition.help.validator, actualValue, validationContext)).toBe(true);
      expect(
        validateCommandHelpValue(definition.help.validator, usageExample.sampleReturnValue, validationContext)
      ).toBe(true);
      expect(normalizeExampleValue(actualValue)).toEqual(normalizeExampleValue(usageExample.sampleReturnValue));
    });
  }
}

function defineDomainKeywordHelpContractTests(keyword) {
  describe(`domain keyword help contract ${keyword}`, () => {
    const definition = getDomainKeywordDefinition(keyword);

    checkKeywordIsRegisteredWithHelpMetadata(keyword, definition);
    checkKeywordUsageExamplesExecuteAndValidate(keyword, definition);
  });
}

export { defineDomainKeywordHelpContractTests };
