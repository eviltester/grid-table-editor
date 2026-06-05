import { createSchemaRowValidation } from '../../shared/test-data/schema/index.js';
import { SOURCE_TYPE_REGEX } from '../../shared/schema-row-rule-mapper.js';

function createGeneratorSchemaRowFactory({ createRowId } = {}) {
  let rowIdCounter = 1;
  const resolveNextRowId = () => {
    if (typeof createRowId === 'function') {
      return createRowId();
    }
    return `schema-row-${rowIdCounter++}`;
  };

  return function createBlankSchemaRow() {
    return {
      id: resolveNextRowId(),
      name: '',
      sourceType: SOURCE_TYPE_REGEX,
      command: '',
      params: '',
      value: '',
      comments: '',
      validation: createSchemaRowValidation(),
    };
  };
}

export { createGeneratorSchemaRowFactory };
