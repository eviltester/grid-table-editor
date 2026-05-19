import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { assertDomainKeywordResult } from './domain-result-assertions.test-helper.js';

describe('music domain keyword execution', () => {
  test('executes music.album', () => {
    const result = executeDomainKeyword('music.album', { faker, args: [] });
    console.log('music.album', result);
    assertDomainKeywordResult('music.album', result);
  });

  test('executes music.artist', () => {
    const result = executeDomainKeyword('music.artist', { faker, args: [] });
    console.log('music.artist', result);
    assertDomainKeywordResult('music.artist', result);
  });

  test('executes music.genre', () => {
    const result = executeDomainKeyword('music.genre', { faker, args: [] });
    console.log('music.genre', result);
    assertDomainKeywordResult('music.genre', result);
  });

  test('executes music.songName', () => {
    const result = executeDomainKeyword('music.songName', { faker, args: [] });
    console.log('music.songName', result);
    assertDomainKeywordResult('music.songName', result);
  });
});
