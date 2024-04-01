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
        <HomepageSoWhatIsOKD/>
        <HomepageFeatures />
        <HomagepageInsideOKD />
      </main>
    </Layout>
  );
}
