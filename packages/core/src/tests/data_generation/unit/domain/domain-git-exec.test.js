import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';

describe('git domain keyword execution', () => {
  test('executes git.branch', () => {
    const result = executeDomainKeyword('git.branch', { faker, args: [] });
    console.log('git.branch', result);
    expect(result).not.toBeUndefined();
  });

  test('executes git.commitDate', () => {
    const result = executeDomainKeyword('git.commitDate', { faker, args: [] });
    console.log('git.commitDate', result);
    expect(result).not.toBeUndefined();
  });

  test('executes git.commitEntry', () => {
    const result = executeDomainKeyword('git.commitEntry', { faker, args: [] });
    console.log('git.commitEntry', result);
    expect(result).not.toBeUndefined();
  });

  test('executes git.commitMessage', () => {
    const result = executeDomainKeyword('git.commitMessage', { faker, args: [] });
    console.log('git.commitMessage', result);
    expect(result).not.toBeUndefined();
  });

  test('executes git.commitSha', () => {
    const result = executeDomainKeyword('git.commitSha', { faker, args: [] });
    console.log('git.commitSha', result);
    expect(result).not.toBeUndefined();
  });
});
