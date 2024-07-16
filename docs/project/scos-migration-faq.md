# FAQ - OKD Components based on SCOS

<!--cSpell:ignore SCOS -->

This FAQ document relates to the builds of OKD that use CentOS Stream CoreOS (SCOS) after work done to stop using RHEL as the base for cluster components, as well as the upgrade path from pre-4.16 OKD FCOS/SCOS installations.

## Secure Boot
Secure Boot is currently not supported on CentOS Stream CoreOS (SCOS). This is tracked in [RHEL-4391](https://issues.redhat.com/browse/RHEL-4391) and [rhboot/shim-review#399](https://github.com/rhboot/shim-review/issues/399).

Please see the GitHub discussion at [this link](https://github.com/okd-project/okd/discussions/1922).
