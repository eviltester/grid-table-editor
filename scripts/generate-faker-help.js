/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const repoRoot = path.resolve(__dirname, '..');
const fakerDistDir = path.join(repoRoot, 'node_modules', '@faker-js', 'faker', 'dist');
const outputFile = path.join(repoRoot, 'packages', 'core', 'js', 'faker', 'faker-command-help-metadata.js');

function sanitizeDocLine(line) {
  return line
    .replace(/^\s*\*\s?/, '')
    .replace(/\{@link\s+([^}\s]+)(?:\s+([^}]+))?\}/g, (_, url, label) => label || url)
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .trim();
}

function extractSummary(jsDocBlock) {
  const lines = String(jsDocBlock || '')
    .split('\n')
    .map(sanitizeDocLine);
  for (const line of lines) {
    if (!line || line.startsWith('@')) {
      continue;
    }
    if (line.startsWith('faker.')) {
      continue;
    }
    if (line.startsWith('```')) {
      continue;
    }
    return line;
  }
  return '';
}

function parseTypeAliases(declarationText) {
  const aliases = new Map();
  const aliasPattern = /type\s+([A-Za-z_$][\w$]*)\s*=\s*([^;]+);/g;
  let match;
  while ((match = aliasPattern.exec(declarationText)) !== null) {
    aliases.set(match[1], match[2].trim());
  }
  return aliases;
}

function parseEnumLiteralValues(declarationText) {
  const enumValues = new Map();
  const enumPattern = /(?:const\s+)?enum\s+([A-Za-z_$][\w$]*)\s*\{([\s\S]*?)\}/g;
  let match;
  while ((match = enumPattern.exec(declarationText)) !== null) {
    const enumBody = match[2];
    const values = [];
    const valuePattern = /=\s*['"]([^'"]+)['"]/g;
    let valueMatch;
    while ((valueMatch = valuePattern.exec(enumBody)) !== null) {
      values.push(`'${valueMatch[1]}'`);
    }
    if (values.length > 0) {
      enumValues.set(match[1], values.join(' | '));
    }
  }
  return enumValues;
}

function resolveKnownAlias(typeText, aliases, enumValues, depth = 0) {
  if (depth > 4) {
    return null;
  }

  const plainTypeName = String(typeText || '').trim();
  if (!plainTypeName || !aliases.has(plainTypeName)) {
    return null;
  }

  const aliasBody = aliases.get(plainTypeName);
  if (!aliasBody) {
    return null;
  }

  const enumTemplateMatch = aliasBody.match(/^`?\$\{([A-Za-z_$][\w$]*)\}`?$/);
  if (enumTemplateMatch) {
    const enumName = enumTemplateMatch[1];
    return enumValues.get(enumName) || null;
  }

  if (aliasBody.includes('|')) {
    return aliasBody;
  }

  if (aliases.has(aliasBody.trim())) {
    return resolveKnownAlias(aliasBody.trim(), aliases, enumValues, depth + 1);
  }

  return null;
}

function simplifyType(typeText, aliases, enumValues) {
  const withoutInlineComments = String(typeText || '')
    .replace(/\/\*\*[\s\S]*?\*\//g, ' ')
    .replace(/\/\*[\s\S]*?\*\//g, ' ');
  const squashed = withoutInlineComments.replace(/\s+/g, ' ').trim();
  if (!squashed) {
    return 'unknown';
  }

  const resolvedAlias = resolveKnownAlias(squashed, aliases, enumValues);
  if (resolvedAlias) {
    return resolvedAlias;
  }

  if (squashed.startsWith('{') || squashed.startsWith('Record<')) {
    return 'object';
  }
  if (squashed.length > 80) {
    return `${squashed.slice(0, 77)}...`;
  }
  return squashed;
}

function splitTopLevel(text, separatorChar) {
  const segments = [];
  let current = '';
  let depthParen = 0;
  let depthBrace = 0;
  let depthBracket = 0;
  let depthAngle = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;

  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    const prev = index > 0 ? text[index - 1] : '';

    if (!inDouble && !inTemplate && char === "'" && prev !== '\\') {
      inSingle = !inSingle;
    } else if (!inSingle && !inTemplate && char === '"' && prev !== '\\') {
      inDouble = !inDouble;
    } else if (!inSingle && !inDouble && char === '`' && prev !== '\\') {
      inTemplate = !inTemplate;
    }

    if (!inSingle && !inDouble && !inTemplate) {
      if (char === '(') depthParen++;
      if (char === ')') depthParen--;
      if (char === '{') depthBrace++;
      if (char === '}') depthBrace--;
      if (char === '[') depthBracket++;
      if (char === ']') depthBracket--;
      if (char === '<') depthAngle++;
      if (char === '>') depthAngle = Math.max(0, depthAngle - 1);

      if (char === separatorChar && depthParen === 0 && depthBrace === 0 && depthBracket === 0 && depthAngle === 0) {
        const trimmed = current.trim();
        if (trimmed) {
          segments.push(trimmed);
        }
        current = '';
        continue;
      }
    }

    current += char;
  }

  const tail = current.trim();
  if (tail) {
    segments.push(tail);
  }
  return segments;
}

function extractParams(parameterText, aliases, enumValues) {
  if (!parameterText || parameterText.trim().length === 0) {
    return [];
  }

  const params = [];
  for (const segment of splitTopLevel(parameterText, ',')) {
    const cleaned = segment
      .replace(/\s*=\s*.+$/, '')
      .replace(/^\.{3}/, '')
      .trim();
    const match = cleaned.match(/^([A-Za-z_$][\w$]*)(\?)?\s*:\s*([\s\S]+)$/);
    if (!match) {
      continue;
    }

    params.push({
      name: match[1],
      optional: match[2] === '?',
      type: simplifyType(match[3], aliases, enumValues),
    });
  }

  return params;
}

function extractParamDocs(jsDocBlock) {
  const descriptionsByName = new Map();
  const lines = String(jsDocBlock || '')
    .split('\n')
    .map(sanitizeDocLine);

  for (const line of lines) {
    const paramMatch = line.match(/^@param\s+(?:\{[^}]+\}\s+)?(\[[^\]]+\]|[A-Za-z_$][\w$\.\-]*)(?:\s+-?\s*)?(.*)$/);
    if (!paramMatch) {
      continue;
    }

    const rawName = paramMatch[1];
    const nameWithoutBrackets = rawName.replace(/^\[/, '').replace(/\]$/, '');
    const nameWithoutDefault = nameWithoutBrackets.split('=')[0];
    const normalizedName = nameWithoutDefault.trim();
    if (!normalizedName) {
      continue;
    }

    const description = String(paramMatch[2] || '')
      .replace(/\s+/g, ' ')
      .trim();

    if (description.length > 0 && !descriptionsByName.has(normalizedName)) {
      descriptionsByName.set(normalizedName, description);
    }
  }

  return descriptionsByName;
}

function findMatchingParenIndex(text, openParenIndex) {
  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;

  for (let index = openParenIndex; index < text.length; index++) {
    const char = text[index];
    const prev = index > 0 ? text[index - 1] : '';

    if (!inDouble && !inTemplate && char === "'" && prev !== '\\') {
      inSingle = !inSingle;
    } else if (!inSingle && !inTemplate && char === '"' && prev !== '\\') {
      inDouble = !inDouble;
    } else if (!inSingle && !inDouble && char === '`' && prev !== '\\') {
      inTemplate = !inTemplate;
    }

    if (inSingle || inDouble || inTemplate) {
      continue;
    }

    if (char === '(') {
      depth++;
    } else if (char === ')') {
      depth--;
      if (depth === 0) {
        return index;
      }
    }
  }

  return -1;
}

function findNearestJsDoc(text, fromIndex) {
  const before = text.slice(0, fromIndex);
  const jsDocEnd = before.lastIndexOf('*/');
  if (jsDocEnd === -1) {
    return '';
  }

  const jsDocStart = before.lastIndexOf('/**', jsDocEnd);
  if (jsDocStart === -1) {
    return '';
  }

  const between = before.slice(jsDocEnd + 2);
  if (/[^\s]/.test(between)) {
    return '';
  }

  return before.slice(jsDocStart + 3, jsDocEnd);
}

function extractMethodCandidates(methodName, declarationText, aliases, enumValues) {
  const candidates = [];
  const methodToken = `${methodName}(`;
  let searchIndex = 0;

  while (searchIndex < declarationText.length) {
    const methodIndex = declarationText.indexOf(methodToken, searchIndex);
    if (methodIndex === -1) {
      break;
    }

    const beforeChar = methodIndex > 0 ? declarationText[methodIndex - 1] : '';
    if (/[A-Za-z0-9_$]/.test(beforeChar)) {
      searchIndex = methodIndex + methodToken.length;
      continue;
    }

    const openParenIndex = methodIndex + methodName.length;
    const closeParenIndex = findMatchingParenIndex(declarationText, openParenIndex);
    if (closeParenIndex === -1) {
      searchIndex = methodIndex + methodToken.length;
      continue;
    }

    let indexAfterParen = closeParenIndex + 1;
    while (indexAfterParen < declarationText.length && /\s/.test(declarationText[indexAfterParen])) {
      indexAfterParen++;
    }
    if (declarationText[indexAfterParen] !== ':') {
      searchIndex = methodIndex + methodToken.length;
      continue;
    }

    const parameterText = declarationText.slice(openParenIndex + 1, closeParenIndex);
    const jsDoc = findNearestJsDoc(declarationText, methodIndex);
    candidates.push({
      jsDoc,
      summary: extractSummary(jsDoc),
      params: extractParams(parameterText, aliases, enumValues),
      paramDocs: extractParamDocs(jsDoc),
    });

    searchIndex = methodIndex + methodToken.length;
  }

  return candidates;
}

function scoreCandidate(command, candidate) {
  const [moduleName, methodName] = command.split('.');
  const jsDoc = String(candidate?.jsDoc || '');
  const summary = String(candidate?.summary || '').toLowerCase();

  let score = 0;
  if (jsDoc.includes(`faker.${moduleName}.${methodName}`)) score += 5;
  if (jsDoc.includes(`/api/${moduleName}.html#`)) score += 3;
  if (jsDoc.includes(`faker.${moduleName}.`)) score += 1;
  if (candidate.params.length > 0) score += 1;
  if (summary.length > 0) score += 1;
  if (summary.includes('proxy for localedefinition')) score -= 4;
  if (summary.includes('type that provides auto-suggestions')) score -= 2;
  return score;
}

function extractMethodHelp(command, declarationText, aliases, enumValues) {
  const parts = command.split('.');
  if (parts.length < 2) {
    return null;
  }

  const methodName = parts[1];
  const candidates = extractMethodCandidates(methodName, declarationText, aliases, enumValues);
  if (candidates.length === 0) {
    return null;
  }

  let best = null;
  let bestScore = Number.NEGATIVE_INFINITY;
  for (const candidate of candidates) {
    const score = scoreCandidate(command, candidate);
    if (score > bestScore) {
      bestScore = score;
      best = candidate;
    }
  }

  if (!best || bestScore <= 0) {
    return null;
  }

  return { summary: best.summary, params: best.params, paramDocs: best.paramDocs };
}

function toReadablePhrase(command) {
  const words = command.split('.').map((token) => token.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase());
  if (words.length === 0) {
    return 'faker command';
  }
  return words.join(' ');
}

function buildFallbackSummary(command) {
  return `Generates data using faker ${toReadablePhrase(command)}.`;
}

function getDocsUrl(command) {
  const moduleName = command.split('.')[0];
  return `https://fakerjs.dev/api/${moduleName}`;
}

function formatExampleValue(value) {
  if (value === null || value === undefined) {
    return '';
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    Object.prototype.hasOwnProperty.call(value, 'data') &&
    Object.prototype.hasOwnProperty.call(value, 'isError')
  ) {
    return formatExampleValue(value.data);
  }

  let rendered = '';
  if (typeof value === 'string') {
    rendered = value;
  } else if (typeof value === 'number' || typeof value === 'boolean') {
    rendered = String(value);
  } else {
    try {
      rendered = JSON.stringify(value);
    } catch (error) {
      rendered = String(value);
    }
  }

  const squashed = rendered.replace(/\s+/g, ' ').trim();
  if (!squashed) {
    return '';
  }
  if (squashed.length > 140) {
    return `${squashed.slice(0, 137)}...`;
  }
  return squashed;
}

function applyMetadataOverrides(command, metadata, helperOverrides = {}) {
  const commandOverrides = {
    'helpers.rangeToNumber': {
      example: '2',
    },
    'string.uuid': {
      summary: 'Returns a UUID (Universally Unique Identifier).',
      params: [
        {
          name: 'version',
          optional: true,
          type: '4 | 7',
          description:
            'The specific UUID version to use. If refDate is supplied and version is omitted, version 7 is used automatically.',
        },
        {
          name: 'refDate',
          optional: true,
          type: 'string | Date | number',
          description:
            'The timestamp to encode into the UUID. This is only valid for UUID v7. If refDate is supplied and version is omitted, version 7 is used automatically. Providing refDate with version 4 is invalid.',
        },
      ],
    },
  };

  const commandOverride = commandOverrides[command];
  const override = helperOverrides[command];
  if (!override && !commandOverride) {
    return metadata;
  }

  const combinedOverride = {
    ...(commandOverride || {}),
    ...(override || {}),
  };

  return {
    ...metadata,
    summary: combinedOverride.summary || metadata.summary,
    params: Array.isArray(combinedOverride.params) ? combinedOverride.params : metadata.params,
    example: combinedOverride.example || metadata.example,
    examples: Array.isArray(combinedOverride.examples) ? combinedOverride.examples : metadata.examples,
  };
}

function loadKnownCommandsFromSource() {
  const sourcePath = path.join(repoRoot, 'packages', 'core', 'js', 'faker', 'faker-commands.js');
  const sourceText = fs.readFileSync(sourcePath, 'utf8');
  const arrayMatch = sourceText.match(/const KNOWN_FAKER_COMMANDS = \[([\s\S]*?)\];/);
  if (!arrayMatch) {
    throw new Error('Unable to locate KNOWN_FAKER_COMMANDS in faker-commands.js');
  }

  const values = [];
  const valuePattern = /'([^']+)'/g;
  let match;
  while ((match = valuePattern.exec(arrayMatch[1])) !== null) {
    values.push(match[1]);
  }

  return values.filter((command) => command !== 'RegEx');
}

function formatForModuleExport(metadataByCommand) {
  const generatedOn = new Date().toISOString();
  return `// AUTO-GENERATED FILE. DO NOT EDIT BY HAND.
// Generated by scripts/generate-faker-help.js on ${generatedOn}

const FAKER_COMMAND_HELP_METADATA = ${JSON.stringify(metadataByCommand, null, 2)};

function getFakerCommandHelp(commandValue) {
  const command = String(commandValue || '').trim();
  return FAKER_COMMAND_HELP_METADATA[command];
}

export { FAKER_COMMAND_HELP_METADATA, getFakerCommandHelp };
`;
}

async function loadRuntimeDependencies() {
  const fakerModule = await import('@faker-js/faker');
  const faker = fakerModule.faker;
  const fakerCommandModule = await import(
    pathToFileURL(path.join(repoRoot, 'packages', 'core', 'js', 'data_generation', 'faker', 'fakerCommand.js'))
  );
  return { faker, FakerCommand: fakerCommandModule.FakerCommand };
}

async function loadHelperOverrides() {
  const helperDefinitionsModule = await import(
    pathToFileURL(path.join(repoRoot, 'packages', 'core', 'js', 'faker', 'faker-helper-keyword-definitions.js'))
  );
  return helperDefinitionsModule.FAKER_HELPER_KEYWORD_DEFINITIONS || {};
}

function tryGenerateExample(command, faker, FakerCommand) {
  try {
    const fakerCommand = new FakerCommand(command);
    fakerCommand.parse();
    fakerCommand.compile(faker);
    const validation = fakerCommand.validate(faker);
    if (validation?.isError) {
      return '';
    }
    return formatExampleValue(fakerCommand.execute(faker));
  } catch (error) {
    return '';
  }
}

async function run() {
  const commands = loadKnownCommandsFromSource();

  const declarationFiles = fs
    .readdirSync(fakerDistDir)
    .filter((fileName) => fileName.endsWith('.d.ts'))
    .map((fileName) => path.join(fakerDistDir, fileName));

  const declarationText = declarationFiles.map((filePath) => fs.readFileSync(filePath, 'utf8')).join('\n');
  const aliases = parseTypeAliases(declarationText);
  const enumValues = parseEnumLiteralValues(declarationText);
  const { faker, FakerCommand } = await loadRuntimeDependencies();
  const helperOverrides = await loadHelperOverrides();

  const metadataByCommand = {};

  for (const command of commands) {
    const methodHelp = extractMethodHelp(command, declarationText, aliases, enumValues);
    const extractedSummary = methodHelp?.summary || '';
    const shouldUseExtractedSummary =
      extractedSummary.length > 0 &&
      !extractedSummary.toLowerCase().includes('proxy for localedefinition') &&
      !extractedSummary.toLowerCase().includes('type that provides auto-suggestions');
    metadataByCommand[command] = {
      ...applyMetadataOverrides(
        command,
        {
          summary: shouldUseExtractedSummary ? extractedSummary : buildFallbackSummary(command),
          params: (methodHelp?.params || []).map((param) => {
            const description = methodHelp?.paramDocs?.get(param.name) || '';
            return {
              ...param,
              description,
            };
          }),
          docsUrl: getDocsUrl(command),
          example: tryGenerateExample(command, faker, FakerCommand),
        },
        helperOverrides
      ),
    };
  }

  fs.writeFileSync(outputFile, formatForModuleExport(metadataByCommand), 'utf8');
  console.log(`Generated faker help metadata for ${commands.length} commands: ${outputFile}`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
