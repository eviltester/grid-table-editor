import { resolveExportTextEncodingSettings } from '@anywaydata/core';
import { resolveWindowObj } from './dom/default-objects.js';

function detectBrowserPlatform({ documentObj, windowObj } = {}) {
  const resolvedWindowObj = resolveWindowObj(windowObj, documentObj);
  const navigatorObj = resolvedWindowObj?.navigator || globalThis.navigator;
  return navigatorObj?.userAgentData?.platform || navigatorObj?.platform || navigatorObj?.userAgent || '';
}

function resolveDefaultBrowserExportEncodingSettings({ documentObj, windowObj } = {}) {
  return resolveExportTextEncodingSettings({}, { platform: detectBrowserPlatform({ documentObj, windowObj }) });
}

export { detectBrowserPlatform, resolveDefaultBrowserExportEncodingSettings };
