function createOrderedArgsValidator({ lowerName, upperName }) {
  return (_args = [], context = {}) => {
    const argsByName = context?.argsByName || {};
    const lowerValue = argsByName[lowerName];
    const upperValue = argsByName[upperName];

    if (typeof lowerValue === 'undefined' || typeof upperValue === 'undefined') {
      return { ok: true };
    }

    if (lowerValue > upperValue) {
      return {
        ok: false,
        error: `Invalid keyword arguments: argument "${lowerName}" must be less than or equal to argument "${upperName}"`,
      };
    }

    return { ok: true };
  };
}

export { createOrderedArgsValidator };
