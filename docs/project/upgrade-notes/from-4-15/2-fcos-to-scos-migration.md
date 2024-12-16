---
title: Node Operating System changes to SCOS
sidebar_label: FCOS -> SCOS Migration
description: OKD Node OS has changed from a Fedora to a CentOS Stream base.
---

### Background

Nodes within OKD run an operating system that ships as a component of the cluster. In OKD \<4.15 you could run an OKD package that incorporated Fedora or CentOS Stream. These builds came from entirely seperate build pipelines, with a long term intention to converge them over time.

As well as the node operating system, there are many cluster components that share a common base image. In versions prior to 4.15 the base image used contained RHEL-polluted content. This was the cause of the pause of releases during the majority of 2024.

In producing OKD 4.16 the decision was taken for both the Node Operating System and Base Image to be based off CentOS Stream. This was to reduce the complexity of rebuilding all the cluster component containers (as CentOS Stream is closer to RHEL) and also to concentrate efforts on the single overall assembly pipeline as builds resumed.

### Moving from FCOS to SCOS for existing clusters

When you perform an upgrade from 4.15 to 4.16 your node operating system will transition from FCOS to SCOS automatically. 

### When might I see issues moving from node OS FCOS to SCOS?

In the vast majority of cases, you should be able to move between FCOS and SCOS without issue (as this kind of checkout/rebase is a usecase of the underlying `ostree` system).

Where you may encounter issue is if you have (probably inadvertanly) made use of features from system components that rely on newer package or kernel version that is present in Fedora but isn't present in CoreOS Stream.

:::note
If you experience issues transitioning between FCOS and SCOS please report or start a discussion on our [GitHub project](https://github.com/okd-project/okd).
:::

We have seen reports related to ext4 features that were present on FCOS installs but not available on SCOS.

### Will you reintroduce a method to support Fedora based node operating systems or base images

There are lab, research and experimental reasons which may mean you want to be running newer packages or kernels than what's available in CentOS Stream. Should you have the resource to do so, we encourage contributions in this area to look at how we can provide both alternative Node Operating Systems (ie Fedora) and even base contianer images for certain cluster components. Please get in touch!

### Where can I get boot artifacts for SCOS?

The FCOS team provide a variety of bootable media for FCOS. The equivalent is not yet available for SCOS but is in progress at the time of writing.

### FCOS -> SCOS for new clusters

Until bootable media is available, you can use FCOS as a live boot image to then "pivot" into a SCOS installation based off the cluster ignitiion manifests and SCOS version. Follow the normal installation procedure for your platform.

As mentioned above we have seen issues related to ext4 issues on FCOS systems that prevent the pivot from FCOS to SCOS in certain setups.
Please see [this issue (#2041)](https://github.com/okd-project/okd/issues/2041) for more information and workarounds.
