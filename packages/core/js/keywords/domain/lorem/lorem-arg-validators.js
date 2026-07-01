import { composeArgsValidators, createOrderedArgsValidator } from '../../../domain/domain-keyword-arg-validators.js';
import { createPositiveIntegerArgsValidator } from '../shared/common-arg-validators.js';

function createLoremCountArgsValidator({ countName, minName, maxName }) {
  return composeArgsValidators(
    createPositiveIntegerArgsValidator(['min', 'max', countName, minName, maxName]),
    createOrderedArgsValidator({ lowerName: 'min', upperName: 'max' }),
    createOrderedArgsValidator({ lowerName: minName, upperName: maxName })
  );
}

export { createLoremCountArgsValidator };
