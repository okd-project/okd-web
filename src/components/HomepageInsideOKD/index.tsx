import clsx from 'clsx';
import styles from './styles.module.scss';



export default function HomagepageInsideOKD(): JSX.Element {
    return (
        <div className="container padding-top--md padding-bottom--xl">
            <div className={clsx('padding-top--sm', 'padding-left--sm', 'padding-bottom--sm', styles.inTheBoxHeader)}><h2>What's in the box?</h2></div>
            <div className="row">
                {THE_BOX.map((boxItem) => (
                    <div className="card col margin--md" key={boxItem.id}>
                        <div className="card__header">
                            <h3>{boxItem.title}</h3>
                        </div>
                        <div className="card__body">
                            {boxItem.text}
                        </div>
                    </div>
                ))}
            </div>
            <div className={clsx('padding-top--sm', 'padding-left--sm', 'padding-bottom--sm', styles.inTheBoxHeader)}></div>
        </div>
    );
}



const THE_BOX = [
    {
        id: 'os',
        title: 'Operating System',
        text: (<>
            Nodes run an immutable operating system that is updated and managed
            through cluster APIs.
        </>),
    },
    {
        id: 'k8s',
        title: 'Kubernetes',
        text: (<>
            The industry leading way to orchestrate. OKD is 100% compliant,
            with additional patches on some Kubernetes components to support
            some advanced featuresets.
        </>),
    },
    {
        id: 'cluster-components',
        title: 'Cluster Components',
        text: (<>
            Full featured web console, authentication, image registry/tooling, monitoring,
            node config/upgrades, networking and operator management out of the box.
        </>)
    },
    {
        id: 'okderators',
        title: 'OKDerators',
        text: (<>
            Installable catalog of GitOps, Storage, Mesh and Storage (+ more!) operators
            using leading OSS projects. Designed to work easily with you and each other.
        </>)
    },
];
