import { toInlineCode } from '../../../../../js/domain/domain-doc-markdown.js';

describe('domain docs inline return value formatting', () => {
  test('escapes return values containing backticks with a longer code fence', () => {
    expect(toInlineCode('value with `tick` and ``double``')).toBe('```value with `tick` and ``double`````');
  });

  test('escapes newline and CRLF characters in inline code values', () => {
    expect(toInlineCode('line1\nline2')).toBe('`line1\\nline2`');
    expect(toInlineCode('line1\r\nline2\rline3')).toBe('`line1\\nline2\\nline3`');
  });

  test('handles mixed backticks and newlines safely', () => {
    expect(toInlineCode('start`\nmid``\r\nend')).toBe('```start`\\nmid``\\nend```');
  });
});
