# Install OKD

<!--- cSpell:ignore nightlies auths Fzcwo freenode -->

## Plan your installation

OKD supports 2 types of cluster install options:

- Installer-provisioned infrastructure (IPI)
- User-provisioned infrastructure (UPI)

IPI is a largely automated install process, where the installer is responsible for setting up the infrastructure, where UPI requires you to set up the base infrastructure.  You can find further details in [the documentation](https://docs.okd.io/latest/installing/index.html)<!--{target=_blank} comment for docusaurus compat-->

OKD support installation on bare metal hardware, a number of virtualization platforms and a number of cloud platforms, so you need to decide where you want to install OKD and that your environment has sufficient resources for the cluster to operate.  The [documentation](https://docs.okd.io/latest/installing/installing-preparing.html)<!--{target=_blank} comment for docusaurus compat--> has more information to help you plan your installation.

If you want to install on a typical developer workstation, then [Code-Ready Containers](crc.md) may be a better options, as that is a cut-down installation designed to run on limited compute and memory resources.

## Getting Started

To obtain the openshift installer and client, visit [releases](https://github.com/okd-project/okd/releases)<!--{target=_blank} comment for docusaurus compat--> for stable versions or [https://amd64.origin.releases.ci.openshift.org/](https://amd64.origin.releases.ci.openshift.org/)<!--{target=_blank} comment for docusaurus compat--> for nightlies.

You can verify the downloads using:

```shell
curl https://www.okd.io/okd-maintainers.pub | gpg --import
```

!!!output
    ```text
        gpg: key F23087F7B3AF7E5A: public key "OKD Maintainers (Key signing OKD releases) <maintainers@okd.io>" imported
        gpg: Total number processed: 1
        gpg:               imported: 1
    ```

```shell
gpg --verify sha256sum.txt.asc sha256sum.txt
```

!!!output
    ```text
    gpg: Signature made Thu Sep 17 13:39:08 2026 IST
    gpg:                using EDDSA key 82E40BC298E7F5D2877586FDF23087F7B3AF7E5A
    gpg:                issuer "maintainers@okd.io"
    gpg: Good signature from "OKD Maintainers (Key signing OKD releases) <maintainers@okd.io>" [unknown]
    Primary key fingerprint: 82E4 0BC2 98E7 F5D2 8775  86FD F230 87F7 B3AF 7E5A
    ```

```shell
sha256sum -c sha256sum.txt
```

!!!output
    ```text
    release.txt: OK
    openshift-client-linux-4.4.0-0.okd-2020-05-23-055148-beta5.tar.gz: OK
    openshift-client-mac-4.4.0-0.okd-2020-05-23-055148-beta5.tar.gz: OK
    openshift-client-windows-4.4.0-0.okd-2020-05-23-055148-beta5.zip: OK
    openshift-install-linux-4.4.0-0.okd-2020-05-23-055148-beta5.tar.gz: OK
    openshift-install-mac-4.4.0-0.okd-2020-05-23-055148-beta5.tar.gz: OK
    ```

Please note that each nightly release is pruned after 72 hours. If the nightly that you installed was pruned, the cluster may be unable to pull necessary images and may show errors for various functionality (including updates).

Alternatively, if you have the openshift client `oc` already installed, you can use it to download and extract the openshift installer and client from our container image:

```shell
oc adm release extract --tools quay.io/openshift/okd:4.5.0-0.okd-2020-07-14-153706-ga
```

!!!Note
    You need a 4.x version of `oc` to extract the installer and the latest client. You can initially use the [official Openshift client (mirror)](https://mirror.openshift.com/pub/openshift-v4/clients/oc/latest/linux/)<!--{target=_blank} comment for docusaurus compat-->

There are full instructions in the [OKD documentation](https://docs.okd.io/latest/installing/installing-preparing.html)<!--{target=_blank} comment for docusaurus compat--> for each supported platform, but the main steps for an IPI install are:

1. extract the downloaded tarballs and copy the binaries into your PATH.
2. run the following from an empty directory:
    ```shell
    openshift-install create cluster
    ```
3. follow the prompts to create the install config
    - you will need to have cloud credentials set in your shell properly before installation.
    - you must have permission to configure the appropriate cloud resources from that account (such as VPCs, instances, and DNS records).
    - you must have already configured a public DNS zone on your chosen cloud before the install starts.
    - you will also be prompted for a pull-secret that will be made available to all of of your machines - for OKD4 you should either paste the pull-secret you use for your registry, or paste `{"auths":{"fake":{"auth":"aWQ6cGFzcwo="}}}` to bypass the required value check (see [bug #182](https://github.com/okd-project/okd/issues/182)<!--{target=_blank} comment for docusaurus compat-->).

Once the install completes successfully the console URL and an admin username and password will be printed. If your DNS records were correct, you should be able to log in to your new OKD4 cluster!

To undo the installation and delete any cloud resources created by the installer, run

```shell
openshift-install destroy cluster
```

!!!Note
    The OpenShift client tools for your cluster can be downloaded from the help drop down menu at the top of the web console.
