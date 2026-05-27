import clsx from 'clsx';

import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import HomepageHero from '@site/src/components/HomepageHero';

import styles from './index.module.scss';
import HomepageSoWhatIsOKD from '../components/HomepageSoWhatIsOKD';
import HomagepageInsideOKD from '../components/HomepageInsideOKD';

function HomepageHeader() {
 
}

function PatchSupportNotice() {
  return (
    <section className={styles.patchSupport} aria-labelledby="patch-support-title">
      <div className="container">
        <Heading as="h2" id="patch-support-title">
          Patch Support
        </Heading>
        <p>
          OKD publishes community patch releases through the stable update
          channel after release verification passes. Not every patch number is
          produced, so use the cluster update graph and the latest stable OKD
          release when planning upgrades.
        </p>
        <a
          className="button button--primary"
          href="https://docs.okd.io/latest/updating/index.html">
          Review OKD update guidance
        </a>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout
      title={`Kubernetes at Scale on any Infrastructure`}
      description="Bringing together 100+ components to provide comprehensive
       tooling for administrators and developers, we've made choices so you
       don't have to. Deploy in-cloud or on-prem and join a community
       embracing the latest in cloud emerging technologies.">
      <HomepageHero />
      <main>
        <PatchSupportNotice />
        <HomepageSoWhatIsOKD/>
        <HomepageFeatures />
        <HomagepageInsideOKD />
      </main>
    </Layout>
  );
}
