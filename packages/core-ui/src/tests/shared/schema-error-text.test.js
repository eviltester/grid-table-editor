import { schemaErrorsToText } from '../../../js/gui_components/shared/test-data/schema/schema-error-text.js';

describe('schema-error-text', () => {
  test('adds the browser unsafe faker setting hint to unsafe faker schema errors', () => {
    expect(
      schemaErrorsToText([
        {
          message:
            'Names failed faker validation - Invalid Faker API Call Unsafe faker rule syntax detected: requires complex argument parsing',
          reasonCode: 'unsafe_faker_rule',
        },
      ])
    ).toBe(
      "Names failed faker validation - Invalid Faker API Call Unsafe faker rule syntax detected: requires complex argument parsing. Configure in Test Data Settings 'allow unsafe faker'."
    );
  });

  test('does not add the unsafe faker setting hint to unrelated schema errors', () => {
    expect(schemaErrorsToText([{ message: 'Name failed domain validation - bad params' }])).toBe(
      'Name failed domain validation - bad params'
    );
  });
});
