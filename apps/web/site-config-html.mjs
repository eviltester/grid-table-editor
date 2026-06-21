const SITE_LINK_PLACEHOLDERS = Object.freeze({
  landing: '%ANYWAYDATA_HOME_HREF%',
  app: '%ANYWAYDATA_APP_HREF%',
  generator: '%ANYWAYDATA_GENERATOR_HREF%',
  combinatorial: '%ANYWAYDATA_COMBINATORIAL_HREF%',
  webmcp: '%ANYWAYDATA_WEBMCP_HREF%',
  writerSchema: '%ANYWAYDATA_WRITER_SCHEMA_HREF%',
  docsIntro: '%ANYWAYDATA_DOCS_INTRO_HREF%',
  blog: '%ANYWAYDATA_BLOG_HREF%',
});

function createSiteLinkPlaceholderMap(siteConfig) {
  return Object.freeze({
    [SITE_LINK_PLACEHOLDERS.landing]: siteConfig?.rootedSiteHrefs?.landing || '/',
    [SITE_LINK_PLACEHOLDERS.app]: siteConfig?.rootedSiteHrefs?.app || '/app.html',
    [SITE_LINK_PLACEHOLDERS.generator]: siteConfig?.rootedSiteHrefs?.generator || '/generator.html',
    [SITE_LINK_PLACEHOLDERS.combinatorial]: siteConfig?.rootedSiteHrefs?.combinatorial || '/combinatorial.html',
    [SITE_LINK_PLACEHOLDERS.webmcp]: siteConfig?.rootedSiteHrefs?.webmcp || '/webmcp.html',
    [SITE_LINK_PLACEHOLDERS.writerSchema]: siteConfig?.rootedSiteHrefs?.writerSchema || '/writer-schema.html',
    [SITE_LINK_PLACEHOLDERS.docsIntro]: siteConfig?.rootedSiteHrefs?.docsIntro || '/docs/intro',
    [SITE_LINK_PLACEHOLDERS.blog]: siteConfig?.rootedSiteHrefs?.blog || '/blog',
  });
}

function transformStandaloneHtmlWithSiteConfig(html, siteConfig) {
  return Object.entries(createSiteLinkPlaceholderMap(siteConfig)).reduce(
    (nextHtml, [placeholder, href]) => nextHtml.replaceAll(placeholder, href),
    String(html || '')
  );
}

export { SITE_LINK_PLACEHOLDERS, createSiteLinkPlaceholderMap, transformStandaloneHtmlWithSiteConfig };
