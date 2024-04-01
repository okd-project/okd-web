import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

import UndrawAlienScience from './img/undraw_alien_science.svg';
import UndrawDeveloperActivity from './img/undraw_developer_activity.svg';
import UndrawEngineeringTeam from './img/undraw_engineering_team.svg';
import UndrawInformedDecision from './img/undraw_informed_decision.svg';
import UndrawServerCluster from './img/undraw_server_cluster.svg';


type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'In-cloud or on-prem',
    Svg: UndrawServerCluster,
    description: (
      <>
        Through installers, OKD can deploy into clouds, lab environments or metal. Depending
        on your platform installation could be fully automated, partially automated or require
        manual work. OKD controls the full operating system of each host, configurable through the
        Kubernetes API.
      </>
    ),
  },
  {
    title: 'Opionated',
    Svg: UndrawInformedDecision,
    description: (
      <>
        The landscape of cloud tools is vast. A community of practice means there is precedence on
        what to use (e.g GitOps, CI/CD, Service Mesh, etc).
        This is expressed through how OKD is deployed, the cluster components included and
        the operators chosen to be included in catalogs.
      </>
    ),
  },
  {
    title: 'Emerging Technologies',
    Svg: UndrawAlienScience,
    description: (
      <>
        OKD uses evolving best practice design patterns and software. We can be used as a testground for 
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
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
