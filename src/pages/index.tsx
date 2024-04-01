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
      description="OKD is a Kubernetes distribution that includes OS management, operators, console and .">
      <HomepageHero />
      <main>
        <HomepageSoWhatIsOKD/>
        <HomepageFeatures />
        <HomagepageInsideOKD />
      </main>
    </Layout>
  );
}
