import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';

describe('system domain keyword execution', () => {
  test('executes system.commonFileExt', () => {
    const result = executeDomainKeyword('system.commonFileExt', { faker, args: [] });
    console.log('system.commonFileExt', result);
    expect(result).not.toBeUndefined();
  });

  test('executes system.commonFileName', () => {
    const result = executeDomainKeyword('system.commonFileName', { faker, args: [] });
    console.log('system.commonFileName', result);
    expect(result).not.toBeUndefined();
  });

  test('executes system.commonFileType', () => {
    const result = executeDomainKeyword('system.commonFileType', { faker, args: [] });
    console.log('system.commonFileType', result);
    expect(result).not.toBeUndefined();
  });

  test('executes system.cron', () => {
    const result = executeDomainKeyword('system.cron', { faker, args: [] });
    console.log('system.cron', result);
    expect(result).not.toBeUndefined();
  });

  test('executes system.directoryPath', () => {
    const result = executeDomainKeyword('system.directoryPath', { faker, args: [] });
    console.log('system.directoryPath', result);
    expect(result).not.toBeUndefined();
  });

  test('executes system.fileExt', () => {
    const result = executeDomainKeyword('system.fileExt', { faker, args: [] });
    console.log('system.fileExt', result);
    expect(result).not.toBeUndefined();
  });

  test('executes system.fileName', () => {
    const result = executeDomainKeyword('system.fileName', { faker, args: [] });
    console.log('system.fileName', result);
    expect(result).not.toBeUndefined();
  });

  test('executes system.filePath', () => {
    const result = executeDomainKeyword('system.filePath', { faker, args: [] });
    console.log('system.filePath', result);
    expect(result).not.toBeUndefined();
  });

  test('executes system.fileType', () => {
    const result = executeDomainKeyword('system.fileType', { faker, args: [] });
    console.log('system.fileType', result);
    expect(result).not.toBeUndefined();
  });

  test('executes system.mimeType', () => {
    const result = executeDomainKeyword('system.mimeType', { faker, args: [] });
    console.log('system.mimeType', result);
    expect(result).not.toBeUndefined();
  });

  test('executes system.networkInterface', () => {
    const result = executeDomainKeyword('system.networkInterface', { faker, args: [] });
    console.log('system.networkInterface', result);
    expect(result).not.toBeUndefined();
  });

  test('executes system.semver', () => {
    const result = executeDomainKeyword('system.semver', { faker, args: [] });
    console.log('system.semver', result);
    expect(result).not.toBeUndefined();
  });
});
