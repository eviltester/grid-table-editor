import { FakerCommand } from "./fakerCommand.js";

export class FakerTestDataGenerator{

    constructor(aFaker){
        this.faker = aFaker;
    }

    
/*
    Support for much of the faker APi

    http://marak.github.io/faker.js/
    https://github.com/Marak/faker.js

    e.g.

    faker.name.firstName
    faker.helpers.fake("{{name.lastName}}, {{name.firstName}}")
    faker.lorem.paragraph

    returns a result object that also says if an error happened
 */

    generateFrom(aRule){

        const fakerCommand = new FakerCommand(aRule.ruleSpec);
        fakerCommand.parse();
        fakerCommand.compile(this.faker);
        return fakerCommand.execute(this.faker);

    }
}