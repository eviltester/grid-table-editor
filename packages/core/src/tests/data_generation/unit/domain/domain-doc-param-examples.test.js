import { DOMAIN_KEYWORDS } from '../../../../../js/domain/domain-keywords.js';
import { DomainKeywordInvocationParser } from '../../../../../js/domain/parser/DomainKeywordInvocationParser.js';

describe('domain docs parameter examples', () => {
  const invocationParser = new DomainKeywordInvocationParser();

  test('curated named usage examples parse cleanly and only reference documented arguments', () => {
    const invalid = [];

    for (const keyword of DOMAIN_KEYWORDS) {
      const usageExamples = Array.isArray(keyword.help?.usageExamples) ? keyword.help.usageExamples : [];
      if (usageExamples.length === 0) {
        continue;
      }

      const documentedArgNames = new Set((keyword.help?.args || []).map((arg) => arg.name).filter(Boolean));
      for (const usageExample of usageExamples) {
        const parsed = invocationParser.parse(String(usageExample?.functionCall || '').trim());
        if (!parsed.ok) {
          invalid.push(`${keyword.keyword}:parse`);
          continue;
        }

        parsed.arguments
          .filter((entry) => entry.kind === 'named')
          .map((entry) => entry.name)
          .forEach((name) => {
            if (!documentedArgNames.has(name)) {
              invalid.push(`${keyword.keyword}.${name}`);
            }
          });
      }
    }

    expect(invalid).toEqual([]);
  });
});
