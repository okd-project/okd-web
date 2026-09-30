# Contribute

We are looking for packagers to expand the OKDerator catalog! The [Directory](directory.md)
lists the operators we would like to offer and which ones still need an owner. Pick one that
interests you, or bring your own suggestion to the `#okd-dev` Slack channel or the OKD
Operators Working Group.

## How packaging works

Two repositories make up the project:

- [okd-operator-pipeline](https://github.com/okd-project/okd-operator-pipeline) builds the
  operator images and OLM bundles from the upstream sources, applying patches where an
  operator needs changes to run on OKD.
- [okderators-catalog-index](https://github.com/okd-project/okderators-catalog-index) is the
  file-based catalog that clusters consume, with a release branch per OKD version.

Most contributions start in the pipeline repository - its
[CONTRIBUTING.md](https://github.com/okd-project/okd-operator-pipeline/blob/main/CONTRIBUTING.md)
explains how to add a new operator, and
[BUILDING.md](https://github.com/okd-project/okd-operator-pipeline/blob/main/BUILDING.md)
covers building and testing against your own registry. For a walkthrough of the development
process, see the
[OKD Operator Development Overview](https://www.youtube.com/watch?v=_uUNnUWQQ9E) video.

## Other ways to help

Not everything needs a new operator. You can also:

- test packaged operators on your cluster and report issues
- update an existing operator to a newer upstream release
- fill gaps in the [Directory](directory.md) - upstream sources and packaging notes

## Links

- [Build pipeline repository](https://github.com/okd-project/okd-operator-pipeline)
- [Catalog repository](https://github.com/okd-project/okderators-catalog-index)
- [Working group communications](../../community/communications.md) - Slack and mailing lists
- [OKD Operator Development Overview](https://www.youtube.com/watch?v=_uUNnUWQQ9E) - video walkthrough
