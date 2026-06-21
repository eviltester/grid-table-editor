import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../../js/domain/domain-keywords.js';
import { expectMeaningfulString } from '../../../unit/domain/domain-assertions.test-helper.js';

describe('image domain keyword execution', () => {
  test('executes image.avatar', () => {
    const result = executeDomainKeyword('image.avatar', { faker, args: [] });
    console.log('image.avatar', result);
    expectMeaningfulString(result);
  });

  test('executes image.avatarGitHub', () => {
    const result = executeDomainKeyword('image.avatarGitHub', { faker, args: [] });
    console.log('image.avatarGitHub', result);
    expectMeaningfulString(result);
  });

  test('executes image.dataUri', () => {
    const result = executeDomainKeyword('image.dataUri', { faker, args: [] });
    console.log('image.dataUri', result);
    expectMeaningfulString(result);
  });

  test('executes image.personPortrait', () => {
    const result = executeDomainKeyword('image.personPortrait', { faker, args: [] });
    console.log('image.personPortrait', result);
    expectMeaningfulString(result);
  });

  test('executes image.url', () => {
    const result = executeDomainKeyword('image.url', { faker, args: [] });
    console.log('image.url', result);
    expectMeaningfulString(result);
  });

  test('executes image.urlPicsumPhotos', () => {
    const result = executeDomainKeyword('image.urlPicsumPhotos', { faker, args: [] });
    console.log('image.urlPicsumPhotos', result);
    expectMeaningfulString(result);
  });
});
