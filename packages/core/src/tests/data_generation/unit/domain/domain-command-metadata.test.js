import {
  getDomainCommandHelp,
  getKnownDomainCommandsAlphabetical,
} from '../../../../../js/domain/domain-command-metadata.js';

describe('domain command metadata', () => {
  test('includes real datatype.enum help in the shared core metadata', () => {
    const help = getDomainCommandHelp('datatype.enum');

    expect(help).toBeTruthy();
    expect(help.canonical).toBe('awd.domain.datatype.enum');
    expect(help.docsUrl).toBe('https://anywaydata.com/docs/test-data/domain/datatype');
    expect(help.usageExamples).toHaveLength(2);
    expect(help.usageExamples).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          functionCall: 'datatype.enum(values="active,inactive,pending")',
          sampleReturnValue: 'inactive',
        }),
        expect.objectContaining({
          functionCall: 'datatype.enum(values="GET,POST,PUT,PATCH")',
          sampleReturnValue: 'PUT',
        }),
      ])
    );
    expect(help.args).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'values',
          type: 'comma-separated list',
          variadic: true,
          optional: false,
        }),
      ])
    );
  });

  test('includes datatype.enum in the shared domain command list', () => {
    expect(getKnownDomainCommandsAlphabetical()).toContain('datatype.enum');
  });
});
