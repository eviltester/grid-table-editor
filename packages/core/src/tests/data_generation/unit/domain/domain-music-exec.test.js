import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { expectMeaningfulString } from './domain-assertions.test-helper.js';

describe('music domain keyword execution', () => {
  test('executes music.album', () => {
    const result = executeDomainKeyword('music.album', { faker, args: [] });
    expectMeaningfulString(result);
  });

  test('executes music.artist', () => {
    const result = executeDomainKeyword('music.artist', { faker, args: [] });
    expectMeaningfulString(result);
  });

  test('executes music.genre', () => {
    const result = executeDomainKeyword('music.genre', { faker, args: [] });
    expectMeaningfulString(result);
  });

  test('executes music.songName', () => {
    const result = executeDomainKeyword('music.songName', { faker, args: [] });
    expectMeaningfulString(result);
  });
});
