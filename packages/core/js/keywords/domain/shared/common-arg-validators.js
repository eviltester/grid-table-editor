import {
  composeArgsValidators,
  createIntegerArgValidator,
  createNumericArgRangeValidator,
} from '../../../domain/domain-keyword-arg-validators.js';

function createPositiveIntegerArgsValidator(argNames = []) {
  return composeArgsValidators(
    ...argNames.flatMap((argName) => [
      createIntegerArgValidator({ argName }),
      createNumericArgRangeValidator({ argName, min: 0, inclusiveMin: false }),
    ])
  );
}

export { createPositiveIntegerArgsValidator };
