import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { assertDomainKeywordResult } from './domain-result-assertions.test-helper.js';

describe('git domain keyword execution', () => {
  test('executes git.branch', () => {
    const result = executeDomainKeyword('git.branch', { faker, args: [] });
    console.log('git.branch', result);
    assertDomainKeywordResult('git.branch', result);
  });

  test('executes git.commitDate', () => {
    const result = executeDomainKeyword('git.commitDate', { faker, args: [] });
    console.log('git.commitDate', result);
    assertDomainKeywordResult('git.commitDate', result);
  });

  test('executes git.commitEntry', () => {
    const result = executeDomainKeyword('git.commitEntry', { faker, args: [] });
    console.log('git.commitEntry', result);
    assertDomainKeywordResult('git.commitEntry', result);
  });

  test('executes git.commitMessage', () => {
    const result = executeDomainKeyword('git.commitMessage', { faker, args: [] });
    console.log('git.commitMessage', result);
    assertDomainKeywordResult('git.commitMessage', result);
  });

  test('executes git.commitSha', () => {
    const result = executeDomainKeyword('git.commitSha', { faker, args: [] });
    console.log('git.commitSha', result);
    assertDomainKeywordResult('git.commitSha', result);
  });
});
