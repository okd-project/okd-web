---
title: "OKD Now Has Its Own Update Service: Announcing OKD Cincinnati"
authors: ["jatinsu"]
date: 2026-09-18
---

OKD clusters now have a dedicated update service. **OKD Cincinnati** is live at
[updates.okd.io](https://updates.okd.io) and serves update graphs to OKD/SCOS clusters over the
same Cincinnati update protocol that OpenShift clusters have used for years.

<!-- truncate -->

Until now, OKD relied on the release controller to create upgrade edges which was something it was never
really built to do. That caused a number of problems, from
[`ec` versions leaking into stable channels](https://github.com/okd-project/okd/issues/2315) to the
[inability to block already-accepted releases](https://github.com/okd-project/okd/issues/2348).
Cincinnati fixes these issues while simplifying over-the-air (OTA) updates.

## What is Cincinnati?

Cincinnati is the update service behind OpenShift's OTA upgrades. It builds a graph of releases
and the valid upgrade edges between them, then serves the slice of that graph relevant to your
cluster's channel and architecture. It has two components:

- a **graph-builder**, which scrapes release payloads and secondary metadata to assemble the graph, and
- a **policy-engine**, which filters that graph per request (by channel and architecture) and serves it to clusters.

## What's different for OKD's Cincinnati instance

OKD Cincinnati runs the same upstream [openshift/cincinnati](https://github.com/openshift/cincinnati)
code, but every data source points at the OKD world instead of OpenShift:

- **Release payloads** are scraped from `quay.io/okd/scos-release` (SCOS builds), not `ocp-release`.
- **Graph data** comes from [okd-project/cincinnati-graph-data](https://github.com/okd-project/cincinnati-graph-data),
  the community-owned repository of channels and upgrade risks.

## Channels available today

At launch, OKD Cincinnati serves two channels:

| Channel         | Covers               |
| --------------- | -------------------- |
| `stable-5.0`    | 5.0                  |
| `candidate-5.0` | 4.22 `ec` → 5.0 `ec` |

Each stable channel carries the prior minor plus its own, so you always have a supported path onto
the next release. The `candidate-5.0` channel carries pre-release (`ec`) builds if you want to test
what's coming before it lands in stable.

## Upgrade risks, handled

Not every build is safe to upgrade into, and OKD Cincinnati handles that the same way OpenShift does
— through **blocked edges**. For example, `4.22.0-okd-scos.4` through `.6` are blocked because CRI-O
1.36.1 could hang during node shutdown and wipe the image store on reboot; the graph steers clusters
around those builds and onto `scos.7+`, where the issue is fixed. Risks are declared in the graph-data
repo and carried forward automatically until a fix ships.

## Built to be boringly reliable

The service runs on the AppSRE platform across stage and production, with autoscaling, a
PodDisruptionBudget, Prometheus alerting, and SLOs for availability, error rate, and latency
(policy-engine p90 under 3 seconds). Early load testing against stage was comfortable — p90 latency
held around 19 ms up to 1,000 requests per second, roughly a 150× margin under the latency SLO — and
the load test now re-runs automatically after every stage deploy.

## Pointing your cluster at it

To receive updates, first upgrade to 5.0.0-okd-scos.0, then set your cluster's upstream to the OKD graph endpoint and pick a channel:

```sh
oc patch clusterversion version --type merge \
  -p '{"spec":{"upstream":"https://updates.okd.io/api/updates/graph","channel":"stable-5.0"}}'
```

Available updates will then show up as usual:

```sh
oc adm upgrade
```

:::note
Starting with OKD 5.1, clusters that aren't using OKD Cincinnati will start showing an
informational alert suggesting you switch over. The cluster-version operator won't change your
update service for you — it simply lets you know. See
[cluster-version-operator#1466](https://github.com/openshift/cluster-version-operator/pull/1466)
for the details.
:::

Special thanks to Red Hat's OTA and AppSRE teams for helping us onboard and for hosting our service.
Point a cluster at [updates.okd.io](https://updates.okd.io), and let us know how it goes!
