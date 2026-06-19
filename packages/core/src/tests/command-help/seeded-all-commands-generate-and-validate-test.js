import { validateCommandHelpValue } from '../../../js/command-help/command-help-contract.js';
import {
  SEEDED_EXAMPLE_FAKER_SEED,
  SEEDED_EXAMPLE_MATH_RANDOM,
  SEEDED_EXAMPLE_REF_DATE,
  buildCommandCases,
  buildValidationContext,
  executeDomainExample,
  executeFakerExample,
  isForbiddenFakerCommand,
  normalizeExampleValue,
} from './command-help-examples.test-support.js';

const SEEDED_COMMAND_HELP_GENERATION = {
  fakerSeed: SEEDED_EXAMPLE_FAKER_SEED,
  refDateIso: SEEDED_EXAMPLE_REF_DATE.toISOString(),
  mathRandom: SEEDED_EXAMPLE_MATH_RANDOM,
};

describe('seeded all commands generate and validate', () => {
  const { commandCases } = buildCommandCases();

  for (const entry of commandCases) {
    if (entry.catalog === 'faker' && isForbiddenFakerCommand(entry.command)) {
      continue;
    }

    const usageExamples = Array.isArray(entry.help?.usageExamples) ? entry.help.usageExamples : [];
    for (const [index, usageExample] of usageExamples.entries()) {
      test(`${entry.catalog}:${entry.command} example ${index + 1} ${usageExample.functionCall} executes and validates with fakerSeed=${SEEDED_COMMAND_HELP_GENERATION.fakerSeed}, refDate=${SEEDED_COMMAND_HELP_GENERATION.refDateIso}, mathRandom=${SEEDED_COMMAND_HELP_GENERATION.mathRandom}`, () => {
        const validator = entry.sourceValidator;
        expect(validator).toBeDefined();
        expect(typeof validator).toBe('function');
        const validationContext = buildValidationContext(entry, usageExample);

        const actualValue =
          entry.catalog === 'faker' && entry.command.startsWith('helpers.')
            ? executeFakerExample(usageExample.functionCall)
            : executeDomainExample(usageExample.functionCall);

        console.log(
          `[command-help-example] ${entry.catalog}:${entry.command} fakerSeed=${SEEDED_COMMAND_HELP_GENERATION.fakerSeed} refDate=${SEEDED_COMMAND_HELP_GENERATION.refDateIso} mathRandom=${SEEDED_COMMAND_HELP_GENERATION.mathRandom} ${usageExample.functionCall}`,
          actualValue
        );

        expect(validateCommandHelpValue(validator, actualValue, validationContext)).toBe(true);
        expect(validateCommandHelpValue(validator, usageExample.sampleReturnValue, validationContext)).toBe(true);
        expect(normalizeExampleValue(usageExample.sampleReturnValue)).toEqual(normalizeExampleValue(actualValue));
      });
    }
  }
});
