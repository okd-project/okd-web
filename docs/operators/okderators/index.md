# OKDerators

:::warning
OKDerators is a WIP project that is in active development. 
Use with caution! We are looking for contributors!
:::


## What are OKDerators?

OKDerators are a curated and opionated catalog of operators for deployment onto OKD clusters. 

The Cloud Native landscape is very large with many options for solving similar problems. This is good for the health of the ecosystem but as a cluster administrator, integrating these solutions into a cohesive application platform for your developers can be hard!

An OKDerator makes the choice for you and provides integrations into OKD tooling (web console, compatibility with other OKDerators etc) by specially packaging open source operators with some additional patches or features.

For example, OKD Storage is built on the `rook-ceph` operator. Packaged as an OKDerator it also includes console plugins and playbooks for dealing with the physical nodes and storage provisioning.

Currently, the choice of what operators are included and packaged as an OKDerator is mainly driven by what's included in RedHat's OpenShift catalogs, and we will use their "mid-stream" versions of the open source project.

## Installation

To install the OKDerators catalog, you can run the following script. This will create or update the existing OKDerators
CatalogSource in your cluster, which will allow you to install operators from the OKDerators catalog via the OperatorHub UI or CLI.
To run this command, you will need `oc` or `kubectl` with cluster-admin privileges.

```bash
curl -s https://raw.githubusercontent.com/okd-project/okderators-catalog-index/refs/heads/release-4.20/hack/install-catalog.sh | bash
```
:::info
Update the branch to your relevant version, this example is for 4.20 with `release-4.20`
:::


If successful, the command will return:

```
catalogsource.operators.coreos.com/okderators created
```

## Compatibility and Support

OKDerators are built and tested against the latest OKD releases. Older versions of the OKDerators catalog are not 
maintained once a new version of OKD is released.


## I think Operator X should be used to solve Y instead of Operator Z

Our choice of operators is currently driven by what's included in the RedHat OpenShift first-party catalog. Over time we may diverge or have an additional options (e.g. via an additional "extras" CatalogSource) but at the time of writing we are not sure what that will look like. 

## Links
- [Catalog repository](https://github.com/okd-project/okderators-catalog-index)
- [Build pipelines repository](https://github.com/okd-project/okd-operator-pipelines)
