import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';

describe('finance domain keyword execution', () => {
  test('executes finance.accountName', () => {
    const result = executeDomainKeyword('finance.accountName', { faker, args: [] });
    console.log('finance.accountName', result);
    expect(result).not.toBeUndefined();
  });

  test('executes finance.accountNumber', () => {
    const result = executeDomainKeyword('finance.accountNumber', { faker, args: [] });
    console.log('finance.accountNumber', result);
    expect(result).not.toBeUndefined();
  });

  test('executes finance.amount', () => {
    const result = executeDomainKeyword('finance.amount', { faker, args: [] });
    console.log('finance.amount', result);
    expect(result).not.toBeUndefined();
  });

  test('executes finance.bic', () => {
    const result = executeDomainKeyword('finance.bic', { faker, args: [] });
    console.log('finance.bic', result);
    expect(result).not.toBeUndefined();
  });

  test('executes finance.bitcoinAddress', () => {
    const result = executeDomainKeyword('finance.bitcoinAddress', { faker, args: [] });
    console.log('finance.bitcoinAddress', result);
    expect(result).not.toBeUndefined();
  });

  test('executes finance.creditCardCVV', () => {
    const result = executeDomainKeyword('finance.creditCardCVV', { faker, args: [] });
    console.log('finance.creditCardCVV', result);
    expect(result).not.toBeUndefined();
  });

  test('executes finance.creditCardIssuer', () => {
    const result = executeDomainKeyword('finance.creditCardIssuer', { faker, args: [] });
    console.log('finance.creditCardIssuer', result);
    expect(result).not.toBeUndefined();
  });

  test('executes finance.creditCardNumber', () => {
    const result = executeDomainKeyword('finance.creditCardNumber', { faker, args: [] });
    console.log('finance.creditCardNumber', result);
    expect(result).not.toBeUndefined();
  });

  test('executes finance.currency', () => {
    const result = executeDomainKeyword('finance.currency', { faker, args: [] });
    console.log('finance.currency', result);
    expect(result).not.toBeUndefined();
  });

  test('executes finance.currencyCode', () => {
    const result = executeDomainKeyword('finance.currencyCode', { faker, args: [] });
    console.log('finance.currencyCode', result);
    expect(result).not.toBeUndefined();
  });

  test('executes finance.currencyName', () => {
    const result = executeDomainKeyword('finance.currencyName', { faker, args: [] });
    console.log('finance.currencyName', result);
    expect(result).not.toBeUndefined();
  });

  test('executes finance.currencyNumericCode', () => {
    const result = executeDomainKeyword('finance.currencyNumericCode', { faker, args: [] });
    console.log('finance.currencyNumericCode', result);
    expect(result).not.toBeUndefined();
  });

  test('executes finance.currencySymbol', () => {
    const result = executeDomainKeyword('finance.currencySymbol', { faker, args: [] });
    console.log('finance.currencySymbol', result);
    expect(result).not.toBeUndefined();
  });

  test('executes finance.ethereumAddress', () => {
    const result = executeDomainKeyword('finance.ethereumAddress', { faker, args: [] });
    console.log('finance.ethereumAddress', result);
    expect(result).not.toBeUndefined();
  });

  test('executes finance.iban', () => {
    const result = executeDomainKeyword('finance.iban', { faker, args: [] });
    console.log('finance.iban', result);
    expect(result).not.toBeUndefined();
  });

  test('executes finance.litecoinAddress', () => {
    const result = executeDomainKeyword('finance.litecoinAddress', { faker, args: [] });
    console.log('finance.litecoinAddress', result);
    expect(result).not.toBeUndefined();
  });

  test('executes finance.maskedNumber', () => {
    const result = executeDomainKeyword('finance.maskedNumber', { faker, args: [] });
    console.log('finance.maskedNumber', result);
    expect(result).not.toBeUndefined();
  });

  test('executes finance.pin', () => {
    const result = executeDomainKeyword('finance.pin', { faker, args: [] });
    console.log('finance.pin', result);
    expect(result).not.toBeUndefined();
  });

  test('executes finance.routingNumber', () => {
    const result = executeDomainKeyword('finance.routingNumber', { faker, args: [] });
    console.log('finance.routingNumber', result);
    expect(result).not.toBeUndefined();
  });

  test('executes finance.transactionDescription', () => {
    const result = executeDomainKeyword('finance.transactionDescription', { faker, args: [] });
    console.log('finance.transactionDescription', result);
    expect(result).not.toBeUndefined();
  });

  test('executes finance.transactionType', () => {
    const result = executeDomainKeyword('finance.transactionType', { faker, args: [] });
    console.log('finance.transactionType', result);
    expect(result).not.toBeUndefined();
  });
});
