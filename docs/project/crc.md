# CodeReady Containers for OKD

 CodeReady Containers brings a minimal, single node OKD 4 cluster to your local computer. This cluster provides a minimal environment for development and testing purposes. CodeReady Containers is mainly targeted at running on developers' laptops and desktops.
 Note that arm64 OKD payload is not yet available.

## Download CodeReady Containers for OKD

Run a developer instance of OKD4 on your local workstation with CodeReady Containers built for OKD - >No Pull Secret Required!
The [Getting Started Guide](https://crc.dev/crc/)<!--{target=_blank} comment for docusaurus compat--> explains how to install and use CodeReady Containers.

You can fetch crc binaries without Red Hat subscription [here](https://developers.redhat.com/content-gateway/rest/mirror2/pub/openshift-v4/clients/crc/latest/)

```shell
$ crc config set preset okd
Changes to configuration property 'preset' are only applied when the CRC instance is created.
If you already have a running CRC instance with different preset, then for this configuration change to take effect, delete the CRC instance with 'crc delete', setup it with `crc setup` and start it with 'crc start'.

$ crc config view
- consent-telemetry                     : yes
- preset                                : okd
```

If you encounter any problems, please open a discussion item in the [OKD GitHub Community](https://github.com/okd-project/okd/discussions)<!--{target=_blank} comment for docusaurus compat-->!

## CRC Working group

There is a working group looking at automating the OKD CRC build process.  If you want technical details on how to build OKD CRC see the [working group section of this site](../community/wg_crc/overview.md)<!--{target=_blank} comment for docusaurus compat-->
