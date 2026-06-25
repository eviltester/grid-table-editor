import { getDomainCommandHelp } from '../../../js/gui_components/shared/domain-command-help-metadata.js';
import { validateCommandHelpValue } from '@anywaydata/core/command-help/command-help-contract.js';

describe('domain command help metadata docs links', () => {
  test('maps domain command docs urls to anywaydata domain pages', () => {
    const airline = getDomainCommandHelp('airline.aircraftType');
    expect(airline).toBeTruthy();
    expect(airline.docsUrl).toBe('https://anywaydata.com/docs/test-data/domain/airline');
    expect(airline.fakerDocsUrl).toBe('https://fakerjs.dev/api/airline');
  });

  test('keeps synthetic datatype enum on anywaydata datatype domain page', () => {
    const enumHelp = getDomainCommandHelp('datatype.enum');
    expect(enumHelp).toBeTruthy();
    expect(enumHelp.docsUrl).toBe('https://anywaydata.com/docs/test-data/domain/datatype');
    expect(enumHelp.usageExamples).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          functionCall: expect.any(String),
          sampleReturnValue: expect.anything(),
          description: expect.any(String),
        }),
      ])
    );
    expect(enumHelp.validator).toBeDefined();
    expect(
      validateCommandHelpValue(enumHelp.validator, 'active', {
        fieldDefinition: {
          sourceType: 'domain',
          command: 'datatype.enum',
          params: 'active,inactive,pending',
          ruleSpec: 'datatype.enum("active","inactive","pending")',
        },
      })
    ).toBe(true);
    expect(
      validateCommandHelpValue(enumHelp.validator, 'archived', {
        fieldDefinition: {
          sourceType: 'domain',
          command: 'datatype.enum',
          params: 'active,inactive,pending',
          ruleSpec: 'datatype.enum("active","inactive","pending")',
        },
      })
    ).toBe(false);
  });

  test('maps autoIncrement timestamp help to the autoIncrement domain page', () => {
    const autoIncrementHelp = getDomainCommandHelp('autoIncrement.timestamp');
    expect(autoIncrementHelp).toBeTruthy();
    expect(autoIncrementHelp.docsUrl).toBe('https://anywaydata.com/docs/test-data/domain/autoIncrement');
  });

  test('keeps explicit anywaydata docs pages for custom domain commands', () => {
    const sequenceHelp = getDomainCommandHelp('autoIncrement.sequence');
    expect(sequenceHelp).toBeTruthy();
    expect(sequenceHelp.docsUrl).toBe('https://anywaydata.com/docs/test-data/auto-increment-sequences');
    expect(sequenceHelp.fakerDocsUrl).toBe('');
  });

  test('runtime domain help metadata does not expose legacy example fields', () => {
    const help = getDomainCommandHelp('commerce.price');
    expect(help).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(help, 'example')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(help, 'examples')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(help, 'exampleReturnValues')).toBe(false);
  });
});
