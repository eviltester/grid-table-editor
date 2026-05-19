import { jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { assertDomainKeywordResult } from './domain-result-assertions.test-helper.js';

describe('system domain keyword execution', () => {
  test('executes system.commonFileExt', () => {
    const result = executeDomainKeyword('system.commonFileExt', { faker, args: [] });
    console.log('system.commonFileExt', result);
    assertDomainKeywordResult('system.commonFileExt', result);
  });

  test('executes system.commonFileName', () => {
    const result = executeDomainKeyword('system.commonFileName', { faker, args: [] });
    console.log('system.commonFileName', result);
    assertDomainKeywordResult('system.commonFileName', result);
  });

  test('system.commonFileName uses extension arg', () => {
    const result = executeDomainKeyword('system.commonFileName', { faker, args: ['txt'] });
    console.log('system.commonFileName(extension=txt)', result);
    expect(result.endsWith('.txt')).toBe(true);
  });

  test('executes system.commonFileType', () => {
    const result = executeDomainKeyword('system.commonFileType', { faker, args: [] });
    console.log('system.commonFileName', result);
    assertDomainKeywordResult('system.commonFileName', result);
  });

  test('executes system.cron', () => {
    const result = executeDomainKeyword('system.cron', { faker, args: [] });
    console.log('system.cron', result);
    assertDomainKeywordResult('system.cron', result);
  });

  test('system.cron uses includeYear arg', () => {
    const result = executeDomainKeyword('system.cron', { faker, args: [false, true] });
    console.log('system.cron(includeNonStandard=false,includeYear=true)', result);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  test('executes system.directoryPath', () => {
    const result = executeDomainKeyword('system.directoryPath', { faker, args: [] });
    console.log('system.cron', result);
    assertDomainKeywordResult('system.cron', result);
  });

  test('executes system.fileExt', () => {
    const result = executeDomainKeyword('system.fileExt', { faker, args: [] });
    console.log('system.fileExt', result);
    assertDomainKeywordResult('system.fileExt', result);
  });

  test('system.fileExt uses mimeType arg', () => {
    const fileExt = jest.fn(() => 'png');
    const fakerStub = {
      ...faker,
      system: {
        ...faker.system,
        fileExt,
      },
    };

    const result = executeDomainKeyword('system.fileExt', { faker: fakerStub, args: ['image/png'] });
    console.log('system.fileExt(mimeType=image/png)', result);
    expect(result).toBe('png');
    expect(fileExt).toHaveBeenCalledWith({ mimeType: 'image/png' });
  });

  test('executes system.fileName', () => {
    const result = executeDomainKeyword('system.fileName', { faker, args: [] });
    console.log('system.fileExt', result);
    assertDomainKeywordResult('system.fileExt', result);
  });

  test('executes system.filePath', () => {
    const result = executeDomainKeyword('system.filePath', { faker, args: [] });
    console.log('system.filePath', result);
    assertDomainKeywordResult('system.filePath', result);
  });

  test('executes system.fileType', () => {
    const result = executeDomainKeyword('system.fileType', { faker, args: [] });
    console.log('system.fileType', result);
    assertDomainKeywordResult('system.fileType', result);
  });

  test('executes system.mimeType', () => {
    const result = executeDomainKeyword('system.mimeType', { faker, args: [] });
    console.log('system.mimeType', result);
    assertDomainKeywordResult('system.mimeType', result);
  });

  test('executes system.networkInterface', () => {
    const result = executeDomainKeyword('system.networkInterface', { faker, args: [] });
    console.log('system.networkInterface', result);
    assertDomainKeywordResult('system.networkInterface', result);
  });

  test('executes system.semver', () => {
    const result = executeDomainKeyword('system.semver', { faker, args: [] });
    console.log('system.semver', result);
    assertDomainKeywordResult('system.semver', result);
  });
});
