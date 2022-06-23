import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import ReactPlayer from 'react-player';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <a
            className="button button--secondary button--lg"
            href="/app.html">
            Use The Application
          </a>
        </div>
      </div>
    </header>
  );
}

function ShowCaseVideo({title, description, videourl}) {
  return (
    <section className={styles.features}>
      <div className="videocontainer">
        <div className="text--center">
          <h2>{title}</h2>
          <p>{description}</p>
        <ReactPlayer style={{margin: "auto"}} controls url={videourl} />
        </div>
      </div>        

    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="A Test Data Editor and Generation Tool. Edit and Convert between Markdown, CSV, JSON, Gherkin and HTML.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <ShowCaseVideo
          title="Generate Test Data Using Faker"
          description="It is possible to easilty generate random data into the Data Grid for editing or export."
          videourl = "https://www.youtube.com/watch?v=E8lYiPEugJQ"
        />
      </main>
    </Layout>
  );
}
