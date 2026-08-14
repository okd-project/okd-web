---
title: "[Resolved] OKD SCOS upgrades failing with authentication required"
authors: ["pskrbasu"]
date: 2026-08-13
---

If you've been hitting `authentication required` errors when trying to upgrade your OKD SCOS cluster, this has been fixed. Users have confirmed upgrades are working again.

## What happened

The OKD SCOS release payload images on `registry.ci.openshift.org` required authentication to pull, but end-user clusters don't have credentials for this registry. This meant any upgrade attempt would fail with `ImagePullBackOff` / `authentication required`, regardless of the version.

## What was fixed

The image-puller rolebinding for the OKD namespaces has been updated to allow unauthenticated pulls, matching how it already works for OCP.

Fix: [openshift/release#83361](https://github.com/openshift/release/pull/83361)

## What to do

If your upgrade was stuck, retry it — it should work now without any changes on your end.

Tracking issue: [okd-project/okd#2347](https://github.com/okd-project/okd/issues/2347)
