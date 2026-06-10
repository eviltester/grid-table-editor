function createImportTrimState(props = {}) {
  return {
    trimInput: props.trimInput === true,
    trimInputFieldsEnabled: props.trimInputFieldsEnabled === true,
    trimInputFieldsCsv: props.trimInputFieldsCsv || '',
  };
}

function applyImportTrimProps(state, nextProps = {}) {
  if (Object.prototype.hasOwnProperty.call(nextProps, 'trimInput')) {
    state.trimInput = nextProps.trimInput === true;
  }
  if (Object.prototype.hasOwnProperty.call(nextProps, 'trimInputFieldsEnabled')) {
    state.trimInputFieldsEnabled = nextProps.trimInputFieldsEnabled === true;
  }
  if (Object.prototype.hasOwnProperty.call(nextProps, 'trimInputFieldsCsv')) {
    state.trimInputFieldsCsv = nextProps.trimInputFieldsCsv || '';
  }
}

export { applyImportTrimProps, createImportTrimState };
