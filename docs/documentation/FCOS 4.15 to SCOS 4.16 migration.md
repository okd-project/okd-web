################### TESTING ONLY ###################

################### NOT FOR USE WITH PRODUCTION OKD CLUSTERS ###################

################### Example of how to gather the correct information and upgrade to a target release ###################

Starting cluster version 4.15.0-0.okd-2024-03-10-010116
Target cluster version 4.16.0-0.okd-scos-2024-10-18-035245

Use https://amd64.origin.releases.ci.openshift.org/graph to find digest for target cluster version

In this case the target version digest is ```registry.ci.openshift.org/origin/release-scos@sha256:b3a25b400e66a8d6961dcd52b947629128aef6ca0d351bd6d3733dafd1dd9586```

Run the following and take note of the output ```oc adm release info --image-for=hyperkube registry.ci.openshift.org/origin/release-scos@sha256:b3a25b400e66a8d6961dcd52b947629128aef6ca0d351bd6d3733dafd1dd9586```
1a) Output -```registry.ci.openshift.org/origin/4.16-okd-scos-2024-10-18-035245@sha256:371c966fc1dfb8ad089089140309b84dc54c2a443e2db0dee5ee940120bf0e4e``` (HYPERKUBE)

Run the following and take note of the output ```oc adm release info --image-for=cluster-kube-apiserver-operator registry.ci.openshift.org/origin/release-scos@sha256:b3a25b400e66a8d6961dcd52b947629128aef6ca0d351bd6d3733dafd1dd9586```
2a) Output -  ```registry.ci.openshift.org/origin/4.16-okd-scos-2024-10-18-035245@sha256:37d6b6c13d864deb7ea925acf2b2cb34305333f92ce64e7906d3f973a8071642``` (KUBE_API)

Run the following command to start the cluster upgrade process to this version ```oc adm upgrade --to-image=registry.ci.openshift.org/origin/release-scos@sha256:b3a25b400e66a8d6961dcd52b947629128aef6ca0d351bd6d3733dafd1dd9586 --allow-explicit-upgrade ```

The clusterversion will show failed status shortly after the process starts, cluster-version-operator pod logs or clusterversion operator object will show an error similar to ```message: 'Could not update customresourcedefinition "infrastructures.config.openshift.io" (47 of 903): the object is invalid, possibly due to local cluster configuration'```

To continue the cluster upgrade process the following steps are required:
Scale down the cluster-version-operator to pause the update process
`oc scale --replicas=0 deployments/cluster-version-operator -n openshift-cluster-version`

Modify the openshift-kube-apiserver-operator deployment with ```oc edit -n openshift-kube-apiserver-operator deployments/kube-apiserver-operator```

Replace the value of the 'kube-apiserver-operator' image with the output returned in step 2a, e.g. `registry.ci.openshift.org/origin/4.16-okd-scos-2024-10-18-035245@sha256:37d6b6c13d864deb7ea925acf2b2cb34305333f92ce64e7906d3f973a8071642`

Replace the value of the OPERATOR_IMAGE environment variable the output returned in step 2a, e.g. `registry.ci.openshift.org/origin/4.16-okd-scos-2024-10-18-035245@sha256:37d6b6c13d864deb7ea925acf2b2cb34305333f92ce64e7906d3f973a8071642`

Replace the value of the IMAGE environment variable with the the output returned in step 1a, e.g. 'registry.ci.openshift.org/origin/4.16-okd-scos-2024-10-18-035245@sha256:371c966fc1dfb8ad089089140309b84dc54c2a443e2db0dee5ee940120bf0e4e'

Replace the value of the OPERAND_IMAGE_VERSION environment variable with the value 1.29.6

Wait for the rollout of the new kube-apiserver pods to complete, this process is complete once an installer pod has the status 'Completed' on each node responsible for running the kube-apiserver. (this process takes 10 minutes on a three node control-plane)
You can monitor this process with 'watch oc get pods -n openshift-kube-apiserver-operator && oc get pods -n openshift-kube-apiserver'

Scale up the cluster-version-operator to continue the update process
'oc scale --replicas=1 deployments/cluster-version-operator -n openshift-cluster-version'

Use the following command to observe progress
watch oc get co,nodes,mcp,clusterversion

################### TESTING ONLY ###################

################### NOT FOR USE WITH PRODUCTION OKD CLUSTERS ###################

################### Patch process to upgrade from cluster version 4.15.0-0.okd-2024-03-10-010116 to 4.16.0-0.okd-scos-2024-10-18-035245 ###################

The following patch can be used to upgrade the cluster if openshift-kube-apiserver-operator deployment has one container and it's environment vairables are in the following order:
```
env:
- name: IMAGE
- name: OPERATOR_IMAGE
- name: OPERAND_IMAGE_VERSION
- name: OPERATOR_IMAGE_VERSION
- name: POD_NAME
```

`oc scale --replicas=0 deployments/cluster-version-operator -n openshift-cluster-version`

```
oc -n openshift-kube-apiserver-operator patch deployment kube-apiserver-operator --type='json' -p='[
    {"op": "replace", "path": "/spec/template/spec/containers/0/image", "value": "registry.ci.openshift.org/origin/4.16-okd-scos-2024-10-18-035245@sha256:37d6b6c13d864deb7ea925acf2b2cb34305333f92ce64e7906d3f973a8071642"},
    {"op": "replace", "path": "/spec/template/spec/containers/0/env/0/value", "value": "registry.ci.openshift.org/origin/4.16-okd-scos-2024-10-18-035245@sha256:371c966fc1dfb8ad089089140309b84dc54c2a443e2db0dee5ee940120bf0e4e"},
    {"op": "replace", "path": "/spec/template/spec/containers/0/env/1/value", "value": "registry.ci.openshift.org/origin/4.16-okd-scos-2024-10-18-035245@sha256:37d6b6c13d864deb7ea925acf2b2cb34305333f92ce64e7906d3f973a8071642"},
    {"op": "replace", "path": "/spec/template/spec/containers/0/env/2/value", "value": "1.29.6"}
]'
```

Wait for the rollout of the new kube-apiserver pods to complete, this process is complete once an installer pod has the status 'Completed' on each node responsible for running the kube-apiserver. (this process takes 10 minutes on a three node control-plane)
You can monitor this process with 'watch oc get pods -n openshift-kube-apiserver-operator && oc get pods -n openshift-kube-apiserver'

'oc scale --replicas=1 deployments/cluster-version-operator -n openshift-cluster-version'