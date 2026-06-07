function createGeneratorUnavailableRowCountResult(fieldLabel) {
  return {
    value: 0,
    valid: false,
    errors: [`${fieldLabel} must be a number greater than or equal to 0.`],
  };
}

export { createGeneratorUnavailableRowCountResult };
