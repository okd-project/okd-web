---
draft: false
date: 2022-10-24
authors:
  - dmueller
---

# OKD Streams - Building the Next Generation of OKD together

<!--- cSpell:ignore dmueller SCOS productized Thorsten Schwesig Humair Coufal Hild Zuccarelli Sherine Khoury Vadim Rutkovsky Alessandro Stefano Magiera Marrich Glombek Gompa massopen Innes -->

OKD is the community distribution of Kubernetes that powers Red Hat OpenShift. The OKD community has created reusable Tekton build pipelines on a shared Kubernetes cluster for the OKD build pipelines so that they could manage the build & release processes for OKD in the open.

<!-- more -->

With the [operate-first.cloud](https://www.operate-first.cloud/)<!--{target=_blank} comment for docusaurus compat--> hosted at the [massopen.cloud](https://massopen.cloud/)<!--{target=_blank} comment for docusaurus compat-->, the OKD community has launched a fully open source release pipeline that the community can participate in to help support and manage the release cycle ourselves. The OKD Community is now able to build and release stable builds of OKD 4.12 on both Fedora CoreOS and the newly introduced CentOS Stream CoreOS. We are calling it OKD Streams.

## New Patterns, New CI/CD Pipelines and a new CoreOS

Today we invite you into our OKD Streams initiative. An OKD Stream refers to a build, test, and release pipeline for any configuration of OKD, the open source kubernetes distribution that powers OpenShift. The [OKD working group](http://okd.io)<!--{target=_blank} comment for docusaurus compat--> is pleased to announce the availability of tooling and processes that will enable building and testing many configurations, or "**streams**".  The OKD Working Group and Red Hat Engineering are now testing one such stream that runs an upstream version of RHEL9 via CentOS Streams CoreOS (‘SCOS’ for short) to improve our RHEL9 readiness signal for Red Hat OpenShift. It is the first of many OKD Streams that will enable developers inside and outside of Red Hat to easily experiment with and explore Cloud Native technologies. You can check out our [MVP OKD on SCOS release here](https://origin-release.apps.ci.l2s4.p1.openshiftapps.com/dashboards/overview#4-scos-stable)<!--{target=_blank} comment for docusaurus compat-->.

With this initiative, the [OKD working group](http://okd.io)<!--{target=_blank} comment for docusaurus compat--> has embraced new patterns and built new partnerships. We have leveraged the concepts in the [open source managed service ‘Operate First’ pattern](https://www.operate-first.cloud/blog/operate-first-operate-open-governance-and-hybrid/)<!--{target=_blank} comment for docusaurus compat-->, worked with the CentOS and CoreOS communities to build [a pipeline for building SCOS](https://github.com/okd-project/okd-coreos-pipeline)<!--{target=_blank} comment for docusaurus compat--> and applied new CI/CD technologies (Tekton) to build a new OKD release build pipeline service. The [MVP of OKD Streams](https://origin-release.apps.ci.l2s4.p1.openshiftapps.com/dashboards/overview#4-scos-stable)<!--{target=_blank} comment for docusaurus compat-->, for example, is an SCOS backed version of OKD built with a Tekton pipeline managed by the OKD working group that runs on AWS infrastructure managed by Operate First. Together we are unlocking some of the innovations to get better (and earlier) release signals for Kubernetes , OCP and RHEL and to enable the OKD community to get more deeply involved with the OKD build processes.

The OKD Working group wanted to make participation in all of these **activities** easier for all Cloud Native developers and this has been the motivating force behind the OKD Streams initiative.

## From the ‘One Size Fits All’ to ‘Built to Order’

There are main three problems that both the OKD working group and Red Hat Engineering teams spend a lot of time thinking about:

1. how do we improve our release signals for OpenShift, RHEL, CoreOS
2. how do we get features into the hands of our customer and partners faster
3. how do we enable engineers to experiment and innovate

Previously, what we referred to as an ‘OKD’ release, was built on the most recent release of [OKD running on the latest stable release of Fedora CoreOS](https://origin-release.apps.ci.l2s4.p1.openshiftapps.com/dashboards/overview#4.12.0-0.okd)<!--{target=_blank} comment for docusaurus compat--> (FCOS for short).  In actuality, we had a singular release pipeline that built a release of OKD with a bespoke version of FCOS. These releases of OKD gave us early signals for the impact of new operating system features that would eventually be landing in RHEL, where they will surface in RHEL CoreOS (RHCOS). It was (and still is) a very good way for developers to experiment with OKD and explore its functionality.

The OKD community wanted to empower wider use of OKD for experimentation in more use cases that required layering on additional resources in some cases, and in others use cases, reducing the footprints for edge and local deployments. OKD has been stable enough for some to run production deployments. CERN’s OKD deployment on OpenStack, for example, is assembled with custom OKD build pipelines. The feedback from these OKD builds has been a source of inspiration for this OKD Streams initiative to enable more such use cases.

The OKD Streams initiative invites more community input and feedback quickly into the project without interrupting the productized builds for OpenShift and OpenShift customers. We can experiment with new features that can then get pushed upstream into Kubernetes or downstream into the OpenShift product. We can reuse the Tekton build pipelines for building streams specific to HPC or Openstack or Bare Metal or whatever the payload customization needs to be for their organizations.

Our goal is to make it simple for others to experiment.

We are experimenting too. The first OKD Streams ‘experiment’ built with the new Tekton build pipeline running on an Operate First AWS Cluster is OKD running on SCOS, which is a future version of OpenShift running on a near-future version of RHEL that's leveraging CentOS Streams CoreOS. This will improve our RHEL9 readiness signal for OCP. Improved RHEL9 readiness signals with input from the community will showcase our work as we explore what the new OKD build service is going to mean for all of us.

## Tekton Pipelines as the Building Blocks

Our new OKD Streams are built using Tekton pipelines, which makes it easier for us to explore building many different kinds of pipelines.

Tekton is a Continuous Deployment (CD) system that enables us to run tasks and pipelines in a composable and flexible manner. This fits in nicely with our OKD Streams initiative where the focus is less on the artifacts that are produced than the pipeline that builds it.

While OKD as a payload remains the core focus of the OKD Working Group, we are also collaborating with the Operate First Community to ensure that anyone is able to take the work we have done and lift and shift it to any cloud enabling OKD to run in any Kubernetes-based infrastructure anywhere. Now anybody can experiment and build their own ‘stream’ of OKD with the Tekton pipeline.

This **new pipeline** approach enables builds that can be customized via parameters, even the tasks within the pipeline can be exchanged or moved around. Add your own tasks. They are reusable templates for creating your own testable stream of OKD. Run the pipelines on any infrastructure, including locally in Kubernetes using podman, for example, or you can run them on a vanilla Kubernetes cluster. We are enabling access to the Operate First managed OKD **Build Service** to deploy more of these builds and pipelines to get some ideas that we have at Red Hat out into the community for early feedback AND to let other community members test their ideas.

As an open source community, we’re always evolving and learning together. Our goal is to make OKD the goto place to experiment and innovate for the entire OpenShift ecosystem and beyond, to showcase new features and functionalities, and to fail fast and often without impacting product releases or incurring more technical debt.

## THE ASK

Help drive faster innovation into OCP, OKD, Kubernetes and RHEL along with the multitude of other Cloud Native open source projects that are part of the OpenShift and the cloud native ecosystem.

-   [Download the MVP OKD/SCOS](https://github.com/okd-project/okd-scos/releases/tag/4.12.0-0.okd-scos-2022-10-25-053756)<!--{target=_blank} comment for docusaurus compat--> build and deploy it!
-   Review our [Tekton OKD Build pipelines](https://github.com/okd-project/okd-coreos-pipeline)<!--{target=_blank} comment for docusaurus compat-->. Try running them on your own Kubernetes cluster with Tekton - help us make our pipelines more efficient and easier to re-use.
-   Review our [pipeline documentation](https://github.com/okd-project/okd-coreos-pipeline/blob/main/README.md)<!--{target=_blank} comment for docusaurus compat--> and help us make it better.
-   Fork our pipelines and add your own tasks and resources and let us know how it goes.
-   Come to an [OKD Working Group meeting](https://calendar.fedoraproject.org/list/okd/)<!--{target=_blank} comment for docusaurus compat--> and share your OKD use cases with the rest of the community. We’ll help you connect with like minded collaborators!

This project is a game changer for lots of open source communities internally and externally. We know there are folks out there in the OKD working group and in the periphery that haven't spoken up and we'd love to hear from you, especially if you are currently doing bespoke OKD builds. Will this unblock your innovation the way we think it will?

## Additional Resources

-   [OKD Github](https://github.com/okd-project)<!--{target=_blank} comment for docusaurus compat-->
-   [OKD.io](https://okd.io)<!--{target=_blank} comment for docusaurus compat-->
-   [MVP Release page]( https://origin-release.apps.ci.l2s4.p1.openshiftapps.com/dashboards/overview#4-scos-stable)<!--{target=_blank} comment for docusaurus compat-->
-   [Introducing OKD Streams](https://www.youtube.com/watch?v=ClHdiChDh3Q)<!--{target=_blank} comment for docusaurus compat-->
-   [Full OKD Streams playlist](https://youtube.com/playlist?list=PLaR6Rq6Z4Iqck7Z0ekuJdsMU1fE6hkd6d)<!--{target=_blank} comment for docusaurus compat-->
-   [Operate First Principles](https://www.operate-first.cloud/blog/operate-first-operate-open-governance-and-hybrid)<!--{target=_blank} comment for docusaurus compat-->

## Kudos and Thank you

Operate First’s Infrastructure Team: Thorsten Schwesig, Humair Khan, Tom Coufal, Marcel Hild
Red Hat’s CFE Team: Luigi Zuccarelli, Sherine Khoury
OKD Working Group: Vadim Rutkovsky, Alessandro Di Stefano, Jaime Magiera, Brian Innes
CentOS Cloud and HPC SIGs: Amy Marrich, Christian Glombek, Neal Gompa
