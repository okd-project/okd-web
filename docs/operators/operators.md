# Operators

## What are Operators?
The [Operator pattern](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) is the concept of running "meta" software within your cluster to manage your applications 
and supporting components.

For example, you as a cluster operator may provision a `OpensourceDatabaseSoftware` 
(an operator-defined [Custom Resource](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)), and the operator would take care of provisioning the underlying resources
(Deployments, ConfigMap, Secrets, Pods, etc) on your behalf, based on the configuration you provide.

Within OKD, we use a suite of tools called [Operator Framework](https://operatorframework.io/) to manage operators within the cluster 
(an operator for operators). With Operator Framework we can access operators from central catalogs (such as this one) 
and install them within our cluster.

## Where can I find the Red Hat operators?

Red Hat operators are not shipped with OKD since they require a subscription to Red Hat OpenShift however, there is a
community effort to provide a curated set of operators that are compatible with OKD, known as the 
[OKDerators](./okderators.md) catalog.

## Why do you need OKD-adapted operators/applications?
Compared to many other Kubernetes distributions, OKD has additional security restrictions, assumptions and features 
that mean an operator or application that would work "out of the box" on a more vanilla Kubernetes distribution, 
does not function on OKD. For example, additional security profiles may need to be applied, or MachineConfigs applied
to add node features.

## Links

- [Operator Framework](https://operatorframework.io/)
- [OperatorHub.io](https://operatorhub.io/)
- [Community Operators](https://github.com/redhat-openshift-ecosystem/community-operators-prod)
