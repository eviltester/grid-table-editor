import {
  EXPORT_LINE_ENDINGS,
  applyExportTextEncoding,
  resolveDefaultLineEndingForPlatform,
  resolveExportTextEncodingSettings,
} from '../../export-text-encoding.js';

describe('export text encoding', () => {
  test('defaults to CRLF for Windows-like platforms', () => {
    expect(resolveDefaultLineEndingForPlatform('win32')).toBe(EXPORT_LINE_ENDINGS.crlf);
    expect(resolveDefaultLineEndingForPlatform('Windows')).toBe(EXPORT_LINE_ENDINGS.crlf);
  });

  test('defaults to LF for non-Windows platforms', () => {
    expect(resolveDefaultLineEndingForPlatform('darwin')).toBe(EXPORT_LINE_ENDINGS.lf);
    expect(resolveDefaultLineEndingForPlatform('linux')).toBe(EXPORT_LINE_ENDINGS.lf);
    expect(resolveDefaultLineEndingForPlatform('MacIntel')).toBe(EXPORT_LINE_ENDINGS.lf);
  });

  test('resolves line ending defaults and BOM defaults together', () => {
    expect(resolveExportTextEncodingSettings({}, { platform: 'win32' })).toEqual({
      lineEnding: EXPORT_LINE_ENDINGS.crlf,
      includeBom: false,
    });
  });

  test('normalizes mixed input line endings to LF output', () => {
    expect(applyExportTextEncoding('a\r\nb\rc\n', { lineEnding: 'lf' })).toBe('a\nb\nc\n');
  });

  test('normalizes mixed input line endings to CRLF output', () => {
    expect(applyExportTextEncoding('a\r\nb\rc\n', { lineEnding: 'crlf' })).toBe('a\r\nb\r\nc\r\n');
  });

  test('prepends a UTF-8 BOM when requested', () => {
    expect(applyExportTextEncoding('hello\nworld', { lineEnding: 'lf', includeBom: true })).toBe('\uFEFFhello\nworld');
  });

  test('does not duplicate an existing BOM when BOM output is requested', () => {
    expect(applyExportTextEncoding('\uFEFFhello\nworld', { lineEnding: 'lf', includeBom: true })).toBe(
      '\uFEFFhello\nworld'
    );
  });
});
