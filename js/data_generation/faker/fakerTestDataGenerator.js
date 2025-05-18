import { FakerCommand } from "./fakerCommand.js";

export class FakerTestDataGenerator{

    constructor(aFaker){
        this.faker = aFaker;
    }

    
    generateFrom(aRule){

        const fakerCommand = new FakerCommand(aRule.ruleSpec);
        fakerCommand.parse();
        fakerCommand.compile(this.faker);
        return fakerCommand.execute(this.faker);

    }
}