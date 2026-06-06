import { getFakerCommandHelp } from '../../../../js/gui_components/shared/faker-command-help-metadata.js';
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
      const expectedExamples = Array.isArray(metadata.examples) ? metadata.examples.length : 0;
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
      const expectedExamples = Array.isArray(getDomainKeywordByCommand(command)?.help?.examples)
        ? getDomainKeywordByCommand(command).help.examples.length
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
      '(length=10, memorable=false, pattern="[A-Za-z0-9]", prefix="#")'
    );
  });

  test('domain argument scenarios prefer examples from keyword definitions', () => {
    const scenarios = buildSchemaInteractionScenarios();

    expect(scenarios.find((scenario) => scenario.id === 'domain-airline-seat-arg-aircraftType')?.rows[0]?.params).toBe(
      '(aircraftType="widebody")'
    );
    expect(scenarios.find((scenario) => scenario.id === 'domain-color-rgb-arg-casing')?.rows[0]?.params).toBe(
      '(casing="upper")'
    );
    expect(scenarios.find((scenario) => scenario.id === 'domain-commerce-price-arg-symbol')?.rows[0]?.params).toBe(
      '(symbol="$")'
    );
    expect(scenarios.find((scenario) => scenario.id === 'domain-date-between-base')?.rows[0]?.params).toBe(
      '(1577836800000, 1609372800000)'
    );
  });

  test('integer-like domain args expose integer metadata in definitions', () => {
    expect(getDomainCommandHelp('string.counterString')?.args?.find((arg) => arg.name === 'min')?.type).toBe('integer');
    expect(getDomainCommandHelp('string.fromCharacters')?.args?.find((arg) => arg.name === 'length')?.type).toBe(
      'integer'
    );
    expect(getDomainCommandHelp('commerce.price')?.args?.find((arg) => arg.name === 'dec')?.type).toBe('integer');
    expect(getDomainCommandHelp('internet.password')?.args?.find((arg) => arg.name === 'length')?.type).toBe('integer');
    expect(getDomainCommandHelp('date.between')?.args?.find((arg) => arg.name === 'from')?.type).toBe('integer');
    expect(getDomainCommandHelp('date.betweens')?.args?.find((arg) => arg.name === 'count')?.type).toBe('integer');
  });

  test('domain arg scenarios include required companion args when needed', () => {
    const scenarios = buildSchemaInteractionScenarios();

    expect(
      scenarios.find((scenario) => scenario.id === 'domain-string-fromCharacters-arg-length')?.rows[0]?.params
    ).toBe('(characters="ABC123", length=4)');
    expect(scenarios.find((scenario) => scenario.id === 'domain-date-between-arg-from')?.rows[0]?.params).toBe(
      '(from=1577836800000, to=1609372800000)'
    );
    expect(scenarios.find((scenario) => scenario.id === 'domain-date-birthdate-arg-max')?.rows[0]?.params).toBe(
      '(max=65, min=18, mode="age")'
    );
  });

  test('definitions describe executable option types and return types for matrix generation', () => {
    expect(getDomainCommandHelp('internet.password')?.args?.find((arg) => arg.name === 'pattern')?.type).toBe('regexp');
    expect(getDomainCommandHelp('commerce.price')?.returnType).toBe('string');
    expect(getDomainCommandHelp('finance.amount')?.returnType).toBe('string');
  });
});
