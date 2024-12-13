---
title: Force upgrade a cluster to 4.16
sidebar_label: Perform a forced upgrade to 4.16
description: Take a cluster from 4.15 or 4.16-preview to 4.16 stable
---

:::danger
copyedit this severely
:::


################### TESTING ONLY ###################

################### NOT FOR USE WITH PRODUCTION OKD CLUSTERS ###################

################### Example of how to gather the correct information and upgrade to a target release ###################

Starting cluster version 4.15.0-0.okd-2024-03-10-010116
Target cluster version 4.16.0-okd-scos.1

Use https://github.com/okd-project/okd-scos/releases to find digest for target cluster version

In this case the target version digest is ```quay.io/okd/scos-release@sha256:0de353901f9ab5ecb14c2583d16d24561df23d1bf46fe03f218f2ffb8f134096``` 

Run the following and take note of the output ```oc adm release info --image-for=hyperkube quay.io/okd/scos-release@sha256:0de353901f9ab5ecb14c2583d16d24561df23d1bf46fe03f218f2ffb8f134096```
1a) Output -```quay.io/okd/scos-content@sha256:5c9128668752a9b891a24a9ec36e0724d975d6d49e6e4e2d516b5ba80ae2fb23``` (HYPERKUBE)

Run the following and take note of the output ```oc adm release info --image-for=cluster-kube-apiserver-operator quay.io/okd/scos-release@sha256:0de353901f9ab5ecb14c2583d16d24561df23d1bf46fe03f218f2ffb8f134096```
2a) Output -  ```quay.io/okd/scos-content@sha256:37d6b6c13d864deb7ea925acf2b2cb34305333f92ce64e7906d3f973a8071642``` (KUBE_API)

Run the following command to start the cluster upgrade process to this version ```oc adm upgrade --allow-explicit-upgrade --force --to-image quay.io/okd/scos-release@sha256:0de353901f9ab5ecb14c2583d16d24561df23d1bf46fe03f218f2ffb8f134096
```

The clusterversion will show failed status shortly after the process starts, cluster-version-operator pod logs or clusterversion operator events will show an error similar to ```message: 'Could not update customresourcedefinition "infrastructures.config.openshift.io" (47 of 903): the object is invalid, possibly due to local cluster configuration'```

To continue the cluster upgrade process the following steps are required:
Scale down the cluster-version-operator to pause the update process
`oc scale --replicas=0 deployments/cluster-version-operator -n openshift-cluster-version`

Modify the openshift-kube-apiserver-operator deployment with ```oc edit -n openshift-kube-apiserver-operator deployments/kube-apiserver-operator```

Replace the value of the 'kube-apiserver-operator' image with the output returned in step 2a, e.g. `quay.io/okd/scos-content@sha256:37d6b6c13d864deb7ea925acf2b2cb34305333f92ce64e7906d3f973a8071642`

Replace the value of the OPERATOR_IMAGE environment variable the output returned in step 2a, e.g. `quay.io/okd/scos-content@sha256:37d6b6c13d864deb7ea925acf2b2cb34305333f92ce64e7906d3f973a8071642`

Replace the value of the IMAGE environment variable with the the output returned in step 1a, e.g. 'quay.io/okd/scos-content@sha256:5c9128668752a9b891a24a9ec36e0724d975d6d49e6e4e2d516b5ba80ae2fb23'

Replace the value of the OPERAND_IMAGE_VERSION environment variable with the value 1.29.6

Wait for the rollout of the new kube-apiserver pods to complete, this process is complete once an installer pod has been created for each node running kube-apiserver after the above changes, the status of these installer pods is 'Completed' and the kube-apiserver cluster operator progressing status is false (this process takes around 3 minutes to start and around 15 minutes to complete on a three node control-plane)

Scale up the cluster-version-operator to continue the update process
'oc scale --replicas=1 deployments/cluster-version-operator -n openshift-cluster-version'

The upgrade should then continue without error

################### TESTING ONLY ###################

################### NOT FOR USE WITH PRODUCTION OKD CLUSTERS ###################

################### Patch process to upgrade from cluster version 4.15.0-0.okd-2024-03-10-010116 to 4.16.0-okd-scos.1 ###################

The above process and patch can be used to upgrade the cluster if the openshift-kube-apiserver-operator deployment has one container and it's environment variables are in the following order:
```
env:
- name: IMAGE
- name: OPERATOR_IMAGE
- name: OPERAND_IMAGE_VERSION
- name: OPERATOR_IMAGE_VERSION
- name: POD_NAME
```

If you use a different image repository to quay.io you will also need to edit the below commands

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

Source: https://github.com/okd-project/okd/discussions/1971#discussioncomment-10119718