import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../js/domain/domain-keyword-parser.js';

function readDomainDocExamples() {
  const testDir = path.dirname(fileURLToPath(import.meta.url));
  let rootDir = testDir;
  while (rootDir && !fs.existsSync(path.join(rootDir, 'docs-src'))) {
    const parent = path.dirname(rootDir);
    if (parent === rootDir) {
      break;
    }
    rootDir = parent;
  }
  const docsDir = path.resolve(rootDir, 'docs-src/docs/040-test-data/domain');
  const files = fs
    .readdirSync(docsDir)
    .filter((name) => name.endsWith('.md') && !name.endsWith('domain-test-data.md'))
    .sort((a, b) => a.localeCompare(b));

  const result = [];

  for (const fileName of files) {
    const fullPath = path.join(docsDir, fileName);
    const body = fs.readFileSync(fullPath, 'utf8');
    const matches = [...body.matchAll(/```txt\s*\n([\s\S]*?)\n```/g)];
    const invocations = matches.map((match) => match[1].trim()).filter((line) => line.length > 0);
    result.push({
      fileName,
      invocations,
    });
  }

  return result;
}

describe('domain docs examples', () => {
  const docs = readDomainDocExamples();

  test('has at least one domain docs page with examples', () => {
    expect(docs.length).toBeGreaterThan(0);
    expect(docs.some((entry) => entry.invocations.length > 0)).toBe(true);
  });

  test('does not include helpers domain docs page', () => {
    expect(docs.some((entry) => entry.fileName.toLowerCase().includes('helpers'))).toBe(false);
  });

  for (const doc of docs) {
    describe(doc.fileName, () => {
      test('contains at least one example', () => {
        expect(doc.invocations.length).toBeGreaterThan(0);
      });

      for (const invocation of doc.invocations) {
        test(`executes example: ${invocation}`, () => {
          const parsed = parseKeywordInvocation(invocation);
          expect(parsed.errors).toEqual([]);

          executeDomainKeyword(parsed.keyword, {
            faker,
            args: parsed.args,
            customDelegates: {
              'literal.value': (context) => context.args?.[0],
            },
          });
        });
      }
    });
  }
});
