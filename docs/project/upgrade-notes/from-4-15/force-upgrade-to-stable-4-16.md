---
title: Upgrade 4.15 cluster to 4.16
sidebar_label: 4.15 -> 4.16 Upgrade
description: Take a cluster from 4.15 to 4.16 before upgrading to 4.17
---

There is a known issue taking a cluster from 4.15 to 4.16 due to validation changes that were introduced in Cluster Version Operator which couldn't be backported to 4.15.

In order to allow the upgrade to proceed, we will start an upgrade to 4.16 and then when the error state is achieved, we will intervene and patch component versions to allow the upgrade to finish.

### Cluster Versions

- Starting cluster version: `4.15.0-0.okd-2024-03-10-010116`
- Target cluster version: `4.16.0-okd-scos.1`

## Manual Upgrade

### 1) Collect OKD payload component references

Use https://github.com/okd-project/okd-scos/releases to confirm release manifest for target cluster version

For `4.16.0-okd-scos.1` the release manifest is found at `quay.io/okd/scos-release@sha256:0de353901f9ab5ecb14c2583d16d24561df23d1bf46fe03f218f2ffb8f134096`

#### Collect `hyperkube` reference
```bash
oc adm release info --image-for=hyperkube quay.io/okd/scos-release@sha256:0de353901f9ab5ecb14c2583d16d24561df23d1bf46fe03f218f2ffb8f134096
```
- `hyperkube`: `quay.io/okd/scos-content@sha256:5c9128668752a9b891a24a9ec36e0724d975d6d49e6e4e2d516b5ba80ae2fb23`

#### Collect `cluster-kube-apiserver-operator` reference
```bash
oc adm release info --image-for=cluster-kube-apiserver-operator quay.io/okd/scos-release@sha256:0de353901f9ab5ecb14c2583d16d24561df23d1bf46fe03f218f2ffb8f134096
```
- `cluster-kube-apiserver-operator`: `quay.io/okd/scos-content@sha256:37d6b6c13d864deb7ea925acf2b2cb34305333f92ce64e7906d3f973a8071642`

### 2) Start the OKD 4.15 to 4.16 upgrade
Run the following command to start the cluster upgrade process to this version
```bash
oc adm upgrade --allow-explicit-upgrade --force --to-image quay.io/okd/scos-release@sha256:0de353901f9ab5ecb14c2583d16d24561df23d1bf46fe03f218f2ffb8f134096
```

### 3) Wait for upgrade error state to occur
The clusterversion will show failed status shortly after the process starts, cluster-version-operator pod logs or clusterversion operator events will show an error similar to
```
message: 'Could not update customresourcedefinition "infrastructures.config.openshift.io" (47 of 903): the object is invalid, possibly due to local cluster configuration'
```

### 4) Scale down Cluster Version Operator for manual intervention
To continue the cluster upgrade process the following steps are required:
Scale down the cluster-version-operator to pause the update process
`oc scale --replicas=0 deployments/cluster-version-operator -n openshift-cluster-version`

### 5) Manually intervene and force Kubernetes API Server upgrade
Modify the openshift-kube-apiserver-operator deployment with
```bash
oc edit -n openshift-kube-apiserver-operator deployments/kube-apiserver-operator
```

1. Update the `kube-apiserver-operator` container template with the image reference for the 4.16 `cluster-kube-apiserver-operator`
```yaml
image: 'quay.io/okd/scos-content@sha256:37d6b6c13d864deb7ea925acf2b2cb34305333f92ce64e7906d3f973a8071642'
```

2. Update the `IMAGE` environment variable within the container template with the the image reference for the 4.16 `hyperkube`
```yaml
- name: IMAGE
  value: 'quay.io/okd/scos-content@sha256:5c9128668752a9b891a24a9ec36e0724d975d6d49e6e4e2d516b5ba80ae2fb23'
```

3. Update the `OPERATOR_IMAGE` environment variable within the container template with  the image reference for the 4.16 `cluster-kube-apiserver-operator`
```yaml
- name: OPERATOR_IMAGE
  value: 'quay.io/okd/scos-content@sha256:37d6b6c13d864deb7ea925acf2b2cb34305333f92ce64e7906d3f973a8071642'
```

4. Update the `OPERAND_IMAGE_VERSION` environment variable within the container template with the value `1.29.6`
```yaml
- name: OPERAND_IMAGE_VERSION
  value: 1.29.6
```

### 6) Wait for rollout of `kube-apiserver`
Wait for the rollout of the new kube-apiserver pods to complete, this process is complete once an installer pod has been created for each node running kube-apiserver after the above changes, the status of these installer pods is 'Completed' and the kube-apiserver cluster operator progressing status is false (this process takes around 3 minutes to start and around 15 minutes to complete on a three node control-plane)


### 7) Scale up Cluster Version Operator to allow upgrade to continue
Scale up the cluster-version-operator to continue the update process
'oc scale --replicas=1 deployments/cluster-version-operator -n openshift-cluster-version'

The upgrade should then continue without error

## Automatic Upgrade

:::danger
Please take care to review that your cluster is in the expected state before running these scripts.
If you only have a few clusters to upgrade consider following the manual process detailed above
:::

The above process and patch can be used to upgrade the cluster if the openshift-kube-apiserver-operator deployment has one container and it's environment variables are in the following order:

```yaml
env:
- name: IMAGE
- name: OPERATOR_IMAGE
- name: OPERAND_IMAGE_VERSION
- name: OPERATOR_IMAGE_VERSION
- name: POD_NAME
```

:::danger
The script *relies on the above ordering of the environment variables*. If your environment variables within the container template are different then this _will not be validated by the script_ and it could break your cluster.
:::

### `upgrade-4-15-to-4-16-unsafe.sh`
```bash
oc adm upgrade --allow-explicit-upgrade --to-image quay.io/okd/scos-release@sha256:0de353901f9ab5ecb14c2583d16d24561df23d1bf46fe03f218f2ffb8f134096

sleep 60

oc scale --replicas=0 deployments/cluster-version-operator -n openshift-cluster-version

oc -n openshift-kube-apiserver-operator patch deployment kube-apiserver-operator --type='json' -p='[
    {"op": "replace", "path": "/spec/template/spec/containers/0/image", "value": "quay.io/okd/scos-content@sha256:37d6b6c13d864deb7ea925acf2b2cb34305333f92ce64e7906d3f973a8071642"},
    {"op": "replace", "path": "/spec/template/spec/containers/0/env/0/value", "value": "quay.io/okd/scos-content@sha256:5c9128668752a9b891a24a9ec36e0724d975d6d49e6e4e2d516b5ba80ae2fb23"},
    {"op": "replace", "path": "/spec/template/spec/containers/0/env/1/value", "value": "quay.io/okd/scos-content@sha256:37d6b6c13d864deb7ea925acf2b2cb34305333f92ce64e7906d3f973a8071642"},
    {"op": "replace", "path": "/spec/template/spec/containers/0/env/2/value", "value": "1.29.6"}
]'

sleep 180

oc wait clusteroperators kube-apiserver --for=condition=Progressing=false --timeout=600s

oc scale --replicas=1 deployments/cluster-version-operator -n openshift-cluster-version
```
