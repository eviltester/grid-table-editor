import { getDomainCommandHelp } from '../../../js/gui_components/shared/domain-command-help-metadata.js';

describe('domain command help metadata docs links', () => {
  test('maps domain command docs urls to anywaydata domain pages', () => {
    const airline = getDomainCommandHelp('airline.aircraftType');
    expect(airline).toBeTruthy();
    expect(airline.docsUrl).toBe('https://anywaydata.com/docs/test-data/domain/airline');
  });

  test('keeps synthetic datatype enum on anywaydata datatype domain page', () => {
    const enumHelp = getDomainCommandHelp('datatype.enum');
    expect(enumHelp).toBeTruthy();
    expect(enumHelp.docsUrl).toBe('https://anywaydata.com/docs/test-data/domain/datatype');
  });

  test('keeps explicit anywaydata docs pages for custom domain commands', () => {
    const sequenceHelp = getDomainCommandHelp('autoIncrement.sequence');
    expect(sequenceHelp).toBeTruthy();
    expect(sequenceHelp.docsUrl).toBe('https://anywaydata.com/docs/test-data/auto-increment-sequences');
  });
});
