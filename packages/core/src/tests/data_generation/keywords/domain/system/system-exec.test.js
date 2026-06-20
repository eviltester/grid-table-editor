import { jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';
import { expectMeaningfulString } from '../../../unit/domain/domain-assertions.test-helper.js';

describe('system domain keyword execution', () => {
  test('executes system.commonFileExt', () => {
    const result = executeDomainKeyword('system.commonFileExt', { faker, args: [] });
    console.log('system.commonFileExt', result);
    expectMeaningfulString(result);
  });

  test('executes system.commonFileName', () => {
    const result = executeDomainKeyword('system.commonFileName', { faker, args: [] });
    console.log('system.commonFileName', result);
    expectMeaningfulString(result);
  });

  test('system.commonFileName uses extension arg', () => {
    const result = executeDomainKeyword('system.commonFileName', { faker, args: ['txt'] });
    console.log('system.commonFileName(extension=txt)', result);
    expect(result.endsWith('.txt')).toBe(true);
  });

  test('system.commonFileName uses extension arg via named arguments', () => {
    const parsed = parseKeywordInvocation('system.commonFileName(extension="txt")');
    expect(parsed.errors).toEqual([]);
    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });
    expect(result.endsWith('.txt')).toBe(true);
  });

  test('executes system.commonFileType', () => {
    const result = executeDomainKeyword('system.commonFileType', { faker, args: [] });
    console.log('system.commonFileName', result);
    expectMeaningfulString(result);
  });

  test('executes system.cron', () => {
    const result = executeDomainKeyword('system.cron', { faker, args: [] });
    console.log('system.cron', result);
    expectMeaningfulString(result);
  });

  test('system.cron uses includeYear arg', () => {
    const result = executeDomainKeyword('system.cron', { faker, args: [false, true] });
    console.log('system.cron(includeNonStandard=false,includeYear=true)', result);
    expectMeaningfulString(result);
  });

  test('system.cron uses includeYear arg via named arguments', () => {
    const parsed = parseKeywordInvocation('system.cron(includeNonStandard=false, includeYear=true)');
    expect(parsed.errors).toEqual([]);
    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });
    expectMeaningfulString(result);
  });

  test('executes system.directoryPath', () => {
    const result = executeDomainKeyword('system.directoryPath', { faker, args: [] });
    console.log('system.cron', result);
    expectMeaningfulString(result);
  });

  test('executes system.fileExt', () => {
    const result = executeDomainKeyword('system.fileExt', { faker, args: [] });
    console.log('system.fileExt', result);
    expectMeaningfulString(result);
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

  test('system.fileExt uses mimeType arg via named arguments', () => {
    const fileExt = jest.fn(() => 'png');
    const fakerStub = {
      ...faker,
      system: {
        ...faker.system,
        fileExt,
      },
    };
    const parsed = parseKeywordInvocation('system.fileExt(mimeType="image/png")');
    expect(parsed.errors).toEqual([]);
    const result = executeDomainKeyword(parsed.keyword, { faker: fakerStub, args: parsed.args });
    expect(result).toBe('png');
    expect(fileExt).toHaveBeenCalledWith({ mimeType: 'image/png' });
  });

  test('executes system.fileName', () => {
    const result = executeDomainKeyword('system.fileName', { faker, args: [] });
    console.log('system.fileExt', result);
    expectMeaningfulString(result);
  });

  test('executes system.filePath', () => {
    const result = executeDomainKeyword('system.filePath', { faker, args: [] });
    console.log('system.filePath', result);
    expectMeaningfulString(result);
  });

  test('executes system.fileType', () => {
    const result = executeDomainKeyword('system.fileType', { faker, args: [] });
    console.log('system.fileType', result);
    expectMeaningfulString(result);
  });

  test('executes system.mimeType', () => {
    const result = executeDomainKeyword('system.mimeType', { faker, args: [] });
    console.log('system.mimeType', result);
    expectMeaningfulString(result);
  });

  test('executes system.networkInterface', () => {
    const result = executeDomainKeyword('system.networkInterface', { faker, args: [] });
    console.log('system.networkInterface', result);
    expectMeaningfulString(result);
  });

  test('executes system.semver', () => {
    const result = executeDomainKeyword('system.semver', { faker, args: [] });
    console.log('system.semver', result);
    expectMeaningfulString(result);
  });
});
