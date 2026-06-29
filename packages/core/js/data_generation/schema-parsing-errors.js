export class SchemaParsingErrors {
  static #columnLabel(column) {
    const text = String(column ?? '').trim();
    return text.length > 0 ? text : '__';
  }

  static #fakerValidationReasonCode(reason) {
    return /\bUnsafe faker rule syntax detected\b/iu.test(String(reason || '')) ? 'unsafe_faker_rule' : '';
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
  static missingDomainCommand(line) {
    return {
      code: 'missing_domain_command',
      message: `Row ${line}: domain command is required.`,
      ...(Number.isInteger(line) ? { line } : {}),
    };
  }

  static missingRegexValue(line) {
    return {
      code: 'missing_regex_value',
      message: `Row ${line}: regex value is required.`,
      ...(Number.isInteger(line) ? { line } : {}),
    };
  }

  static helpersNotSupportedInDomain(line) {
    return {
      code: 'helpers_not_supported_in_domain',
      message: `Row ${line}: helpers.* is faker-only; use faker.helpers.*`,
      ...(Number.isInteger(line) ? { line } : {}),
    };
  }

  static invalidSchemaPairing() {
    return {
      code: 'invalid_schema_pairing',
      message: 'No rules defined. Provide column/rule pairs.',
    };
  }

  static invalidConstraintSyntax(message, line) {
    return {
      code: 'invalid_constraint_syntax',
      message: Number.isInteger(line) ? `Line ${line}: ${message}` : message,
      ...(Number.isInteger(line) ? { line } : {}),
    };
  }

  static unknownConstraintParameter(parameterName, line) {
    return {
      code: 'unknown_constraint_parameter',
      message: Number.isInteger(line)
        ? `Line ${line}: unknown constraint parameter [${parameterName}].`
        : `Unknown constraint parameter [${parameterName}].`,
      parameterName,
      ...(Number.isInteger(line) ? { line } : {}),
    };
  }

  static invalidConstraintEnumValue(parameterName, value, line) {
    return {
      code: 'invalid_constraint_enum_value',
      message: Number.isInteger(line)
        ? `Line ${line}: constraint value "${value}" is not a valid enum value for [${parameterName}].`
        : `Constraint value "${value}" is not a valid enum value for [${parameterName}].`,
      parameterName,
      value,
      ...(Number.isInteger(line) ? { line } : {}),
    };
  }

  static invalidConstraintRegexValue(parameterName, value, line) {
    return {
      code: 'invalid_constraint_regex_value',
      message: Number.isInteger(line)
        ? `Line ${line}: constraint value "${value}" does not match the regex for [${parameterName}].`
        : `Constraint value "${value}" does not match the regex for [${parameterName}].`,
      parameterName,
      value,
      ...(Number.isInteger(line) ? { line } : {}),
    };
  }

  static invalidConstraintRegexSet(parameterName, values, line) {
    const renderedValues = Array.isArray(values) ? values.map((value) => `"${value}"`).join(', ') : '';
    return {
      code: 'invalid_constraint_regex_set',
      message: Number.isInteger(line)
        ? `Line ${line}: constraint IN set ${renderedValues} does not contain any values that match the regex for [${parameterName}].`
        : `Constraint IN set ${renderedValues} does not contain any values that match the regex for [${parameterName}].`,
      parameterName,
      values,
      ...(Number.isInteger(line) ? { line } : {}),
    };
  }

  static invalidConstraintLiteralValue(parameterName, value, expectedValue, line) {
    return {
      code: 'invalid_constraint_literal_value',
      message: Number.isInteger(line)
        ? `Line ${line}: constraint value "${value}" does not match the literal value "${expectedValue}" for [${parameterName}].`
        : `Constraint value "${value}" does not match the literal value "${expectedValue}" for [${parameterName}].`,
      parameterName,
      value,
      expectedValue,
      ...(Number.isInteger(line) ? { line } : {}),
    };
  }

  static invalidConstraintLiteralExclusion(parameterName, value, line) {
    return {
      code: 'invalid_constraint_literal_exclusion',
      message: Number.isInteger(line)
        ? `Line ${line}: constraint excludes the only literal value "${value}" for [${parameterName}].`
        : `Constraint excludes the only literal value "${value}" for [${parameterName}].`,
      parameterName,
      value,
      ...(Number.isInteger(line) ? { line } : {}),
    };
  }

  static invalidConstraintInSet(parameterName, values, line) {
    const renderedValues = Array.isArray(values) ? values.map((value) => `"${value}"`).join(', ') : '';
    return {
      code: 'invalid_constraint_in_set',
      message: Number.isInteger(line)
        ? `Line ${line}: constraint IN set ${renderedValues} does not contain any valid values for [${parameterName}].`
        : `Constraint IN set ${renderedValues} does not contain any valid values for [${parameterName}].`,
      parameterName,
      values,
      ...(Number.isInteger(line) ? { line } : {}),
    };
  }

  static invalidConstraintNotInSet(parameterName, values, line) {
    const renderedValues = Array.isArray(values) ? values.map((value) => `"${value}"`).join(', ') : '';
    return {
      code: 'invalid_constraint_not_in_set',
      message: Number.isInteger(line)
        ? `Line ${line}: constraint NOT IN set ${renderedValues} excludes every possible value for [${parameterName}].`
        : `Constraint NOT IN set ${renderedValues} excludes every possible value for [${parameterName}].`,
      parameterName,
      values,
      ...(Number.isInteger(line) ? { line } : {}),
    };
  }

  static invalidConstraintLikePattern(parameterName, pattern, line) {
    return {
      code: 'invalid_constraint_like_pattern',
      message: Number.isInteger(line)
        ? `Line ${line}: constraint LIKE pattern "${pattern}" cannot match any values for [${parameterName}].`
        : `Constraint LIKE pattern "${pattern}" cannot match any values for [${parameterName}].`,
      parameterName,
      pattern,
      ...(Number.isInteger(line) ? { line } : {}),
    };
  }

  static invalidConstraintNotLikePattern(parameterName, pattern, line) {
    return {
      code: 'invalid_constraint_not_like_pattern',
      message: Number.isInteger(line)
        ? `Line ${line}: constraint NOT LIKE pattern "${pattern}" excludes every possible value for [${parameterName}].`
        : `Constraint NOT LIKE pattern "${pattern}" excludes every possible value for [${parameterName}].`,
      parameterName,
      pattern,
      ...(Number.isInteger(line) ? { line } : {}),
    };
  }

  static constraintGenerationFailed(reason) {
    return {
      code: 'constraint_generation_failed',
      message: reason || 'Unable to generate a row that satisfies the schema constraints.',
    };
  }

  static missingRuleDefinition(column, line) {
    return {
      code: 'missing_rule_definition',
      message: `column ${column} requires a data definition, use 'literal("")' for blank data`,
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
    const reasonCode = SchemaParsingErrors.#fakerValidationReasonCode(reason);
    return {
      code: 'compiler_validation_error',
      message: `${columnLabel} failed faker validation - ${reason}`,
      ...(column ? { column } : {}),
      ...(reasonCode ? { reasonCode } : {}),
    };
  }
  static domainValidationFailed(column, reason) {
    const columnLabel = SchemaParsingErrors.#columnLabel(column);
    return {
      code: 'compiler_validation_error',
      message: `${columnLabel} failed domain validation - ${reason}`,
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
