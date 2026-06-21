const ALL_HTTP_METHODS = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'TRACE', 'CONNECT'];
const COMMON_HTTP_METHODS = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'];
const INTERNET_HTTP_METHOD_RETURN_TYPE = ALL_HTTP_METHODS.join('|');

function normalizeHttpMethodToken(value) {
  return String(value ?? '')
    .trim()
    .toUpperCase();
}

function parseExcludedHttpMethodsCsv(excludesValue = '') {
  return String(excludesValue ?? '')
    .split(',')
    .map((value) => normalizeHttpMethodToken(value))
    .filter((value) => value.length > 0);
}

function getInternetHttpMethodPool({ commonOnly = false, excludes = '' } = {}) {
  const baseMethods = commonOnly === true ? COMMON_HTTP_METHODS : ALL_HTTP_METHODS;
  const excludedMethods = new Set(parseExcludedHttpMethodsCsv(excludes));

  return baseMethods.filter((method) => !excludedMethods.has(method));
}

function selectRandomHttpMethod(methods, executionContext = {}) {
  if (executionContext?.faker?.helpers?.arrayElement) {
    return executionContext.faker.helpers.arrayElement(methods);
  }

  const index = Math.floor(Math.random() * methods.length);
  return methods[index];
}

function executeCustomInternetHttpMethod(executionContext = {}) {
  const args = Array.isArray(executionContext.args) ? executionContext.args : [];
  const commonOnly = args[0] === true;
  const excludes = typeof args[1] === 'undefined' ? '' : args[1];
  const availableMethods = getInternetHttpMethodPool({ commonOnly, excludes });

  if (availableMethods.length === 0) {
    throw new Error('Invalid argument for excludes: no HTTP methods remain after exclusions.');
  }

  return selectRandomHttpMethod(availableMethods, executionContext);
}

export {
  ALL_HTTP_METHODS,
  COMMON_HTTP_METHODS,
  INTERNET_HTTP_METHOD_RETURN_TYPE,
  executeCustomInternetHttpMethod,
  getInternetHttpMethodPool,
  normalizeHttpMethodToken,
  parseExcludedHttpMethodsCsv,
};
