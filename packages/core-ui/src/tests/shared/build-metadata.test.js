import {
  FALLBACK_BUILD_VERSION,
  formatUtcBuildVersion,
  getBuildMetadata,
  normaliseBuildVersion,
  resolveBuildVersion,
} from '../../../js/build-metadata/build-metadata.js';

describe('build metadata', () => {
  test('formats UTC build versions with zero-padded fields', () => {
    expect(formatUtcBuildVersion(new Date('2026-05-19T01:02:00Z'))).toBe('v20260519.0102');
    expect(formatUtcBuildVersion(new Date('2026-01-02T03:04:59Z'))).toBe('v20260102.0304');
  });

  test('normalises only supported build version values', () => {
    expect(normaliseBuildVersion(' v20260519.0102 ')).toBe('v20260519.0102');
    expect(normaliseBuildVersion('20260519.0102')).toBe('');
    expect(normaliseBuildVersion('v20260519.001')).toBe('');
    expect(normaliseBuildVersion('not-a-version')).toBe('');
  });

  test('resolves configured build versions before generating from date', () => {
    expect(
      resolveBuildVersion({
        configuredVersion: 'v20261224.2359',
        date: new Date('2026-05-19T01:02:00Z'),
      })
    ).toBe('v20261224.2359');
    expect(
      resolveBuildVersion({
        configuredVersion: 'bad',
        date: new Date('2026-05-19T01:02:00Z'),
      })
    ).toBe('v20260519.0102');
  });

  test('reads injected build metadata and falls back for non-bundled execution', () => {
    expect(getBuildMetadata({ globalObj: { __ANYWAYDATA_BUILD_VERSION__: 'v20260519.0102' } })).toEqual({
      version: 'v20260519.0102',
    });
    expect(getBuildMetadata({ globalObj: { __ANYWAYDATA_BUILD_VERSION__: 'bad' } })).toEqual({
      version: FALLBACK_BUILD_VERSION,
    });
  });
});
