# OKD SCOS 4.16 Frequently Asked Questions
 
<!--cSpell:ignore SCOS -->

This FAQ document relates to the builds of OKD that use CentOS Stream CoreOS (SCOS) after work done to stop using RHEL as the base for cluster components, as well as the upgrade path from pre-4.16 OKD FCOS/SCOS installations.

- [When will OKD SCOS be released?](https://okd.io/docs/project/scos-migration-faq#When-will-OKD-SCOS-be-released)
- [Will there be any more releases of OKD FCOS?](https://okd.io/docs/project/scos-migration-faq#Will-there-be-any-more-releases-of-OKD-FCOS)
- [Can OKD FCOS clusters transition to OKD SCOS?](https://okd.io/docs/project/scos-migration-faq#Can-OKD-FCOS-clusters-transition-to-OKD-SCOS)
- [What is the status of Operators on OKD SCOS?](https://okd.io/docs/project/scos-migration-faq#What-is-the-status-of-Operators-on-OKD-SCOS)
- [Can I use a Red Hat pull secret to enable OCP-related content such as operators?](https://okd.io/docs/project/scos-migration-faq#Can-I-use-a-Red-Hat-pull-secret-to-enable-OCP-related-content-such-as-operators)
- [What platforms has OKD SCOS been tested on?](https://okd.io/docs/project/scos-migration-faq#What-platforms-has-OKD-SCOS-been-tested-on)
- [What are the known issues with OKD SCOS 4.16?](https://okd.io/docs/project/scos-migration-faq#What-are-the-known-issues-with-OKD-SCOS-416)
- [Why does the OKD SCOS 4.16 installer require nodes to be running FCOS?](https://okd.io/docs/project/scos-migration-faq#Why-does-the-OKD-SCOS-416-installer-require-nodes-to-be-running-FCOS)

## When will OKD SCOS be released?

A. We're currently working through several issues and gathering results from community members performing installations on GCP, Azure, and bare metal. We expect to release 4.16 in November, with 4.17 to follow shortly thereafter.

## Will there be any more releases of OKD FCOS?

A. At this time, the Working Group has chosen to focus on SCOS releases. You can read more about that decision in our [June 2024 blog post](https://okd.io/blog/2024/06/01/okd-future-statement/). We may revisit FCOS support at a later time, once we've solidified our CI/CD infrastructure and reached a certain level of community involvement. 

## Can OKD FCOS clusters transition to OKD SCOS?

A. Yes. The upgrade path requires that your FCOS-based cluster be running 4.15. From there, clusters can be updated to 4.16 SCOS. We're working on a guide for those transition. It's currently a [merge request in our website repo](https://github.com/okd-project/okd-web/pull/22/files) while being worked on. Feeback is welcome.

## What is the status of Operators on OKD SCOS?

A. We are currently development an OKD-specific operator catalog that will provide community versions of the most popular operators. We're always looking for volunteers to build and test operators. Please reach out if you're interested. Our website has a [page with more information about the operators effort](https://okd.io/docs/operators/).

## Can I use a Red Hat pull secret to enable OCP-related content such as operators?

A. No, this would be a violation of Red Hat's Terms of Service.

## What platforms has OKD SCOS been tested on? 

A. Currently, the OKD CI tests Installer Provided Infrastructure (IPI) on AWS and vSphere. We're looking for community members to test installations on GCP, Azure, and Bare Metal. Please reach out if you can volunteer to help. 

## What are the known issues with OKD SCOS 4.16?

When OKD 4.16 is released, we'll have an official "OKD SCOS 4.16 Release Notes" document with known issues. In the meantime, please see this hackmd file where we're tracking issues.  

## Why does the OKD SCOS 4.16 installer require nodes to be running FCOS?

Currently, we don't have a solution to consistently build SCOS images for nodes. So, the installer uses rpm-ostree to pivot the nodes from FCOS to SCOS content. We expect to have access to consistent SCOS image builds in the coming months. We will make an announcement when that happens.




