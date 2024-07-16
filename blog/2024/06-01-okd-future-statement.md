---
draft: false 
date: 2024-06-01
---

# OKD Working Group Statement

<!-- cSpell:ignore SCOS ostree homelabs -->

We would like to take a moment to outline what's been happening the past few months in terms of OKD releases and what the future holds for the project. 

In Summer of 2023, it came to the attention of Red Hat that licensed content was inadvertently being included in the OKD releases. This necessitates a change of the OKD release materials. At the same time, the Working Group has been striving to increase the community's direct involvement in the build and release process. To address these concerns, Red Hat and the Working Group have been collaborating on defining a path forward over the past few months. This work involves moving OKD builds to a new system, changing the underlying OS, and exposing the new build and release process to community members. 

After careful consideration, we've settled on using Centos Stream CoreOS (SCOS) as the underlying operating system for the new builds. We've been working with SCOS since it was first announced at KubeCon U.S. 2022. There's a great opportunity with SCOS for the larger Open Source community to participate in improving OKD and further delineating it from other Kubernetes distributions. The builds will be for x86_64 only while we get our bearings. Given rpm-ostree is the foundation of all modern OKD releases, many existing installations will be able to switch to the SCOS distribution in-place. We're working to outline that procedure in our documentation and identify any edge-cases that may require more work to transition.

The payload for OKD on SCOS is now successfully building. There are still end-to-end tests which need to complete successfully and other housekeeping tasks before pre-release nightly builds can spin up an active cluster. We anticipate this happening within the next few weeks. At that point, members of the community will be able to download these nightly builds for testing and exploration purposes.

On the community involvement and engagement side of things, we'll be relaunching our website to align with the first official release of OKD on SCOS. That site will feature much clearer paths to the information users want to get their clusters up and running. We're redoubling our efforts to help homelabs, single-node, and other similar use cases get off the ground. Likewise, the new website will provide much clearer information on how community members can contribute to the project. 

We appreciate everyone's patience over the past few months while we solidified the path forward. We wanted to be confident the pieces would fit together and bring about the desired results before releasing an official statement. From here on out, there will be regular updates on our website.

We understand that there will be lots of questions as this process moves forward. Please post those questions on [this discussion thread](https://github.com/okd-project/okd/discussions/1922). We will organize them into this [Frequently Asked Questions page](https://okd.io/scos-migration-faq/).

Many thanks,

The OKD Working Group Co-Chairs