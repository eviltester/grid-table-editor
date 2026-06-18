import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const repoRoot = path.resolve(process.cwd());
const domainDefinitionsDir = path.join(repoRoot, 'packages/core/js/domain');
const fakerDefinitionsFile = path.join(repoRoot, 'packages/core/js/faker/faker-helper-keyword-definitions.js');

function collectDomainDefinitionFiles() {
  return fs
    .readdirSync(domainDefinitionsDir)
    .filter((fileName) => fileName.endsWith('definitions.js'))
    .map((fileName) => path.join(domainDefinitionsDir, fileName));
}

function collectExportedDefinitionValues(moduleNamespace) {
  return Object.entries(moduleNamespace)
    .filter(([, value]) => Array.isArray(value) || (value && typeof value === 'object'))
    .filter(([exportName]) => exportName.endsWith('_DEFINITIONS'));
}

function findMissingUsageExamplesInDomainDefinitions(definitions = [], exportName, modulePath) {
  return definitions.flatMap((definition, index) => {
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
        keyword: definition?.keyword || `(index ${index})`,
        hasUsageExamplesProperty,
        usageExampleCount: usageExamples.length,
      },
    ];
  });
}

function findMissingUsageExamplesInFakerHelperDefinitions(definitions = {}, exportName, modulePath) {
  return Object.entries(definitions).flatMap(([command, definition]) => {
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
  });
}

function findLegacyExampleFieldsInDomainDefinitions(definitions = [], exportName, modulePath) {
  return definitions.flatMap((definition, index) => {
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
        keyword: definition?.keyword || `(index ${index})`,
        legacyFields,
      },
    ];
  });
}

function findLegacyExampleFieldsInFakerHelperDefinitions(definitions = {}, exportName, modulePath) {
  return Object.entries(definitions).flatMap(([command, definition]) => {
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
        command,
        legacyFields,
      },
    ];
  });
}

function findMissingValidatorsInDomainDefinitions(definitions = [], exportName, modulePath) {
  return definitions.flatMap((definition, index) => {
    const help = definition?.help || {};
    const hasValidatorProperty = Object.prototype.hasOwnProperty.call(help, 'validator');
    if (hasValidatorProperty && typeof help.validator === 'function') {
      return [];
    }

    return [
      {
        modulePath,
        exportName,
        keyword: definition?.keyword || `(index ${index})`,
        hasValidatorProperty,
        validatorType: typeof help.validator,
      },
    ];
  });
}

function findMissingValidatorsInFakerHelperDefinitions(definitions = {}, exportName, modulePath) {
  return Object.entries(definitions).flatMap(([command, definition]) => {
    const hasValidatorProperty = Object.prototype.hasOwnProperty.call(definition || {}, 'validator');
    if (hasValidatorProperty && typeof definition?.validator === 'function') {
      return [];
    }

    return [
      {
        modulePath,
        exportName,
        command,
        hasValidatorProperty,
        validatorType: typeof definition?.validator,
      },
    ];
  });
}

describe('keyword definition usage examples contract', () => {
  test('all domain definition modules export definitions with explicit help.usageExamples', async () => {
    const missingUsageExamples = [];

    for (const modulePath of collectDomainDefinitionFiles()) {
      const moduleNamespace = await import(pathToFileURL(modulePath).href);
      for (const [exportName, value] of collectExportedDefinitionValues(moduleNamespace)) {
        if (!Array.isArray(value)) {
          continue;
        }
        missingUsageExamples.push(...findMissingUsageExamplesInDomainDefinitions(value, exportName, modulePath));
      }
    }

    expect(missingUsageExamples).toEqual([]);
  });

  test('faker helper definition modules export definitions with explicit usageExamples', async () => {
    const moduleNamespace = await import(pathToFileURL(fakerDefinitionsFile).href);
    const missingUsageExamples = [];

    for (const [exportName, value] of collectExportedDefinitionValues(moduleNamespace)) {
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        continue;
      }
      missingUsageExamples.push(
        ...findMissingUsageExamplesInFakerHelperDefinitions(value, exportName, fakerDefinitionsFile)
      );
    }

    expect(missingUsageExamples).toEqual([]);
  });

  test('keyword definition exports do not expose legacy example fields', async () => {
    const legacyFieldFailures = [];

    for (const modulePath of collectDomainDefinitionFiles()) {
      const moduleNamespace = await import(pathToFileURL(modulePath).href);
      for (const [exportName, value] of collectExportedDefinitionValues(moduleNamespace)) {
        if (!Array.isArray(value)) {
          continue;
        }
        legacyFieldFailures.push(...findLegacyExampleFieldsInDomainDefinitions(value, exportName, modulePath));
      }
    }

    const fakerModuleNamespace = await import(pathToFileURL(fakerDefinitionsFile).href);
    for (const [exportName, value] of collectExportedDefinitionValues(fakerModuleNamespace)) {
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        continue;
      }
      legacyFieldFailures.push(
        ...findLegacyExampleFieldsInFakerHelperDefinitions(value, exportName, fakerDefinitionsFile)
      );
    }

    expect(legacyFieldFailures).toEqual([]);
  });

  test('keyword definition exports expose explicit validator functions', async () => {
    const missingValidators = [];

    for (const modulePath of collectDomainDefinitionFiles()) {
      const moduleNamespace = await import(pathToFileURL(modulePath).href);
      for (const [exportName, value] of collectExportedDefinitionValues(moduleNamespace)) {
        if (!Array.isArray(value)) {
          continue;
        }
        missingValidators.push(...findMissingValidatorsInDomainDefinitions(value, exportName, modulePath));
      }
    }

    const fakerModuleNamespace = await import(pathToFileURL(fakerDefinitionsFile).href);
    for (const [exportName, value] of collectExportedDefinitionValues(fakerModuleNamespace)) {
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        continue;
      }
      missingValidators.push(...findMissingValidatorsInFakerHelperDefinitions(value, exportName, fakerDefinitionsFile));
    }

    expect(missingValidators).toEqual([]);
  });
});
