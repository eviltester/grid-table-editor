import fs from 'node:fs';
import path from 'node:path';
import { DOMAIN_KEYWORDS } from '../packages/core/js/domain/domain-keywords.js';
import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../packages/core/js/domain/domain-keywords.js';

const outDir = path.resolve('docs-src/docs/040-test-data/domain');
fs.mkdirSync(outDir, { recursive: true });

const byDomain = new Map();
for (const keyword of DOMAIN_KEYWORDS) {
  const domain = keyword.keyword.split('.')[0];
  if (!byDomain.has(domain)) byDomain.set(domain, []);
  byDomain.get(domain).push(keyword);
}

const domains = [...byDomain.keys()].sort((a,b)=>a.localeCompare(b));

const category = {
  label: 'Domain Keywords',
  position: 6,
  link: {
    type: 'generated-index',
    description: 'Domain keyword abstraction pages with method arguments, examples, and links to Faker API docs.'
  },
  collapsed: true
};
fs.writeFileSync(path.join(outDir, '_category_.json'), JSON.stringify(category, null, 2));

const indexLines = [
  '---',
  'sidebar_position: 1',
  'title: "Domain Test Data"',
  'description: "Domain keyword abstraction reference and examples."',
  '---',
  '',
  '# Domain Test Data',
  '',
  'Domain keywords provide a stable AnyWayData abstraction over Faker-backed generators.',
  '',
  'Each domain page lists methods, arguments, and executable examples.',
  '',
  '## Domains',
  ''
];
for (const d of domains) {
  indexLines.push(`- [${d}](/docs/test-data/domain/${d})`);
}
fs.writeFileSync(path.join(outDir, '010-domain-test-data.md'), indexLines.join('\n'));

const valueForType = (typeName) => {
  const first = String(typeName || '').split('|').map(s=>s.trim()).find(Boolean) || 'string';
  if (first === 'number') return '1';
  if (first === 'boolean') return 'true';
  if (first === 'array') return '["sample"]';
  if (first === 'null') return 'null';
  return '"sample"';
};

const invocationOverrides = {
  'date.between': { invocation: 'date.between(0, 2000000000000)', args: [0, 2000000000000] },
  'date.betweens': { invocation: 'date.betweens(2, 0, 2000000000000)', args: [2, 0, 2000000000000] },
};
const nonDeterministicExamples = new Set(['helpers.maybe']);

function canExecuteInvocation(keyword, args) {
  try {
    executeDomainKeyword(keyword, {
      faker,
      args,
      customDelegates: {
        'literal.value': (context) => context.args?.[0],
      },
    });
    return true;
  } catch {
    return false;
  }
}

function getExampleReturnValues(keyword, args, count = 2) {
  const values = [];
  for (let index = 0; index < count; index += 1) {
    try {
      const value = executeDomainKeyword(keyword, {
        faker,
        args,
        customDelegates: {
          'literal.value': (context) => context.args?.[0],
        },
      });
      values.push(JSON.stringify(value));
    } catch {
      break;
    }
  }
  return values;
}

function toNamedInvocation(keyword, argSpecs, typedArgs) {
  if (!Array.isArray(argSpecs) || argSpecs.length === 0) {
    return '';
  }
  const pairs = [];
  for (let index = 0; index < argSpecs.length; index += 1) {
    const spec = argSpecs[index];
    const name = String(spec?.name || '').trim();
    if (!name) {
      return '';
    }
    const value = typedArgs[index];
    const rendered =
      typeof value === 'string'
        ? `"${value}"`
        : Array.isArray(value)
          ? JSON.stringify(value)
          : String(value);
    pairs.push(`${name}=${rendered}`);
  }
  return `${keyword}(${pairs.join(', ')})`;
}

function sampleValueForArg(argSpec) {
  const name = String(argSpec?.name || '').trim();
  const typeName = String(argSpec?.type || '').trim();
  if (name === 'aircraftType') return 'narrowbody';
  if (name === 'countryCode') return 'GB';
  if (name === 'cidrBlock') return '192.168.0.0/24';
  if (name === 'network') return 'private-a';
  if (name === 'format') return 'hex';
  if (name === 'casing') return 'lower';
  if (name === 'prefix') return '#';
  if (name === 'separator') return '-';
  if (name === 'variant') return 13;
  if (name === 'strategy') return 'any-length';
  if (name === 'version') return 'v4';
  if (name === 'mode') return 'age';
  if (name === 'mimeType') return 'image/png';
  if (name === 'extension') return 'txt';
  if (name === 'symbol') return '$';
  if (name === 'style') return 'human';
  if (name === 'context') return false;
  if (name === 'abbreviated') return false;

  const first = typeName.split('|').map((s) => s.trim()).find(Boolean) || 'string';
  if (first === 'number') return 1;
  if (first === 'boolean') return true;
  if (first === 'array') return ['sample'];
  if (first === 'null') return null;
  return 'sample';
}

let pageIndex = 20;
for (const domain of domains) {
  const keywords = byDomain.get(domain).sort((a,b)=>a.keyword.localeCompare(b.keyword));
  const lines = [
    '---',
    `sidebar_position: ${pageIndex}`,
    `title: "${domain} Domain"`,
    `description: "Domain keyword reference for ${domain}."`,
    '---',
    '',
    `# ${domain} Domain`,
    '',
    `The \`${domain}\` domain maps domain keywords to underlying faker implementations.`,
    ''
  ];

  const docsByDomain = [...new Set(keywords.map(k => k.help.docsUrl).filter(Boolean))];
  if (docsByDomain.length > 0) {
    lines.push('## Faker Documentation', '');
    for (const url of docsByDomain) lines.push(`- [${url}](${url})`);
    lines.push('');
  }

  lines.push('## Methods', '');

  for (const entry of keywords) {
    const args = entry.help.args || [];
    const invocationArgs = args.filter((a) => a.required).map((a) => valueForType(a.type));
    const override = invocationOverrides[entry.keyword];
    const invocation = override ? override.invocation : `${entry.keyword}(${invocationArgs.join(', ')})`;
    const typedRequiredArgs = args.filter((a) => a.required).map((a) => {
      const first = String(a.type || '').split('|').map((s) => s.trim()).find(Boolean) || 'string';
      if (first === 'number') return 1;
      if (first === 'boolean') return true;
      if (first === 'array') return ['sample'];
      if (first === 'null') return null;
      return 'sample';
    });
    const hasExecutableExample =
      !nonDeterministicExamples.has(entry.keyword) &&
      canExecuteInvocation(entry.keyword, override ? override.args : typedRequiredArgs);

    lines.push(`### \`${entry.keyword}\``, '');
    lines.push(entry.help.summary || 'No summary provided.', '');
    lines.push(`- Canonical: \`${entry.canonical}\``);
    if (entry.help.docsUrl) lines.push(`- Faker docs: [${entry.help.docsUrl}](${entry.help.docsUrl})`);
    lines.push('');

    if (args.length > 0) {
      lines.push('| Arg | Type | Required | Description |');
      lines.push('| --- | --- | --- | --- |');
      for (const arg of args) {
        lines.push(`| \`${arg.name}\` | \`${arg.type}\` | ${arg.required ? 'yes' : 'no'} | ${arg.description || 'No description provided.'} |`);
      }
      lines.push('');
    } else {
      lines.push('No parameters.', '');
    }

    if (hasExecutableExample) {
      let namedInvocation = '';
      if (args.length > 0) {
        const requiredArgSpecs = args.filter((a) => a.required);
        if (requiredArgSpecs.length > 0) {
          namedInvocation = toNamedInvocation(
            entry.keyword,
            requiredArgSpecs,
            override ? override.args : typedRequiredArgs
          );
        } else {
          const sampledArgs = args.map((arg) => sampleValueForArg(arg));
          let chosenArgs = [];
          let chosenSpecs = [];
          for (let length = 1; length <= sampledArgs.length; length += 1) {
            const trialArgs = sampledArgs.slice(0, length);
            if (canExecuteInvocation(entry.keyword, trialArgs)) {
              chosenArgs = trialArgs;
              chosenSpecs = args.slice(0, length);
              break;
            }
          }
          if (chosenArgs.length > 0) {
            namedInvocation = toNamedInvocation(entry.keyword, chosenSpecs, chosenArgs);
          }
        }
      }
      lines.push('Examples:', '', '```txt', invocation, '```');
      if (namedInvocation) {
        lines.push('', '```txt', namedInvocation, '```');
      }
      const returnValues = getExampleReturnValues(entry.keyword, override ? override.args : typedRequiredArgs);
      if (returnValues.length > 0) {
        lines.push('', 'Example return values:');
        for (const value of returnValues) {
          lines.push(`- \`${value}\``);
        }
      }
      lines.push('');
    } else {
      lines.push(
        'Example:',
        '',
        'Literal-only parser example is not currently available for this method.',
        '',
        'Example return values:',
        '- `Not available for this method with literal-only args.`',
        ''
      );
    }
  }

  const file = `${String(pageIndex).padStart(3,'0')}-${domain}.md`;
  fs.writeFileSync(path.join(outDir, file), lines.join('\n'));
  pageIndex += 10;
}
