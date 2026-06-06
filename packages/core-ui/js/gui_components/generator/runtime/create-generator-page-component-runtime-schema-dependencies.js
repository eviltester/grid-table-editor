function createGeneratorPageComponentRuntimeSchemaDependencies({ runtime } = {}) {
  return {
    schemaTextToDataRules: runtime.schemaTextToDataRules,
    dataRulesToSchemaText: runtime.dataRulesToSchemaText,
    faker: runtime.faker,
    RandExp: runtime.RandExp,
    generatorSchemaDefinitionSupport: runtime.generatorSchemaDefinitionSupport,
    fakerCommands: runtime.fakerCommands,
    sampleSchemaText: runtime.sampleSchemaText,
  };
}

export { createGeneratorPageComponentRuntimeSchemaDependencies };
