---
draft: false 
date: 2023-07-18
categories:
  - Build
authors:
  - jmeng
---

# State of affairs in OKD CI/CD

<!--- cSpell:ignore jmeng SCOS scos -->

[OKD](https://www.okd.io/) is a community distribution of Kubernetes which is built from Red Hat OpenShift components on
top of Fedora CoreOS (FCOS) and recently also CentOS Stream CoreOS (SCOS). The OKD variant based on Fedora CoreOS is
called [OKD or OKD/FCOS](https://github.com/okd-project/okd). The SCOS variant is often referred to as [OKD/SCOS](
https://github.com/okd-project/okd-scos/).

<!-- more -->

The previous blog posts introduced [OKD Streams](/blog/2022/10-24-OKD-Streams-Building-the-Next-Generation-of-OKD-together.md)
and [its new Tekton pipelines](/blog/2022/12-12-building-OKD-payload.md) for building OKD/FCOS and OKD/SCOS releases. This
blog post gives an overview of the current build and release processes for FCOS, SCOS and OKD. It outlines OKD's
dependency on OpenShift, an remnant from the past when its Origin predecessor was a downstream rebuild of OpenShift 3,
and concludes with an outlook on how OKD Streams will help users, developers and partners to experiment with future
OpenShift.

## Fedora CoreOS and CentOS Stream CoreOS

[Fedora CoreOS is built with a Jenkins pipeline running in Fedora's infrastructure](
https://github.com/coreos/fedora-coreos-pipeline) and is being maintained by the Fedora CoreOS team.

CentOS Stream CoreOS is built with a [Tekton pipeline](https://github.com/okd-project/okd-coreos-pipeline/) running in a
OpenShift cluster on [MOC](https://massopen.cloud/)'s infrastructure and pushed to `quay.io/okd/centos-stream-coreos-9`.
The SCOS build pipeline is owned and maintained by the OpenShift OKD Streams team and [SCOS builds are being imported
from `quay.io` into OpenShift CI as `ImageStream`s](
https://github.com/openshift/release/blob/master/clusters/app.ci/supplemental-ci-images/okd/scos.yaml).

## OpenShift payload components

At the time of writing, most payload components for OKD/FCOS and OKD/SCOS get mirrored from OCP CI releases. OpenShift
CI ([Prow](https://docs.prow.k8s.io) and [ci-operator](https://docs.ci.openshift.org/docs/architecture/ci-operator/))
periodically builds OCP images, e.g. for [OVN-Kubernetes](
https://github.com/openshift/release/blob/master/ci-operator/config/openshift/ovn-kubernetes/).
[OpenShift's `release-controller`](https://github.com/openshift/release/tree/master/core-services/release-controller)
detects changes to image streams, caused by recently built images, then builds and tests a OCP release image. When such
an release image passes all non-optional tests (also see [release gating](
https://docs.ci.openshift.org/docs/architecture/release-gating/) docs), the release image and other payload components
are mirrored to `origin` namespaces on `quay.io` (release gating is subject to [change](
https://issues.redhat.com/browse/DPTP-3565)). [For example, at most every 3 hours a OCP 4.14 release image](
https://github.com/openshift/release/blob/master/core-services/release-controller/_releases/release-ocp-4.14-ci.json)
will be deployed (and upgraded) on AWS and GCP and afterwards tested with [OpenShift's conformance test suite](
https://github.com/openshift/origin). [When it passes the non-optional tests the release image and its dependencies will
be mirrored to `quay.io/origin` (except for `rhel-coreos*`, `*-installer` and some other images)](
https://github.com/openshift/release/blob/master/core-services/release-controller/_releases/release-ocp-4.14-ci.json).
These OCP CI releases are listed with a `ci` tag at [amd64.ocp.releases.ci.openshift.org](
https://amd64.ocp.releases.ci.openshift.org/). Builds and promotions of `nightly` and `stable` OCP releases are handled
differently (i.e. outside of Prow) by the [Automated Release Tooling (ART)](
https://source.redhat.com/groups/public/openshift/openshift_wiki/openshift_automated_release_tooling_art_team_faqs)
team.

## OKD payload components

A few payload components are built specifically for OKD though, for example OKD/FCOS' [okd-machine-os](
https://github.com/openshift/okd-machine-os). Unlike RHCOS and SCOS, [okd-machine-os](
https://github.com/openshift/okd-machine-os), the operating system running on OKD/FCOS nodes,
[is layered on top of FCOS](https://github.com/openshift/okd-machine-os/blob/master/Dockerfile) (also
see [CoreOS Layering](https://github.com/coreos/enhancements/blob/main/os/coreos-layering.md),
[OpenShift Layered CoreOS](
https://github.com/openshift/enhancements/blob/master/enhancements/ocp-coreos-layering/ocp-coreos-layering.md)).

Note, some payload components have OKD specific configuration in OpenShift CI although the resulting images are not
incorporated into OKD release images. For example, [OVN-Kubernetes images are built and tested in OpenShift CI to
ensure OVN changes do not break OKD](
https://github.com/openshift/release/commit/4df7ed1775ee8a65ec5ca435ab356cfb599793cc).

## OKD releases

When OpenShift's `release-controller` detects changes to OKD related image streams, either due to updates of FCOS/SCOS,
an OKD payload component or due to OCP payload components being mirrored after an OCP CI release promotion, it builds
and tests a new OKD release image. When such an OKD release image passes all non-optional tests, the image is tagged as
`registry.ci.openshift.org/origin/release:4.14` etc. This CI release process is similar for OKD/FCOS and OKD/SCOS, e.g.
compare these examples for [OKD/FCOS 4.14](
https://github.com/openshift/release/blob/master/core-services/release-controller/_releases/release-okd-4.14.json) and
with [OKD/SCOS 4.14](
https://github.com/openshift/release/blob/master/core-services/release-controller/_releases/release-okd-scos-4.14.json).
OKD/FCOS's and OKD/SCOS's CI releases are listed at [amd64.origin.releases.ci.openshift.org](
https://amd64.origin.releases.ci.openshift.org/).

Promotions for OKD/FCOS to `quay.io/openshift/okd` (published at [github.com/okd-project/okd](
https://github.com/okd-project/okd/releases/)) and for OKD/SCOS to `quay.io/okd/scos-release` (published at
[github.com/okd-project/okd-scos](https://github.com/okd-project/okd-scos/releases/)) are done roughly every 2 to 3
weeks. For OKD/SCOS, [OKD's release pipeline](https://github.com/okd-project/okd-release-pipeline) is triggered manually
once a sprint to promote CI releases to [`4-scos-{next,stable}`](https://amd64.origin.releases.ci.openshift.org/).

## OKD Streams and customizable Tekton pipelines

However, the OKD project is currently shifting its focus from doing downstream rebuilds of OCP to [OKD Streams](
https://www.okd.io/blog/2022-10-25-OKD-Streams-Building-the-Next-Generation-of-OKD-together/). As part of this strategic
repositioning, OKD offers [Argo CD](https://argo-cd.readthedocs.io/en/stable/) workflows and [Tekton](
https://tekton.dev/) pipelines to build CentOS Stream CoreOS (SCOS) (with [okd-coreos-pipeline](
https://github.com/okd-project/okd-coreos-pipeline/)), to build OKD/SCOS (with [okd-payload-pipeline](
https://github.com/okd-project/okd-payload-pipeline)) and to build operators (with [okd-operator-pipeline](
https://github.com/okd-project/okd-operator-pipeline)). [The OKD Streams pipelines have been created to improve the
RHEL9 readiness signal for Red Hat OpenShift. It allows developers to build and compose different tasks and pipelines to
easily experiment with OpenShift and related technologies](/blog/2022/10/24/OKD-Streams-Building-the-Next-Generation-of-OKD-together/). Both
`okd-coreos-pipeline` and `okd-operator-pipeline` are already used in OKD's CI/CD and in the future
`okd-payload-pipeline` might supersede OCP CI for building OKD payload components and mirroring OCP payload components.
