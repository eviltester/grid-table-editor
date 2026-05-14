export class CoreGenerationErrors {
  static invalidTextSpecRequired() {
    return {
      code: 'invalid_text_spec',
      message: 'textSpec is required and must be a non-empty string.',
    };
  }

  static invalidRowCountRequired() {
    return {
      code: 'invalid_row_count',
      message: 'rowCount is required and must be an integer greater than or equal to zero.',
    };
  }

  static invalidOutputFormat(supportedFormats) {
    return {
      code: 'invalid_output_format',
      message: `outputFormat must be one of: ${supportedFormats.join(', ')}`,
    };
  }

  static pairwiseInitializationFailed(message) {
    return {
      code: 'pairwise_initialization_error',
      message: message || 'Failed to initialize pairwise generation.',
    };
  }

  static pairwiseGenerationFailed(message) {
    return {
      code: 'pairwise_generation_error',
      message: message || 'Failed to generate pairwise rows.',
    };
  }

  static invalidInputDataRequired() {
    return {
      code: 'invalid_input_data',
      message: 'inputData is required and must be a non-empty string.',
    };
  }

  static invalidInputFormatRequired() {
    return {
      code: 'invalid_input_format',
      message: 'inputFormat is required and must be a non-empty string.',
    };
  }

  static invalidInputFormatSupported(supportedFormats) {
    return {
      code: 'invalid_input_format',
      message: `inputFormat must be one of: ${supportedFormats.join(', ')}`,
    };
  }

  static inputParseError(format) {
    return {
      code: 'input_parse_error',
      message: `Unable to parse inputData using inputFormat "${format}".`,
    };
  }

  static invalidAmendRowCount() {
    return {
      code: 'invalid_row_count',
      message: 'rowCount must be an integer greater than or equal to zero when provided.',
    };
  }

  static rowCountExceedsImported(importedRowCount) {
    return {
      code: 'invalid_row_count',
      message: `rowCount must be less than or equal to imported row count (${importedRowCount}).`,
    };
  }
}
