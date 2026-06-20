import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { DOMAIN_KEYWORD_DEFINITIONS } from '../../../../js/domain/domain-keyword-definitions.js';
import { FAKER_HELPER_KEYWORD_DEFINITIONS } from '../../../../js/faker/faker-helper-keyword-definitions.js';

const repoRoot = path.resolve(process.cwd());
const domainKeywordRoot = path.join(repoRoot, 'packages/core/js/keywords/domain');
const fakerHelperKeywordRoot = path.join(repoRoot, 'packages/core/js/keywords/faker/helpers');

function collectDefinitionModuleFiles(rootDir) {
  const modulePaths = [];

  function visit(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
        continue;
      }
      if (entry.isFile() && entry.name.endsWith('-keyword-definition.js')) {
        modulePaths.push(fullPath);
      }
    }
  }

  visit(rootDir);
  return modulePaths.sort((left, right) => left.localeCompare(right));
}

async function importKeywordDefinitionExports(modulePaths) {
  const definitions = [];

  for (const modulePath of modulePaths) {
    const moduleNamespace = await import(pathToFileURL(modulePath).href);
    for (const [exportName, value] of Object.entries(moduleNamespace)) {
      if (exportName.endsWith('_KEYWORD_DEFINITION') && value && typeof value === 'object') {
        definitions.push(value);
      }
    }
  }

  return definitions;
}

describe('keyword definition registries', () => {
  test('domain registry assembles the same keyword set as the per-keyword modules', async () => {
    const modulePaths = collectDefinitionModuleFiles(domainKeywordRoot);
    const moduleDefinitions = await importKeywordDefinitionExports(modulePaths);

    expect(moduleDefinitions.map((definition) => definition.keyword).sort()).toEqual(
      DOMAIN_KEYWORD_DEFINITIONS.map((definition) => definition.keyword).sort()
    );
  });

  test('faker helper registry assembles the same command set as the per-keyword modules', async () => {
    const modulePaths = collectDefinitionModuleFiles(fakerHelperKeywordRoot);
    const moduleDefinitions = await importKeywordDefinitionExports(modulePaths);

    const helperCommandsFromModules = moduleDefinitions
      .map((definition) => definition.usageExamples?.[0]?.functionCall || '')
      .map((functionCall) =>
        String(functionCall || '')
          .split('(')[0]
          .trim()
      )
      .sort();

    expect(helperCommandsFromModules).toEqual(Object.keys(FAKER_HELPER_KEYWORD_DEFINITIONS).sort());
  });
});
