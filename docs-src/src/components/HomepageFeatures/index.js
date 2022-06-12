import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Easy to Use',
    //Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        The Data Table Editor is designed to be easy to use and 
        uses AG Grid's Community Edition Data Grid to create an intuitive
        editing experience.
      </>
    ),
  },
  {
    title: 'Import and Export Data',
    //Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Any Data Grid of data can be converted to multiple table formats e.g.
        Markdown, CSV, Gherkin, JSON and plain HTML. These formats can all be
        exported to and converted between. It is possible to import Markdown,
        CSV, Gherkin and JSON for editing the data.
      </>
    ),
  },
  {
    title: 'Random Data Generation',
    //Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        You can Generate random data in a Data Grid to use for testing. Simply
        configure a test data schema and choose from predefined random formats or
        write your field value description as a RegEx. Generate as many rows as your
        computer can handle. Want 1000 records? Easy. 100,000? Easy. 1,000,000 sure,
        it might take 30 seconds or so, but if your computer can handle it, we can
        generate it.
      </>
    ),
  },
];

//         <Svg className={styles.featureSvg} role="img" />
function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
