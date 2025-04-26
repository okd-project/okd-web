---
title: OKD 4.16 has Known Issues
sidebar_label: OKD 4.16 Known Issues
description: OKD 4.16 should only be used as a step-thru to 4.17
---

OKD 4.16 was released simulteanously with OKD 4.17.

The purpose of the OKD 4.16 release was to provide an upgrade path to exisitng OKD \<4.15 clusters.

It is not intended that clusters should remain on OKD 4.16. After completing [the manual steps](2-fcos-to-scos-migration.md) to take your cluster to 4.16, you should proceed immediately to the 4.17 version which is available.

## Known Issues - 4.16
- metal3 pod crash on baremetal ([#2030](https://github.com/okd-project/okd/issues/2030))
- upgrade failed when selinux is disabled (/run will be filled up to 100%)
- boot into centos stream coreos will fail (fsck fail)
- upgrade fail when extra packages are installed (e.g. ipset, ipvsadm)
- disk names has changed after boot (e.g.: /dev/sda to /dev/sdb)

### upgrade failed when selinux is disabled
Enable it
```
sed -i 's/SELINUX=.*/SELINUX=permissive/g' /etc/selinux/config
```

### boot into centos stream coreos will fail (fsck fail)
In the boot process the disk check with fsck fails, because in the upgrade from FCOS to SCOS the kernel will be downgraded from 6.x to 5.x<br>
and this results in an unknown attribute for a ext4 filesystem (orphan_file).<br>
This attribute must be removed from the underlaying disk, but this can only be done, when the assosiated filesystem is unmounted !<br>
A possible work-a-round is to remove it in the startup process.<br>
#### If you have console access
you can configure the grub-bootloader with this options to interup the boot process:<br>
```
rd.break rd.shell
```
In the shell you have to run the following command for all your ext4-partitions.<br>
In most cases this will be /dev/sda3 for /boot<br>
and /dev/sda5 for /var:
```
lsblk

tune2fs -O ^orphan_file /dev/sda3
tune2fs -O ^orphan_file /dev/sda5
```
#### If you have no console access
you can configure a systemd-service like this:
```
cat << EOF > /etc/systemd/system/disable-orphanfile.service
[Unit]
Description=Disable Orphan-File-Feature
DefaultDependencies=no
#BindsTo=%i.device
Conflicts=shutdown.target
After=systemd-fsck-root.service local-fs-pre.target
Before=system-systemd\x2dfsck.slice
#Before=systemd-fsck@%i.service

[Service]
Type=oneshot
RemainAfterExit=no
ExecStart=tune2fs -O ^orphan_file /dev/sda3
ExecStart=tune2fs -O ^orphan_file /dev/sda5
TimeoutSec=30

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable disable-orphanfile.service
```
### upgrade fail when extra packages are installed
Remove this packages with e.g.:<br>
```
rpm-ostree uninstall ipset ipvsadm
```
### disk names has changed after boot
Use <b>lsblk<b> to identify your boot-partition (e.g.: /dev/sda3)<br>
Edit your grub-bootloader and add the option:<br>
scsi_mod.scan=sync
```
mount -o remount,rw /dev/sda3 /boot
#
# Edit you boot-entry and append scsi_mod.scan=sync  to the   option - line
vi /boot/loader/entries/ostree-1.conf
    scsi_mod.scan=sync
mount -o remount,ro /dev/sda3 /boot
```
