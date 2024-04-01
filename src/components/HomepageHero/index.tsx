import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.scss';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import heroVideoMP4 from './okd-web-poster-bg.mp4';
import heroVideoWebM from './okd-web-poster-bg.webm';
import heroPoster from './okd-web-poster-bg-first-frame.jpg';
import OKDLogo from '../OKDLogo';


export default function HomepageFeatures(): JSX.Element {
    const {siteConfig} = useDocusaurusContext();
    return (
      <header className={styles.okdHeroCanvas}>
        
  
        <div className={clsx('container', styles.okdHeroLayer, styles.videoBG)}>
          <video autoPlay loop playsInline muted poster={heroPoster.src}>
            <source src={heroVideoMP4} type='video/mp4' />
            <source src={heroVideoWebM} type='video/webm' />
          </video>
        </div>




        <div className={clsx("container", styles.okdHeroLayer, styles.heroTextContainer)}>
          <div className={styles.logoHolder}>
            <OKDLogo/>
          </div>
          <Heading as="h1" className={clsx("hero__title", styles.heroTextHolder, styles.heroBGBrand)}>
            Deploy at scale on any Infrastructure
          </Heading>
          
        
          <p className={clsx("hero__subtitle", styles.heroTextHolder)}>Integrated Platform built on Kubernetes to manage your applications, clusters and more</p>
          
        </div>
        
      </header>
    );
  }
  
  /*/*<div className={styles.buttons}>
            <Link
              className="button button--secondary button--lg"
              to="/docs/intro">
              Docusaurus Tutorial - 5min ⏱️
            </Link>
          </div>*/
          /*
                  <div 
          className={clsx('container', styles.okdHeroLayer, styles.videoBG)}>
    <svg>

      <path fill-opacity="0.05"  d="M1920,499.8L1665,756L725.3,243.6l-470.3,42L0,499.8V0h1920V499.8z"/>
	    <path fill-opacity="0.05" d="M1920,266.1l-210,152.7l-473.3-130.4L725.3,400.7L210,189.6L0,266.1V0h1920V266.1z"/>
    </svg>

        </div>*/