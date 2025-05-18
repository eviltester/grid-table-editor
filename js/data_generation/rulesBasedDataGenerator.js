import {FakerTestDataGenerator} from "./faker/fakerTestDataGenerator.js";
import {RegexTestDataGenerator} from "./regex/regexTestDataGenerator.js";
import { LiteralTestDataGenerator } from "./literal/literalTestDataGenerator.js";
import { dataResponse } from "./ruleResponse.js";

export class RulesBasedDataGenerator{

    constructor(aFaker, RandExp){
        this.faker = aFaker;
        this.RandExp = RandExp;
    }

    generateFromRules(thisMany, fromRules){
        
        // given some rules
        // generate thisMany instances
        // data is row of values where the first row is the headers
        const data = [];
    
        const headers = fromRules.map((rule) => rule.name);
        data.push(headers);
    
        const fakerGenerator = new FakerTestDataGenerator(this.faker);
        const regexGenerator = new RegexTestDataGenerator(this.RandExp);
        const literalGenerator = new LiteralTestDataGenerator();
        const defaultGenerator = new DefaultTestDataGenerator();
    
        for(var row=0; row<thisMany; row++){
    
            const aRow = fromRules.map((rule) => {
    
                var dataGen = "";
                var generator;
                var value;
    
                switch (rule.type) {
                    case "faker": // is faker?
                        generator = fakerGenerator;
                        break;
    
                    case "regex":
                        generator  = regexGenerator;
                        break;
    
                    case "literal":
                        generator = literalGenerator;
                        break;
    
                    default:
                        console.warn(`${rule.name} has Unidentified rule type ${rule.type} with spec ${rule.ruleSpec}`);
                        generator = defaultGenerator;
                }

                value = generator.generateFrom(rule);

                if(value.isError){
                    dataGen = "**ERROR**";
                }else{
                    dataGen = value.data;
                }
    
                return dataGen;
            });
    
            data.push(aRow);
    
        }
    
        return data;
    }
}

class DefaultTestDataGenerator{

    constructor(){
    }

    generateFrom(aRule){
        return dataResponse(aRule.ruleSpec);
    }
}