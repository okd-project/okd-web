Starting cluster version 4.15.0-0.okd-2024-03-10-010116
Target cluster version 4.16.0-0.okd-scos-2024-08-15-225023

Use https://amd64.origin.releases.ci.openshift.org/graph to find digest for target cluster version

Run the following command to start the cluster upgrade process oc adm upgrade --to-image=registry.ci.openshift.org/origin/release-scos@sha256:edf5e6b84df328781795e4b4e27cd1d277f6d997922fe1b9dcea71e0f3ecf687 --allow-explicit-upgrade 

The clusterversion will show failed status shortly after the process starts, cluster-version-operator pod logs or clusterversion operator object will show an error similar to ```message: 'Could not update customresourcedefinition "infrastructures.config.openshift.io" (47 of 903): the object is invalid, possibly due to local cluster configuration'```

To continue the cluster upgrade process the following steps are required:
1) Scale down the cluster-version-operator to pause the update process
`oc scale --replicas=0 deployments/cluster-version-operator -n openshift-cluster-version`

2) Run the following and take note of the output ```oc adm release info --image-for=hyperkube registry.ci.openshift.org/origin/release-scos@sha256:edf5e6b84df328781795e4b4e27cd1d277f6d997922fe1b9dcea71e0f3ecf687```
2a) Output -```registry.ci.openshift.org/origin/4.16-okd-scos-2024-08-15-225023@sha256:db7fcff06af8da4cd273cb094456885627234f928c402b4e6e7fb1ef90f9ccf0``` (HYPERKUBE)

3) Run the following and take note of the output ```oc adm release info --image-for=cluster-kube-apiserver-operator registry.ci.openshift.org/origin/release-scos@sha256:edf5e6b84df328781795e4b4e27cd1d277f6d997922fe1b9dcea71e0f3ecf687```
3a) Output -  ```registry.ci.openshift.org/origin/4.16-okd-scos-2024-08-15-225023@sha256:37d6b6c13d864deb7ea925acf2b2cb34305333f92ce64e7906d3f973a8071642``` (KUBE_API)

Modify the openshift-kube-apiserver-operator deployment with ```oc edit -n openshift-kube-apiserver-operator deployments/kube-apiserver-operator```

Replace the value of the 'kube-apiserver-operator' image with the output returned in step 3a, e.g. `registry.ci.openshift.org/origin/4.16-okd-scos-2024-08-15-225023@sha256:37d6b6c13d864deb7ea925acf2b2cb34305333f92ce64e7906d3f973a8071642`

Replace the value of the OPERATOR_IMAGE environment variable the output returned in step 3a, e.g. `registry.ci.openshift.org/origin/4.16-okd-scos-2024-08-15-225023@sha256:37d6b6c13d864deb7ea925acf2b2cb34305333f92ce64e7906d3f973a8071642`

Replace the value of the IMAGE environment variable with the the output returned in step 2a, e.g. 'registry.ci.openshift.org/origin/4.16-okd-scos-2024-08-15-225023@sha256:db7fcff06af8da4cd273cb094456885627234f928c402b4e6e7fb1ef90f9ccf0'

Replace the value of the OPERAND_IMAGE_VERSION environment variable with the value 1.29.6

Wait for the rollout of the new kube-apiserver pods to complete, this process is complete once an installer pod has the status 'Completed' on each node responsible for running the kube-apiserver. (this process takes 10 minutes on a three node control-plane)
You can monitor this process with 'watch oc get pods -n openshift-kube-apiserver-operator && oc get pods -n openshift-kube-apiserver'

Scale up the cluster-version-operator to continue the update process
'oc scale --replicas=1 deployments/cluster-version-operator -n openshift-cluster-version'

Use the following command to observe progress
watch oc get co,nodes,mcp,clusterversion