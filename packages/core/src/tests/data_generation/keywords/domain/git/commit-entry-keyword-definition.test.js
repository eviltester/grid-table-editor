import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('git.commitEntry');

describe('git.commitEntry parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('git.commitEntry');
    const parsed = parseKeywordInvocation(`git.commitEntry(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes git.commitEntry(merge=true, eol="LF") successfully', () => {
    const parsed = parseKeywordInvocation('git.commitEntry(merge=true, eol="LF")');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid merge type before generation', () => {
    expect(validateArgs('merge={"bad":true}, eol="LF"')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "merge" must be boolean, not object',
    });
  });

  test('rejects invalid eol type before generation', () => {
    expect(validateArgs('merge=true, eol={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "eol" must be LF or CRLF, not object',
    });
  });

  test('rejects invalid refDate type before generation', () => {
    expect(validateArgs('merge=true, eol="LF", refDate={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "refDate" must be string, date or number, not object',
    });
  });
});
