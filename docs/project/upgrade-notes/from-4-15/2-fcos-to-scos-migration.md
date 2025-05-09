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

:::danger
[You must disable Secure Boot before pivoting from FCOS to SCOS](#scos-does-not-support-secure-boot). Secure Boot is enabled by default on VMWare platforms.
:::

### When might I see issues moving from node OS FCOS to SCOS?

In the vast majority of cases, you should be able to move between FCOS and SCOS without issue (as this kind of checkout/rebase is a usecase of the underlying `ostree` system).

Where you may encounter issue is if you have (probably inadvertanly) made use of features from system components that rely on newer package or kernel version that is present in Fedora but isn't present in CoreOS Stream.

:::note
If you experience issues transitioning between FCOS and SCOS please report or start a discussion on our [GitHub project](https://github.com/okd-project/okd).
:::

We have seen reports related to ext4 features that were present on FCOS installs but not available on SCOS.

### Will you reintroduce a method to support Fedora based node operating systems or base images

There are lab, research and experimental reasons which may mean you want to be running newer packages or kernels than what's available in CentOS Stream. Should you have the resource to do so, we encourage contributions in this area to look at how we can provide both alternative Node Operating Systems (ie Fedora) and even base container images for certain cluster components. Please get in touch!

### Where can I get boot artifacts for SCOS?

The FCOS team provide a variety of bootable media for FCOS. The equivalent is not yet available for SCOS but is in progress at the time of writing.

### FCOS -> SCOS for new clusters

Until bootable media is available, you can use FCOS as a live boot image to then "pivot" into a SCOS installation based off the cluster ignitiion manifests and SCOS version. Follow the normal installation procedure for your platform.

As mentioned above we have seen issues related to ext4 issues on FCOS systems that prevent the pivot from FCOS to SCOS in certain setups.
Please see [this issue (#2041)](https://github.com/okd-project/okd/issues/2041) for more information and workarounds.

### SCOS does not Support Secure Boot

:::danger
Migrating a node from FCOS to SCOS whilst secure boot is enabled may make the node **unbootable**.
:::


CentOS Stream 9 does not currently support Secure Boot in all environments. Work is being done within CentOS Stream to ensure that either CentOS Stream 9 gains secure boot or to ensure that it is available within CentOS Stream 10.

FCOS does support Secure Boot and so if secure boot is enabled on your node then the pivot from FCOS to SCOS will render the node **unbootable** until Secure Boot is disabled. The usual backout method of FCOS/SCOS will likely not work due to where this occurs in the boot process.

#### Why?

Briefly, secure boot is usually implemented in the Linux ecosystem by distributions (such as Fedora, Ubuntu and CentOS) using a piece of software called [`shim`](https://github.com/rhboot/shim). `shim` is a simple piece of software that verifies and runs the "real" bootloader of the distribution (e.g. `grub`), ensuring that it is properly signed by the distribution's relevant certificates. The maintainers of the Linux distribution submit their build of `shim` to a [review board](https://github.com/rhboot/shim-review/blob/main/docs/submitting.md) and then to bodies like Microsoft who will [sign the shim](https://techcommunity.microsoft.com/blog/hardwaredevcenter/updated-uefi-signing-requirements/1062916) so that it is then bootable on machines with Secure Boot enabled (that use the Microsoft Secure Boot CAs).

At boot time, the UEFI environment verifies that the `shim` is properly signed by a CA (such as Microsoft), permits the boot and then the `shim` verifies that the "real" bootloader (e.g. `grub` or `systemd-boot`) is properly signed by the distribution before delegating the rest of the boot to it. This allows the distribution to independently update the "real" bootloader without going through the lengthy verification process that the `shim` does (which is a much smaller and less updated piece of software).

Although CentOS Stream 9 has a shim, it has [not completed the review board process](https://github.com/rhboot/shim-review/issues/399) and so is not currently trusted by the majority of Secure Boot enabled systems. If you were so inclined, you could manually trust the shim through "Machine Owner Keys" using tools such as `mokutil`, however that's outside the scope of this document.