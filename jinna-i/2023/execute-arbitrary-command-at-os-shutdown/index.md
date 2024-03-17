---
title: "[CentOS7] OS シャットダウン時に任意のコマンドを実行する"
date: 2023-03-10
author: jinna-i
tags: [Linux, CentOS, Red Hat]
description: "OS シャットダウン時に任意のコマンドを実行する方法を紹介します。"
---

こんにちは、じんないです。

システムを構成していると、OS の起動時やユーザーのログイン、ログオフの際に任意のコマンドを実行したい場合があります。

実行する手段は、スタートアップスクリプトやログイン・ログオフスクリプトなどさまざまです。

今回は CentOS 7 環境において、**サービス (Unit) の停止時や OS のシャットダウン時に任意のコマンド (スクリプト) を実行する方法**を紹介します。


## 想定環境

- CentOS Linux release 7.9.2009 (Core)

## 1. サービス停止時にコマンドを実行するパターン

### カスタムサービスの作成

まずはサービス停止時に任意のコマンドを実行する例です。

**カスタムサービス (Unit) を作成しておき、そのサービスが停止するタイミングでコマンドを実行するという流れ**です。

`/etc/systemd/system` 配下にカスタムサービスを作成します。

例として `msen.service` を作成しています。

サービス停止時、 `/tmp` 配下へ `testfile.txt` を作成するようにしました。

```bash{7}:title=msen.service
[Unit]
Description=Run msen custom task at service stop ★任意の説明

[Service]
Type=oneshot
RemainAfterExit=true
ExecStop=/bin/touch /tmp/testfile.txt ★任意のコマンド

[Install]
WantedBy=multi-user.target
```

サービスの停止時にコマンドを実行したいので **`ExecStop` にコマンドを指定**しています。

カスタムサービス (Unit) の各セクションの詳細は下記のナレッジを参照してください。

[10.6. systemd のユニットファイルの作成および変更 Red Hat Enterprise Linux 7 | Red Hat Customer Portal](https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/7/html/system_administrators_guide/sect-managing_services_with_systemd-unit_files)

デーモンをリロードし、作成したサービスを起動しておきます。

```bash
[root@jinna-i ~]# systemctl daemon-reload

[root@jinna-i ~]# systemctl enable msen --now
Created symlink from /etc/systemd/system/multi-user.target.wants/msen.service to /etc/systemd/system/msen.service.

[root@jinna-i ~]# systemctl status msen
● msen.service - Run msen custom task at service stop
   Loaded: loaded (/etc/systemd/system/msen.service; enabled; vendor preset: disabled)
   Active: active (exited) since 日 2023-02-12 17:18:24 JST; 2s ago

 2月 12 17:18:24 jinna-i systemd[1]: Started Run msen custom task at service stop.
```

### 動作確認

サービスを停止し `/tmp` 配下を確認します。

```bash{5}
[root@jinna-i ~]# systemctl stop msen

[root@jinna-i ~]# ll /tmp/
合計 1
-rw-r--r-- 1 root root    0  2月 12 17:20 testfile.txt ★作成された
```

`testfile.txt` が作成されていました。

サービスの起動や停止が任意に行えるため注意が必要ですが、シャットダウン以外にも**サービスの停止をトリガーにしたい場合**はこちらのパターンがよいと思います。

## 2. OS シャットダウン時にのみコマンドを実行するパターン

### カスタムサービスの作成

次は OS シャットダウン時にのみコマンドを実行する例です。

カスタムサービスを作成するという流れは同じです。

```bash{3-5,9}:title=msen.service
[Unit]
Description=Run msen custom task at shutdown ★任意の説明
DefaultDependencies=no
Before=shutdown.target
RefuseManualStart=true

[Service]
Type=oneshot
ExecStart=/bin/touch /tmp/testfile.txt ★任意のコマンド

[Install]
WantedBy=shutdown.target
```

`DefaultDependencies=no` と `Before=shutdown.target` で OS のシャットダウンプロセスが開始する前に実行するよう依存関係を指定しています。

また、前項と異なり **`ExecStart` に実行したいコマンドを指定**しているのもポイントです。 

`RefuseManualStart=true` を設定することでユーザーが任意にサービスを起動停止できないようにしています。


### 動作確認

OS を再起動またはシャットダウンし `/tmp` 配下を確認します。

```bash{5}
[root@jinna-i ~]# reboot

[root@jinna-i ~]# ll /tmp/
合計 1
-rw-r--r-- 1 root root    0  2月 12 17:32 testfile.txt　★生成された
```

`testfile.txt` が作成されていました。

**シャットダウンのみをトリガーとしたい場合**はこちらのパターンがよいでしょうか。

ユースケースに合わせて使い分けてみてください。

ではまた。

## 参考

- [10.6. systemd のユニットファイルの作成および変更 Red Hat Enterprise Linux 7 | Red Hat Customer Portal](https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/7/html/system_administrators_guide/sect-managing_services_with_systemd-unit_files)

- [システムのシャットダウン時にコマンドまたはスクリプトを実行するように、systemd サービスユニットを設定する - Red Hat Customer Portal](https://access.redhat.com/ja/solutions/2954731)
