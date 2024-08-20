import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

import UndrawAlienScience from './img/undraw_alien_science.svg';
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
        OKD is intended to be run at all scales from cloud to metal to edge. 
        The installer is fully automated on some platforms (such as AWS), or
        supports configuration into custom environments (such as metal or labs).
      </>
    ),
  },
  {
    title: 'Opinionated',
    Svg: UndrawInformedDecision,
    description: (
      <>
        The cloud landscape is vast. From GitOps to Service Meshes, Virtualisation to Storage, OKD integrated 
        deployments of leading projects. Recommended Design Patterns enchance security posture
        and defaults include hardended configuration 
      </>
    ),
  },
  {
    title: 'Emerging Technologies',
    Svg: UndrawAlienScience,
    description: (
      <>
        OKD adopts developing best practise and technology. A great platform for technologists and students 
        to learn, experiment and contribute across the cloud ecosystem. For OpenShift contributors and partners
        our technical similarity makes us an ideal lab and development environemnt.
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
