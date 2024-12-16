---
title: Upgrading from OKD 4.15 to 4.17
sidebar_label: From 4.15 to 4.17
description: Upgrading to OKD 4.17 for existing 4.15 clusters requires special attention and passing through 4.16.
---

import DocCardList from '@theme/DocCardList';

Please also see the [4.16 and 4.17 release blog post](/blog/2024/12/16/okd-4-16-and-4-17-release).

There was a large gap of releases after 4.15. 4.16 and 4.17 were released concurrently based off a significantly different build process. OKD 4.16 is only intended to be used as a pass-through for clusters going from 4.15 through to 4.17.

Extra care should be taken for upgrading an existing OKD 4.15 cluster to 4.17.

Your cluster will need to pass from OKD 4.15, to the latest version of 4.16 before proceeding to 4.17.

Upgrades should take place from the March 2024 FCOS stream of OKD (`4.15.0-0.okd-2024-03-10-010116`), upgrades from other versions may require additional work.

:::tip
Read these notes in conjunction with the usual [Product Documentation for Upgrading](https://docs.okd.io/4.16/updating/index.html)
:::

<DocCardList />

