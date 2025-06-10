# OKDerators

:::warning
OKDerators is a WIP project that is in active development. Cluster breaking changes could be introduced.
Use with caution!
:::

OKD by default only includes the community catalog of operators, which is a small fraction of what is available in 
OpenShift. You can install additional catalogs like OperatorHub.io, but some of these operators lack support for the
additional security context constraints (SCCs) that OKD provides, or miss console integrations that are available in
OpenShift. OKDerators aims to fill this gap by providing the downstream OKD variant of core operators such as storage,
networking, and more.

## Compatibility

OKDerators are built and tested against the latest OKD releases. Older versions of the OKDerators catalog are not 
maintained once a new version of OKD is released.

## Installation

To install the OKDerators catalog, you can run the following script. This will create or update the existing OKDerators
CatalogSource in your cluster, which will allow you to install operators from the OKDerators catalog via the OperatorHub UI or CLI.
To run this command, you will need `oc` or `kubectl` with cluster-admin privileges.

```bash
curl -s https://raw.githubusercontent.com/okd-project/okderators-catalog-index/refs/heads/release-4.18/hack/install-catalog.sh | bash
```

If successful, the command will return:

```
catalogsource.operators.coreos.com/okderators created
```

## Links
- [Catalog repository](https://github.com/okd-project/okderators-catalog-index)
- [Build pipelines repository](https://github.com/okd-project/okd-operator-pipelines)
