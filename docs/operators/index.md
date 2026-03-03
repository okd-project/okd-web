# Operators

## What are Operators?
The [Operator pattern](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) is the concept of running "meta" software within your cluster to manage your applications and supporting components.

For example, you as a cluster operator may provision a `OpensourceDatabaseSoftware` 
(an operator-defined [Custom Resource](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)), and the operator would take care of provisioning the underlying resources (Deployments, ConfigMap, Secrets, Pods, etc) on your behalf, based on the configuration you provide.

Within OKD, we use a suite of tools called [Operator Framework](https://operatorframework.io/) to manage operators within the cluster 
(an operator for operators). With Operator Framework we can access operators from central catalogs (such as this one) 
and install them within your cluster.

### Isn't that what Helm is for?

Helm is a different way of deploying software into Kubernetes clusters. Helm Chats are a set of templates, and then based on your specification (from `values.yaml`), the Helm Controller renders those resources out. Helm Charts often relies on existing Kubernetes primitives (e.g. Deployment) to manage the running pods.

Some Operators will use Helm internally to handle the creation of their Kubernetes resources, whilst the operator also provides additional management functionality (such as backup coordination)

## Where can I find Operators to install on my cluster?
OKD currently by default includes a catalog shared with OpenShift called "[Community Operators](https://github.com/redhat-openshift-ecosystem/community-operators-prod)". These Community Operators are often packaged with OKD/OpenShift in mind.

There is also [OperatorHub.io](https://operatorhub.io/) which contains a larger catalog of software, however operators in this catalog are more likely to not be compatible with OKD/Openshift. 

### [OKDerators](./okderators/index.md)

The OKD Working Group packages an opionated and curated set of operators called "[OKDerators](./okderators/index.md)". These are intended to be the OKD alternative to the private catalogs included within OpenShift (see below).

OKDerators includes solutions for Storage, Cluster Logging, GitOps, Multi-cluster and more.

We need contributors to help package operators for OKDerators. We are especially seeking contributions to package Virtualisation and AI operator sets.

### Why do you need OKD-adapted operators/applications?
Compared to many other Kubernetes distributions, OKD has additional security restrictions, assumptions and features 
that mean an operator or application that would work "out of the box" on a more vanilla Kubernetes distribution, 
does not function on OKD. For example, additional security profiles may need to be applied, or MachineConfigs applied
to add node features.

## Are these "Cluster Extensions"?

Some vendors (such as RedHat) use the term "Cluster Extension" to describe an opionated deployment of an operator or set of operators that bring significant functionality into their Kubernetes distribution (such as Storage or Virtualisation).

### Can I install OpenShift Cluster Extensions/Operators on my OKD cluster?

Red Hat OpenShift includes two additional private catalog sources. "redhat-operators" and "certified 
