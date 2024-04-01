import clsx from 'clsx';
import styles from './styles.module.scss';

export default function HomagepageInsideOKD(): JSX.Element {
    return (
        <div className="container padding-top--md padding-bottom--xl">
            <h2>What's in the box? (in progress)</h2>
            <p>This is a component that should go through and explain what makes up OKD</p>
            <ul>
                <li>Operating System - Fedora CoreOS or SCOS (an immutable operating system)</li>
                <li>Kubernetes - A slightly modified version of Kubernetes with some extra features</li>
                <li>Core Cluster Components - Console, OVN-Kubernetes, Monitoring, etcd, MCO...</li>
                <li>Specialised Design Patterns - S2I, dealing with non-root and SCC the "OKD/Openshift" way</li>
                <li>Okderators - Opinionated, integrated, deployments of operators such as KubeVirt, Rook-Ceph, etc</li>
            </ul>
            <p>Just needs to look a bit prettier... thinking of basing it off the "Customer Stories" component from Apache Doris site</p>
        </div>
    );
}