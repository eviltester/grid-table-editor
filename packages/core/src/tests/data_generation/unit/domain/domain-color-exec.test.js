import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';

describe('color domain keyword execution', () => {
  test('executes color.cmyk', () => {
    const result = executeDomainKeyword('color.cmyk', { faker, args: [] });
    console.log('color.cmyk', result);
    expect(result).not.toBeUndefined();
  });

  test('executes color.colorByCSSColorSpace', () => {
    const result = executeDomainKeyword('color.colorByCSSColorSpace', { faker, args: [] });
    console.log('color.colorByCSSColorSpace', result);
    expect(result).not.toBeUndefined();
  });

  test('executes color.cssSupportedFunction', () => {
    const result = executeDomainKeyword('color.cssSupportedFunction', { faker, args: [] });
    console.log('color.cssSupportedFunction', result);
    expect(result).not.toBeUndefined();
  });

  test('executes color.cssSupportedSpace', () => {
    const result = executeDomainKeyword('color.cssSupportedSpace', { faker, args: [] });
    console.log('color.cssSupportedSpace', result);
    expect(result).not.toBeUndefined();
  });

  test('executes color.hsl', () => {
    const result = executeDomainKeyword('color.hsl', { faker, args: [] });
    console.log('color.hsl', result);
    expect(result).not.toBeUndefined();
  });

  test('executes color.human', () => {
    const result = executeDomainKeyword('color.human', { faker, args: [] });
    console.log('color.human', result);
    expect(result).not.toBeUndefined();
  });

  test('executes color.hwb', () => {
    const result = executeDomainKeyword('color.hwb', { faker, args: [] });
    console.log('color.hwb', result);
    expect(result).not.toBeUndefined();
  });

  test('executes color.lab', () => {
    const result = executeDomainKeyword('color.lab', { faker, args: [] });
    console.log('color.lab', result);
    expect(result).not.toBeUndefined();
  });

  test('executes color.lch', () => {
    const result = executeDomainKeyword('color.lch', { faker, args: [] });
    console.log('color.lch', result);
    expect(result).not.toBeUndefined();
  });

  test('executes color.rgb', () => {
    const result = executeDomainKeyword('color.rgb', { faker, args: [] });
    console.log('color.rgb', result);
    expect(result).not.toBeUndefined();
  });

  test('executes color.space', () => {
    const result = executeDomainKeyword('color.space', { faker, args: [] });
    console.log('color.space', result);
    expect(result).not.toBeUndefined();
  });
});
