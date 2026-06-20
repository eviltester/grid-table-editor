import fs from 'node:fs';
import path from 'node:path';
import { DOMAIN_KEYWORD_ALIAS_INDEX } from '../packages/core/js/domain/domain-keywords.js';
import { toInlineCode } from '../packages/core/js/domain/domain-doc-markdown.js';

const configuredOutDir = process.env.ANYWAYDATA_DOMAIN_DOCS_OUT_DIR;
const outDir = configuredOutDir ? path.resolve(configuredOutDir) : path.resolve('docs-src/docs/040-test-data/domain');
fs.mkdirSync(outDir, { recursive: true });
for (const fileName of fs.readdirSync(outDir)) {
  if (fileName.endsWith('.md')) {
    fs.unlinkSync(path.join(outDir, fileName));
  }
}

const keywordEntries = Object.values(DOMAIN_KEYWORD_ALIAS_INDEX.byCanonical || {}).sort((left, right) =>
  String(left.keyword || '').localeCompare(String(right.keyword || ''))
);

const byDomain = new Map();
for (const keyword of keywordEntries) {
  const domain = String(keyword.keyword || '').split('.')[0];
  if (!byDomain.has(domain)) byDomain.set(domain, []);
  byDomain.get(domain).push({
    ...keyword,
    displayCommand: String(keyword.shortestUniqueAlias || keyword.keyword || '').trim(),
  });
}

const domains = [...byDomain.keys()].sort((a, b) => a.localeCompare(b));

const category = {
  label: 'Domain Test Data',
  position: 6,
  link: {
    type: 'doc',
    id: 'domain-test-data',
  },
  className: 'category-domain-test-data',
  collapsed: true,
};
fs.writeFileSync(path.join(outDir, '_category_.json'), JSON.stringify(category, null, 2));

const indexLines = [
  '---',
  'sidebar_position: 0',
  'id: domain-test-data',
  'slug: /test-data/domain/domain-test-data',
  'title: "Domain Test Data"',
  'description: "Domain keyword abstraction reference and examples."',
  '---',
  '',
  '# Domain Test Data',
  '',
  'Domain keywords provide a stable AnyWayData abstraction over Faker-backed generators.',
  '',
  'Note: `helpers.*` is intentionally faker-only and not part of the domain abstraction.',
  '',
  'Most common Faker usage is mapped to domain methods so schemas can use a curated, stable surface.',
  '',
  'Each domain page lists methods, arguments, and executable examples.',
  '',
  '## Quick Examples',
  '',
  '```txt',
  'FirstName',
  'person.firstName()',
  'LastName',
  'person.lastName()',
  'Email',
  'internet.email()',
  'Address',
  'location.streetAddress()',
  '```',
  '',
  '```txt',
  'Direction',
  'location.cardinalDirection(abbreviated=true)',
  '```',
  '',
  '```txt',
  'Date',
  'date.between(from=1577836800000, to=1659312000000)',
  '```',
  '',
  '```txt',
  'IBAN',
  'finance.iban(formatted=true, countryCode="GB")',
  'IBANDE',
  'finance.iban(formatted=false, countryCode="DE")',
  '```',
  '',
  '```txt',
  'Num',
  'number.int(min=32, max=47)',
  '```',
  '',
  '## Migration',
  '',
  '- Before (invalid): `domain.helpers.fake("...")`',
  '- After: `faker.helpers.fake("...")` (or `helpers.fake("...")` in faker contexts)',
  '',
  'For faker helper templates and utility functions, use faker helpers:',
  '- [Faker Helpers](/docs/test-data/faker/helpers)',
  '- [fakerjs.dev/api/helpers](https://fakerjs.dev/api/helpers)',
  '',
  '## Domains',
  '',
];
for (const d of domains) {
  indexLines.push(`- [${d}](/docs/test-data/domain/${d})`);
}
fs.writeFileSync(path.join(outDir, '000-domain-test-data.md'), indexLines.join('\n'));

const domainIntroOverrides = {
  autoIncrement: 'The `autoIncrement` domain provides stateful sequence helpers for accepted generated rows.',
  internet:
    'The `internet` domain mostly maps domain keywords to faker-backed generators, but `internet.httpMethod` is implemented directly by AnywayData.',
  literal: 'The `literal` domain returns caller-provided values directly and does not invoke faker.',
};

function escapeMdxText(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('{', '&#123;')
    .replaceAll('}', '&#125;');
}

function escapeMarkdownTableCell(value) {
  const normalized = String(value ?? '')
    .replaceAll('\r\n', '\n')
    .replaceAll('\r', '\n');
  return escapeMdxText(normalized.replaceAll('\n', '<br/>')).replaceAll('|', '\\|');
}

function getDefinitionUsageExamples(entry) {
  return (Array.isArray(entry?.help?.usageExamples) ? entry.help.usageExamples : [])
    .map((usageExample) => {
      const functionCall = String(usageExample?.functionCall || '').trim();
      if (!functionCall) {
        return null;
      }

      return {
        functionCall,
        description: String(usageExample?.description || '').trim(),
        hasSampleReturnValue: Object.prototype.hasOwnProperty.call(usageExample || {}, 'sampleReturnValue'),
        sampleReturnValue: usageExample?.sampleReturnValue,
      };
    })
    .filter(Boolean);
}

let pageIndex = 20;
for (const domain of domains) {
  const keywords = byDomain.get(domain).sort((a, b) =>
    String(a.displayCommand || a.keyword || '').localeCompare(String(b.displayCommand || b.keyword || ''))
  );
  const lines = [
    '---',
    `sidebar_position: ${pageIndex}`,
    `title: "${domain} Domain"`,
    `description: "Domain keyword reference for ${domain}."`,
    '---',
    '',
    `# ${domain} Domain`,
    '',
    domainIntroOverrides[domain] ||
      `The \`${domain}\` domain maps domain keywords to underlying faker implementations.`,
    '',
  ];

  const fakerDocsByDomain = [
    ...new Set(
      keywords
        .map((k) => String(k.help.fakerDocsUrl || '').trim())
        .filter((url) => url.length > 0 && url.includes('fakerjs.dev/api/'))
    ),
  ];
  if (fakerDocsByDomain.length > 0) {
    lines.push('## Faker Documentation', '');
    for (const url of fakerDocsByDomain) lines.push(`- [${url}](${url})`);
    lines.push('');
  }

  lines.push('## Methods', '');

  for (const entry of keywords) {
    const args = entry.help.args || [];
    const definitionUsageExamples = getDefinitionUsageExamples(entry);
    if (definitionUsageExamples.length === 0) {
      throw new Error(`Missing usageExamples for ${entry.keyword}. Domain docs are generated from curated examples.`);
    }

    const displayCommand = String(entry.displayCommand || entry.keyword || '').trim();
    lines.push(`### \`${displayCommand}\``, '');
    lines.push(escapeMdxText(entry.help.summary || 'No summary provided.'), '');
    lines.push(`- Canonical: \`${entry.canonical}\``);
    if (entry.help.fakerDocsUrl) {
      lines.push(`- Faker docs: [${entry.help.fakerDocsUrl}](${entry.help.fakerDocsUrl})`);
    }
    lines.push('');

    if (args.length > 0) {
      lines.push('| Arg | Type | Required | Description |');
      lines.push('| --- | --- | --- | --- |');
      for (const arg of args) {
        lines.push(
          `| \`${escapeMarkdownTableCell(arg.name)}\` | \`${escapeMarkdownTableCell(arg.type)}\` | ${arg.required ? 'yes' : 'no'} | ${escapeMarkdownTableCell(arg.description || 'No description provided.')} |`
        );
      }
      lines.push('');
    } else {
      lines.push('No parameters.', '');
    }

    lines.push('Examples:');
    for (const usageExample of definitionUsageExamples) {
      if (usageExample.description) {
        lines.push('', escapeMdxText(usageExample.description));
      }
      lines.push('', '```txt', usageExample.functionCall, '```');
      if (usageExample.hasSampleReturnValue) {
        lines.push('', `Returns: ${toInlineCode(usageExample.sampleReturnValue)}`);
      }
    }
    lines.push('');
  }

  const file = `${String(pageIndex).padStart(3, '0')}-${domain}.md`;
  fs.writeFileSync(path.join(outDir, file), lines.join('\n'));
  pageIndex += 10;
}
