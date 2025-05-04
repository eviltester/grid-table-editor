import {RulesParser} from "./rulesParser.js";
import {RulesBasedDataGenerator} from "./rulesBasedDataGenerator.js"
import {TestDataRulesCompiler} from "./testDataRulesCompiler.js";

/*
    This is the main entry point for data generation.

    Used by the CLI and the Web.

    Given a specification of data via importSpec, the data would
    then be compiled and could then generate.
*/
export class TestDataGenerator{

    constructor(aFaker, aRandExp){
        this.faker = aFaker;
        this.RandExp = aRandExp;
        this.rulesParser = new RulesParser(aFaker, aRandExp);
        this.generator = new RulesBasedDataGenerator(aFaker, aRandExp);
        this.compiler = new TestDataRulesCompiler(aFaker, aRandExp);
    }

    importSpec(textContent){
        this.rulesParser.parseText(textContent);
    }

    compile(){
        // validate and assign rules
        this.compiler.compile(this.rulesParser.testDataRules.rules);
        this.compiler.validate();
    }

    compilationReport(){
        return this.compiler.compilationReport();
    }

    testDataRules(){
        return this.rulesParser.testDataRules.rules;
    }

    isValid(){
        return this.errors().length === 0;
    }

    errors(){
        return this.rulesParser.errors.concat(this.compiler.errors);
    }

    generate(thisMany){
        return this.generator.generateFromRules(thisMany, this.rulesParser.testDataRules.rules);
    }
}