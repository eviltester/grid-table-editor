import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../js/domain/domain-keyword-parser.js';
import { expectMeaningfulString } from './domain-assertions.test-helper.js';

describe('finance domain keyword execution', () => {
  test('executes finance.accountName', () => {
    const result = executeDomainKeyword('finance.accountName', { faker, args: [] });
    console.log('finance.accountName', result);
    expect(result).toMatch(/account/i);
  });

  test('executes finance.accountNumber', () => {
    const result = executeDomainKeyword('finance.accountNumber', { faker, args: [] });
    console.log('finance.accountNumber', result);
    expect(result).toMatch(/^[0-9]{6,}$/);
  });

  test('executes finance.amount', () => {
    const result = executeDomainKeyword('finance.amount', { faker, args: [] });
    console.log('finance.amount', result);
    expect(result).toMatch(/^-?\d+(\.\d+)?$/);
  });

  test('executes finance.bic', () => {
    const result = executeDomainKeyword('finance.bic', { faker, args: [] });
    console.log('finance.bic', result);
    expect(result).toMatch(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/);
  });

  test('executes finance.bitcoinAddress', () => {
    const result = executeDomainKeyword('finance.bitcoinAddress', { faker, args: [] });
    console.log('finance.bitcoinAddress', result);
    expectMeaningfulString(result);
  });

  test('executes finance.creditCardCVV', () => {
    const result = executeDomainKeyword('finance.creditCardCVV', { faker, args: [] });
    console.log('finance.creditCardCVV', result);
    expect(result).toMatch(/^\d{3,4}$/);
  });

  test('executes finance.creditCardIssuer', () => {
    const result = executeDomainKeyword('finance.creditCardIssuer', { faker, args: [] });
    console.log('finance.creditCardIssuer', result);
    expectMeaningfulString(result);
  });

  test('executes finance.creditCardNumber', () => {
    const result = executeDomainKeyword('finance.creditCardNumber', { faker, args: [] });
    console.log('finance.creditCardNumber', result);
    expect(result.replace(/[\s-]/g, '')).toMatch(/^\d{12,19}$/);
  });

  test('executes finance.currency', () => {
    const result = executeDomainKeyword('finance.currency', { faker, args: [] });
    console.log('finance.currency', result);
    expect(result).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        code: expect.any(String),
        symbol: expect.any(String),
      })
    );
  });

  test('executes finance.currencyCode', () => {
    const result = executeDomainKeyword('finance.currencyCode', { faker, args: [] });
    console.log('finance.currencyCode', result);
    expect(result).toMatch(/^[A-Z]{3}$/);
  });

  test('executes finance.currencyName', () => {
    const result = executeDomainKeyword('finance.currencyName', { faker, args: [] });
    console.log('finance.currencyName', result);
    expectMeaningfulString(result);
  });

  test('executes finance.currencyNumericCode', () => {
    const result = executeDomainKeyword('finance.currencyNumericCode', { faker, args: [] });
    console.log('finance.currencyNumericCode', result);
    expect(result).toMatch(/^\d{3}$/);
  });

  test('executes finance.currencySymbol', () => {
    const result = executeDomainKeyword('finance.currencySymbol', { faker, args: [] });
    console.log('finance.currencySymbol', result);
    expectMeaningfulString(result);
  });

  test('executes finance.ethereumAddress', () => {
    const result = executeDomainKeyword('finance.ethereumAddress', { faker, args: [] });
    console.log('finance.ethereumAddress', result);
    expect(result).toMatch(/^0x[a-fA-F0-9]{40}$/);
  });

  test('executes finance.iban', () => {
    const result = executeDomainKeyword('finance.iban', { faker, args: [] });
    console.log('finance.iban', result);
    expect(result.replace(/\s+/g, '')).toMatch(/^[A-Z]{2}[0-9A-Z]{13,32}$/);
  });

  test('executes finance.iban with countryCode and formatted options', () => {
    const result = executeDomainKeyword('finance.iban', { faker, args: ['GB', true] });
    console.log('finance.iban(countryCode=GB,formatted=true)', result);
    expect(result).toMatch(/^GB/);
    expect(result.includes(' ')).toBe(true);
  });

  test('executes finance.iban with countryCode and formatted options via named arguments', () => {
    const parsed = parseKeywordInvocation('finance.iban(countryCode="GB", formatted=true)');
    expect(parsed.errors).toEqual([]);
    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });
    expect(result).toMatch(/^GB/);
    expect(result.includes(' ')).toBe(true);
  });

  test('executes finance.litecoinAddress', () => {
    const result = executeDomainKeyword('finance.litecoinAddress', { faker, args: [] });
    console.log('finance.litecoinAddress', result);
    expectMeaningfulString(result);
  });

  test('executes finance.pin', () => {
    const result = executeDomainKeyword('finance.pin', { faker, args: [] });
    console.log('finance.pin', result);
    expect(result).toMatch(/^\d{4}$/);
  });

  test('executes finance.routingNumber', () => {
    const result = executeDomainKeyword('finance.routingNumber', { faker, args: [] });
    console.log('finance.routingNumber', result);
    expect(result).toMatch(/^\d{9}$/);
  });

  test('executes finance.transactionDescription', () => {
    const result = executeDomainKeyword('finance.transactionDescription', { faker, args: [] });
    console.log('finance.transactionDescription', result);
    expectMeaningfulString(result);
  });

  test('executes finance.transactionType', () => {
    const result = executeDomainKeyword('finance.transactionType', { faker, args: [] });
    console.log('finance.transactionType', result);
    expectMeaningfulString(result);
  });
});
