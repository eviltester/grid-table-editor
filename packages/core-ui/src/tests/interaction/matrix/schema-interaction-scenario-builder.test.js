import { getFakerCommandHelp } from '@anywaydata/core/faker/faker-helper-keyword-definitions.js';
import {
  getKnownDomainCommandsAlphabetical,
  getDomainKeywordByCommand,
} from '../../../../js/gui_components/shared/domain-commands.js';
import { getVisibleDomainCommands } from '../../../../js/gui_components/shared/test-data/help/domain-command-provider.js';
import { getDomainCommandHelp } from '../../../../js/gui_components/shared/domain-command-help-metadata.js';
import {
  buildSchemaInteractionScenarios,
  buildScenarioCoverageSummary,
  CUSTOM_SOURCE_TYPES,
  FAKER_INTERACTION_COMMANDS,
} from './support/schema-interaction-scenario-builder.js';

describe('schema interaction scenario builder', () => {
  test('exposes datatype.enum in domain command list with help metadata', () => {
    const visibleCommands = getVisibleDomainCommands({
      commands: getKnownDomainCommandsAlphabetical(),
      currentCommand: '',
    });
    expect(visibleCommands).toContain('datatype.enum');
    expect(getDomainCommandHelp('datatype.enum')).toBeTruthy();
  });

  test('builds at least one scenario for every dropdown selectable item', () => {
    const { byCommand } = buildScenarioCoverageSummary();
    const scenarios = buildSchemaInteractionScenarios();

    CUSTOM_SOURCE_TYPES.forEach((sourceType) => {
      const hasScenario = scenarios.some((scenario) => scenario.sourceType === sourceType);
      expect(hasScenario).toBe(true);
    });

    FAKER_INTERACTION_COMMANDS.forEach((command) => {
      expect(byCommand.has(`faker:${command}`)).toBe(true);
    });

    getVisibleDomainCommands({ commands: getKnownDomainCommandsAlphabetical(), currentCommand: '' }).forEach(
      (command) => {
        expect(byCommand.has(`domain:${command}`)).toBe(true);
      }
    );
  });

  test('every faker interaction command has help metadata and argument coverage', () => {
    const { byCommand } = buildScenarioCoverageSummary();

    FAKER_INTERACTION_COMMANDS.forEach((command) => {
      const metadata = getFakerCommandHelp(command);
      expect(metadata).toBeTruthy();
      expect(String(metadata.docsUrl || '').trim().length).toBeGreaterThan(0);

      const bucket = byCommand.get(`faker:${command}`);
      expect(bucket.scenarios.length).toBeGreaterThan(0);
      (metadata.params || []).forEach((param) => {
        expect(bucket.coveredArgs.has(param.name)).toBe(true);
      });

      const exampleScenarioCount = bucket.scenarios.filter((scenario) => scenario.origins.includes('example')).length;
      const expectedExamples = Array.isArray(metadata.usageExamples) ? metadata.usageExamples.length : 0;
      if (expectedExamples > 0) {
        expect(exampleScenarioCount).toBeGreaterThanOrEqual(expectedExamples);
      }
    });
  });

  test('every dropdown selectable domain command has help metadata, scenarios, and curated examples represented', () => {
    const { byCommand } = buildScenarioCoverageSummary();
    const visibleCommands = getVisibleDomainCommands({
      commands: getKnownDomainCommandsAlphabetical(),
      currentCommand: '',
    });

    visibleCommands.forEach((command) => {
      const metadata = getDomainCommandHelp(command);
      expect(metadata).toBeTruthy();
      expect(String(metadata.docsUrl || '').trim().length).toBeGreaterThan(0);

      const bucket = byCommand.get(`domain:${command}`);
      expect(bucket.scenarios.length).toBeGreaterThan(0);
      (metadata.args || []).forEach((arg) => {
        expect(bucket.coveredArgs.has(arg.name)).toBe(true);
      });

      const exampleScenarioCount = bucket.scenarios.filter((scenario) => scenario.origins.includes('example')).length;
      const expectedExamples = Array.isArray(getDomainKeywordByCommand(command)?.help?.usageExamples)
        ? getDomainKeywordByCommand(command).help.usageExamples.length
        : 0;
      if (expectedExamples > 0) {
        expect(exampleScenarioCount).toBeGreaterThanOrEqual(expectedExamples);
      }
    });
  });

  test('curated definition examples are included as example scenarios', () => {
    const scenarios = buildSchemaInteractionScenarios();

    expect(scenarios.find((scenario) => scenario.id === 'faker-helpers-mustache-example-1')?.rows[0]?.params).toBe(
      '("Hello {{name}}", { name: "Ada" })'
    );
    expect(scenarios.find((scenario) => scenario.id === 'domain-commerce-price-example-1')?.rows[0]?.params).toBe(
      '(dec=2, max=10, min=1, symbol="$")'
    );
    expect(scenarios.find((scenario) => scenario.id === 'domain-date-birthdate-example-1')?.rows[0]?.params).toBe(
      '(refDate=20000, max=69, min=16, mode="age")'
    );
    expect(scenarios.find((scenario) => scenario.id === 'domain-internet-password-example-1')?.rows[0]?.params).toBe(
      '()'
    );
    expect(scenarios.find((scenario) => scenario.id === 'domain-internet-password-example-2')?.rows[0]?.params).toBe(
      '(length=12)'
    );
    expect(
      scenarios.find((scenario) => scenario.id === 'domain-autoIncrement-sequence-example-1')?.rows[0]?.params
    ).toBe('()');
  });

  test('base scenarios reuse minimal curated examples from keyword definitions', () => {
    const scenarios = buildSchemaInteractionScenarios();

    expect(scenarios.find((scenario) => scenario.id === 'faker-helpers-arrayElements-base')?.rows[0]?.params).toBe(
      '(["A", "B", "C"])'
    );
    expect(scenarios.find((scenario) => scenario.id === 'domain-date-between-base')?.rows[0]?.params).toBe(
      '(from=1577836800000, to=1609372800000)'
    );
    expect(scenarios.find((scenario) => scenario.id === 'domain-string-fromCharacters-base')?.rows[0]?.params).toBe(
      '(characters="ABC123")'
    );
  });

  test('integer-like domain args expose integer metadata in definitions', () => {
    expect(getDomainCommandHelp('string.counterString')?.args?.find((arg) => arg.name === 'min')?.type).toBe('integer');
    expect(getDomainCommandHelp('autoIncrement.sequence')?.args?.find((arg) => arg.name === 'start')?.type).toBe(
      'integer'
    );
    expect(getDomainCommandHelp('autoIncrement.sequence')?.args?.find((arg) => arg.name === 'zeropadding')?.type).toBe(
      'integer'
    );
    expect(getDomainCommandHelp('string.fromCharacters')?.args?.find((arg) => arg.name === 'length')?.type).toBe(
      'integer'
    );
    expect(getDomainCommandHelp('commerce.price')?.args?.find((arg) => arg.name === 'dec')?.type).toBe('integer');
    expect(getDomainCommandHelp('internet.password')?.args?.find((arg) => arg.name === 'length')?.type).toBe('integer');
    expect(getDomainCommandHelp('date.between')?.args?.find((arg) => arg.name === 'from')?.type).toBe('integer');
    expect(getDomainCommandHelp('date.betweens')?.args?.find((arg) => arg.name === 'count')?.type).toBe('integer');
  });

  test('example-derived coverage still includes focused optional-parameter scenarios', () => {
    const scenarios = buildSchemaInteractionScenarios();

    expect(
      scenarios.find((scenario) => scenario.id === 'domain-string-fromCharacters-example-2')?.rows[0]?.params
    ).toBe('(characters=["A", "B", "C"], length=4)');
    expect(scenarios.find((scenario) => scenario.id === 'domain-datatype-enum-base')?.coveredArgs).toEqual(['values']);
    expect(scenarios.find((scenario) => scenario.id === 'domain-date-birthdate-example-3')?.coveredArgs).toEqual([
      'refDate',
    ]);
    expect(
      scenarios.find((scenario) => scenario.id === 'domain-autoIncrement-sequence-example-5')?.coveredArgs
    ).toEqual(['step']);
  });

  test('definitions describe executable option types and return types for matrix generation', () => {
    expect(getDomainCommandHelp('internet.password')?.args?.find((arg) => arg.name === 'pattern')?.type).toBe('regexp');
    expect(getDomainCommandHelp('commerce.price')?.returnType).toBe('string');
    expect(getDomainCommandHelp('finance.amount')?.returnType).toBe('string');
  });
});
