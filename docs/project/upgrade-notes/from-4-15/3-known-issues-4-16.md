---
title: OKD 4.16 has Known Issues
sidebar_label: OKD 4.16 Known Issues
description: OKD 4.16 should only be used as a step-thru to 4.17
---

OKD 4.16 was released simulteanously with OKD 4.17.

The purpose of the OKD 4.16 release was to provide an upgrade path to exisitng OKD \<4.15 clusters.

It is not intended that clusters should remain on OKD 4.16. After completing [the manual steps](2-fcos-to-scos-migration.md) to take your cluster to 4.16, you should proceed immediately to the 4.17 version which is available.

## Known Issues - 4.16
- metal3 pod crash on baremetal ([#2030](https://github.com/okd-project/okd/issues/2030))
