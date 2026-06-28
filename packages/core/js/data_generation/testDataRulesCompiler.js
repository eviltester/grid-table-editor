import { FakerTestDataRuleValidator } from './faker/fakerTestDataRuleValidator.js';
import { RegexTestDataRuleValidator } from './regex/regexTestDataRuleValidator.js';
import { EnumTestDataRuleValidator } from './enum/enumTestDataRuleValidator.js';
import { DomainTestDataRuleValidator } from './domain/domainTestDataRuleValidator.js';
import { SchemaParsingErrors } from './schema-parsing-errors.js';
import { EnumParser } from './utils/enumParser.js';
import { extractFakerCommandCandidate, isSupportedFakerRuleCommand } from '../faker/faker-commands.js';

function looksLikeCommandRuleSpec(ruleSpec) {
  const spec = String(ruleSpec || '').trim();
  return /^(?:faker\.)?[A-Za-z_][\w]*(?:\.[A-Za-z_][\w]*)+(?:\s*\([\s\S]*\))?$/.test(spec);
}

function looksLikeFakerHelperRuleSpec(ruleSpec) {
  const command = extractFakerCommandCandidate(ruleSpec);
  return command.startsWith('helpers.');
}

function looksLikeRegexShorthand(ruleSpec) {
  return /[\\[\]{}()*+?|^$]/.test(String(ruleSpec || '').trim());
}

/*
    'Compilation' of rules is where we try to identify if the rules are
    faker or regex.

    If the rules are predefined as a type then we validate the type
    during compilation.
*/
export class TestDataRulesCompiler {
  constructor(aFaker, aRandExp, options = {}) {
    this.faker = aFaker;
    this.RandExp = aRandExp;
    this.options = options;

    // compilation report
    this.rules = [];
    this.compilationReportLines = [];
    this.errors = [];
  }

  /*
        Compilation will attempt to assign a type to a rule if the rule
        does not have a type allocated.

        It creates a compilation report.

    */
  compile(theRules) {
    this.rules = theRules;
    this.compilationReportLines = [];
    this.errors = [];

    const fakerValidator = new FakerTestDataRuleValidator(this.faker, this.options);
    const regexValidator = new RegexTestDataRuleValidator(this.RandExp);
    const enumValidator = new EnumTestDataRuleValidator();
    const domainValidator = new DomainTestDataRuleValidator();

    const validTypes = ['regex', 'faker', 'domain', 'literal', 'enum'];

    this.rules.forEach((rule) => {
      if (rule.type == '') {
        // unassigned a type, try and generate one
        this.compilationReportLines.push(`Identifying type for ${rule.name}`);

        // Check for explicit literal patterns first
        if (this.isLiteralPattern(rule.ruleSpec)) {
          const literalValue = this.extractLiteralValue(rule.ruleSpec);
          this.compilationReportLines.push(`${rule.name} is a valid 'literal': ${rule.ruleSpec}`);
          rule.ruleSpec = literalValue;
          rule.type = 'literal';
          return;
        }

        if (this.isRegexPattern(rule.ruleSpec)) {
          const regexValue = this.extractRegexValue(rule.ruleSpec);
          this.compilationReportLines.push(`${rule.name} is a valid 'regex': ${rule.ruleSpec}`);
          rule.ruleSpec = regexValue;
          rule.type = 'regex';
          return;
        }

        // Check for enum patterns first
        if (this.isEnumPattern(rule.ruleSpec)) {
          const parsedEnumRule = EnumParser.parseEnumRuleSpec(rule.ruleSpec);
          enumValidator.validate(rule);
          if (enumValidator.isValid()) {
            this.compilationReportLines.push(`${rule.name} is a valid 'enum': ${rule.ruleSpec}`);
            rule.ruleSpec = EnumParser.normalizeToCanonicalDomainRuleSpec(rule.ruleSpec);
            rule.type = 'domain';
          } else {
            this.compilationReportLines.push(
              `${rule.name} is not a valid 'enum': ${enumValidator.getValidationError()}`
            );
            rule.type = parsedEnumRule.explicit ? 'domain' : 'enum';
          }
        } else {
          if (this.isDomainHelpersPattern(rule.ruleSpec)) {
            this.compilationReportLines.push(
              `${rule.name} is a domain helpers rule and is unsupported: helpers.* is faker-only`
            );
            rule.type = 'domain';
            return;
          }

          domainValidator.validate(rule);
          if (domainValidator.isValid()) {
            this.compilationReportLines.push(`${rule.name} is a valid 'domain': ${rule.ruleSpec}`);
            rule.type = 'domain';
            return;
          }
          if (domainValidator.lastParsed?.recognized === true) {
            this.compilationReportLines.push(
              `${rule.name} resolves to domain keyword '${domainValidator.lastParsed.keyword}' but has invalid arguments: ${domainValidator.getValidationError()}`
            );
            rule.type = 'domain';
            return;
          }
          this.compilationReportLines.push(`${rule.name} is not a 'domain': ${domainValidator.getValidationError()}`);

          // is it a faker function?
          fakerValidator.validate(rule);
          if (fakerValidator.isValid()) {
            this.compilationReportLines.push(`${rule.name} is a valid 'faker': ${rule.ruleSpec}`);
            rule.type = 'faker';
          } else {
            this.compilationReportLines.push(`${rule.name} is not a 'faker': ${fakerValidator.getValidationError()}`);
            if (fakerValidator.lastParsed?.recognized === true) {
              this.compilationReportLines.push(
                `${rule.name} resolves to faker command '${fakerValidator.lastParsed.command}' but has invalid arguments: ${fakerValidator.getValidationError()}`
              );
              rule.type = 'faker';
              return;
            }
            if (looksLikeCommandRuleSpec(rule.ruleSpec)) {
              if (
                looksLikeFakerHelperRuleSpec(rule.ruleSpec) ||
                isSupportedFakerRuleCommand(extractFakerCommandCandidate(rule.ruleSpec))
              ) {
                this.compilationReportLines.push(
                  `${rule.name} looks like a faker command but is invalid: ${fakerValidator.getValidationError()}`
                );
                rule.type = 'faker';
                return;
              }
              this.compilationReportLines.push(
                `${rule.name} looks like a domain command but is not registered: ${domainValidator.getValidationError()}`
              );
              rule.type = 'domain';
              return;
            }
            if (looksLikeRegexShorthand(rule.ruleSpec)) {
              // does the regex generation work?
              regexValidator.validate(rule);
              if (regexValidator.isValid()) {
                this.compilationReportLines.push(`${rule.name} is a valid 'regex': ${rule.ruleSpec}`);
                rule.type = 'regex';
              } else {
                this.compilationReportLines.push(
                  `${rule.name} is not a 'regex': ${regexValidator.getValidationError()}`
                );
                this.errors.push(SchemaParsingErrors.evaluatingAsLiteral(rule.name));
                rule.type = 'literal';
              }
            } else {
              this.compilationReportLines.push(`${rule.name} is plain text and is treated as a 'literal'`);
              rule.type = 'literal';
            }
          }
        }
      } else {
        if (!validTypes.includes(rule.type)) {
          this.compilationReportLines.push(
            `Warning: Unrecognised Type for '${rule.name}' - '${rule.type}' converting to 'literal'`
          );
          rule.type = 'literal';
        } else {
          this.compilationReportLines.push(`Type for '${rule.name}' declared as '${rule.type}'`);
          if (rule.type === 'literal' && this.isLiteralPattern(rule.ruleSpec)) {
            rule.ruleSpec = this.extractLiteralValue(rule.ruleSpec);
          }
          if (rule.type === 'regex' && this.isRegexPattern(rule.ruleSpec)) {
            rule.ruleSpec = this.extractRegexValue(rule.ruleSpec);
          }
          if (rule.type === 'enum') {
            enumValidator.validate(rule);
            if (enumValidator.isValid()) {
              rule.ruleSpec = EnumParser.normalizeToCanonicalDomainRuleSpec(rule.ruleSpec);
              rule.type = 'domain';
            }
          }
        }
      }
    });
  }

  /*
        Validate assumes that every rule has been compiled and validates each rule against type.
    */
  validate() {
    this.errors = [];

    const fakerValidator = new FakerTestDataRuleValidator(this.faker, this.options);
    const regexValidator = new RegexTestDataRuleValidator(this.RandExp);
    const enumValidator = new EnumTestDataRuleValidator();
    const domainValidator = new DomainTestDataRuleValidator();

    this.rules.forEach((rule) => {
      switch (rule.type) {
        case 'faker':
          // is it a faker function?
          fakerValidator.validate(rule);
          if (!fakerValidator.isValid()) {
            this.errors.push(SchemaParsingErrors.fakerValidationFailed(rule.name, fakerValidator.getValidationError()));
          }
          break;
        case 'domain':
          domainValidator.validate(rule);
          if (!domainValidator.isValid()) {
            this.errors.push(
              SchemaParsingErrors.domainValidationFailed(rule.name, domainValidator.getValidationError())
            );
          }
          break;
        case 'regex':
          // does the regex generation work?
          regexValidator.validate(rule);
          if (!regexValidator.isValid()) {
            this.errors.push(SchemaParsingErrors.regexValidationFailed(rule.name, regexValidator.getValidationError()));
          }
          break;
        case 'literal':
          // literals always work
          break;
        case 'enum':
          // validate enum values
          enumValidator.validate(rule);
          if (!enumValidator.isValid()) {
            this.errors.push(SchemaParsingErrors.enumValidationFailed(rule.name, enumValidator.getValidationError()));
          }
          break;
        default:
          this.errors.push(SchemaParsingErrors.unknownRuleType(rule.name));
      }
    });
  }

  isEnumPattern(ruleSpec) {
    return EnumParser.isEnumRuleSpec(ruleSpec);
  }

  isLiteralPattern(ruleSpec) {
    const spec = String(ruleSpec || '').trim();
    return /^(literal|datatype\.literal|awd\.datatype\.literal)\s*\(/i.test(spec);
  }

  isDomainHelpersPattern(ruleSpec) {
    const spec = String(ruleSpec || '').trim();
    return spec.startsWith('awd.domain.helpers.') || spec.startsWith('domain.helpers.');
  }

  isRegexPattern(ruleSpec) {
    const spec = String(ruleSpec || '').trim();
    return /^(regex|datatype\.regex|awd\.datatype\.regex)\s*\(/i.test(spec);
  }

  extractLiteralValue(ruleSpec) {
    const spec = String(ruleSpec || '').trim();
    const match = spec.match(/^(?:literal|datatype\.literal|awd\.datatype\.literal)\s*\(([\s\S]*)\)\s*$/i);
    if (!match) {
      return spec;
    }
    const unwrapped = match[1];
    if (unwrapped === '""' || unwrapped === "''") {
      return '';
    }
    return unwrapped;
  }

  extractRegexValue(ruleSpec) {
    const spec = String(ruleSpec || '').trim();
    const match = spec.match(/^(?:regex|datatype\.regex|awd\.datatype\.regex)\s*\(([\s\S]*)\)\s*$/i);
    if (!match) {
      return spec;
    }
    const unwrapped = match[1];
    if (unwrapped === '""' || unwrapped === "''") {
      return '';
    }
    return unwrapped;
  }

  isValid() {
    return this.errors.length == 0;
  }

  compilationReport() {
    return this.compilationReportLines.join('\n');
  }

  validationErrors() {
    return this.errors.join('\n');
  }
}
