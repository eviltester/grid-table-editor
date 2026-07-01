import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { DOMAIN_KEYWORDS } from '../packages/core/js/domain/domain-keywords.js';

const require = createRequire(import.meta.url);

function findMatching(source, openIndex, openChar, closeChar) {
  let depth = 0;
  for (let index = openIndex; index < source.length; index += 1) {
    if (source[index] === openChar) {
      depth += 1;
    }
    if (source[index] === closeChar) {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }
  return -1;
}

function getTopLevelObjectKeys(objectBody) {
  const keys = [];
  let depth = 0;
  let tokenStart = 0;
  const normalizedBody = objectBody.replace(/\/\*[\s\S]*?\*\//g, ' ');

  for (let index = 0; index <= normalizedBody.length; index += 1) {
    const character = normalizedBody[index] || ';';
    if (character === '{' || character === '(' || character === '[' || character === '<') {
      depth += 1;
    }
    if (character === '}' || character === ')' || character === ']' || character === '>') {
      depth = Math.max(0, depth - 1);
    }
    if ((character === ';' || character === ',') && depth === 0) {
      const segment = normalizedBody.slice(tokenStart, index).trim();
      const match = segment.match(/^([A-Za-z_$][\w$]*)\??\s*:/);
      if (match) {
        keys.push(match[1]);
      }
      tokenStart = index + 1;
    }
  }

  return [...new Set(keys)];
}

function getObjectOptionKeys(optionsSignature) {
  const keys = [];
  for (let index = 0; index < optionsSignature.length; index += 1) {
    if (optionsSignature[index] !== '{') {
      continue;
    }
    const objectEnd = findMatching(optionsSignature, index, '{', '}');
    if (objectEnd < 0) {
      continue;
    }
    keys.push(...getTopLevelObjectKeys(optionsSignature.slice(index + 1, objectEnd)));
    index = objectEnd;
  }
  return [...new Set(keys)];
}

function getFakerDeclarationPath() {
  const packageJsonPath = require.resolve('@faker-js/faker/package.json');
  const distDir = path.join(path.dirname(packageJsonPath), 'dist');

  for (const fileName of fs.readdirSync(distDir)) {
    if (!fileName.endsWith('.d.ts') || fileName === 'index.d.ts') {
      continue;
    }
    const filePath = path.join(distDir, fileName);
    const contents = fs.readFileSync(filePath, 'utf8');
    if (contents.includes('declare class NumberModule')) {
      return filePath;
    }
  }

  throw new Error('Unable to find Faker declaration bundle with module method signatures.');
}

function extractFakerOptionMethods(declarationText) {
  const modules = new Map();
  const classRegex = /declare class (\w+)Module\b/g;
  let classMatch = classRegex.exec(declarationText);

  while (classMatch) {
    const className = classMatch[1];
    const classOpen = declarationText.indexOf('{', classMatch.index);
    if (classOpen < 0) {
      classRegex.lastIndex = classMatch.index + classMatch[0].length;
      classMatch = classRegex.exec(declarationText);
      continue;
    }
    const classClose = findMatching(declarationText, classOpen, '{', '}');
    if (classClose < 0) {
      classRegex.lastIndex = classMatch.index + classMatch[0].length;
      classMatch = classRegex.exec(declarationText);
      continue;
    }

    const body = declarationText.slice(classOpen + 1, classClose);
    const methods = new Map();
    const methodStartRegex = /^\s*(\w+)\s*(?:<[^\n;]+>)?\s*\(/gm;
    let methodMatch = methodStartRegex.exec(body);

    while (methodMatch) {
      const methodName = methodMatch[1];
      const paramsOpen = body.indexOf('(', methodMatch.index);
      const paramsClose = findMatching(body, paramsOpen, '(', ')');
      if (paramsClose < 0) {
        methodMatch = methodStartRegex.exec(body);
        continue;
      }

      const paramsText = body
        .slice(paramsOpen + 1, paramsClose)
        .replace(/\s+/g, ' ')
        .trim();
      const optionsIndex = paramsText.indexOf('options?:');
      if (optionsIndex < 0) {
        methodMatch = methodStartRegex.exec(body);
        continue;
      }

      const optionsSignature = paramsText.slice(optionsIndex + 'options?:'.length).trim();
      methods.set(methodName, {
        signature: optionsSignature,
        optionParams: getObjectOptionKeys(optionsSignature),
      });
      methodMatch = methodStartRegex.exec(body);
    }

    const moduleName = className.charAt(0).toLowerCase() + className.slice(1);
    modules.set(moduleName, methods);
    classRegex.lastIndex = classClose + 1;
    classMatch = classRegex.exec(declarationText);
  }

  return modules;
}

function getFakerOptionParamComparison({ declarationPath = getFakerDeclarationPath() } = {}) {
  const declarationText = fs.readFileSync(declarationPath, 'utf8');
  const fakerMethods = extractFakerOptionMethods(declarationText);

  return DOMAIN_KEYWORDS.filter((keyword) => keyword.delegate?.type === 'faker')
    .map((keyword) => {
      const [moduleName, methodName] = String(keyword.delegate.target || '').split('.');
      const method = fakerMethods.get(moduleName)?.get(methodName);
      if (!method || method.optionParams.length === 0) {
        return null;
      }

      const domainParams = (keyword.help?.args || [])
        .map((arg) => String(arg?.name || '').trim())
        .filter((name) => name.length > 0);
      const domainParamSet = new Set(domainParams);
      const fakerParamSet = new Set(method.optionParams);

      return {
        keyword: keyword.keyword,
        fakerTarget: keyword.delegate.target,
        fakerOptionParams: method.optionParams,
        domainParams,
        missingInDomain: method.optionParams.filter((param) => !domainParamSet.has(param)),
        domainOnlyParams: domainParams.filter((param) => !fakerParamSet.has(param)),
        fakerOptionsSignature: method.signature,
      };
    })
    .filter(Boolean)
    .sort((left, right) => left.keyword.localeCompare(right.keyword));
}

function formatList(values) {
  return values.length > 0 ? values.map((value) => `\`${value}\``).join(', ') : 'none';
}

function formatMarkdownComparisonReport(rows = getFakerOptionParamComparison()) {
  const missingRows = rows.filter((row) => row.missingInDomain.length > 0);
  const domainOnlyRows = rows.filter((row) => row.domainOnlyParams.length > 0);

  const lines = [
    '# Domain/Faker Param Comparison',
    '',
    'Generated by `node scripts/compare-domain-faker-params.mjs --markdown` from the installed `@faker-js/faker` declaration bundle and the domain keyword catalog.',
    '',
    '## Summary',
    '',
    `- Faker option-backed domain commands compared: ${rows.length}`,
    `- Commands with Faker option params missing from domain metadata: ${missingRows.length}`,
    `- Commands with domain params not present in Faker options: ${domainOnlyRows.length}`,
    '',
    '## Comparison',
    '',
    '| Command | Faker option params | Domain params | Missing in domain | Domain-only params |',
    '| --- | --- | --- | --- | --- |',
  ];

  for (const row of rows) {
    lines.push(
      `| \`${row.keyword}\` | ${formatList(row.fakerOptionParams)} | ${formatList(row.domainParams)} | ${formatList(row.missingInDomain)} | ${formatList(row.domainOnlyParams)} |`
    );
  }

  lines.push('');
  lines.push('## Review Notes');
  lines.push('');
  lines.push('- `Missing in domain` must stay at `none` for every row.');
  lines.push('- `Domain-only params` must stay at `none` for every Faker-backed domain command.');
  lines.push('');

  return `${lines.join('\n')}\n`;
}

function runCli() {
  const args = process.argv.slice(2);
  const rows = getFakerOptionParamComparison();
  const missingRows = rows.filter((row) => row.missingInDomain.length > 0);

  if (args.includes('--markdown')) {
    process.stdout.write(formatMarkdownComparisonReport(rows));
  } else {
    process.stdout.write(`${JSON.stringify(rows, null, 2)}\n`);
  }

  if (args.includes('--check') && missingRows.length > 0) {
    process.exitCode = 1;
  }
}

const isCli = fileURLToPath(import.meta.url) === path.resolve(process.argv[1] || '');
if (isCli) {
  runCli();
}

export { formatMarkdownComparisonReport, getFakerOptionParamComparison };
