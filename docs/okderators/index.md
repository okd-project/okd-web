Operators & Extensions in OKD
===

OKD is an "operator-first" Kubernetes distribution.

What this means in practise is that by default we prefer running software within the cluster
that reads desired state from CRDs and performs a control loop to attempt to get the applications
and components running within the cluster to the desired state.

For example, a component of OKD is 