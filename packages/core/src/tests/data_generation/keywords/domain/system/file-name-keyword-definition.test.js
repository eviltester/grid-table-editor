import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('system.fileName');

describe('system.fileName parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('system.fileName');
    const parsed = parseKeywordInvocation(`system.fileName(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes system.fileName(extensionCount=1) successfully', () => {
    const parsed = parseKeywordInvocation('system.fileName(extensionCount=1)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
    expect(result.split('.')).toHaveLength(2);
  });

  test('rejects invalid extensionCount type before generation', () => {
    expect(validateArgs('extensionCount={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "extensionCount" must be number, not object',
    });
  });

  test('rejects zero extensionCount before generation', () => {
    expect(validateArgs('extensionCount=0')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "extensionCount" must be greater than 0',
    });
  });

  test('rejects negative extensionCount before generation', () => {
    expect(validateArgs('extensionCount=-1')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "extensionCount" must be greater than 0',
    });
  });

  test('rejects fractional extensionCount before generation', () => {
    expect(validateArgs('extensionCount=1.5')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "extensionCount" must be an integer',
    });
  });
});
