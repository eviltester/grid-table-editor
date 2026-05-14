export class SchemaParsingErrors {
  static #columnLabel(column) {
    const text = String(column ?? '').trim();
    return text.length > 0 ? text : '__';
  }

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
    const columnLabel = SchemaParsingErrors.#columnLabel(column);
    return {
      code: 'compiler_validation_error',
      message: `Evaluating ${columnLabel} as 'literal'`,
      ...(column ? { column } : {}),
    };
  }

  static fakerValidationFailed(column, reason) {
    const columnLabel = SchemaParsingErrors.#columnLabel(column);
    return {
      code: 'compiler_validation_error',
      message: `${columnLabel} failed faker validation - ${reason}`,
      ...(column ? { column } : {}),
    };
  }

  static regexValidationFailed(column, reason) {
    const columnLabel = SchemaParsingErrors.#columnLabel(column);
    return {
      code: 'compiler_validation_error',
      message: `${columnLabel} failed Regex validation - ${reason}`,
      ...(column ? { column } : {}),
    };
  }

  static enumValidationFailed(column, reason) {
    const columnLabel = SchemaParsingErrors.#columnLabel(column);
    return {
      code: 'compiler_validation_error',
      message: `${columnLabel} failed enum validation - ${reason}`,
      ...(column ? { column } : {}),
    };
  }

  static unknownRuleType(column) {
    const columnLabel = SchemaParsingErrors.#columnLabel(column);
    return {
      code: 'unknown_rule_type',
      message: `${columnLabel} has no defined type`,
      ...(column ? { column } : {}),
    };
  }
}
