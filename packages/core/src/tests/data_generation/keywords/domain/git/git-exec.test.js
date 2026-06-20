import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../../js/domain/domain-keywords.js';
import { expectMeaningfulString } from '../../../unit/domain/domain-assertions.test-helper.js';

describe('git domain keyword execution', () => {
  test('executes git.branch', () => {
    const result = executeDomainKeyword('git.branch', { faker, args: [] });
    console.log('git.branch', result);
    expectMeaningfulString(result);
  });

  test('executes git.commitDate', () => {
    const result = executeDomainKeyword('git.commitDate', { faker, args: [] });
    console.log('git.commitDate', result);
    expectMeaningfulString(result);
  });

  test('executes git.commitEntry', () => {
    const result = executeDomainKeyword('git.commitEntry', { faker, args: [] });
    console.log('git.commitEntry', result);
    expectMeaningfulString(result);
  });

  test('executes git.commitMessage', () => {
    const result = executeDomainKeyword('git.commitMessage', { faker, args: [] });
    console.log('git.commitMessage', result);
    expectMeaningfulString(result);
  });

  test('executes git.commitSha', () => {
    const result = executeDomainKeyword('git.commitSha', { faker, args: [] });
    console.log('git.commitSha', result);
    expectMeaningfulString(result);
  });
});
