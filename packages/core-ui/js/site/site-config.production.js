import { createSiteConfig } from './site-config-core.js';

const siteConfig = createSiteConfig({
  siteOrigin: 'https://anywaydata.com',
  pageHrefs: {
    landing: '/',
    app: '/app.html',
    generator: '/generator.html',
    combinatorial: '/combinatorial.html',
    webmcp: '/webmcp.html',
    writerSchema: '/writer-schema.html',
  },
  docsIntroHref: '/docs/intro',
  blogHref: '/blog',
  docsBaseUrl: 'https://anywaydata.com/docs',
  blogBaseUrl: 'https://anywaydata.com/blog',
});

const pageHrefs = siteConfig.pageHrefs;
const rootedSiteHrefs = siteConfig.rootedSiteHrefs;
const buildDocsUrl = (...args) => siteConfig.buildDocsUrl(...args);
const buildBlogUrl = (...args) => siteConfig.buildBlogUrl(...args);
const resolveOwnedSiteUrl = (...args) => siteConfig.resolveOwnedSiteUrl(...args);

export { siteConfig, pageHrefs, rootedSiteHrefs, buildDocsUrl, buildBlogUrl, resolveOwnedSiteUrl };
export default siteConfig;
