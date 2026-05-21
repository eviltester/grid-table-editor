import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOMAIN_KEYWORDS } from '../../../../../js/domain/domain-keywords.js';
import { DomainKeywordInvocationParser } from '../../../../../js/domain/parser/DomainKeywordInvocationParser.js';

function readDomainDocsTxtExamples() {
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

  const examples = [];
  const keywordsWithoutLiteralExamples = new Set();
  for (const fileName of files) {
    const body = fs.readFileSync(path.join(docsDir, fileName), 'utf8');
    const matches = [...body.matchAll(/```txt\s*\n([\s\S]*?)\n```/g)];
    for (const match of matches) {
      const invocation = match[1].trim();
      if (invocation) {
        examples.push(invocation);
      }
    }

    const sectionPattern =
      /### `([^`]+)`[\s\S]*?Literal-only parser example is not currently available for this method\./g;
    for (const match of body.matchAll(sectionPattern)) {
      keywordsWithoutLiteralExamples.add(match[1]);
    }
  }

  return { examples, keywordsWithoutLiteralExamples };
}

describe('domain docs parameter examples', () => {
  const invocationParser = new DomainKeywordInvocationParser();
  const docsExamples = readDomainDocsTxtExamples();

  test('every keyword with curated named examples demonstrates each argument at least once', () => {
    const usedByKeyword = new Map();

    for (const invocation of docsExamples.examples) {
      const parsed = invocationParser.parse(invocation);
      if (!parsed.ok) {
        continue;
      }

      const namedArgs = parsed.arguments.filter((entry) => entry.kind === 'named').map((entry) => entry.name);
      if (namedArgs.length === 0) {
        continue;
      }

      const existing = usedByKeyword.get(parsed.keyword) || new Set();
      for (const name of namedArgs) {
        existing.add(name);
      }
      usedByKeyword.set(parsed.keyword, existing);
    }

    const missing = [];
    for (const keyword of DOMAIN_KEYWORDS) {
      const curatedExamples = keyword.help?.examples || [];
      if (!Array.isArray(curatedExamples) || curatedExamples.length === 0) {
        continue;
      }

      const argNames = (keyword.help?.args || [])
        .map((arg) => arg.name)
        .filter((argName) => Boolean(argName) && argName !== 'value');
      if (argNames.length === 0) {
        continue;
      }
      if (docsExamples.keywordsWithoutLiteralExamples.has(keyword.keyword)) {
        continue;
      }
      const demonstrated = usedByKeyword.get(keyword.keyword) || new Set();
      for (const argName of argNames) {
        if (!demonstrated.has(argName)) {
          missing.push(`${keyword.keyword}.${argName}`);
        }
      }
    }

    expect(missing).toEqual([]);
  });
});
