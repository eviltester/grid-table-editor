import {
  extractFakerCommandAndParams,
  extractDomainCommandAndParams,
} from '../../../js/gui_components/shared/test-data/schema/command-spec-parser.js';

describe('command-spec-parser', () => {
  test('extractFakerCommandAndParams splits command and params by longest match', () => {
    const result = extractFakerCommandAndParams('person.firstName(sex="male")', {
      normaliseFakerCommand: (value) => String(value || '').trim(),
      fakerCommandsLongestFirst: ['person.firstName', 'person'],
    });

    expect(result).toEqual({
      command: 'person.firstName',
      params: '(sex="male")',
    });
  });

  test('extractFakerCommandAndParams does not split unknown commands at a known prefix', () => {
    const result = extractFakerCommandAndParams('image.urlLoremFlickr()', {
      normaliseFakerCommand: (value) => String(value || '').trim(),
      fakerCommandsLongestFirst: ['image.url'],
    });

    expect(result).toEqual({
      command: 'image.urlLoremFlickr',
      params: '()',
    });
  });

  test('extractDomainCommandAndParams resolves alias and params', () => {
    const result = extractDomainCommandAndParams('string.counterString(2,4)', {
      normaliseDomainCommand: (value) => String(value || '').trim(),
      getDomainKeywordByCommand: (command) =>
        command === 'string.counterString'
          ? { keyword: 'string.counterString', shortestUniqueAlias: 'string.counterString' }
          : null,
      domainCommandsLongestFirst: ['string.counterString'],
    });

    expect(result).toEqual({
      command: 'string.counterString',
      params: '(2,4)',
    });
  });
});
