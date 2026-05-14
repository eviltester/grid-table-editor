export class SchemaParsingErrors {
  static missingSchemaRows() {
    return {
      code: 'missing_schema_rows',
      message: 'Add at least one schema row.',
    };
  }

  static missingColumnName(line) {
    return {
      code: 'missing_column_name',
      message: `Row ${line}: column name is required.`,
      ...(Number.isInteger(line) ? { line } : {}),
    };
  }

  static missingFakerCommand(line) {
    return {
      code: 'missing_faker_command',
      message: `Row ${line}: faker command is required.`,
      ...(Number.isInteger(line) ? { line } : {}),
    };
  }

  static invalidSchemaPairing() {
    return {
      code: 'invalid_schema_pairing',
      message: 'No rules defined. Provide column/rule pairs.',
    };
  }

  static missingRuleDefinition(column, line) {
    return {
      code: 'missing_rule_definition',
      message: `column ${column} requires a data definition, use 'literal()' for blank data`,
      column,
      ...(Number.isInteger(line) ? { line } : {}),
    };
  }

  static evaluatingAsLiteral(column) {
    return {
      code: 'compiler_validation_error',
      message: `Evaluating _${column}_ as 'literal'`,
      ...(column ? { column } : {}),
    };
  }

  static fakerValidationFailed(column, reason) {
    return {
      code: 'compiler_validation_error',
      message: `${column} failed faker validation - ${reason}`,
      ...(column ? { column } : {}),
    };
  }

  static regexValidationFailed(column, reason) {
    return {
      code: 'compiler_validation_error',
      message: `${column} failed Regex validation - ${reason}`,
      ...(column ? { column } : {}),
    };
  }

  static enumValidationFailed(column, reason) {
    return {
      code: 'compiler_validation_error',
      message: `${column} failed enum validation - ${reason}`,
      ...(column ? { column } : {}),
    };
  }

  static unknownRuleType(column) {
    return {
      code: 'unknown_rule_type',
      message: `${column} has no defined type`,
      ...(column ? { column } : {}),
    };
  }
}
