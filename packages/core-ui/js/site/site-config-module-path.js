import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_SITE_CONFIG_MODULE_PATH = path.resolve(__dirname, 'site-config.production.js');

function resolveSiteConfigModulePath(env = process.env) {
  const overridePath = String(env?.ANYWAYDATA_SITE_CONFIG_OVERRIDE_PATH || '').trim();
  return overridePath ? path.resolve(overridePath) : DEFAULT_SITE_CONFIG_MODULE_PATH;
}

export { DEFAULT_SITE_CONFIG_MODULE_PATH, resolveSiteConfigModulePath };
