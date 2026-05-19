import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { assertDomainKeywordResult } from './domain-result-assertions.test-helper.js';

describe('color domain keyword execution', () => {
  test('executes color.cmyk', () => {
    const result = executeDomainKeyword('color.cmyk', { faker, args: [] });
    console.log('color.cmyk', result);
    assertDomainKeywordResult('color.cmyk', result);
  });

  test('executes color.colorByCSSColorSpace', () => {
    const result = executeDomainKeyword('color.colorByCSSColorSpace', { faker, args: [] });
    console.log('color.colorByCSSColorSpace', result);
    assertDomainKeywordResult('color.colorByCSSColorSpace', result);
  });

  test('executes color.cssSupportedFunction', () => {
    const result = executeDomainKeyword('color.cssSupportedFunction', { faker, args: [] });
    console.log('color.cssSupportedFunction', result);
    assertDomainKeywordResult('color.cssSupportedFunction', result);
  });

  test('executes color.cssSupportedSpace', () => {
    const result = executeDomainKeyword('color.cssSupportedSpace', { faker, args: [] });
    console.log('color.cssSupportedSpace', result);
    assertDomainKeywordResult('color.cssSupportedSpace', result);
  });

  test('executes color.hsl', () => {
    const result = executeDomainKeyword('color.hsl', { faker, args: [] });
    console.log('color.hsl', result);
    assertDomainKeywordResult('color.hsl', result);
  });

  test('executes color.human', () => {
    const result = executeDomainKeyword('color.human', { faker, args: [] });
    console.log('color.human', result);
    assertDomainKeywordResult('color.human', result);
  });

  test('executes color.hwb', () => {
    const result = executeDomainKeyword('color.hwb', { faker, args: [] });
    console.log('color.hwb', result);
    assertDomainKeywordResult('color.hwb', result);
  });

  test('executes color.lab', () => {
    const result = executeDomainKeyword('color.lab', { faker, args: [] });
    console.log('color.lab', result);
    assertDomainKeywordResult('color.lab', result);
  });

  test('executes color.lch', () => {
    const result = executeDomainKeyword('color.lch', { faker, args: [] });
    console.log('color.lch', result);
    assertDomainKeywordResult('color.lch', result);
  });

  test('executes color.rgb', () => {
    const result = executeDomainKeyword('color.rgb', { faker, args: [] });
    console.log('color.rgb', result);
    assertDomainKeywordResult('color.rgb', result);
  });

  test('executes color.space', () => {
    const result = executeDomainKeyword('color.space', { faker, args: [] });
    console.log('color.space', result);
    assertDomainKeywordResult('color.space', result);
  });
});
