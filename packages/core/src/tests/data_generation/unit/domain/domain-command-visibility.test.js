import {
  getVisibleDomainCommands,
  isDomainCommandVisibleByDefault,
} from '../../../../../js/domain/domain-command-visibility.js';

describe('domain command visibility', () => {
  test('hides object and array returning domain commands by default', () => {
    expect(isDomainCommandVisibleByDefault('airline.airplane')).toBe(false);
    expect(isDomainCommandVisibleByDefault('finance.currency')).toBe(false);
    expect(isDomainCommandVisibleByDefault('location.language')).toBe(false);
    expect(isDomainCommandVisibleByDefault('science.chemicalElement')).toBe(false);
    expect(isDomainCommandVisibleByDefault('date.betweens')).toBe(false);
    expect(isDomainCommandVisibleByDefault('location.nearbyGPSCoordinate')).toBe(false);
  });

  test('keeps scalar domain commands visible by default', () => {
    expect(isDomainCommandVisibleByDefault('airplane.name')).toBe(true);
    expect(isDomainCommandVisibleByDefault('airplane.iataTypeCode')).toBe(true);
    expect(isDomainCommandVisibleByDefault('finance.currencyCode')).toBe(true);
    expect(isDomainCommandVisibleByDefault('location.city')).toBe(true);
    expect(isDomainCommandVisibleByDefault('language.name')).toBe(true);
    expect(isDomainCommandVisibleByDefault('language.alpha2')).toBe(true);
    expect(isDomainCommandVisibleByDefault('language.alpha3')).toBe(true);
    expect(isDomainCommandVisibleByDefault('unit.name')).toBe(true);
    expect(isDomainCommandVisibleByDefault('unit.symbol')).toBe(true);
    expect(isDomainCommandVisibleByDefault('datatype.enum')).toBe(true);
  });

  test('preserves the selected hidden command when filtering a command list', () => {
    const commands = ['airline.airplane', 'airplane.name', 'date.betweens', 'date.between'];

    expect(getVisibleDomainCommands({ commands, currentCommand: '' })).toEqual(['airplane.name', 'date.between']);
    expect(getVisibleDomainCommands({ commands, currentCommand: 'airline.airplane' })).toEqual([
      'airline.airplane',
      'airplane.name',
      'date.between',
    ]);
  });
});
