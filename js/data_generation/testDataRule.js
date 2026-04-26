class TestDataRule {
  constructor(aName, aRule = '') {
    this.name = aName;
    this.ruleSpec = aRule;
    // we don't know what the command is until we compile it
    this.fakerCommand = '';
    this.type = ''; // by default no type,
    // can be assigned 'regex' or 'faker' or 'literal'
    // in future more types can be created
  }
}

export { TestDataRule };
