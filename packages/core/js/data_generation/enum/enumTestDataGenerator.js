import { dataResponse, errorResponse } from '../ruleResponse.js';
import { EnumParser } from '../utils/enumParser.js';

export class EnumTestDataGenerator {
  constructor() {}

  generateFrom(aRule) {
    try {
      const ruleSpec = String(aRule.ruleSpec || '');
      const enumValues = EnumParser.extractEnumValues(ruleSpec);

      // Randomly select one of the enum values
      const randomIndex = Math.floor(Math.random() * enumValues.length);
      return dataResponse(enumValues[randomIndex]);
    } catch (e) {
      return errorResponse('Enum Generation Error: ' + e.message);
    }
  }
}
