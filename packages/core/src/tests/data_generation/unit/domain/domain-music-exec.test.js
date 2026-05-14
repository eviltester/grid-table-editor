import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';

describe('music domain keyword execution', () => {
  test('executes music.album', () => {
    const result = executeDomainKeyword('music.album', { faker, args: [] });
    console.log('music.album', result);
    expect(result).not.toBeUndefined();
  });

  test('executes music.artist', () => {
    const result = executeDomainKeyword('music.artist', { faker, args: [] });
    console.log('music.artist', result);
    expect(result).not.toBeUndefined();
  });

  test('executes music.genre', () => {
    const result = executeDomainKeyword('music.genre', { faker, args: [] });
    console.log('music.genre', result);
    expect(result).not.toBeUndefined();
  });

  test('executes music.songName', () => {
    const result = executeDomainKeyword('music.songName', { faker, args: [] });
    console.log('music.songName', result);
    expect(result).not.toBeUndefined();
  });
});
