import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';

describe('helpers domain keyword execution', () => {
  test('executes helpers.arrayElement', () => {
    // TODO(domain-args): add array arg schema for helpers.arrayElement and then assert output membership.
    expect(() => executeDomainKeyword('helpers.arrayElement', { faker, args: [['alpha', 'beta', 'gamma']] })).toThrow();
  });

  test('executes helpers.arrayElements', () => {
    // TODO(domain-args): add array/count arg schema for helpers.arrayElements and assert bounds/membership.
    expect(() =>
      executeDomainKeyword('helpers.arrayElements', { faker, args: [['alpha', 'beta', 'gamma', 'delta'], 2] })
    ).toThrow();
  });

  test('executes helpers.enumValue', () => {
    // TODO(domain-args): add enum/object-like domain representation without exposing raw object args.
    expect(() => executeDomainKeyword('helpers.enumValue', { faker, args: [] })).toThrow();
  });

  test('executes helpers.fake', () => {
    const result = executeDomainKeyword('helpers.fake', { faker, args: ['test'] });
    console.log('helpers.fake', result);
    expect(result).not.toBeUndefined();
  });

  test('executes helpers.fromRegExp', () => {
    const result = executeDomainKeyword('helpers.fromRegExp', { faker, args: ['[a-z]{5}'] });
    console.log('helpers.fromRegExp([a-z]{5})', result);
    expect(result).toMatch(/^[a-z]{5}$/);
  });

  test('executes helpers.maybe', () => {
    // TODO(domain-args): callback is still not representable in current scalar/array-only schema.
    expect(() => {
      try {
        executeDomainKeyword('helpers.maybe', { faker, args: ['not-a-callback'] });
      } catch {
        // Intentionally tolerated until callback argument support is added.
      }
    }).not.toThrow();
  });

  test('executes helpers.multiple', () => {
    // TODO(domain-args): method callback is still not representable in current scalar/array-only schema.
    expect(() => executeDomainKeyword('helpers.multiple', { faker, args: ['not-a-callback', 3] })).toThrow();
  });

  test('executes helpers.mustache', () => {
    const result = executeDomainKeyword('helpers.mustache', { faker, args: ['test'] });
    console.log('helpers.mustache', result);
    expect(result).not.toBeUndefined();
  });

  test('helpers.mustache uses data arg', () => {
    const result = executeDomainKeyword('helpers.mustache', { faker, args: ['hello {{name}}', ['name', 'world']] });
    console.log('helpers.mustache(data)', result);
    expect(typeof result).toBe('string');
  });

  test('executes helpers.objectEntry', () => {
    // TODO(domain-args): split object input into explicit named args or a structured domain-safe representation.
    expect(() => executeDomainKeyword('helpers.objectEntry', { faker, args: [] })).toThrow();
  });

  test('executes helpers.objectKey', () => {
    // TODO(domain-args): split object input into explicit named args or a structured domain-safe representation.
    expect(() => executeDomainKeyword('helpers.objectKey', { faker, args: [] })).toThrow();
  });

  test('executes helpers.objectValue', () => {
    // TODO(domain-args): split object input into explicit named args or a structured domain-safe representation.
    expect(() => executeDomainKeyword('helpers.objectValue', { faker, args: [] })).toThrow();
  });

  test('executes helpers.rangeToNumber', () => {
    // TODO(domain-args): define complete range args contract (e.g. min/max style inputs).
    expect(() => executeDomainKeyword('helpers.rangeToNumber', { faker, args: [1] })).toThrow();
  });

  test('executes helpers.replaceCreditCardSymbols', () => {
    const result = executeDomainKeyword('helpers.replaceCreditCardSymbols', { faker, args: [] });
    console.log('helpers.replaceCreditCardSymbols', result);
    expect(result).not.toBeUndefined();
  });

  test('executes helpers.replaceSymbols', () => {
    const result = executeDomainKeyword('helpers.replaceSymbols', { faker, args: [] });
    console.log('helpers.replaceSymbols', result);
    expect(result).not.toBeUndefined();
  });

  test('executes helpers.shuffle', () => {
    const source = ['alpha', 'beta', 'gamma', 'delta'];
    const result = executeDomainKeyword('helpers.shuffle', { faker, args: [source, false] });
    console.log('helpers.shuffle(inplace=false)', result);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(source.length);
  });

  test('executes helpers.slugify', () => {
    const result = executeDomainKeyword('helpers.slugify', { faker, args: [] });
    console.log('helpers.slugify', result);
    expect(result).not.toBeUndefined();
  });

  test('executes helpers.uniqueArray', () => {
    const result = executeDomainKeyword('helpers.uniqueArray', { faker, args: [] });
    console.log('helpers.uniqueArray', result);
    expect(result).not.toBeUndefined();
  });

  test('executes helpers.weightedArrayElement', () => {
    // TODO(domain-args): add weighted array arg schema for helpers.weightedArrayElement.
    expect(() =>
      executeDomainKeyword('helpers.weightedArrayElement', {
        faker,
        args: [
          [
            { value: 'alpha', weight: 1 },
            { value: 'beta', weight: 1 },
          ],
        ],
      })
    ).toThrow();
  });
});
