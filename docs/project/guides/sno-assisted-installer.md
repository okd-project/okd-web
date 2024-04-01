---
draft: false 
date: 2023-04-13
categories:
  - Guide
---

# Create a Single Node OKD (SNO) Cluster with Assisted Installer

<!--- cSpell:ignore Vadim configmap SCOS auths aWQ6cGFzcwo kubeconfig kubeadmin nsenter rootfs ostree kublet kubelet baremetal autoscaler apiserver Alertmanager Thanos packageserver thanos-querier -->

This guide outlines how to run the assisted installer locally then use it to deploy a single node OKD cluster.

<!-- more -->

!!!Warning
    This guide won't produce a working system as there are issues to be resolved

## Reference Material

Information from the following sources was used to create this guide:

- [OpenShift Container Platform Single Node Docs](https://docs.openshift.com/container-platform/latest/installing/installing_sno/install-sno-preparing-to-install-sno.html)<!--{target=_blank} comment for docusaurus compat-->
- [Assisted Installer guide from Vadim](https://hackmd.io/tDnHM2BoQru0VgqMGI_Q5g)<!--{target=_blank} comment for docusaurus compat-->
- [Assisted Installer github repo instructions](https://github.com/openshift/assisted-service/tree/master/deploy/podman)<!--{target=_blank} comment for docusaurus compat-->

## Preparation

### Compute resources

A single Node OKD cluster takes fewer resource than the full cluster deployment, but you still need sufficient CPU and memory resources to run.  You can run on a bare metal system or in a virtual environment.  The minimum resources required are:

- vCPU : 8 cores
- Memory : 16 GB
- Storage (ideally fast storage, such as SSD) : 120GB

These are the absolute minimum resources needed, depending on the workload(s) you want to run in the cluster you may need additional CPU, memory and storage.

### Network

Before starting with the assisted installer you need to setup your local network by allocating an IP address for the cluster and ensure DNS resolution is configured and working.  You may also want to configure DHCP to allocate the IP address to a specific MAC address.

!!!Info
    This guide assumes you have a basic working knowledge of networking, including DNS name resolution and DHCP.

!!!Todo
    Do we need a network primer for home users wanting to setup OKD that don't have networking experience?  If there is a good one available online we can link to it or create our own on this site.

You should have the following information before you start.  I provide example values, but you need to substitute these for the values for your local environment

| Item               | Description                                                                      | Sample value            |
|--------------------|----------------------------------------------------------------------------------|-------------------------|
| Machine Network    | The local network                                                                | 192.168.0.0/24          |
| Default gateway    | The default gateway for your network                                             | 192.168.0.1             |
| DNS Server(s)      | Comma separated list of DNS servers (must be able to resolve cluster IP address) | 192.168.0.2,192.168.0.3 |
| Cluster IP address | The IP address allocated to the OKD cluster                                      | 192.168.0.59            |
| Base domain        | The domain in use on your local network                                          | lab.home                |
| Cluster name       | The name of the cluster.  This will form part of the URLs to access cluster      | okd-sno                 |

#### DNS

You must have a DNS server that can resolve the following Fully Qualified Domain Names (FQDN) to the Cluster IP address (192.168.0.59):

- `api.<Cluster Name>.<base domain>` - the Kubernetes API.  (**api.okd-sno.lab.home**)
- `api-int.<Cluster Name>.<base domain>` - the Internal API.  (**api-int.okd-sno.lab.home**)
- `*.apps.<Cluster Name>.<base domain>` - Ingress route.  (***.apps.okd-sno.lab.home**)

The last item is a wild card resolution which should resolve all entries ending in `apps.<Cluster Name>.<base domain>`, so **console-openshift-console.apps.okd-sno.lab.home** should resolve to the Cluster IP address, **192.168.0.59**.

Reverse lookup should also be working, so **192.168.0.59** should resolve to the host **api.okd-sno.lab.home**.

#### DHCP

When your single node cluster runs it is important that it uses the assigned IP address.  You can configure this in the Assisted Installer to setup a static IP address in the cluster configuration or get your DHCP server to assign the IP address to a specific MAC address. 

You can choose the preferred solution in your network.

## Running the Assisted Installer

For OpenShift Container Platform RedHat hosts the assisted installer, so you can simply use their hosted version, but for OKD you need to run the installer yourself.  This guide will use podman to run the Assisted Installer locally.

The guide uses the most basic setup of the Assisted Installer, but the documentation in the git repository provides additional information to enable secure communication (https) and enable persistent storage.

### Installing Podman

You need to have podman available on your machine (where the assisted installer will run).  This is typically your laptop or workstation - not the target system where the OKD single node cluster will run.  Follow the [instructions on podman.io](https://podman.io/getting-started/installation)<!--{target=_blank} comment for docusaurus compat--> to install podman if you don't already have it installed.  You should also ensure you have an up to date version of podman installed.

!!! Warning
    If you ae using podman machine (MacOS and Windows native users) you can't use the `podman play kube --configmap` option as mentioned in the Assisted Installer git repository, as the **--configmap** option is not available.  You need to concatenate your config and deployments yaml files into a single yaml file using the `---` document separator.  Linux users and Windows users running under the Windows Subsystem for Linux have access to the --configmap option.

### Create the configuration file

Before creating the configuration file you need to know the IP of the host running podman that will host the Assisted Installer.  

As the OKD cluster boots it will need to communicate with the Assisted Installer, so needs to know the IP address of the assisted installer.  It is important that the OKD cluster host machine is able to communicate with the machine hosting the Assisted Installer and the machine hosting the Assisted Installer is able to run the service and listen for incoming network traffic. (no network firewalls or filters that block this traffic).

For this example I will use IP **192.168.0.141** for the system running podman and hosting the Assisted Installer.

You need to create the configuration file to run the Assisted Installer in podman.  The base files are available in the assisted installer [git repo](https://github.com/openshift/assisted-service/tree/master/deploy/podman)<!--{target=_blank} comment for docusaurus compat-->, but I have modified them and updated them to offer both FCOS (Fedora Core OS) and SCOS (CentOS Stream Core OS) options.

Create the file (sno.yaml) - this is the combined file for use with podman machine (will also work with Linux).  You need to change all instances of 192.168.0.141 to the IP address of your system running podman and hosting the Assisted Installer:

```yaml title="sno.yaml"
apiVersion: v1
kind: ConfigMap
metadata:
  name: config
data:
  ASSISTED_SERVICE_HOST: 192.168.0.141:8090
  ASSISTED_SERVICE_SCHEME: http
  AUTH_TYPE: none
  DB_HOST: 127.0.0.1
  DB_NAME: installer
  DB_PASS: admin
  DB_PORT: "5432"
  DB_USER: admin
  DEPLOY_TARGET: onprem
  DISK_ENCRYPTION_SUPPORT: "true"
  DUMMY_IGNITION: "false"
  ENABLE_SINGLE_NODE_DNSMASQ: "true"
  HW_VALIDATOR_REQUIREMENTS: '[{"version":"default","master":{"cpu_cores":4,"ram_mib":16384,"disk_size_gb":100,"installation_disk_speed_threshold_ms":10,"network_latency_threshold_ms":100,"packet_loss_percentage":0},"worker":{"cpu_cores":2,"ram_mib":8192,"disk_size_gb":100,"installation_disk_speed_threshold_ms":10,"network_latency_threshold_ms":1000,"packet_loss_percentage":10},"sno":{"cpu_cores":8,"ram_mib":16384,"disk_size_gb":100,"installation_disk_speed_threshold_ms":10},"edge-worker":{"cpu_cores":2,"ram_mib":8192,"disk_size_gb":15,"installation_disk_speed_threshold_ms":10}}]'
  IMAGE_SERVICE_BASE_URL: http://192.168.0.141:8888
  IPV6_SUPPORT: "true"
  ISO_IMAGE_TYPE: "full-iso"
  LISTEN_PORT: "8888"
  NTP_DEFAULT_SERVER: ""
  POSTGRESQL_DATABASE: installer
  POSTGRESQL_PASSWORD: admin
  POSTGRESQL_USER: admin
  PUBLIC_CONTAINER_REGISTRIES: 'quay.io'
  SERVICE_BASE_URL: http://192.168.0.141:8090
  STORAGE: filesystem
  OS_IMAGES: '[{"openshift_version":"4.12","cpu_architecture":"x86_64","url":"https://builds.coreos.fedoraproject.org/prod/streams/stable/builds/37.20221127.3.0/x86_64/fedora-coreos-37.20221127.3.0-live.x86_64.iso","version":"37.20221127.3.0"},{"openshift_version":"4.12-scos","cpu_architecture":"x86_64","url":"https://builds.coreos.fedoraproject.org/prod/streams/stable/builds/37.20221127.3.0/x86_64/fedora-coreos-37.20221127.3.0-live.x86_64.iso","version":"37.20221127.3.0"}]'
  RELEASE_IMAGES: '[{"openshift_version":"4.12","cpu_architecture":"x86_64","cpu_architectures":["x86_64"],"url":"quay.io/openshift/okd:4.12.0-0.okd-2023-04-01-051724","version":"4.12.0-0.okd-2023-04-01-051724","default":true},{"openshift_version":"4.12-scos","cpu_architecture":"x86_64","cpu_architectures":["x86_64"],"url":"quay.io/okd/scos-release:4.12.0-0.okd-scos-2023-03-23-213604","version":"4.12.0-0.okd-scos-2023-03-23-213604","default":false}]'
  ENABLE_UPGRADE_AGENT: "false"
---
apiVersion: v1
kind: Pod
metadata:
  labels:
    app: assisted-installer
  name: assisted-installer
spec:
  containers:
  - args:
    - run-postgresql
    image: quay.io/centos7/postgresql-12-centos7:latest
    name: db
    envFrom:
    - configMapRef:
        name: config
  - image: quay.io/edge-infrastructure/assisted-installer-ui:latest
    name: ui
    ports:
    - hostPort: 8080
    envFrom:
    - configMapRef:
        name: config
  - image: quay.io/edge-infrastructure/assisted-image-service:latest
    name: image-service
    ports:
    - hostPort: 8888
    envFrom:
    - configMapRef:
        name: config
  - image: quay.io/edge-infrastructure/assisted-service:latest
    name: service
    ports:
    - hostPort: 8090
    envFrom:
    - configMapRef:
        name: config
  restartPolicy: Never
```

You may want to modify this configuration to add https communication and persistent storage using information in the [Assisted Installer git repo](https://github.com/openshift/assisted-service/tree/master/deploy/podman)<!--{target=_blank} comment for docusaurus compat-->.

### Run the Assisted Installer

Once you have your configuration file saved to disk, open a command line, change to the directory containing your sno.yaml file then run the following command:

!!!Info
    On a Mac and native Windows system you need to ensure podman machine is running on your system before running the podman play command:

    ```shell
    podman machine init
    podman machine start
    ```

```shell
podman play kube sno.yaml
```

To stop a running Assisted Installer instance run (without the persistence option configured all cluster data within the Assisted Installer will be lost, so make sure you have all credentials downloaded to your local system):

```shell
podman play kube --down sno.yaml
```

Once the Assisted installer is running you can access it on port 8080 (http) on the system hosting podman, `http://192.168.0.141:8080` (substitute your IP address) or if accessing from the machine hosting the service `http://localhost:8080`

## Create a cluster

When you have the Assisted Installer running locally you can use it to deploy a cluster.  For a single node cluster follow the steps:

1. On the Assisted Installer Web UI page click **Create Cluster**
2. On the **Cluster details** page enter:

    - the cluster name (okd-sno)
    - the base domain (lab.home)
    - use the drop down to select the version of OKD you want to install (FCOS or SCOS)
    - x86_64 is the only valid architecture at the time of writing this guide
    - click the *Install single node OpenShift (SNO)* option
    - enter `{"auths":{"fake":{"auth":"aWQ6cGFzcwo="}}}` as the pull secret
    - If you configured your DHCP server to serve the correct IP to the targe system MAC address leave the Hosts network configuration set to **DHCP only**.  If you want to set the target system IP address as part of the install then select **Static IP, bridges and bonds**
    - leave the encryption option off
    - select Next

    If you selected static IP address you will get additional options to define the **Network-wide configuration** and **Host specific configurations**

    - on the **Network-wide configuration** page enter the network details
    - on the **Host specific configurations** page enter the interface MAC address on the target host for the cluster and the custer IP address then press Next

3. On the **Operators** page leave everything as default and press Next
4. On the **Host discovery** page click the Add Host button and complete the dialog the appears

    - Set the **Provisioning type** to **Minimal image file - Provision with virtual media**
    - set the SSH public key
        !!!Todo
            Do we need to explain how to create this?
    - leave the rest of the settings as unchecked unless you need to configure a proxy then select the **Generate Discovery ISO** then download the ISO by pressing **Download Discovery ISO**.  Once downloaded you can close the popup dialog, where you should see **waiting for hosts...**

5. You should boot your target OKD host using the downloaded ISO file.  During the install the target system will reboot a couple of times, so it is important that the first boot uses the ISO but subsequent boots will use the internal hard disk.

    !!!Warning
        All internal storage on the target system will be wiped and used for the cluster
6. Once the target system has booted from the ISO it will contact the Assisted Installer and then appear on the Assisted Installer **Host discovery** screen.  After the target system appears and the status moves from **Discovering** to **Ready**  On the you can press the next button
7. On the **Storage** page you can configure the storage to use on the target system.  The default should work, but you may want to modify if your target system contains multiple disks.  Once the storage settings are correct press next
8. On the **Networking** page you should be able to leave things at the default values.  You may need to wait a short time while the host is initializing ,  When the status changes to **Ready** then press next
9. On the **Review and create** page you may need to wait for the preflight checks to complete.  When they are ready you can press **Install cluster** to start the cluster install.

You should be able to leave the system to complete.  The target system will reboot twice and then the cluster will be installed and configured.  The Assisted installer screen will show the progress.

As the cluster is being installed you will be able to download the kubeconfig file for the cluster.  It is important to download this before stopping the Assisted Installer as by default the Assisted Installer storage does not persist across a shutdown.

Once the cluster setup completes you will see the cluster console access details, including the password for the kubeadmin account.  Again, you need to capture this information before stopping the Assisted Installer as the information will be lost if you have not enabled persistence.

## Issues to be resolved

Currently the generated clusters are not installed correctly, so some work needs to be done to correct the setup instructions or find issues with the Assisted Installer or OKD release files.

### SCOS issue

The SCOS installation fails at step 2/7 with error (this doesn't happen with the FCOS image):

*Host okd-sno: updated status from installing-in-progress to error (Failed - failed executing nsenter [--target 1 --cgroup --mount --ipc --pid -- podman run --net host --pid=host --volume /:/rootfs:rw --volume /usr/bin/rpm-ostree:/usr/bin/rpm-ostree --privileged --entrypoint /usr/bin/machine-config-daemon quay.io/openshift/okd-content@sha256:7986774bbd06f4355567ae05b9b737b437d22dbbc3e0793c343bc7ee2de1ab54 start --node-name localhost --root-mount /rootfs --once-from /opt/install-dir/bootstrap.ign --skip-reboot], Error exit status 255, LastOutput "Error while ensuring access to kublet config.json pull secrets: symlink /var/lib/kubelet/config.json /run/ostree/auth.json: file exists")*

### FCOS issue

The FCOS configuration completes the install but goes from 80% complete with status of Installed and Control Plane Initialization in Finalizing stage to Failed.

The cluster operators are not all available

|NAME                                      |VERSION                         |AVAILABLE  |PROGRESSING  |DEGRADED  |SINCE  |MESSAGE |
|------------------------------------------|--------------------------------|-----------|-------------|----------|-------|--------|
|authentication                            |4.12.0-0.okd-2023-04-01-051724  |False      |True         |True      |71m    |OAuthServerDeploymentAvailable: no oauth-openshift.openshift-authentication pods available on any node....|
|baremetal                                 |4.12.0-0.okd-2023-04-01-051724  |True       |False        |False     |61m    | |
|cloud-controller-manager                  |4.12.0-0.okd-2023-04-01-051724  |True       |False        |False     |63m    | |
|cloud-credential                          |4.12.0-0.okd-2023-04-01-051724  |True       |False        |False     |70m    | |
|cluster-autoscaler                        |4.12.0-0.okd-2023-04-01-051724  |True       |False        |False     |60m    | |
|config-operator                           |4.12.0-0.okd-2023-04-01-051724  |True       |False        |False     |71m    | |
|console                                   |                                |           |             |          |       | |
|control-plane-machine-set                 |4.12.0-0.okd-2023-04-01-051724  |True       |False        |False     |63m    | |
|csi-snapshot-controller                   |4.12.0-0.okd-2023-04-01-051724  |True       |False        |False     |70m    | |
|dns                                       |4.12.0-0.okd-2023-04-01-051724  |True       |False        |False     |67m    | |
|etcd                                      |4.12.0-0.okd-2023-04-01-051724  |True       |False        |False     |63m    | |
|image-registry                            |4.12.0-0.okd-2023-04-01-051724  |False      |True         |False     |55m    |Available: The registry is removed...|
|ingress                                   |4.12.0-0.okd-2023-04-01-051724  |True       |True         |True      |60m     |The "default" ingress controller reports Degraded=True: DegradedConditions: One or more other status conditions indicate a degraded state: CanaryChecksSucceeding=False (CanaryChecksRepetitiveFailures: Canary route checks for the default ingress controller are failing)|
|insights                                  |4.12.0-0.okd-2023-04-01-051724  |True       |False        |False     |61m    | |
|kube-apiserver                            |4.12.0-0.okd-2023-04-01-051724  |True       |False        |False     |57m    | |
|kube-controller-manager                   |4.12.0-0.okd-2023-04-01-051724  |True       |False        |True      |57m    |GarbageCollectorDegraded: error fetching rules: Get "https://thanos-querier.openshift-monitoring.svc:9091/api/v1/rules": dial tcp 172.30.59.74:9091: connect: connection refused|
|kube-scheduler                            |4.12.0-0.okd-2023-04-01-051724  |True       |False        |False     |58m    | |
|kube-storage-version-migrator             |4.12.0-0.okd-2023-04-01-051724  |True       |False        |False     |70m    | |
|machine-api                               |4.12.0-0.okd-2023-04-01-051724  |True       |False        |False     |60m    | |
|machine-approver                          |4.12.0-0.okd-2023-04-01-051724  |True       |False        |False     |63m    | |
|machine-config                            |4.12.0-0.okd-2023-04-01-051724  |True       |False        |False     |69m    | |
|marketplace                               |4.12.0-0.okd-2023-04-01-051724  |True       |False        |False     |70m    | |
|monitoring                                |                                |False      |True         |True      |44m    |reconciling PrometheusAdapter Deployment failed: updating Deployment object failed: waiting for DeploymentRollout of openshift-monitoring/prometheus-adapter: current generation 2, observed generation 1, waiting for Alertmanager object changes failed: waiting for Alertmanager openshift-monitoring/main: expected 1 replicas, got 0 updated replicas, reconciling Thanos Querier Deployment failed: updating Deployment object failed: waiting for DeploymentRollout of openshift-monitoring/thanos-querier: current generation 1, observed generation 0 |
|network                                   |4.12.0-0.okd-2023-04-01-051724  |True       |False        |False     |71m    | |
|node-tuning                               |4.12.0-0.okd-2023-04-01-051724  |True       |False        |False     |59m    | |
|openshift-apiserver                       |4.12.0-0.okd-2023-04-01-051724  |True       |False        |False     |57m    | |
|openshift-controller-manager              |                                |False      |True         |False     |71m    |Available: no pods available on any node.
|openshift-samples                         |4.12.0-0.okd-2023-04-01-051724  |True       |False        |False     |56m    | |
|operator-lifecycle-manager                |4.12.0-0.okd-2023-04-01-051724  |True       |False        |False     |61m    | |
|operator-lifecycle-manager-catalog        |4.12.0-0.okd-2023-04-01-051724  |True       |False        |False     |61m    | |
|operator-lifecycle-manager-packageserver  |4.12.0-0.okd-2023-04-01-051724  |True       |False        |False     |57m    | |
|service-ca                                |4.12.0-0.okd-2023-04-01-051724  |True       |False        |False     |71m    | |
|storage                                   |4.12.0-0.okd-2023-04-01-051724  |True       |False        |False     |60m    | |

running `oc adm must-gather` produced the following terminal output:

```text
[must-gather      ] OUT Using must-gather plug-in image: quay.io/openshift/okd-content@sha256:5b649183c0c550cdfd9f164a70c46f1e23b9e5a7e5af05fc6836bdd5280fbd79
When opening a support case, bugzilla, or issue please include the following summary data along with any other requested information:
ClusterID: 655c76ee-b76c-4072-8fba-c136dcd753f7
ClusterVersion: Installing "4.12.0-0.okd-2023-04-01-051724" for 2 hours: Unable to apply 4.12.0-0.okd-2023-04-01-051724: some cluster operators are not available
ClusterOperators:
	clusteroperator/authentication is not available (OAuthServerDeploymentAvailable: no oauth-openshift.openshift-authentication pods available on any node.
OAuthServerRouteEndpointAccessibleControllerAvailable: Get "https://oauth-openshift.apps.okd-sno.lab.home/healthz": EOF
OAuthServerServiceEndpointAccessibleControllerAvailable: Get "https://172.30.32.70:443/healthz": dial tcp 172.30.32.70:443: connect: connection refused
OAuthServerServiceEndpointsEndpointAccessibleControllerAvailable: endpoints "oauth-openshift" not found) because IngressStateEndpointsDegraded: No subsets found for the endpoints of oauth-server
OAuthServerDeploymentDegraded: 1 of 1 requested instances are unavailable for oauth-openshift.openshift-authentication (no pods found with labels "app=oauth-openshift,oauth-openshift-anti-affinity=true")
OAuthServerRouteEndpointAccessibleControllerDegraded: Get "https://oauth-openshift.apps.okd-sno.lab.home/healthz": EOF
OAuthServerServiceEndpointAccessibleControllerDegraded: Get "https://172.30.32.70:443/healthz": dial tcp 172.30.32.70:443: connect: connection refused
OAuthServerServiceEndpointsEndpointAccessibleControllerDegraded: oauth service endpoints are not ready
	clusteroperator/console is not available (<missing>) because <missing>
	clusteroperator/image-registry is not available (Available: The registry is removed
NodeCADaemonAvailable: The daemon set node-ca does not have available replicas
ImagePrunerAvailable: Pruner CronJob has been created) because Degraded: The registry is removed
	clusteroperator/ingress is degraded because The "default" ingress controller reports Degraded=True: DegradedConditions: One or more other status conditions indicate a degraded state: DeploymentReplicasAllAvailable=False (DeploymentReplicasNotAvailable: 0/1 of replicas are available), CanaryChecksSucceeding=False (CanaryChecksRepetitiveFailures: Canary route checks for the default ingress controller are failing)
	clusteroperator/kube-controller-manager is degraded because GarbageCollectorDegraded: error fetching rules: Get "https://thanos-querier.openshift-monitoring.svc:9091/api/v1/rules": dial tcp 172.30.59.74:9091: connect: connection refused
	clusteroperator/monitoring is not available (reconciling PrometheusAdapter Deployment failed: updating Deployment object failed: waiting for DeploymentRollout of openshift-monitoring/prometheus-adapter: current generation 2, observed generation 1, waiting for Alertmanager object changes failed: waiting for Alertmanager openshift-monitoring/main: expected 1 replicas, got 0 updated replicas, reconciling Thanos Querier Deployment failed: updating Deployment object failed: waiting for DeploymentRollout of openshift-monitoring/thanos-querier: current generation 1, observed generation 0) because reconciling PrometheusAdapter Deployment failed: updating Deployment object failed: waiting for DeploymentRollout of openshift-monitoring/prometheus-adapter: current generation 2, observed generation 1, waiting for Alertmanager object changes failed: waiting for Alertmanager openshift-monitoring/main: expected 1 replicas, got 0 updated replicas, reconciling Thanos Querier Deployment failed: updating Deployment object failed: waiting for DeploymentRollout of openshift-monitoring/thanos-querier: current generation 1, observed generation 0
	clusteroperator/openshift-controller-manager is not available (Available: no pods available on any node.) because All is well


[must-gather      ] OUT namespace/openshift-must-gather-rn52t created
[must-gather      ] OUT clusterrolebinding.rbac.authorization.k8s.io/must-gather-9twf4 created
[must-gather      ] OUT namespace/openshift-must-gather-rn52t deleted
[must-gather      ] OUT clusterrolebinding.rbac.authorization.k8s.io/must-gather-9twf4 deleted


Error running must-gather collection:
    pods "must-gather-" is forbidden: error looking up service account openshift-must-gather-rn52t/default: serviceaccount "default" not found

Falling back to `oc adm inspect clusteroperators.v1.config.openshift.io` to collect basic cluster information.
Gathering data for ns/openshift-config...
Gathering data for ns/openshift-config-managed...
Gathering data for ns/openshift-authentication...
Gathering data for ns/openshift-authentication-operator...
Gathering data for ns/openshift-ingress...
Gathering data for ns/openshift-oauth-apiserver...
Gathering data for ns/openshift-machine-api...
Gathering data for ns/openshift-cloud-controller-manager-operator...
Gathering data for ns/openshift-cloud-controller-manager...
Gathering data for ns/openshift-cloud-credential-operator...
Gathering data for ns/openshift-config-operator...
Gathering data for ns/openshift-cluster-storage-operator...
Gathering data for ns/openshift-dns-operator...
Gathering data for ns/openshift-dns...
Gathering data for ns/openshift-etcd-operator...
Gathering data for ns/openshift-etcd...
Gathering data for ns/openshift-image-registry...
Gathering data for ns/openshift-ingress-operator...
Gathering data for ns/openshift-ingress-canary...
Gathering data for ns/openshift-insights...
Gathering data for ns/openshift-kube-apiserver-operator...
Gathering data for ns/openshift-kube-apiserver...
Gathering data for ns/openshift-kube-controller-manager...
Gathering data for ns/openshift-kube-controller-manager-operator...
Gathering data for ns/kube-system...
Gathering data for ns/openshift-kube-scheduler...
Gathering data for ns/openshift-kube-scheduler-operator...
Gathering data for ns/openshift-kube-storage-version-migrator...
Gathering data for ns/openshift-kube-storage-version-migrator-operator...
Gathering data for ns/openshift-cluster-machine-approver...
Gathering data for ns/openshift-machine-config-operator...
Gathering data for ns/openshift-kni-infra...
Gathering data for ns/openshift-openstack-infra...
Gathering data for ns/openshift-ovirt-infra...
Gathering data for ns/openshift-vsphere-infra...
Gathering data for ns/openshift-nutanix-infra...
Gathering data for ns/openshift-marketplace...
Gathering data for ns/openshift-monitoring...
Gathering data for ns/openshift-user-workload-monitoring...
Gathering data for ns/openshift-multus...
Gathering data for ns/openshift-ovn-kubernetes...
Gathering data for ns/openshift-host-network...
Gathering data for ns/openshift-network-diagnostics...
Gathering data for ns/openshift-network-operator...
Gathering data for ns/openshift-cloud-network-config-controller...
Gathering data for ns/openshift-cluster-node-tuning-operator...
Gathering data for ns/openshift-apiserver-operator...
Gathering data for ns/openshift-apiserver...
Gathering data for ns/openshift-controller-manager-operator...
Gathering data for ns/openshift-controller-manager...
Gathering data for ns/openshift-route-controller-manager...
Gathering data for ns/openshift-cluster-samples-operator...
Gathering data for ns/openshift-operator-lifecycle-manager...
Gathering data for ns/openshift-service-ca-operator...
Gathering data for ns/openshift-service-ca...
Gathering data for ns/openshift-cluster-csi-drivers...
Wrote inspect data to must-gather.local.5575179556041727039/inspect.local.62720609973566482.
error running backup collection: errors occurred while gathering data:
    [skipping gathering clusterroles.rbac.authorization.k8s.io/system:registry due to error: clusterroles.rbac.authorization.k8s.io "system:registry" not found, skipping gathering clusterrolebindings.rbac.authorization.k8s.io/registry-registry-role due to error: clusterrolebindings.rbac.authorization.k8s.io "registry-registry-role" not found, skipping gathering podnetworkconnectivitychecks.controlplane.operator.openshift.io due to error: the server doesn't have a resource type "podnetworkconnectivitychecks", skipping gathering endpoints/host-etcd-2 due to error: endpoints "host-etcd-2" not found, skipping gathering sharedconfigmaps.sharedresource.openshift.io due to error: the server doesn't have a resource type "sharedconfigmaps", skipping gathering sharedsecrets.sharedresource.openshift.io due to error: the server doesn't have a resource type "sharedsecrets"]


Reprinting Cluster State:
When opening a support case, bugzilla, or issue please include the following summary data along with any other requested information:
ClusterID: 655c76ee-b76c-4072-8fba-c136dcd753f7
ClusterVersion: Installing "4.12.0-0.okd-2023-04-01-051724" for 2 hours: Unable to apply 4.12.0-0.okd-2023-04-01-051724: some cluster operators are not available
ClusterOperators:
	clusteroperator/authentication is not available (OAuthServerDeploymentAvailable: no oauth-openshift.openshift-authentication pods available on any node.
OAuthServerRouteEndpointAccessibleControllerAvailable: Get "https://oauth-openshift.apps.okd-sno.lab.home/healthz": EOF
OAuthServerServiceEndpointAccessibleControllerAvailable: Get "https://172.30.32.70:443/healthz": dial tcp 172.30.32.70:443: connect: connection refused
OAuthServerServiceEndpointsEndpointAccessibleControllerAvailable: endpoints "oauth-openshift" not found) because IngressStateEndpointsDegraded: No subsets found for the endpoints of oauth-server
OAuthServerDeploymentDegraded: 1 of 1 requested instances are unavailable for oauth-openshift.openshift-authentication (no pods found with labels "app=oauth-openshift,oauth-openshift-anti-affinity=true")
OAuthServerRouteEndpointAccessibleControllerDegraded: Get "https://oauth-openshift.apps.okd-sno.lab.home/healthz": EOF
OAuthServerServiceEndpointAccessibleControllerDegraded: Get "https://172.30.32.70:443/healthz": dial tcp 172.30.32.70:443: connect: connection refused
OAuthServerServiceEndpointsEndpointAccessibleControllerDegraded: oauth service endpoints are not ready
	clusteroperator/console is not available (<missing>) because <missing>
	clusteroperator/image-registry is not available (Available: The registry is removed
NodeCADaemonAvailable: The daemon set node-ca does not have available replicas
ImagePrunerAvailable: Pruner CronJob has been created) because Degraded: The registry is removed
	clusteroperator/ingress is degraded because The "default" ingress controller reports Degraded=True: DegradedConditions: One or more other status conditions indicate a degraded state: DeploymentReplicasAllAvailable=False (DeploymentReplicasNotAvailable: 0/1 of replicas are available), CanaryChecksSucceeding=False (CanaryChecksRepetitiveFailures: Canary route checks for the default ingress controller are failing)
	clusteroperator/kube-controller-manager is degraded because GarbageCollectorDegraded: error fetching rules: Get "https://thanos-querier.openshift-monitoring.svc:9091/api/v1/rules": dial tcp 172.30.59.74:9091: connect: connection refused
	clusteroperator/monitoring is not available (reconciling PrometheusAdapter Deployment failed: updating Deployment object failed: waiting for DeploymentRollout of openshift-monitoring/prometheus-adapter: current generation 2, observed generation 1, waiting for Alertmanager object changes failed: waiting for Alertmanager openshift-monitoring/main: expected 1 replicas, got 0 updated replicas, reconciling Thanos Querier Deployment failed: updating Deployment object failed: waiting for DeploymentRollout of openshift-monitoring/thanos-querier: current generation 1, observed generation 0) because reconciling PrometheusAdapter Deployment failed: updating Deployment object failed: waiting for DeploymentRollout of openshift-monitoring/prometheus-adapter: current generation 2, observed generation 1, waiting for Alertmanager object changes failed: waiting for Alertmanager openshift-monitoring/main: expected 1 replicas, got 0 updated replicas, reconciling Thanos Querier Deployment failed: updating Deployment object failed: waiting for DeploymentRollout of openshift-monitoring/thanos-querier: current generation 1, observed generation 0
	clusteroperator/openshift-controller-manager is not available (Available: no pods available on any node.) because All is well


Error from server (Forbidden): pods "must-gather-" is forbidden: error looking up service account openshift-must-gather-rn52t/default: serviceaccount "default" not found
```

and the generated bundle can be found [here](https://www.dropbox.com/s/aarjem5th51mml5/okd-sno.tgz?dl=0)<!--{target=_blank} comment for docusaurus compat-->
