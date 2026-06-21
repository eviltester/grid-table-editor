import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const repoRoot = path.resolve(process.cwd());
const domainDefinitionsDir = path.join(repoRoot, 'packages/core/js/keywords/domain');
const fakerDefinitionsDir = path.join(repoRoot, 'packages/core/js/keywords/faker/helpers');

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

function collectExportedDefinitionValues(moduleNamespace) {
  return Object.entries(moduleNamespace)
    .filter(([, value]) => value && typeof value === 'object' && !Array.isArray(value))
    .filter(([exportName]) => exportName.endsWith('_KEYWORD_DEFINITION'));
}

function findMissingUsageExamplesInDomainDefinition(definition = {}, exportName, modulePath) {
  const help = definition?.help;
  const hasUsageExamplesProperty = Object.prototype.hasOwnProperty.call(help || {}, 'usageExamples');
  const usageExamples = Array.isArray(help?.usageExamples) ? help.usageExamples : [];
  if (hasUsageExamplesProperty && usageExamples.length > 0) {
    return [];
  }

  return [
    {
      modulePath,
      exportName,
      keyword: definition?.keyword || '(unknown keyword)',
      hasUsageExamplesProperty,
      usageExampleCount: usageExamples.length,
    },
  ];
}

function findMissingUsageExamplesInFakerHelperDefinition(definition = {}, exportName, modulePath) {
  const command =
    String(definition?.usageExamples?.[0]?.functionCall || '')
      .split('(')[0]
      .trim() || exportName;
  const hasUsageExamplesProperty = Object.prototype.hasOwnProperty.call(definition || {}, 'usageExamples');
  const usageExamples = Array.isArray(definition?.usageExamples) ? definition.usageExamples : [];
  if (hasUsageExamplesProperty && usageExamples.length > 0) {
    return [];
  }

  return [
    {
      modulePath,
      exportName,
      command,
      hasUsageExamplesProperty,
      usageExampleCount: usageExamples.length,
    },
  ];
}

function findLegacyExampleFieldsInDomainDefinition(definition = {}, exportName, modulePath) {
  const help = definition?.help || {};
  const legacyFields = ['example', 'examples', 'exampleReturnValues'].filter((fieldName) =>
    Object.prototype.hasOwnProperty.call(help, fieldName)
  );
  if (legacyFields.length === 0) {
    return [];
  }

  return [
    {
      modulePath,
      exportName,
      keyword: definition?.keyword || '(unknown keyword)',
      legacyFields,
    },
  ];
}

function findLegacyExampleFieldsInFakerHelperDefinition(definition = {}, exportName, modulePath) {
  const legacyFields = ['example', 'examples', 'exampleReturnValues'].filter((fieldName) =>
    Object.prototype.hasOwnProperty.call(definition || {}, fieldName)
  );
  if (legacyFields.length === 0) {
    return [];
  }

  return [
    {
      modulePath,
      exportName,
      command:
        String(definition?.usageExamples?.[0]?.functionCall || '')
          .split('(')[0]
          .trim() || exportName,
      legacyFields,
    },
  ];
}

function findMissingValidatorsInDomainDefinition(definition = {}, exportName, modulePath) {
  const help = definition?.help || {};
  const hasValidatorProperty = Object.prototype.hasOwnProperty.call(help, 'validator');
  if (hasValidatorProperty && typeof help.validator === 'function') {
    return [];
  }

  return [
    {
      modulePath,
      exportName,
      keyword: definition?.keyword || '(unknown keyword)',
      hasValidatorProperty,
      validatorType: typeof help.validator,
    },
  ];
}

function findMissingValidatorsInFakerHelperDefinition(definition = {}, exportName, modulePath) {
  const hasValidatorProperty = Object.prototype.hasOwnProperty.call(definition || {}, 'validator');
  if (hasValidatorProperty && typeof definition?.validator === 'function') {
    return [];
  }

  return [
    {
      modulePath,
      exportName,
      command:
        String(definition?.usageExamples?.[0]?.functionCall || '')
          .split('(')[0]
          .trim() || exportName,
      hasValidatorProperty,
      validatorType: typeof definition?.validator,
    },
  ];
}

describe('keyword definition usage examples contract', () => {
  test('all domain definition modules export definitions with explicit help.usageExamples', async () => {
    const missingUsageExamples = [];

    for (const modulePath of collectDefinitionModuleFiles(domainDefinitionsDir)) {
      const moduleNamespace = await import(pathToFileURL(modulePath).href);
      for (const [exportName, definition] of collectExportedDefinitionValues(moduleNamespace)) {
        missingUsageExamples.push(...findMissingUsageExamplesInDomainDefinition(definition, exportName, modulePath));
      }
    }

    expect(missingUsageExamples).toEqual([]);
  });

  test('faker helper definition modules export definitions with explicit usageExamples', async () => {
    const missingUsageExamples = [];

    for (const modulePath of collectDefinitionModuleFiles(fakerDefinitionsDir)) {
      const moduleNamespace = await import(pathToFileURL(modulePath).href);
      for (const [exportName, definition] of collectExportedDefinitionValues(moduleNamespace)) {
        missingUsageExamples.push(
          ...findMissingUsageExamplesInFakerHelperDefinition(definition, exportName, modulePath)
        );
      }
    }

    expect(missingUsageExamples).toEqual([]);
  });

  test('keyword definition exports do not expose legacy example fields', async () => {
    const legacyFieldFailures = [];

    for (const modulePath of collectDefinitionModuleFiles(domainDefinitionsDir)) {
      const moduleNamespace = await import(pathToFileURL(modulePath).href);
      for (const [exportName, definition] of collectExportedDefinitionValues(moduleNamespace)) {
        legacyFieldFailures.push(...findLegacyExampleFieldsInDomainDefinition(definition, exportName, modulePath));
      }
    }

    for (const modulePath of collectDefinitionModuleFiles(fakerDefinitionsDir)) {
      const fakerModuleNamespace = await import(pathToFileURL(modulePath).href);
      for (const [exportName, definition] of collectExportedDefinitionValues(fakerModuleNamespace)) {
        legacyFieldFailures.push(...findLegacyExampleFieldsInFakerHelperDefinition(definition, exportName, modulePath));
      }
    }

    expect(legacyFieldFailures).toEqual([]);
  });

  test('keyword definition exports expose explicit validator functions', async () => {
    const missingValidators = [];

    for (const modulePath of collectDefinitionModuleFiles(domainDefinitionsDir)) {
      const moduleNamespace = await import(pathToFileURL(modulePath).href);
      for (const [exportName, definition] of collectExportedDefinitionValues(moduleNamespace)) {
        missingValidators.push(...findMissingValidatorsInDomainDefinition(definition, exportName, modulePath));
      }
    }

    for (const modulePath of collectDefinitionModuleFiles(fakerDefinitionsDir)) {
      const fakerModuleNamespace = await import(pathToFileURL(modulePath).href);
      for (const [exportName, definition] of collectExportedDefinitionValues(fakerModuleNamespace)) {
        missingValidators.push(...findMissingValidatorsInFakerHelperDefinition(definition, exportName, modulePath));
      }
    }

    expect(missingValidators).toEqual([]);
  });
});
