import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('autoIncrement.timestamp');

describe('autoIncrement.timestamp parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('autoIncrement.timestamp');
    const parsed = parseKeywordInvocation(`autoIncrement.timestamp(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes autoIncrement.timestamp(start="2026-06-12T12:39:23Z", step=1, type="seconds") successfully', () => {
    const parsed = parseKeywordInvocation(
      'autoIncrement.timestamp(start="2026-06-12T12:39:23Z", step=1, type="seconds")'
    );

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, {
      args: parsed.args,
      rowIndex: 0,
      runStartedAt: new Date('2026-06-18T15:55:20.000Z'),
    });

    expect(result).toBeDefined();
  });

  test('rejects invalid start type before generation', () => {
    expect(validateArgs('start={"bad":true}, step=1, type="seconds"')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "start" must be string or number, not object',
    });
  });

  test('rejects invalid step type before generation', () => {
    expect(validateArgs('start="2026-06-12T12:39:23Z", step={"bad":true}, type="seconds"')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "step" must be number, not object',
    });
  });

  test('rejects invalid type type before generation', () => {
    expect(validateArgs('start="2026-06-12T12:39:23Z", step=1, type={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "type" must be string, not object',
    });
  });

  test('rejects invalid outputFormat type before generation', () => {
    expect(validateArgs('start="2026-06-12T12:39:23Z", step=1, type="seconds", outputFormat={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "outputFormat" must be string, not object',
    });
  });

  test('rejects invalid inputFormat type before generation', () => {
    expect(validateArgs('start="2026-06-12T12:39:23Z", step=1, type="seconds", inputFormat={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "inputFormat" must be string, not object',
    });
  });
});
