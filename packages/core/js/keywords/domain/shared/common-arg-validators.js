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

const WORD_SELECTION_STRATEGY_TYPE = 'fail|closest|shortest|longest|any-length';

function createWordSelectionArgsValidator() {
  return createPositiveIntegerArgsValidator(['length']);
}

export { createPositiveIntegerArgsValidator, createWordSelectionArgsValidator, WORD_SELECTION_STRATEGY_TYPE };
