import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { assertDomainKeywordResult } from './domain-result-assertions.test-helper.js';

describe('finance domain keyword execution', () => {
  test('executes finance.accountName', () => {
    const result = executeDomainKeyword('finance.accountName', { faker, args: [] });
    console.log('finance.accountName', result);
    assertDomainKeywordResult('finance.accountName', result);
  });

  test('executes finance.accountNumber', () => {
    const result = executeDomainKeyword('finance.accountNumber', { faker, args: [] });
    console.log('finance.accountNumber', result);
    assertDomainKeywordResult('finance.accountNumber', result);
  });

  test('executes finance.amount', () => {
    const result = executeDomainKeyword('finance.amount', { faker, args: [] });
    console.log('finance.amount', result);
    assertDomainKeywordResult('finance.amount', result);
  });

  test('executes finance.bic', () => {
    const result = executeDomainKeyword('finance.bic', { faker, args: [] });
    console.log('finance.bic', result);
    assertDomainKeywordResult('finance.bic', result);
  });

  test('executes finance.bitcoinAddress', () => {
    const result = executeDomainKeyword('finance.bitcoinAddress', { faker, args: [] });
    console.log('finance.bitcoinAddress', result);
    assertDomainKeywordResult('finance.bitcoinAddress', result);
  });

  test('executes finance.creditCardCVV', () => {
    const result = executeDomainKeyword('finance.creditCardCVV', { faker, args: [] });
    console.log('finance.creditCardCVV', result);
    assertDomainKeywordResult('finance.creditCardCVV', result);
  });

  test('executes finance.creditCardIssuer', () => {
    const result = executeDomainKeyword('finance.creditCardIssuer', { faker, args: [] });
    console.log('finance.creditCardIssuer', result);
    assertDomainKeywordResult('finance.creditCardIssuer', result);
  });

  test('executes finance.creditCardNumber', () => {
    const result = executeDomainKeyword('finance.creditCardNumber', { faker, args: [] });
    console.log('finance.creditCardNumber', result);
    assertDomainKeywordResult('finance.creditCardNumber', result);
  });

  test('executes finance.currency', () => {
    const result = executeDomainKeyword('finance.currency', { faker, args: [] });
    console.log('finance.currency', result);
    assertDomainKeywordResult('finance.currency', result);
  });

  test('executes finance.currencyCode', () => {
    const result = executeDomainKeyword('finance.currencyCode', { faker, args: [] });
    console.log('finance.currencyCode', result);
    assertDomainKeywordResult('finance.currencyCode', result);
  });

  test('executes finance.currencyName', () => {
    const result = executeDomainKeyword('finance.currencyName', { faker, args: [] });
    console.log('finance.currencyName', result);
    assertDomainKeywordResult('finance.currencyName', result);
  });

  test('executes finance.currencyNumericCode', () => {
    const result = executeDomainKeyword('finance.currencyNumericCode', { faker, args: [] });
    console.log('finance.currencyNumericCode', result);
    assertDomainKeywordResult('finance.currencyNumericCode', result);
  });

  test('executes finance.currencySymbol', () => {
    const result = executeDomainKeyword('finance.currencySymbol', { faker, args: [] });
    console.log('finance.currencySymbol', result);
    assertDomainKeywordResult('finance.currencySymbol', result);
  });

  test('executes finance.ethereumAddress', () => {
    const result = executeDomainKeyword('finance.ethereumAddress', { faker, args: [] });
    console.log('finance.ethereumAddress', result);
    assertDomainKeywordResult('finance.ethereumAddress', result);
  });

  test('executes finance.iban', () => {
    const result = executeDomainKeyword('finance.iban', { faker, args: [] });
    console.log('finance.iban', result);
    assertDomainKeywordResult('finance.iban', result);
  });

  test('executes finance.iban with countryCode and formatted options', () => {
    const result = executeDomainKeyword('finance.iban', { faker, args: ['GB', true] });
    console.log('finance.iban(countryCode=GB,formatted=true)', result);
    expect(result).toMatch(/^GB/);
    expect(result.includes(' ')).toBe(true);
  });

  test('executes finance.litecoinAddress', () => {
    const result = executeDomainKeyword('finance.litecoinAddress', { faker, args: [] });
    console.log('finance.iban', result);
    assertDomainKeywordResult('finance.iban', result);
  });

  test('executes finance.maskedNumber', () => {
    const result = executeDomainKeyword('finance.maskedNumber', { faker, args: [] });
    console.log('finance.maskedNumber', result);
    assertDomainKeywordResult('finance.maskedNumber', result);
  });

  test('executes finance.pin', () => {
    const result = executeDomainKeyword('finance.pin', { faker, args: [] });
    console.log('finance.pin', result);
    assertDomainKeywordResult('finance.pin', result);
  });

  test('executes finance.routingNumber', () => {
    const result = executeDomainKeyword('finance.routingNumber', { faker, args: [] });
    console.log('finance.routingNumber', result);
    assertDomainKeywordResult('finance.routingNumber', result);
  });

  test('executes finance.transactionDescription', () => {
    const result = executeDomainKeyword('finance.transactionDescription', { faker, args: [] });
    console.log('finance.transactionDescription', result);
    assertDomainKeywordResult('finance.transactionDescription', result);
  });

  test('executes finance.transactionType', () => {
    const result = executeDomainKeyword('finance.transactionType', { faker, args: [] });
    console.log('finance.transactionType', result);
    assertDomainKeywordResult('finance.transactionType', result);
  });
});
