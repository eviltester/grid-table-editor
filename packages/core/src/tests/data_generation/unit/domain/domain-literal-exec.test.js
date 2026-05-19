import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';

describe('literal domain keyword execution', () => {
  test('executes literal.value', () => {
    const result = executeDomainKeyword('literal.value', {
      args: [1],
      customDelegates: {
        'literal.value': ({ args: runtimeArgs }) => runtimeArgs[0],
      },
    });
    expect(result).toBe(1);
  });
});
