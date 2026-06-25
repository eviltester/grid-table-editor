import { validateCommandHelpValue } from '../../../js/command-help/command-help-contract.js';
import {
  validateAlphaStringValue,
  validateAlphanumericStringValue,
  createPredicateValidator,
  createRegexValidator,
  createStringEnumValidator,
  validateAirlineIataCodeValue,
  validateBinaryStringValue,
  validateCounterStringValue,
  validateCountryCodeValue,
  validateCreditCardNumberValue,
  validateEnumMemberValue,
  validateFromCharactersStringValue,
  validateIbanValue,
  validateImeiValue,
  validateIpValue,
  validateIpv4Value,
  validateIpv6Value,
  validateIsbnValue,
  validateMacAddressValue,
  validateRoutingNumberValue,
  validateLiteralValue,
  validateNanoIdValue,
  validateSampleStringValue,
  validateSymbolStringValue,
  validateTimeZoneValue,
  validateUpcValue,
  validateUrlValue,
  validateUuidValue,
  validateVinValue,
  validateStringValue,
} from '../../../js/command-help/command-help-validators.js';

describe('command help validators', () => {
  test('validateCommandHelpValue passes the validation context through to function validators', () => {
    let receivedArgs = null;
    const validator = (...args) => {
      receivedArgs = args;
      return true;
    };
    const context = {
      fieldDefinition: {
        sourceType: 'domain',
        command: 'string.counterString',
        params: '(min=12, max=12, delimiter="#")',
        ruleSpec: 'string.counterString(min=12, max=12, delimiter="#")',
      },
    };

    expect(validateCommandHelpValue(validator, '#3#5#7#9#12#', context)).toBe(true);
    expect(receivedArgs).toEqual(['#3#5#7#9#12#', context]);
  });

  test('counterstring validator enforces the declared length bounds from the field definition', () => {
    const context = {
      fieldDefinition: {
        sourceType: 'domain',
        command: 'string.counterString',
        params: '(min=12, max=12, delimiter="#")',
        ruleSpec: 'string.counterString(min=12, max=12, delimiter="#")',
      },
      args: [12, 12, '#'],
    };

    expect(validateCounterStringValue('#3#5#7#9#12#', context)).toBe(true);
    expect(validateCounterStringValue('#3#5#7#9#', context)).toBe(false);
  });

  test('counterstring validator ignores delimiter choice and only validates the requested length range', () => {
    const context = {
      fieldDefinition: {
        sourceType: 'domain',
        command: 'string.counterString',
        params: '(min=12, max=12, delimiter="#")',
        ruleSpec: 'string.counterString(min=12, max=12, delimiter="#")',
      },
      args: [12, 12, '#'],
    };

    expect(validateCounterStringValue('X3X5X7X9X12X', context)).toBe(true);
  });

  test('counterstring validator falls back to fieldDefinition bounds when parsed args are unavailable', () => {
    const context = {
      fieldDefinition: {
        sourceType: 'domain',
        command: 'string.counterString',
        params: '(min=12, max=12, delimiter="#")',
        ruleSpec: 'string.counterString(min=12, max=12, delimiter="#")',
      },
    };

    expect(validateCounterStringValue('#3#5#7#9#12#', context)).toBe(true);
    expect(validateCounterStringValue('#3#5#7#9#', context)).toBe(false);
  });

  test('enum validator only allows values declared on the field definition', () => {
    const context = {
      fieldDefinition: {
        sourceType: 'domain',
        command: 'datatype.enum',
        params: 'active,inactive,pending',
        ruleSpec: 'datatype.enum("active","inactive","pending")',
      },
    };

    expect(validateEnumMemberValue('active', context)).toBe(true);
    expect(validateEnumMemberValue('inactive', context)).toBe(true);
    expect(validateEnumMemberValue('archived', context)).toBe(false);
  });

  test('literal validator matches the declared literal value exactly', () => {
    const context = {
      fieldDefinition: {
        sourceType: 'domain',
        command: 'literal.value',
        params: '(value=true)',
        ruleSpec: 'literal.value(value=true)',
      },
      args: [true],
    };

    expect(validateLiteralValue(true, context)).toBe(true);
    expect(validateLiteralValue('true', context)).toBe(false);
    expect(validateLiteralValue(false, context)).toBe(false);
  });

  test('literal validator defaults to empty string when no literal value is provided', () => {
    const context = {
      fieldDefinition: {
        sourceType: 'domain',
        command: 'literal.value',
        params: '()',
        ruleSpec: 'literal.value()',
      },
      args: [],
    };

    expect(validateLiteralValue('', context)).toBe(true);
    expect(validateLiteralValue('Pending', context)).toBe(false);
  });

  test('string enum validators only allow declared values', () => {
    const validator = createStringEnumValidator(['http', 'https']);

    expect(validator('http')).toBe(true);
    expect(validator('https')).toBe(true);
    expect(validator('ftp')).toBe(false);
    expect(validator(123)).toBe(false);
  });

  test('regex validators require a non-empty string that matches the pattern', () => {
    const validator = createRegexValidator(/^[A-Z]{2}$/u);

    expect(validator('AB')).toBe(true);
    expect(validator('A1')).toBe(false);
    expect(validator('')).toBe(false);
  });

  test('validateCommandHelpValue resets lastIndex for stateful regex validators', () => {
    const validator = /^[A-Z]{2}$/gu;

    expect(validateCommandHelpValue(validator, 'AB')).toBe(true);
    expect(validateCommandHelpValue(validator, 'AB')).toBe(true);
  });

  test('predicate validators can enforce semantic checks', () => {
    const validator = createPredicateValidator((value) => value.endsWith('.json'));

    expect(validator('sample.json')).toBe(true);
    expect(validator('sample.txt')).toBe(false);
    expect(validator('')).toBe(false);
  });

  test('string validator requires non-empty strings by default', () => {
    expect(validateStringValue('Alpha')).toBe(true);
    expect(validateStringValue('')).toBe(false);
  });

  test('string validator allows empty string when a zero-length configuration is explicitly requested', () => {
    const context = {
      help: {
        args: [{ name: 'length' }],
      },
      args: [0],
      fieldDefinition: {
        sourceType: 'domain',
        command: 'string.alpha',
        params: '(length=0)',
        ruleSpec: 'string.alpha(length=0)',
      },
    };

    expect(validateStringValue('', context)).toBe(true);
  });

  test('string validator allows empty string when the configured length range includes zero', () => {
    const context = {
      help: {
        args: [{ name: 'length' }],
      },
      args: [{ min: 0, max: 3 }],
      fieldDefinition: {
        sourceType: 'domain',
        command: 'string.sample',
        params: '(length={min:0,max:3})',
        ruleSpec: 'string.sample(length={min:0,max:3})',
      },
    };

    expect(validateStringValue('', context)).toBe(true);
  });

  test('string validator allows empty string for helpers with empty input passthrough behavior', () => {
    const context = {
      command: 'helpers.slugify',
      functionCall: 'helpers.slugify()',
      fieldDefinition: {
        sourceType: 'faker',
        command: 'helpers.slugify',
        ruleSpec: 'helpers.slugify()',
      },
    };

    expect(validateStringValue('', context)).toBe(true);
  });

  test('country code validator respects the requested variant', () => {
    expect(
      validateCountryCodeValue('GB', {
        help: {
          args: [{ name: 'variant' }],
        },
        args: [],
      })
    ).toBe(true);

    expect(
      validateCountryCodeValue('GBR', {
        help: {
          args: [{ name: 'variant' }],
        },
        args: ['alpha-3'],
      })
    ).toBe(true);

    expect(
      validateCountryCodeValue('826', {
        help: {
          args: [{ name: 'variant' }],
        },
        args: ['numeric'],
      })
    ).toBe(true);

    expect(
      validateCountryCodeValue('GB', {
        help: {
          args: [{ name: 'variant' }],
        },
        args: ['numeric'],
      })
    ).toBe(false);
  });

  test('network validators distinguish ip address families', () => {
    expect(validateIpValue('2001:db8::1')).toBe(true);
    expect(validateIpv4Value('192.168.0.1')).toBe(true);
    expect(validateIpv4Value('2001:db8::1')).toBe(false);
    expect(validateIpv6Value('2001:db8::1')).toBe(true);
    expect(validateIpv6Value('192.168.0.1')).toBe(false);
  });

  test('url validator enforces http and https urls', () => {
    expect(validateUrlValue('https://example.com/path')).toBe(true);
    expect(validateUrlValue('notaurl')).toBe(false);
    expect(
      validateUrlValue('https://example.com', {
        help: {
          args: [{ name: 'protocol' }],
        },
        args: ['https'],
      })
    ).toBe(true);
    expect(
      validateUrlValue('https://example.com', {
        help: {
          args: [{ name: 'protocol' }],
        },
        args: ['http'],
      })
    ).toBe(false);
  });

  test('mac validator respects the requested separator', () => {
    expect(validateMacAddressValue('aa:bb:cc:dd:ee:ff')).toBe(true);
    expect(
      validateMacAddressValue('aa-bb-cc-dd-ee-ff', {
        help: {
          args: [{ name: 'separator' }],
        },
        args: ['-'],
      })
    ).toBe(true);
    expect(
      validateMacAddressValue('aabbccddeeff', {
        help: {
          args: [{ name: 'separator' }],
        },
        args: [''],
      })
    ).toBe(true);
    expect(validateMacAddressValue('aa-bb-cc-dd-ee-ff')).toBe(false);
  });

  test('binary validator respects the configured prefix and length', () => {
    expect(
      validateBinaryStringValue('0b1010', {
        help: {
          args: [{ name: 'length' }, { name: 'prefix' }],
        },
        args: [4],
      })
    ).toBe(true);

    expect(
      validateBinaryStringValue('PRE-1010', {
        help: {
          args: [{ name: 'length' }, { name: 'prefix' }],
        },
        args: [4, 'PRE-'],
      })
    ).toBe(true);

    expect(
      validateBinaryStringValue('0b101', {
        help: {
          args: [{ name: 'length' }, { name: 'prefix' }],
        },
        args: [4],
      })
    ).toBe(false);
  });

  test('alpha validator respects casing, exclusions, and length', () => {
    const uppercaseContext = {
      help: {
        args: [{ name: 'length' }, { name: 'casing' }, { name: 'exclude' }],
      },
      args: [5, 'upper', ['A', 'B']],
    };

    expect(validateAlphaStringValue('KSCHD', uppercaseContext)).toBe(true);
    expect(validateAlphaStringValue('KSaHD', uppercaseContext)).toBe(false);
    expect(validateAlphaStringValue('ABCDZ', uppercaseContext)).toBe(false);
    expect(validateAlphaStringValue('KSAH', uppercaseContext)).toBe(false);
  });

  test('alphanumeric validator respects casing, exclusions, and length', () => {
    const context = {
      help: {
        args: [{ name: 'length' }, { name: 'casing' }, { name: 'exclude' }],
      },
      args: [6, 'lower', ['a', '1']],
    };

    expect(validateAlphanumericStringValue('bc2def', context)).toBe(true);
    expect(validateAlphanumericStringValue('BC2DEF', context)).toBe(false);
    expect(validateAlphanumericStringValue('ba2def', context)).toBe(false);
    expect(validateAlphanumericStringValue('bc2de', context)).toBe(false);
  });

  test('fromCharacters validator only allows strings built from the declared source tokens', () => {
    expect(
      validateFromCharactersStringValue('xyzxy', {
        help: {
          args: [{ name: 'characters' }, { name: 'length' }],
        },
        args: ['xyz', 5],
      })
    ).toBe(true);

    expect(
      validateFromCharactersStringValue('abab', {
        help: {
          args: [{ name: 'characters' }, { name: 'length' }],
        },
        args: [['ab', 'cd'], 2],
      })
    ).toBe(true);

    expect(
      validateFromCharactersStringValue('abef', {
        help: {
          args: [{ name: 'characters' }, { name: 'length' }],
        },
        args: [['ab', 'cd'], 2],
      })
    ).toBe(false);
  });

  test('nanoid validator enforces the Nano ID alphabet and configured length', () => {
    expect(
      validateNanoIdValue('Abc123_-Xy', {
        help: {
          args: [{ name: 'length' }],
        },
        args: [10],
      })
    ).toBe(true);

    expect(
      validateNanoIdValue('Abc123_-X!', {
        help: {
          args: [{ name: 'length' }],
        },
        args: [10],
      })
    ).toBe(false);
  });

  test('sample validator restricts output to the documented ASCII range', () => {
    expect(
      validateSampleStringValue(`!AZaz09{}|`, {
        help: {
          args: [{ name: 'length' }],
        },
        args: [10],
      })
    ).toBe(true);

    expect(
      validateSampleStringValue(`bad\nline`, {
        help: {
          args: [{ name: 'length' }],
        },
        args: [8],
      })
    ).toBe(false);
  });

  test('symbol validator restricts output to documented symbol characters and length', () => {
    expect(
      validateSymbolStringValue(`!@#{}~`, {
        help: {
          args: [{ name: 'length' }],
        },
        args: [6],
      })
    ).toBe(true);

    expect(
      validateSymbolStringValue('!@#A{}', {
        help: {
          args: [{ name: 'length' }],
        },
        args: [6],
      })
    ).toBe(false);
  });

  test('semantic document and payment validators enforce checksums', () => {
    expect(validateIsbnValue('978-0-306-40615-7')).toBe(true);
    expect(validateIsbnValue('978-0-306-40615-8')).toBe(false);
    expect(validateUpcValue('036000291452')).toBe(true);
    expect(validateUpcValue('036000291453')).toBe(false);
    expect(validateCreditCardNumberValue('4111 1111 1111 1111')).toBe(true);
    expect(validateCreditCardNumberValue('4111 1111 1111 1112')).toBe(false);
    expect(validateImeiValue('35-209900-176148-1')).toBe(true);
    expect(validateImeiValue('35-209900-176148-2')).toBe(false);
    expect(validateRoutingNumberValue('011000015')).toBe(true);
    expect(validateRoutingNumberValue('011000016')).toBe(false);
  });

  test('iban validator respects the optional country code constraint', () => {
    expect(validateIbanValue('GB82 WEST 1234 5698 7654 32')).toBe(true);
    expect(
      validateIbanValue('GB82 WEST 1234 5698 7654 32', {
        help: {
          args: [{ name: 'countryCode' }, { name: 'formatted' }],
        },
        args: ['GB', true],
      })
    ).toBe(true);
    expect(
      validateIbanValue('DE89 3704 0044 0532 0130 00', {
        help: {
          args: [{ name: 'countryCode' }, { name: 'formatted' }],
        },
        args: ['GB', true],
      })
    ).toBe(false);
  });

  test('timezone validator recognises IANA timezone names', () => {
    expect(validateTimeZoneValue('Europe/London')).toBe(true);
    expect(validateTimeZoneValue('Mars/Phobos')).toBe(false);
  });

  test('uuid validator respects requested version and vin validator enforces vin shape', () => {
    expect(
      validateUuidValue('019edb71-aa40-76b0-8421-25686a3e0a68', { help: { args: [{ name: 'version' }] }, args: [7] })
    ).toBe(true);
    expect(
      validateUuidValue('6b042125-686a-43e0-8a68-23cf5bee102e', { help: { args: [{ name: 'version' }] }, args: [7] })
    ).toBe(false);
    expect(validateVinValue('1M8GDM9AXKP042788')).toBe(true);
    expect(validateVinValue('1M8GDM9AOKP042788')).toBe(false);
  });

  test('airline iata code validator rejects malformed codes', () => {
    expect(validateAirlineIataCodeValue('BA')).toBe(true);
    expect(validateAirlineIataCodeValue('B')).toBe(false);
    expect(validateAirlineIataCodeValue('B-A')).toBe(false);
  });
});
