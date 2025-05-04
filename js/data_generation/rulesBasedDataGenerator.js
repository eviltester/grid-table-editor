import {FakerTestDataGenerator} from "./faker/fakerTestDataGenerator.js";

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
    
        for(var row=0; row<thisMany; row++){
    
            const aRow = fromRules.map((rule) => {
    
                var dataGen = "";
    
                switch (rule.type) {
                    case "faker": // is faker?
                        const value = fakerGenerator.generateFrom(rule)
                        dataGen = value.data ? value.data : "**ERROR**";
                        break;
    
                    case "regex":
                        dataGen = new this.RandExp(rule.ruleSpec).gen();
                        break;
    
                    case "literal":
                        dataGen = rule.ruleSpec;
                        break;
    
                    default:
                        console.warn(`${rule.name} has Unidentified rule type ${rule.type} with spec ${rule.ruleSpec}`);
                        dataGen = rule.ruleSpec;
                }
    
                return dataGen;
            });
    
            data.push(aRow);
    
        }
    
        return data;
    }
}