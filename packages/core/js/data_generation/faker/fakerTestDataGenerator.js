import { FakerCommand } from './fakerCommand.js';

export class FakerTestDataGenerator {
  constructor(aFaker, options = {}) {
    this.faker = aFaker;
    this.options = options;
  }

  generateFrom(aRule) {
    const fakerCommand = new FakerCommand(aRule.ruleSpec, this.options);
    fakerCommand.parse();
    fakerCommand.compile(this.faker);
    return fakerCommand.execute(this.faker);
  }
}
