import { parseNonNegativeCount } from '../test-data/generation/index.js';

function normalizeProps(props = {}) {
  const min = Number.isFinite(Number.parseInt(props.min, 10)) ? Number.parseInt(props.min, 10) : 0;
  const max = Number.isFinite(Number.parseInt(props.max, 10)) ? Number.parseInt(props.max, 10) : null;
  const step = Number.isFinite(Number.parseInt(props.step, 10)) ? Number.parseInt(props.step, 10) : 1;
  const initialValue = props.value ?? min;

  return {
    inputId: typeof props.inputId === 'string' ? props.inputId : '',
    label: props.label || 'Rows',
    min,
    max,
    step,
    value: initialValue,
    disabled: props.disabled === true,
    normalizeOnInput: props.normalizeOnInput === true,
    clampToMaxOnInput: props.clampToMaxOnInput === true,
    className: props.className || 'row-count-control',
    inputClassName: props.inputClassName || '',
    inputAriaLabel: props.inputAriaLabel || '',
    labelClassName: props.labelClassName || '',
  };
}

function resolveFieldName({ inputId, inputAriaLabel, label }) {
  return inputId || inputAriaLabel || label || 'rowCount';
}

function createErrorMessage({ fieldName, min, max, rawValue }) {
  const rawParsed = Number.parseInt(rawValue, 10);
  if (!Number.isFinite(rawParsed)) {
    return `${fieldName} must be a number greater than or equal to ${min}.`;
  }
  if (Number.isFinite(max) && rawParsed > max) {
    return `${fieldName} must be less than or equal to ${max}.`;
  }
  if (rawParsed < min) {
    return `${fieldName} must be a number greater than or equal to ${min}.`;
  }
  return '';
}

class RowCountControlController {
  constructor({ props = {}, callbacks = {} } = {}) {
    this.callbacks = callbacks;
    this.props = normalizeProps(props);
    this.state = {
      ...this.props,
      inputValue: `${this.props.value}`,
    };
  }

  getState() {
    return { ...this.state };
  }

  updateProps(nextProps = {}) {
    this.props = normalizeProps({ ...this.props, ...nextProps });
    const nextValue = Object.prototype.hasOwnProperty.call(nextProps, 'value')
      ? this.props.value
      : this.state.inputValue;
    this.state = {
      ...this.props,
      inputValue: `${nextValue}`,
    };
  }

  handleInput(rawValue) {
    const rawParsed = Number.parseInt(rawValue, 10);
    const nextState = { ...this.state };

    if (nextState.normalizeOnInput) {
      const parsed = parseNonNegativeCount(rawValue, {
        min: nextState.min,
        max: nextState.clampToMaxOnInput ? nextState.max : null,
      });
      if (!parsed.valid || rawParsed < nextState.min) {
        nextState.inputValue = `${parsed.value}`;
      } else if (
        nextState.clampToMaxOnInput &&
        Number.isFinite(nextState.max) &&
        Number.isFinite(rawParsed) &&
        rawParsed > nextState.max
      ) {
        nextState.inputValue = `${parsed.value}`;
      } else {
        nextState.inputValue = `${rawValue ?? ''}`;
      }
    } else {
      nextState.inputValue = `${rawValue ?? ''}`;
    }

    this.state = nextState;
    this.callbacks.onChange?.({
      rawValue: `${rawValue ?? ''}`,
      parsed: this.getParsedValue(),
      state: this.getState(),
    });
    return this.getState();
  }

  parseValue(rawValue = this.state.inputValue) {
    const { inputId, inputAriaLabel, label, min, max } = this.state;
    const parsed = parseNonNegativeCount(rawValue, { min, max });
    const message = createErrorMessage({
      fieldName: resolveFieldName({ inputId, inputAriaLabel, label }),
      min,
      max,
      rawValue,
    });

    return {
      value: parsed.value,
      valid: message.length === 0,
      errors: message ? [message] : [],
    };
  }

  getParsedValue() {
    return this.parseValue(this.state.inputValue);
  }
}

export { RowCountControlController };
