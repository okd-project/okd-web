---
title: "Hacking OKD: Changing an OpenShift Component and Building Your Own Release"
authors: ["jatinsu"]
date: 2026-11-02
---

OKD is built from hundreds of repositories under [github.com/openshift](https://github.com/openshift). If you want to
fix a bug, try out a feature, or understand how OKD works, the fastest way to learn is to
change the code and run it on a real cluster.

This post walks through the developer loop for OKD on CentOS Stream CoreOS (SCOS):

1. **Build** a component image for OKD (with the `scos` build tag and an SCOS base image)
2. **Create a new release payload** that swaps in your custom image
3. **Install** (or upgrade to) that release and **test** your change

<!-- truncate -->

In this example we'll use the [machine-config-operator](https://github.com/openshift/machine-config-operator) (MCO) as the
example, but the same steps apply to (almost) any payload component.

The first half of this post is the commands you need to run. The second half,
[Under the hood](#under-the-hood), explains why they work and how to adapt them to other components.

## Prerequisites

- `podman` (or `docker`) and the latest [`oc (openshift-client)`](https://github.com/okd-project/okd/releases)
- A container registry account that your cluster can pull from (in this blog we'll assume you are using
  [quay.io](https://quay.io), but any **public** registry will work)
- An environment to install OKD into (a cloud account, vSphere, bare metal, etc.)

## Step 0: Find the code that is actually in your release

Pick a release from the [OKD release controller](https://amd64.origin.releases.ci.openshift.org/)
i.e.

```shell
export FROM_RELEASE=quay.io/okd/scos-release:5.0.0-okd-scos.1
```

Find the image and the exact commit that went into that release for your component:

```shell
oc adm release info --image-for=machine-config-operator ${FROM_RELEASE}
oc adm release info --commit-urls ${FROM_RELEASE} | grep machine-config-operator
```

Clone the repository and check out the branch that matches your release (for example `release-5.0` is for OKD 5.0, `main` is always for the
next release in development):

```shell
git clone https://github.com/openshift/machine-config-operator
cd machine-config-operator
git checkout release-5.0
```

Now make your change.

## Step 1: Build the component for OKD (SCOS)

The MCO's `Dockerfile.rhel7` has two `FROM` lines, and both point at images on the OpenShift CI registry:

- **Final stage (this is what makes it OKD):** replace `registry.ci.openshift.org/ocp/5.0:base-rhel9` with the SCOS
  base image, `registry.ci.openshift.org/origin/scos-5.0:base-stream9`. This image is publicly pullable.
- **Builder stage (only because the CI image is private):** OKD CI keeps the same builder as OpenShift,
  `registry.ci.openshift.org/ocp/builder:rhel-9-golang-1.26-openshift-5.0`, but pulling it requires CI credentials.
  Replace it with the public `golang` image at the Go version in `go.mod`, and install the libraries the build links
  against.

```shell
sed \
  -e 's|^FROM registry.ci.openshift.org/ocp/builder:.* AS rhel9-builder|FROM docker.io/library/golang:1.26.10 AS rhel9-builder\nRUN apt-get update \&\& apt-get install -y libgpgme-dev|' \
  -e 's|^FROM registry.ci.openshift.org/ocp/5.0:base-rhel9|FROM registry.ci.openshift.org/origin/scos-5.0:base-stream9|' \
  Dockerfile.rhel7 > Dockerfile.okd
```

This uses GNU `sed`. On macOS, install `gnu-sed` and run `gsed`, or make the same edits by hand.

The top of each stage in `Dockerfile.okd` should now look like this:

```dockerfile
FROM docker.io/library/golang:1.26.10 AS rhel9-builder
RUN apt-get update && apt-get install -y libgpgme-dev
...
FROM registry.ci.openshift.org/origin/scos-5.0:base-stream9
```

Then build with `TAGS=scos` and push:

```shell
podman build \
  --build-arg TAGS=scos \
  -f Dockerfile.okd \
  -t quay.io/<your-user>/machine-config-operator:okd-5.0-mychange .

podman push quay.io/<your-user>/machine-config-operator:okd-5.0-mychange
```

Check that the image has the release-operator label, so `oc adm release new` will pick up its manifests:

```shell
oc image info quay.io/<your-user>/machine-config-operator:okd-5.0-mychange -o json | jq '.config.config.Labels'
# look for "io.openshift.release.operator": "true"
```

The Dockerfile name, build args and base image are specific to the MCO on `release-5.0`. To find the right values for
another component or branch, see [Finding the build settings for any component](#finding-the-build-settings-for-any-component).

## Step 2: Create a new release with your operator

Take the existing release and override the MCO with your image:

```shell
export TO_RELEASE=quay.io/<your-user>/okd-release:5.0.0-okd-scos.1-mychange

oc adm release new \
  --from-release ${FROM_RELEASE} \
  --to-image ${TO_RELEASE} \
  --name 5.0.0-okd-scos.1-mychange \
  machine-config-operator=quay.io/<your-user>/machine-config-operator:okd-5.0-mychange
```

:::note
If you're changing the **cluster-version-operator** itself, append these flags to the `oc adm release new` command:

```shell
  --keep-manifest-list \
  --allow-missing-images
```

:::

Verify that the new payload points at your image:

```shell
oc adm release info --image-for=machine-config-operator ${TO_RELEASE}
oc adm release info --pullspecs ${TO_RELEASE} | grep machine-config-operator
```

## Step 3: Install the release and test

### Option A: Install a fresh cluster

Extract an `openshift-install` binary from your custom release. It installs your payload by default:

```shell
oc adm release extract --command=openshift-install --to=./bin ${TO_RELEASE}
./bin/openshift-install version
```

Create an `install-config.yaml` as usual (see the [installation docs](/docs/project/installation)). If all your
images are public, you can use a placeholder pull secret:

```json
{ "auths": { "fake": { "auth": "aWQ6cGFzcwo=" } } }
```

Then install:

```shell
./bin/openshift-install create cluster --dir ./mycluster
```

### Option B: Upgrade an existing cluster

If you already have a cluster on the release you built from, upgrade it to your custom payload by digest:

```shell
DIGEST=$(oc adm release info ${TO_RELEASE} -o jsonpath='{.digest}')
oc adm upgrade --allow-explicit-upgrade --force \
  --to-image quay.io/<your-user>/okd-release@${DIGEST}
```

Only do this on clusters you're fine with breaking.

### Test your change

Once the cluster is up, confirm that your image is running and the operator is healthy:

```shell
oc get clusterversion
oc get clusteroperators
oc get clusteroperator machine-config -o yaml
oc -n openshift-machine-config-operator get pods \
  -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.spec.containers[*].image}{"\n"}{end}'
```

Then exercise the behavior you changed. For broader coverage, run the conformance suites from
[openshift/origin](https://github.com/openshift/origin) against your cluster:

```shell
oc adm release extract --command=openshift-tests --to=./bin ${TO_RELEASE}
```

## Faster iteration: skip the payload

Building a whole release for every one-line change is slow. Once you have a cluster, you can swap a single operator
image in place:

1. Tell the CVO to stop managing the operator's Deployment by adding an `overrides` entry to `ClusterVersion` with
   `unmanaged: true`, or scale the CVO down entirely for a throwaway cluster:

   ```shell
   oc scale --replicas=0 deployment/cluster-version-operator -n openshift-cluster-version
   ```

2. Edit the operator's Deployment to point at your new image.

This is great for quick experiments, but remember to remove the overrides (or scale the CVO back up) afterwards.
Overrides block minor and major version upgrades. Some operators also need extra steps beyond swapping the
Deployment image. When you're happy with the change, build a proper release as described above to test it the way
users would get it.

---

## Under the hood

### What is a release payload?

An OKD release image is a Cluster Version Operator (CVO) image with an extra layer containing `release-manifests/`:
an `image-references` file listing every component image by digest, plus the manifests for each operator. When you
install or upgrade a cluster, the CVO reads that payload and rolls out every component it references.

That means changing OKD comes down to two things: build a new image for the component you changed, then build a new
payload that points at it. The [Building the OKD payload](../2022/12-12-building-OKD-payload.md) post goes deeper into
how CI does this at scale.

### What makes an OKD build different

The same source code builds both OpenShift and OKD images. Two things are different for OKD:

1. **The `TAGS=scos` build argument.** Most payload Dockerfiles declare `ARG TAGS=""` and pass it through to
   `go build -tags`. With `scos` set, OKD-specific code is compiled in. These are files guarded by `//go:build scos`.
   For example, the MCO sets `version.SCOS = true` and rewrites `rhel-coreos` image references to `stream-coreos`.
   The installer switches to SCOS boot images, and the console-operator switches to OKD branding.
2. **An SCOS base image.** OpenShift images are layered on a RHEL base. OKD images are layered on the
   CentOS Stream-based `origin/scos-X.Y` base image.

### Finding the build settings for any component

You don't need to guess the build settings. Every component that ships in OKD has an OKD _variant_ CI configuration in
[openshift/release](https://github.com/openshift/release/tree/main/ci-operator/config/openshift), named
`openshift-<repo>-<branch>__okd-scos.yaml`. For the MCO on `release-5.0`, that is
[`openshift-machine-config-operator-release-5.0__okd-scos.yaml`](https://github.com/openshift/release/blob/main/ci-operator/config/openshift/machine-config-operator/openshift-machine-config-operator-release-5.0__okd-scos.yaml).
The parts you care about look like this:

```yaml
base_images:
  origin_scos-5.0_base-stream9:
    name: scos-5.0
    namespace: origin
    tag: base-stream9
images:
  items:
    - build_args:
        - name: TAGS
          value: scos
      dockerfile_path: Dockerfile.rhel7
      from: origin_scos-5.0_base-stream9
      to: machine-config-operator
promotion:
  to:
    - name: scos-5.0
      namespace: origin
```

This tells you:

- **Which Dockerfile** CI builds (`Dockerfile.rhel7` here; other repos use `Dockerfile.rhel`, `Dockerfile.ocp`, and so on)
- **Which build args** to pass (`TAGS=scos`)
- **Which base image** replaces the final `FROM` (`registry.ci.openshift.org/origin/scos-5.0:base-stream9`)
- **The image name** in the payload (`to: machine-config-operator`), which is the `NAME` you override in
  `oc adm release new`

In CI, `from:` replaces the image in the Dockerfile's final `FROM` line. That is what the second `sed` expression in
Step 1 does locally: the MCO's `Dockerfile.rhel7` ends with `FROM registry.ci.openshift.org/ocp/5.0:base-rhel9`, and we
swap it for the SCOS base. Despite the `base-stream9` tag, the OKD 5.0 base image is CentOS Stream 10.

The `main` branch configs target the next release (for example `scos-5.1:base-stream10`), so always read the config
for the branch you're building.

### Build notes

- **Builder images.** OKD only swaps the runtime base image. CI builds every component with the same private
  `registry.ci.openshift.org/ocp/builder` images as OpenShift, and there is no public equivalent. If you have access to
  the CI cluster, you can log in with `oc registry login` and keep the original builder. Otherwise, use the official
  `golang` image at the Go version from `go.mod`. It ships Go, `make` and `git`, but not the C libraries the private
  builder includes. Add whatever your component links against with cgo. For the MCO that's `libgpgme-dev`, which the
  vendored `proglottis/gpgme` package needs. If the build fails with
  `Package <name> was not found in the pkg-config search path`, install the matching `lib<name>-dev` package in the
  builder stage.
- **Repo helpers.** Some repositories ship a helper. For example, the MCO's `TAGS=scos make image` passes the build tag
  to `podman build`. It does **not** swap the base image, so you still need the `FROM` change.

### Release notes

- **Overriding several components.** You can pass several `NAME=PULLSPEC` arguments to `oc adm release new`. This is
  handy when a change spans repositories, such as an API change and the operator that consumes it. Every other
  component still points at the original OKD images, so you only build what you changed.
- **Multi-arch releases.** If the source release is a multi-arch manifest list, add `--keep-manifest-list`, or point
  `--from-release` at the single-architecture digest for the platform you're testing on.

### Install and upgrade notes

- **The extracted installer.** `oc adm release extract --command=openshift-install` embeds the release pullspec,
  pinned by digest, into the binary. That's why it installs your payload without any extra flags.
- **Pull secrets.** OKD doesn't need a Red Hat pull secret, which is why the placeholder works. If your registry
  repositories are private, put real credentials for them in the pull secret instead.
- **`OPENSHIFT_INSTALL_RELEASE_IMAGE_OVERRIDE`.** You _can_ point an existing installer at a different payload with
  this environment variable. The installer and payload versions should match, though. Extracting the installer from
  your release is the safer option.
- **Upgrade flags.** Your release isn't signed and isn't in the update graph, so `oc adm upgrade` needs
  `--allow-explicit-upgrade` and `--force`. With `--force`, a by-tag pullspec is accepted, but a digest is safer.

### Getting your change upstream

When your change works, open a pull request against the component repository. Repositories that ship in OKD run the
OKD (`__okd-scos`) variant jobs on PRs too, so your change is built with `TAGS=scos` on the SCOS base and tested in CI.
Once it merges, the post-submit job promotes the image into the `origin/scos-X.Y` image stream, and it shows up in the
next OKD build on the [release controller](https://amd64.origin.releases.ci.openshift.org/).

If something is OKD-specific, such as a CentOS package name, a base image, or a build argument, the fix may belong in
the OKD variant config in [openshift/release](https://github.com/openshift/release) rather than the component itself.

If you get stuck, come find us in the
`#okd-dev` channel in the Kubernetes Slack. Happy hacking!
