import { dataResponse, errorResponse } from '../ruleResponse.js';
import { EnumParser } from '../utils/enumParser.js';

export class EnumTestDataGenerator {
  constructor() {}

  generateFrom(aRule) {
    try {
      const ruleSpec = String(aRule.ruleSpec || '');
      let enumValues;

      // Handle different enum formats
      if (EnumParser.isAwdEnumFormat(ruleSpec)) {
        enumValues = EnumParser.extractAwdEnumValues(ruleSpec);
      } else {
        // Simple comma-separated format
        enumValues = ruleSpec.split(',').map((v) => v.trim());
      }

      // Randomly select one of the enum values
      const randomIndex = Math.floor(Math.random() * enumValues.length);
      return dataResponse(enumValues[randomIndex]);
    } catch (e) {
      return errorResponse('Enum Generation Error: ' + e.message);
    }
  }
}
