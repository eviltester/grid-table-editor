import { FakerTestDataRuleValidator } from './faker/fakerTestDataRuleValidator.js';
import { RegexTestDataRuleValidator } from './regex/regexTestDataRuleValidator.js';
import { EnumTestDataRuleValidator } from './enum/enumTestDataRuleValidator.js';

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

    const validTypes = ['regex', 'faker', 'literal', 'enum'];

    this.rules.forEach((rule) => {
      if (rule.type == '') {
        // unassigned a type, try and generate one
        this.compilationReportLines.push(`Identifying type for ${rule.name}`);

        // Check for enum patterns first
        if (this.isEnumPattern(rule.ruleSpec)) {
          enumValidator.validate(rule);
          if (enumValidator.isValid()) {
            this.compilationReportLines.push(`${rule.name} is a valid 'enum': ${rule.ruleSpec}`);
            rule.type = 'enum';
          } else {
            this.compilationReportLines.push(
              `${rule.name} is not a valid 'enum': ${enumValidator.getValidationError()}`
            );
            rule.type = 'literal';
          }
        } else {
          // is it a faker function?
          fakerValidator.validate(rule);
          if (fakerValidator.isValid()) {
            this.compilationReportLines.push(`${rule.name} is a valid 'faker': ${rule.ruleSpec}`);
            rule.type = 'faker';
          } else {
            this.compilationReportLines.push(`${rule.name} is not a 'faker': ${fakerValidator.getValidationError()}`);
            // does the regex generation work?
            regexValidator.validate(rule);
            if (regexValidator.isValid()) {
              this.compilationReportLines.push(`${rule.name} is a valid 'regex': ${rule.ruleSpec}`);
              rule.type = 'regex';
            } else {
              this.compilationReportLines.push(`${rule.name} is not a 'regex': ${regexValidator.getValidationError()}`);
              this.errors.push(`Evaluating _${rule.name}_ as 'literal'`);
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

    this.rules.forEach((rule) => {
      switch (rule.type) {
        case 'faker':
          // is it a faker function?
          fakerValidator.validate(rule);
          if (!fakerValidator.isValid()) {
            this.errors.push(`ERROR: ${rule.name} failed faker validation - ${fakerValidator.getValidationError()}`);
          }
          break;
        case 'regex':
          // does the regex generation work?
          regexValidator.validate(rule);
          if (!regexValidator.isValid()) {
            this.errors.push(`ERROR: ${rule.name} failed Regex validation - ${regexValidator.getValidationError()}`);
          }
          break;
        case 'literal':
          // literals always work
          break;
        case 'enum':
          // validate enum values
          enumValidator.validate(rule);
          if (!enumValidator.isValid()) {
            this.errors.push(`ERROR: ${rule.name} failed enum validation - ${enumValidator.getValidationError()}`);
          }
          break;
        default:
          this.errors.push(`ERROR: ${rule.name} has no defined type`);
      }
    });
  }

  isEnumPattern(ruleSpec) {
    const spec = String(ruleSpec || '').trim();

    // Check for awd enum formats: enum(), datatype.enum(), awd.datatype.enum()
    if (spec.match(/^(enum|datatype\.enum|awd\.datatype\.enum)\s*\(/)) {
      return true;
    }

    // Check for simple comma-separated values that look like enums
    if (spec.includes(',')) {
      const values = spec.split(',').map((v) => v.trim());
      // Must have at least 2 values
      if (values.length >= 2) {
        // Values should be reasonably short (not code/expressions)
        if (values.every((v) => v.length > 0 && v.length <= 50)) {
          // Values shouldn't look like regex/function syntax.
          // Dotted literals such as versions (1.0) or domains (example.com) are valid,
          // but faker-like dotted member paths (e.g. person.firstName) should not be enums.
          if (!values.some((v) => /[\[\]{}()^$*+?|\\]/.test(v) || (v.includes('.') && /[A-Z]/.test(v)))) {
            return true;
          }
        }
      }
    }

    return false;
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
