---
title: VMware ESXi 6.7 に cron を設定する
date: 2020-12-02
author: jinna-i
tags: [VMware, ESXi, 仮想化技術]
---

こんにちは、じんないです。

今回は VMware ESXi 6.7 で cron を設定し、例として仮想マシンのバックアップスクリプトを定期実行してみようと思います。

ESXi の cron 設定は記述方法こそ同じですが、他の Linux OS と異なり再起動すると消えてしまう動作となります。cron の設定を永続化する方法、実行時刻の注意点なども併せてご紹介します。

## 環境

- VMware vSphere ESXi 6.7 Update 3

## cron の設定方法

ESXi には crontab コマンドがありませんので、`crontab -e` などで編集ができません。cron の設定ファイルを直接編集します。

cron の設定はファイルは `/var/spool/cron/crontabs/root` です。

パーミッションは `1444` の ReadOnly になっているので、まずは一時的に `1744` などに変更します。

余談ですがパーミッション4桁のうち最初の1桁目はスティッキービットと呼びます。詳しい説明は割愛しますが、スティッキービットのフラグが立っていると所有者もしくはスーパーユーザー (root) しかファイル・ディレクトリの削除ができなくなります。

下記のパーミッションで最後に **`T`** がついてますが、この **`T` がスティッキービット**を表します。

```shell
# パーミッションの確認
[root@esxi1:~] ls -l /var/spool/cron/crontabs/root
-r--r--r-T    1 root     root           324 Nov 23  2019 /var/spool/cron/crontabs/root

# パーミッションを 1744 に変更
[root@esxi1:~] chmod 1744 /var/spool/cron/crontabs/root

# パーミッションの再確認
[root@esxi1:~] ls -l /var/spool/cron/crontabs/root
-rwxr--r-T    1 root     root           324 Nov 23  2019 /var/spool/cron/crontabs/root
```

そのあと、`vi` などで cron 設定を行います。フォーマットは他の Linux OS と同じです。

`vi /var/spool/cron/crontabs/root` 

今回は例として下記を追記しました。

```shell
## MSEN Original Backup Tasks
00   16   *   *   *   /vmware_backup.sh centos8
```

**ここで注意点ですが、ESXi のハードウェアクロックは UTC+0:00 です。日本時間と9時間時差があるので、時刻の設定値は-9時間した時刻に設定しましょう**。

**上記の例では毎日 16:00 に実行されますが、日本時間では 1:00 に実行されます**。

参考情報を載せておきます。
[ESXiの時刻設定について - VMware Technology Network VMTN](https://communities.vmware.com/t5/Japanese-Discussions/ESXi%E3%81%AE%E6%99%82%E5%88%BB%E8%A8%AD%E5%AE%9A%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/m-p/2248597)

先ほど変更したパーミッションをもとに戻します。

```shell
# パーミッションを 1444 に変更
[root@esxi1:~] chmod 1444 /var/spool/cron/crontabs/root

# パーミッションの確認
[root@esxi1:~] ls -l /var/spool/cron/crontabs/root
-r--r--r-T    1 root     root           506 Nov 20 08:28 /var/spool/cron/crontabs/root
```

crond を再起動し、設定を反映します。

```
[root@esxi1:~] /bin/kill $(cat /var/run/crond.pid)
[root@esxi1:~] /usr/lib/vmware/busybox/bin/busybox crond
```

## 再起動した際に cron に自動追記する方法

**ESXi の cron は再起動すると元に戻る仕様**のようです。このままでは消えてしまうので、`/etc/rc.local.d/local.sh` を編集し**起動時に cron 設定を追記する**ようにします。
※ `/etc/rc.local.d/` の下に適当にファイルを作成しそこに記載してもよいと思います。

`vi /etc/rc.local.d/local.sh`

追記した内容は下記のとおりです。先の手順に記載した crond の再起動も忘れずに記述します。
**※ 行末に書いている `exit 0` の手前に追記してください。**

```
/bin/echo "## MSEN Original Backup Tasks" >> /var/spool/cron/crontabs/root
/bin/echo "00   16   *   *   *   /vmware_backup.sh centos8" >> /var/spool/cron/crontabs/root


/bin/kill $(cat /var/run/crond.pid)
/usr/lib/vmware/busybox/bin/busybox crond
```

全体はこんな感じです。

```
[root@esxi1:~] cat /etc/rc.local.d/local.sh
#!/bin/sh

# local configuration options

# Note: modify at your own risk!  If you do/use anything in this
# script that is not part of a stable API (relying on files to be in
# specific places, specific tools, specific output, etc) there is a
# possibility you will end up with a broken system after patching or
# upgrading.  Changes are not supported unless under direction of
# VMware support.

# Note: This script will not be run when UEFI secure boot is enabled.

/bin/echo "## MSEN Original Backup Tasks" >> /var/spool/cron/crontabs/root
/bin/echo "00   16   *   *   *   /vmware_backup.sh centos8" >> /var/spool/cron/crontabs/root

/bin/kill $(cat /var/run/crond.pid)
/usr/lib/vmware/busybox/bin/busybox crond

exit 0
```

これで、ESXi を再起動しても cron が自動設定されるようになりました。

ではまた。

## 参考

- [\[仮想\]Esxi(VMware vSphere Hypervisor)でcronを使用する](https://www.myit-service.com/blog/%E4%BB%AE%E6%83%B3esxi%E3%81%A7cron%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%99%E3%82%8B/)