import {
  SOURCE_TYPE_FAKER,
  SOURCE_TYPE_DOMAIN,
  SOURCE_TYPE_ENUM,
  SOURCE_TYPE_REGEX,
  normaliseFakerCommand,
  normaliseDomainCommand,
  normaliseCommandParams,
  normaliseSourceType,
  buildRuleSpecFromSchemaRow,
} from '../../schema-row-rule-mapper.js';
import { Faker } from '@faker-js/faker';
import { getKnownFakerCommandsAlphabetical, isForbiddenFakerCommand } from '../../faker-commands.js';
import { getKnownDomainCommandsAlphabetical } from '../../domain-commands.js';

const KNOWN_FAKER_COMMANDS = new Set(
  getKnownFakerCommandsAlphabetical().map((command) => normaliseFakerCommand(command))
);
const KNOWN_DOMAIN_COMMANDS = new Set(
  getKnownDomainCommandsAlphabetical().map((command) => normaliseDomainCommand(command))
);

function buildBracketGuidanceExample(rawParams, command = '') {
  const paramsText = String(rawParams ?? '').trim();
  if (!paramsText) {
    return '()';
  }
  const normalizedCommand = String(command || '')
    .trim()
    .toLowerCase();
  if (normalizedCommand === 'datatype.enum') {
    return 'active,inactive,pending';
  }
  const withoutLeadingParen = paramsText.startsWith('(') ? paramsText.slice(1).trim() : paramsText;
  const withoutTrailingParen = withoutLeadingParen.endsWith(')')
    ? withoutLeadingParen.slice(0, -1).trim()
    : withoutLeadingParen;
  return normaliseCommandParams(withoutTrailingParen);
}

function createSchemaRowValidation(issues = []) {
  const normalizedIssues = Array.isArray(issues) ? issues.filter(Boolean) : [];
  return {
    valid: normalizedIssues.length === 0,
    issues: normalizedIssues,
    message: normalizedIssues[0]?.message || '',
  };
}

function createRowValidationIssue({ rowIndex, code, field, message, severity, reasonCode }) {
  return {
    code,
    field,
    line: Number.isInteger(rowIndex) ? rowIndex + 1 : undefined,
    message,
    ...(severity ? { severity: severity === 'warning' ? 'warning' : 'error' } : {}),
    ...(reasonCode ? { reasonCode } : {}),
  };
}

function isBlankSchemaRow(row) {
  return (
    String(row?.name ?? '').trim().length === 0 &&
    String(row?.command ?? '').trim().length === 0 &&
    String(row?.params ?? '').trim().length === 0 &&
    String(row?.value ?? '').trim().length === 0 &&
    String(row?.comments ?? '').trim().length === 0
  );
}

function createSemanticValidationMessage(row, errorMessage, rowIndex) {
  const rowNumber = rowIndex + 1;
  const sourceType = normaliseSourceType(row?.sourceType);
  const name = String(row?.name ?? '').trim();
  const rawMessage = String(errorMessage || '').trim();
  if (!rawMessage) {
    return '';
  }

  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const rowPrefixPatterns = [
    new RegExp(`^${escapedName}\\s+failed\\s+domain\\s+validation\\s+-\\s+`, 'i'),
    new RegExp(`^${escapedName}\\s+failed\\s+faker\\s+validation\\s+-\\s+`, 'i'),
    new RegExp(`^${escapedName}\\s+failed\\s+regex\\s+validation\\s+-\\s+`, 'i'),
    new RegExp(`^${escapedName}\\s+failed\\s+enum\\s+validation\\s+-\\s+`, 'i'),
  ];

  let detail = rawMessage;
  rowPrefixPatterns.forEach((pattern) => {
    detail = detail.replace(pattern, '');
  });

  if (!detail) {
    return '';
  }

  if (sourceType === SOURCE_TYPE_DOMAIN || sourceType === SOURCE_TYPE_FAKER) {
    return `Row ${rowNumber}: invalid ${sourceType} params - ${detail}`;
  }
  return `Row ${rowNumber}: invalid ${sourceType} value - ${detail}`;
}

function getSemanticValidationField(row) {
  const sourceType = normaliseSourceType(row?.sourceType);
  if (sourceType === SOURCE_TYPE_DOMAIN || sourceType === SOURCE_TYPE_FAKER) {
    return 'params';
  }
  return 'value';
}

function getSemanticValidationSeverity(error) {
  if (error?.severity === 'warning' || error?.reasonCode === 'unsafe_faker_rule') {
    return 'warning';
  }
  return 'error';
}

function buildSemanticValidationRuleSpec(row, ruleSpec) {
  const sourceType = normaliseSourceType(row?.sourceType);
  const spec = String(ruleSpec ?? '');
  const trimmedSpec = spec.trim();

  if (sourceType === SOURCE_TYPE_DOMAIN && normaliseDomainCommand(row?.command).toLowerCase() === 'datatype.enum') {
    return trimmedSpec.length > 0 ? trimmedSpec : 'datatype.enum()';
  }

  if (sourceType === SOURCE_TYPE_REGEX && trimmedSpec.length > 0) {
    if (/^(regex|datatype\.regex|awd\.datatype\.regex)\s*\(/i.test(trimmedSpec)) {
      return trimmedSpec;
    }
    return `regex(${spec})`;
  }

  return spec;
}

function getStaticSchemaRowValidationIssues(row, rowIndex) {
  if (isBlankSchemaRow(row)) {
    return [];
  }

  const issues = [];
  const name = String(row?.name ?? '').trim();
  const sourceType = normaliseSourceType(row?.sourceType);

  if (name.length === 0) {
    issues.push(
      createRowValidationIssue({
        rowIndex,
        code: 'missing_column_name',
        field: 'name',
        message: `Row ${rowIndex + 1}: column name is required.`,
      })
    );
  }

  if (sourceType === SOURCE_TYPE_FAKER) {
    const command = normaliseFakerCommand(row?.command);
    const rawParams = String(row?.params ?? '').trim();
    if (!command) {
      issues.push(
        createRowValidationIssue({
          rowIndex,
          code: 'missing_faker_command',
          field: 'command',
          message: `Row ${rowIndex + 1}: faker command is required.`,
        })
      );
      return issues;
    }
    if (!KNOWN_FAKER_COMMANDS.has(command)) {
      issues.push(
        createRowValidationIssue({
          rowIndex,
          code: 'unknown_faker_command',
          field: 'command',
          message: `Row ${rowIndex + 1}: unknown faker command "${command}".`,
        })
      );
    }
    if (isForbiddenFakerCommand(command)) {
      issues.push(
        createRowValidationIssue({
          rowIndex,
          code: 'forbidden_faker_command',
          field: 'command',
          message: `Row ${rowIndex + 1}: faker command "${command}" is known but not allowed for schema/API use.`,
        })
      );
    }
    if (rawParams.length > 0 && normaliseCommandParams(rawParams) !== rawParams) {
      issues.push(
        createRowValidationIssue({
          rowIndex,
          code: 'params_missing_brackets',
          field: 'params',
          message: `Row ${rowIndex + 1}: params should be wrapped in parentheses, e.g. ${buildBracketGuidanceExample(rawParams, command)}.`,
        })
      );
    }
    return issues;
  }

  if (sourceType === SOURCE_TYPE_DOMAIN) {
    const command = normaliseDomainCommand(row?.command);
    const rawParams = String(row?.params ?? '').trim();
    if (!command) {
      issues.push(
        createRowValidationIssue({
          rowIndex,
          code: 'missing_domain_command',
          field: 'command',
          message: `Row ${rowIndex + 1}: domain command is required.`,
        })
      );
      return issues;
    }
    if (command.startsWith('helpers.')) {
      issues.push(
        createRowValidationIssue({
          rowIndex,
          code: 'helpers_not_supported_in_domain',
          field: 'command',
          message: `Row ${rowIndex + 1}: helpers.* is faker-only; use faker.helpers.*`,
        })
      );
      return issues;
    }
    if (!KNOWN_DOMAIN_COMMANDS.has(command)) {
      issues.push(
        createRowValidationIssue({
          rowIndex,
          code: 'unknown_domain_command',
          field: 'command',
          message: `Row ${rowIndex + 1}: unknown domain command "${command}".`,
        })
      );
    }
    if (
      rawParams.length > 0 &&
      command.toLowerCase() !== 'datatype.enum' &&
      normaliseCommandParams(rawParams) !== rawParams
    ) {
      issues.push(
        createRowValidationIssue({
          rowIndex,
          code: 'params_missing_brackets',
          field: 'params',
          message: `Row ${rowIndex + 1}: params should be wrapped in parentheses, e.g. ${buildBracketGuidanceExample(rawParams, command)}.`,
        })
      );
    }
  }

  if (sourceType === SOURCE_TYPE_REGEX) {
    const rawValue = String(row?.value ?? '').trim();
    if (!rawValue) {
      issues.push(
        createRowValidationIssue({
          rowIndex,
          code: 'missing_regex_value',
          field: 'value',
          message: `Row ${rowIndex + 1}: regex value is required.`,
        })
      );
    }
  }

  if (sourceType === SOURCE_TYPE_ENUM) {
    const rawValue = String(row?.value ?? '').trim();
    if (!rawValue) {
      issues.push(
        createRowValidationIssue({
          rowIndex,
          code: 'missing_enum_value',
          field: 'value',
          message: `Row ${rowIndex + 1}: enum value is required.`,
        })
      );
    }
  }

  return issues;
}

function getSchemaRowSemanticValidationIssues(
  row,
  rowIndex,
  { schemaTextToDataRules, faker, RandExp, includeBracketGuidance = true } = {}
) {
  if (isBlankSchemaRow(row)) {
    return [];
  }

  const staticIssues = getStaticSchemaRowValidationIssues(row, rowIndex);
  if (staticIssues.length > 0) {
    if (includeBracketGuidance) {
      return Array.isArray(row?.semanticValidationIssues) ? row.semanticValidationIssues : [];
    }
    return [];
  }

  const name = String(row?.name ?? '').trim();
  const ruleSpec = buildSemanticValidationRuleSpec(row, buildRuleSpecFromSchemaRow(row));
  if (!name || !ruleSpec || typeof schemaTextToDataRules !== 'function') {
    return [];
  }

  let validationFaker = faker;
  if (faker?.rawDefinitions && typeof Faker === 'function') {
    try {
      validationFaker = new Faker({ locale: faker.rawDefinitions });
    } catch {
      validationFaker = faker;
    }
  }

  const result = schemaTextToDataRules({
    schemaText: `${name}\n${ruleSpec}`,
    faker: validationFaker,
    RandExp,
    includeInvalidRules: true,
  });
  const errors = Array.isArray(result?.errors) ? result.errors : [];
  if (errors.length === 0) {
    return [];
  }

  const field = getSemanticValidationField(row);
  return errors
    .map((error) =>
      createRowValidationIssue({
        rowIndex,
        code: error?.code || 'semantic_validation_failed',
        field,
        message: createSemanticValidationMessage(row, error?.message, rowIndex),
        severity: getSemanticValidationSeverity(error),
        reasonCode: error?.reasonCode,
      })
    )
    .filter((issue) => issue.message);
}

function getSchemaRowValidationIssues(row, rowIndex) {
  return [
    ...getStaticSchemaRowValidationIssues(row, rowIndex),
    ...(Array.isArray(row?.semanticValidationIssues) ? row.semanticValidationIssues : []),
  ];
}

function annotateSchemaRowsWithValidation(schemaRows = []) {
  return (Array.isArray(schemaRows) ? schemaRows : []).map((row, index) => {
    const issues = getSchemaRowValidationIssues(row, index);
    return {
      ...row,
      validation: createSchemaRowValidation(issues),
    };
  });
}

function collectSchemaRowValidationErrors(schemaRows = []) {
  return annotateSchemaRowsWithValidation(schemaRows).flatMap((row) => row?.validation?.issues || []);
}

export {
  createSchemaRowValidation,
  getSchemaRowValidationIssues,
  getStaticSchemaRowValidationIssues,
  getSchemaRowSemanticValidationIssues,
  annotateSchemaRowsWithValidation,
  collectSchemaRowValidationErrors,
};
