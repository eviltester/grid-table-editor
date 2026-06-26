const BUILD_VERSION_PATTERN = /^v\d{8}\.\d{4}$/;
const FALLBACK_BUILD_VERSION = 'v00000000.0000';

function pad2(value) {
  return String(value).padStart(2, '0');
}

function formatUtcBuildVersion(date = new Date()) {
  const dateObj = date instanceof Date ? date : new Date(date);
  if (!Number.isFinite(dateObj.getTime())) {
    return FALLBACK_BUILD_VERSION;
  }

  const year = dateObj.getUTCFullYear();
  const month = pad2(dateObj.getUTCMonth() + 1);
  const day = pad2(dateObj.getUTCDate());
  const hour = pad2(dateObj.getUTCHours());
  const minute = pad2(dateObj.getUTCMinutes());

  return `v${year}${month}${day}.${hour}${minute}`;
}

function normaliseBuildVersion(value) {
  const version = String(value || '').trim();
  return BUILD_VERSION_PATTERN.test(version) ? version : '';
}

function resolveBuildVersion({ configuredVersion = '', date = new Date() } = {}) {
  return normaliseBuildVersion(configuredVersion) || formatUtcBuildVersion(date);
}

function readInjectedBuildVersion(globalObj = globalThis) {
  if (globalObj === globalThis) {
    return normaliseBuildVersion(globalThis.__ANYWAYDATA_BUILD_VERSION__);
  }
  return normaliseBuildVersion(globalObj?.__ANYWAYDATA_BUILD_VERSION__);
}

function getBuildMetadata({ globalObj = globalThis } = {}) {
  return {
    version: readInjectedBuildVersion(globalObj) || FALLBACK_BUILD_VERSION,
  };
}

export {
  BUILD_VERSION_PATTERN,
  FALLBACK_BUILD_VERSION,
  formatUtcBuildVersion,
  getBuildMetadata,
  normaliseBuildVersion,
  resolveBuildVersion,
};
