import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { expectMeaningfulString } from './domain-assertions.test-helper.js';

describe('color domain keyword execution', () => {
  test('executes color.cmyk', () => {
    const result = executeDomainKeyword('color.cmyk', { faker, args: [] });
    console.log('color.cmyk', result);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(4);
    for (const channel of result) {
      expect(typeof channel).toBe('number');
      expect(channel).toBeGreaterThanOrEqual(0);
      expect(channel).toBeLessThanOrEqual(1);
    }
  });

  test('executes color.colorByCSSColorSpace', () => {
    const result = executeDomainKeyword('color.colorByCSSColorSpace', { faker, args: [] });
    console.log('color.colorByCSSColorSpace', result);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(3);
    for (const component of result) {
      expect(typeof component).toBe('number');
      expect(component).toBeGreaterThanOrEqual(0);
      expect(component).toBeLessThanOrEqual(1);
    }
  });

  test('executes color.cssSupportedFunction', () => {
    const result = executeDomainKeyword('color.cssSupportedFunction', { faker, args: [] });
    console.log('color.cssSupportedFunction', result);
    expectMeaningfulString(result);
  });

  test('executes color.cssSupportedSpace', () => {
    const result = executeDomainKeyword('color.cssSupportedSpace', { faker, args: [] });
    console.log('color.cssSupportedSpace', result);
    expectMeaningfulString(result);
  });

  test('executes color.hsl', () => {
    const result = executeDomainKeyword('color.hsl', { faker, args: [] });
    console.log('color.hsl', result);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(3);
  });

  test('executes color.human', () => {
    const result = executeDomainKeyword('color.human', { faker, args: [] });
    console.log('color.human', result);
    expectMeaningfulString(result);
  });

  test('executes color.hwb', () => {
    const result = executeDomainKeyword('color.hwb', { faker, args: [] });
    console.log('color.hwb', result);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(3);
  });

  test('executes color.lab', () => {
    const result = executeDomainKeyword('color.lab', { faker, args: [] });
    console.log('color.lab', result);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(3);
  });

  test('executes color.lch', () => {
    const result = executeDomainKeyword('color.lch', { faker, args: [] });
    console.log('color.lch', result);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(3);
  });

  test('executes color.rgb', () => {
    const result = executeDomainKeyword('color.rgb', { faker, args: [] });
    console.log('color.rgb', result);
    expect(result).toMatch(/^#?[0-9a-f]{6}$/i);
  });

  test('executes color.space', () => {
    const result = executeDomainKeyword('color.space', { faker, args: [] });
    console.log('color.space', result);
    expectMeaningfulString(result);
  });
});
