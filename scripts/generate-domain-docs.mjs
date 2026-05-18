import fs from 'node:fs';
import path from 'node:path';
import { DOMAIN_KEYWORDS } from '../packages/core/js/domain/domain-keywords.js';
import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../packages/core/js/domain/domain-keywords.js';

const outDir = path.resolve('docs-src/docs/040-test-data/domain');
fs.mkdirSync(outDir, { recursive: true });
for (const fileName of fs.readdirSync(outDir)) {
  if (fileName.endsWith('.md') && fileName !== '010-domain-test-data.md') {
    fs.unlinkSync(path.join(outDir, fileName));
  }
}

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
  'Note: `helpers.*` is intentionally faker-only and not part of the domain abstraction.',
  '',
  'Each domain page lists methods, arguments, and executable examples.',
  '',
  '## Migration',
  '',
  '- Before (invalid): `domain.helpers.fake("...")`',
  '- After: `faker.helpers.fake("...")` (or `helpers.fake("...")` in faker contexts)',
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

function renderInvocation(keyword, typedArgs) {
  if (!Array.isArray(typedArgs) || typedArgs.length === 0) {
    return `${keyword}()`;
  }
  const renderedArgs = typedArgs.map((value) => {
    if (typeof value === 'string') {
      return `"${value}"`;
    }
    if (Array.isArray(value)) {
      return JSON.stringify(value);
    }
    return String(value);
  });
  return `${keyword}(${renderedArgs.join(', ')})`;
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
  if (name === 'variant') return '13';
  if (name === 'strategy') return 'any-length';
  if (name === 'version') return 'v4';
  if (name === 'mode') return 'age';
  if (name === 'mimeType') return 'image/png';
  if (name === 'extension') return 'txt';
  if (name === 'symbol') return '$';
  if (name === 'types') return ['food', 'nature'];
  if (name === 'list') return ['alpha', 'beta', 'gamma'];
  if (name === 'style') return 'human';
  if (name === 'context') return false;
  if (name === 'abbreviated') return false;

  const first = typeName.split('|').map((s) => s.trim()).find(Boolean) || 'string';
  if (first === 'number') return 1;
  if (first === 'boolean') return true;
  if (first === 'array') return ['sample'];
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
    const override = invocationOverrides[entry.keyword];
    const requiredArgSpecs = args.filter((a) => a.required);
    const typedRequiredArgs = requiredArgSpecs.map((a) => {
      const first = String(a.type || '').split('|').map((s) => s.trim()).find(Boolean) || 'string';
      if (first === 'number') return 1;
      if (first === 'boolean') return true;
      if (first === 'array') return ['sample'];
      return 'sample';
    });
    const sampledArgs = args.map((arg) => sampleValueForArg(arg));
    let executableExampleArgs = override ? override.args : typedRequiredArgs;
    if (!canExecuteInvocation(entry.keyword, executableExampleArgs)) {
      if (canExecuteInvocation(entry.keyword, sampledArgs)) {
        executableExampleArgs = sampledArgs;
      } else {
        for (let length = 1; length <= sampledArgs.length; length += 1) {
          const trialArgs = sampledArgs.slice(0, length);
          if (canExecuteInvocation(entry.keyword, trialArgs)) {
            executableExampleArgs = trialArgs;
            break;
          }
        }
      }
    }

    const hasExecutableExample =
      !nonDeterministicExamples.has(entry.keyword) &&
      canExecuteInvocation(entry.keyword, executableExampleArgs);

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
      const allArgsValues = sampledArgs;
      if (args.length > 0 && canExecuteInvocation(entry.keyword, allArgsValues)) {
        namedInvocation = toNamedInvocation(entry.keyword, args, allArgsValues);
      } else if (requiredArgSpecs.length > 0) {
        namedInvocation = toNamedInvocation(entry.keyword, requiredArgSpecs, override ? override.args : typedRequiredArgs);
      }
      const invocation = override ? override.invocation : renderInvocation(entry.keyword, executableExampleArgs);
      lines.push('Examples:', '', '```txt', invocation, '```');
      if (namedInvocation) {
        lines.push('', '```txt', namedInvocation, '```');
      }
      if (args.length > 0) {
        const typeInExamples = [];
        const seenExamples = new Set([invocation, namedInvocation].filter(Boolean));
        for (let index = 0; index < args.length; index += 1) {
          const arg = args[index];
          const value = sampleValueForArg(arg);
          const typedArgs = args.map((entryArg, argIndex) => (argIndex === index ? value : sampleValueForArg(entryArg)));
          const fullNamed = toNamedInvocation(entry.keyword, args, typedArgs);
          if (fullNamed && canExecuteInvocation(entry.keyword, typedArgs)) {
            if (!seenExamples.has(fullNamed)) {
              typeInExamples.push(fullNamed);
              seenExamples.add(fullNamed);
            }
            continue;
          }

          const singleNamed = toNamedInvocation(entry.keyword, [arg], [value]);
          if (singleNamed && canExecuteInvocation(entry.keyword, [value])) {
            if (!seenExamples.has(singleNamed)) {
              typeInExamples.push(singleNamed);
              seenExamples.add(singleNamed);
            }
            continue;
          }

          const positional = renderInvocation(entry.keyword, [value]);
          if (canExecuteInvocation(entry.keyword, [value])) {
            if (!seenExamples.has(positional)) {
              typeInExamples.push(positional);
              seenExamples.add(positional);
            }
          }
        }
        if (typeInExamples.length > 0) {
          lines.push('', 'Type-in examples (named params):');
          for (const example of typeInExamples) {
            lines.push('', '```txt', example, '```');
          }
        }
      }
      const returnValues = getExampleReturnValues(entry.keyword, executableExampleArgs);
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
