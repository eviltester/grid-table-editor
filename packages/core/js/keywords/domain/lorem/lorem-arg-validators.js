import { composeArgsValidators, createOrderedArgsValidator } from '../../../domain/domain-keyword-arg-validators.js';
import { createPositiveIntegerArgsValidator } from '../shared/common-arg-validators.js';

function createMixedLoremCountSchemeValidator({ countName, minName, maxName }) {
  return (_args = [], context = {}) => {
    const argsByName = context?.argsByName || {};
    const hasGenericRange = typeof argsByName.min !== 'undefined' || typeof argsByName.max !== 'undefined';
    const hasSpecificCount = typeof argsByName[countName] !== 'undefined';
    const hasSpecificRange = typeof argsByName[minName] !== 'undefined' || typeof argsByName[maxName] !== 'undefined';
    const usedSchemeCount = [hasGenericRange, hasSpecificCount, hasSpecificRange].filter(Boolean).length;

    if (usedSchemeCount <= 1) {
      return { ok: true };
    }

    return {
      ok: false,
      error: `Invalid keyword arguments: use only one lorem count scheme: min/max, ${countName}, or ${minName}/${maxName}`,
    };
  };
}

function createLoremCountArgsValidator({ countName, minName, maxName }) {
  return composeArgsValidators(
    createPositiveIntegerArgsValidator(['min', 'max', countName, minName, maxName]),
    createMixedLoremCountSchemeValidator({ countName, minName, maxName }),
    createOrderedArgsValidator({ lowerName: 'min', upperName: 'max' }),
    createOrderedArgsValidator({ lowerName: minName, upperName: maxName })
  );
}

export { createLoremCountArgsValidator };
