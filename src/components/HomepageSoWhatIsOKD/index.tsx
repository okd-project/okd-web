import clsx from 'clsx';
import styles from './styles.module.scss';

export default function HomepageSoWhatIsOKD(): JSX.Element {
    return (
    <div className="container padding-top--lg">
        <div className="row">
            <div className={clsx("col", "col--4", styles.centerArt)}>
                <img style={{padding: "40px"}} src="img/brand/mascot/mascot_laptop_plugged.svg" />
            </div>
            <div className="col col--8">
                <h2>So what does that mean exactly?</h2>
                <p>Cloud buzzwords, right? In short, OKD is a very opinionated deployment of <i>Kubernetes</i>.
                    Kubernetes is a collection of software and design patters to operate applications at scale.</p>
                <p>We add some features directly as modifications into Kubernetes, but mostly we augment the platform by "preinstalling"
                    a large amount of pieces of software called "Operators" into the deployed cluster.</p>
                <p>These operators then provide all of our cluster components (over 100 of them!) which make up the platform, such as OS upgrades, web consoles, monitoring and image building</p>
                <p>
                    <a href="/docs/documentation" className="button button--primary">Go to Docs</a>
                </p>
            </div>
        </div>
    </div>
    );
}
