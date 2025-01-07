---
title: Extra steps for users with Hashicorp Vault and similar applications
sidebar_label: Hashicorp Vault & default registry semantics
description: Default registry changes effects Vault and other applications
---

Hashicorp Vault is known to cause trouble while upgrading. The issues are not solely related to Hashicorp Vault but can occur on any other application stack with similar characteristics. 

While upgrading OKD 4.15 cluster to 4.16 and afterwards 4.16 to 4.17 (auto upgrade), you could most probably run into the same issues when your Hashicorp Vault/ other applications meet the following requirements.
- A `PodDisruptionBudget` is set, e.g. 2 of 3 Pods have to be up and running (ready).

Usually the compute nodes are updated one after the other, but if one of the vault pods can't achieve a ready state you reach the minimal allowed pods 2 of 3. Another compute node can't be drained because of the `PodDisruptionBudget` as it would violate the 2 of 3 requirement. In that special case, let's say compute node 0 was updated, vault pod restarted and therefore is sealed. Only after you manually unseal it, the pod will become ready. If another application has a similar behavior, needing some manual work to become ready, you will face the same issue.

If you think that all your pods start up automatically, you are not using Hashicorp Vault and there is no chance that you could run into these issues, I'm sorry to say that, but you're wrong and I will give you another example.

In OKD 4.15 you could have deployed your application stack using `image: foo/bar:1.0.0` (Registry not explicitly set). By default you would expect, and this was working so far, that the image is pulled from docker hub. 

Back to `PodDisruptionBudget` and a slightly different behavior on 4.16. During the 4.15 to 4.16 Upgrade, your application has e.g. 2 of 3 pods (ready) requirement, one pod is not coming up, because suddenly it tries to pull from the Red Hat registry and the events could show something like `Failed to pull image foo/bar:1.0.0”: unable to retrieve auth token: invalid username/password: unauthorized: Please login to the Red Hat Registry using your Customer Portal credentials`. Which you typically not see right away. Two pods are running, one is stuck here, the cluster update process can't continue to drain another node, as it would violate the `PodDisruptionBudget` setting. So it's not only about Hashicorp Vault and sealed pods, but similar setups, maybe not specifying the registry in deployments and using something like `PodDisruptionBudget`.

## Recommendation
1. Open `Administrator -> Workloads -> Pods -> Project vault` (or your project where you know that the pods are using a PodDisruptionBudget)
OR `oc get pods -n my-project`
All pods should be up and running

2. Open `Administrator -> Administration -> Cluster Settings`
It shows the overview of the update cluster process

3. Additionally open `Administrator -> Workloads -> Pods -> All Projects` (Sorted by `Created` newest first)
OR `oc get pods --sort-by=.metadata.creationTimestamp --all-namespaces`
This view can help figure to see if pods are failing to come up.

Useful cli commands
```bash
# Gives you an overview of the cluster operator update process. 
# They should end up with the new 4.16/ 4.17 Version, Available: True, Progressing: False, Degraded: False
watch -n1 oc get co
# check the machine config pool
# master and worker should be Updated: True, Updating: False, Degraded: False
oc get mcp
# Having issues with master or worker pool, you can get some extra information via
oc describe mcp worker
# The above command could e.g. Show an output like
# Message: Node compute1.my-domain.com.lan is reporting: "failed to drain node: compute1.my-domain.com.lan after 1 hour...
# You can then dive into gathering information of that specific node via
oc describe node/compute1.my-domain.com.lan
```

Optional: consider white-/blacklisting registries.
`oc edit image.config.openshift.io/cluster`
Setting `allowedRegistries` and black list e.g. red hat registry.
> https://docs.okd.io/4.15/openshift_images/image-configuration.html#images-configuration-file_image-configuration


## Summary
If your application stack has a `PodDisruptionBudget`, e.g. 2 of 3 has to be ready. Check that all pods are running (if Hashicorp Vault, don't forget to unseal the pods). Make sure to explicitly set the registry from where an image should be pulled e.g. `docker.io/foo/bar:x.x.x`.
If you run into one of the mentioned issues and you end up in a timeout during the cluster upgrade process, don't worry, it will continue automatically after the issue is resolved (Even after waiting a longer period of time e.g. 12 hours).
