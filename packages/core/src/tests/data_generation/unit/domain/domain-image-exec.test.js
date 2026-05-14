import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';

describe('image domain keyword execution', () => {
  test('executes image.avatar', () => {
    const result = executeDomainKeyword('image.avatar', { faker, args: [] });
    console.log('image.avatar', result);
    expect(result).not.toBeUndefined();
  });

  test('executes image.avatarGitHub', () => {
    const result = executeDomainKeyword('image.avatarGitHub', { faker, args: [] });
    console.log('image.avatarGitHub', result);
    expect(result).not.toBeUndefined();
  });

  test('executes image.avatarLegacy', () => {
    const result = executeDomainKeyword('image.avatarLegacy', { faker, args: [] });
    console.log('image.avatarLegacy', result);
    expect(result).not.toBeUndefined();
  });

  test('executes image.dataUri', () => {
    const result = executeDomainKeyword('image.dataUri', { faker, args: [] });
    console.log('image.dataUri', result);
    expect(result).not.toBeUndefined();
  });

  test('executes image.personPortrait', () => {
    const result = executeDomainKeyword('image.personPortrait', { faker, args: [] });
    console.log('image.personPortrait', result);
    expect(result).not.toBeUndefined();
  });

  test('executes image.url', () => {
    const result = executeDomainKeyword('image.url', { faker, args: [] });
    console.log('image.url', result);
    expect(result).not.toBeUndefined();
  });

  test('executes image.urlLoremFlickr', () => {
    const result = executeDomainKeyword('image.urlLoremFlickr', { faker, args: [] });
    console.log('image.urlLoremFlickr', result);
    expect(result).not.toBeUndefined();
  });

  test('executes image.urlPicsumPhotos', () => {
    const result = executeDomainKeyword('image.urlPicsumPhotos', { faker, args: [] });
    console.log('image.urlPicsumPhotos', result);
    expect(result).not.toBeUndefined();
  });

  test('executes image.urlPlaceholder', () => {
    const result = executeDomainKeyword('image.urlPlaceholder', { faker, args: [] });
    console.log('image.urlPlaceholder', result);
    expect(result).not.toBeUndefined();
  });
});
