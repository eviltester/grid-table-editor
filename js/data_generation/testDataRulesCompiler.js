import {FakerTestDataRuleValidator} from "./faker/fakerTestDataRuleValidator.js";

/*
    'Compilation' of rules is where we try to identify if the rules are
    faker or regex.

    If the rules are predefined as a type then we validate the type
    during compilation.
*/
export class TestDataRulesCompiler{

    constructor(aFaker, aRandExp) {
        this.faker = aFaker;
        this.RandExp = aRandExp;

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
    compile(theRules){

        this.rules = theRules;
        this.compilationReportLines = [];
        this.errors = [];

        const fakerValidator = new FakerTestDataRuleValidator(this.faker)

        const validTypes = ["regex","faker","literal"];

        this.rules.forEach((rule)=>{

            if(rule.type == ""){
                // unassigned a type, try and generate one
                this.compilationReportLines.push(`Identifying type for ${rule.name}`);

                // is it a faker function?
                fakerValidator.validate(rule);
                if(fakerValidator.isValid()){
                    this.compilationReportLines.push(`${rule.name} is a valid 'faker': ${rule.ruleSpec}`);
                    rule.type="faker";
                }else{
                    this.compilationReportLines.push(`${rule.name} is not a 'faker': ${fakerValidator.getValidationError()}`);
                    // does the regex generation work?
                    try{
                        new this.RandExp(rule.ruleSpec).gen();
                        rule.type="regex";
                        this.compilationReportLines.push(`${rule.name} is a valid 'regex': ${rule.ruleSpec}`);
                    }catch(err){
                        this.compilationReportLines.push(`${rule.name} is not a 'regex': ${err}`);
                        this.errors.push(`Evaluating _${rule.name}_ as 'literal'`);
                        rule.type="literal";
                    }
                }
            }else{
                if(!validTypes.contains(rule.type)){
                    this.compilationReportLines.push(`Warning: Unrecognised Type for '${rule.name}' - '${rule.type}' converting to 'literal'`);
                    rule.type="literal";
                }else{
                    this.compilationReportLines.push(`Type for '${rule.name}' declared as '${rule.type}'`);
                }
            }
        });
    }

    /*
        Validate assumes that every rule has been compiled and validates each rule against type.
    */
    validate(){

        this.errors = [];

        const fakerValidator = new FakerTestDataRuleValidator(this.faker)

        this.rules.forEach((rule)=>{
            switch (rule.type) {
                case "faker":
            // is it a faker function?
                    fakerValidator.validate(rule);
                    if(!fakerValidator.isValid()){
                        this.errors.push(`ERROR: ${rule.name} failed faker validation - ${fakerValidator.getValidationError()}`)
                    }
                    break;
                case "regex":
                    // does the regex generation work?
                    try{
                        new this.RandExp(rule.ruleSpec).gen();
                    }catch(err){
                        this.errors.push(`ERROR: ${rule.name} failed Regex validation - ${err}`);
                    }
                case "literal":
                    // literals always work
                    break;
                default:
                    this.errors.push(`ERROR: ${rule.name} has no defined type`);
            }
        });
    }

    isValid(){
        return this.errors.length == 0;
    }

    compilationReport(){
        return this.compilationReportLines.join("\n");
    }

    validationErrors(){
        return this.errors.join("\n");
    }
}