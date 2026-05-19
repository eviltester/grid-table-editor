import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { assertDomainKeywordResult } from './domain-result-assertions.test-helper.js';

describe('image domain keyword execution', () => {
  test('executes image.avatar', () => {
    const result = executeDomainKeyword('image.avatar', { faker, args: [] });
    console.log('image.avatar', result);
    assertDomainKeywordResult('image.avatar', result);
  });

  test('executes image.avatarGitHub', () => {
    const result = executeDomainKeyword('image.avatarGitHub', { faker, args: [] });
    console.log('image.avatarGitHub', result);
    assertDomainKeywordResult('image.avatarGitHub', result);
  });

  test('executes image.avatarLegacy', () => {
    const result = executeDomainKeyword('image.avatarLegacy', { faker, args: [] });
    console.log('image.avatarLegacy', result);
    assertDomainKeywordResult('image.avatarLegacy', result);
  });

  test('executes image.dataUri', () => {
    const result = executeDomainKeyword('image.dataUri', { faker, args: [] });
    console.log('image.dataUri', result);
    assertDomainKeywordResult('image.dataUri', result);
  });

  test('executes image.personPortrait', () => {
    const result = executeDomainKeyword('image.personPortrait', { faker, args: [] });
    console.log('image.personPortrait', result);
    assertDomainKeywordResult('image.personPortrait', result);
  });

  test('executes image.url', () => {
    const result = executeDomainKeyword('image.url', { faker, args: [] });
    console.log('image.url', result);
    assertDomainKeywordResult('image.url', result);
  });

  test('executes image.urlLoremFlickr', () => {
    const result = executeDomainKeyword('image.urlLoremFlickr', { faker, args: [] });
    console.log('image.urlLoremFlickr', result);
    assertDomainKeywordResult('image.urlLoremFlickr', result);
  });

  test('executes image.urlPicsumPhotos', () => {
    const result = executeDomainKeyword('image.urlPicsumPhotos', { faker, args: [] });
    console.log('image.urlPicsumPhotos', result);
    assertDomainKeywordResult('image.urlPicsumPhotos', result);
  });

  test('executes image.urlPlaceholder', () => {
    const result = executeDomainKeyword('image.urlPlaceholder', { faker, args: [] });
    console.log('image.urlPlaceholder', result);
    assertDomainKeywordResult('image.urlPlaceholder', result);
  });
});
