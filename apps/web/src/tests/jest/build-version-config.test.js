import storybookConfig, { resolveStorybookBuildVersion } from '../../../../../.storybook/main.js';
import webViteConfig, { resolveWebBuildVersion } from '../../../vite.config.mjs';

describe('build version config', () => {
  test('web vite config uses override values or UTC build-time values', () => {
    expect(
      resolveWebBuildVersion({ ANYWAYDATA_BUILD_VERSION: 'v20261224.2359' }, new Date('2026-05-19T01:02:00Z'))
    ).toBe('v20261224.2359');
    expect(resolveWebBuildVersion({}, new Date('2026-05-19T01:02:00Z'))).toBe('v20260519.0102');
  });

  test('web vite config injects the build version into global metadata', async () => {
    const originalBuildVersion = process.env.ANYWAYDATA_BUILD_VERSION;

    try {
      process.env.ANYWAYDATA_BUILD_VERSION = 'v20261224.2359';
      const config = await webViteConfig();

      expect(config.define['globalThis.__ANYWAYDATA_BUILD_VERSION__']).toBe('"v20261224.2359"');
    } finally {
      if (originalBuildVersion === undefined) {
        delete process.env.ANYWAYDATA_BUILD_VERSION;
      } else {
        process.env.ANYWAYDATA_BUILD_VERSION = originalBuildVersion;
      }
    }
  });

  test('storybook config uses the same build version injection shape', async () => {
    const originalBuildVersion = process.env.ANYWAYDATA_BUILD_VERSION;

    try {
      process.env.ANYWAYDATA_BUILD_VERSION = 'v20261224.2359';

      expect(resolveStorybookBuildVersion(process.env, new Date('2026-05-19T01:02:00Z'))).toBe('v20261224.2359');
      const viteConfig = await storybookConfig.viteFinal({});

      expect(viteConfig.define['globalThis.__ANYWAYDATA_BUILD_VERSION__']).toBe('"v20261224.2359"');
    } finally {
      if (originalBuildVersion === undefined) {
        delete process.env.ANYWAYDATA_BUILD_VERSION;
      } else {
        process.env.ANYWAYDATA_BUILD_VERSION = originalBuildVersion;
      }
    }
  });
});
