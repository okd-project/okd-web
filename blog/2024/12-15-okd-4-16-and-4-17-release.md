---
title: OKD 4.17 and 4.16 releases
authors: ["zedsm"]
date: 2024-12-05
unlisted: true
---

We are pleased to announce the release of OKD 4.17, alongside OKD 4.16 to allow upgrades for existing 4.15 clusters.

:::warning
4.16 is intended only as a pass-through for existing 4.15 clusters. Upgrading existing 4.15 cluster will require manual interventions and special care due to major changes in how OKD is built and assembled which have introduced various side effects.
:::

## You're late, why?

Yes, we are. OKD builds became polluted with RHEL content that was included in "payload components" (e.g cluster-infrastructure operators, images, etc that made up OKD). This was highlighted in Summer 2023 and heading into 2024 all OKD releases were stopped until this issue was addressed.

After significant work from a few engineers at RedHat, all components that make up OKD should now be free from RHEL artifacts. This required significant work to build infrastructure and process and chasing issues related to discrepancies between CentOS and RHEL. Most OKD components are now based off CentOS Stream as the base image layer (the license-free upstream to RHEL).

## I want to install a new cluster

New cluster installations can follow the normal process. Downloads of client tools with the latest versions of OKD 4.17 embedded can be found HERE

## I want to upgrade an existing cluster

We recommended attempting upgrades from the latest released version of OKD FCOS 4.15 (`4.15.0-0.okd-2024-03-10-010116`).

Upgrading existing 4.15 cluster will require manual interventions and special care due to major changes in how OKD is built and assembled which have introduced various side effects.

There is a new area for upgrade notes covering the 4.15 through 4.17

:::info
[OKD Upgrade Notes: From 4.15](/docs/project/upgrade-notes/from-4-15/)
:::

## Node operating systems are now based off CentOS Stream CoreOS (SCOS)

As part of this work we have also changed the node operating system to be based off CentOS Stream CoreOS (SCOS) rather than Fedora CoreOS (FCOS). It's worth noting that this work was not part of the OKD Streams (where we produced concurrent releases for FCOS and SCOS) project which for now has been suspended.

The build process for SCOS and it's assembly into OKD in versions greater than 4.16 is vastly different to how it happened as part of OKD Streams in version 4.15 and below.

:::warning
There are known issues and regressions related to the move from FCOS to SCOS that may effect new and existing clusters. Please refer to [OKD Upgrade Notes: From 4.15](/docs/project/upgrade-notes/from-4-15/)
:::

## Special thanks

The OKD Working Group would like to thank [Prashanth Sundararaman](https://github.com/Prashanth684) of RedHat for their work 


