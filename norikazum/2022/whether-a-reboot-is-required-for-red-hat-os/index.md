---
title: Red Hat 系OSで再起動が必要かどうか判断する方法
date: 
author: norikazum
tags: [Linux,Red Hat]
description: 
---

こんにちは。

昨今、**日々脆弱性の通知が飛び交い、その都度アップデートを実施** します。
その際、「**どのサービスを再起動したらいいんだ？**」「**OSの再起動は必要なのか？**」 ということが **よくある** と思います。

そんなときに便利なのが、 **needs-restarting** というコマンドです。

Red Hat から公開されている以下のナレッジも参考に。
[Which packages require a system reboot after the update? - Red Hat Customer Portal](https://access.redhat.com/solutions/27943)

それでは、さっそく使ってみましょう。

## 前提
このコマンドは `yum-utils` に含まれています。
インストールされていない場合は、 `yum -y install yum-utils` もしくは `dnf -y install yum-utils` でインストールしましょう。

## 使い方

以下の内容は **Red Hat Enterprise Linux 8.5 で実行** しています。

### OSの再起動が必要かどうかを判断する場合
`needs-restarting -r` を使います。

- **再起動が不要** な場合
    ```bash
    # needs-restarting -r
    サブスクリプション管理リポジトリーを更新しています。
    起動以降にアップデートされたコアライブラリーまたはサービスはありません。
    再起動な必要ありません。
    # needs-restarting -r
    サブスクリプション管理リポジトリーを更新しています。
    起動以降にアップデートされたコアライブラリーまたはサービスはありません。
    再起動な必要ありません。
    ```

- **再起動が必要** な場合
    ```bash
    サブスクリプション管理リポジトリーを更新しています。
    起動以降にコアライブラリーまたはサービスがアップデートされました:
      * kernel
    
    これらのアップデートを完全に活用するには、再起動が必要です。
    詳細情報: https://access.redhat.com/solutions/27943
    ```

### OSの再起動が必要かどうかを判断する場合
`needs-restarting --services` を使います。

- **再起動が不要** な場合
    ```bash
    # needs-restarting --services
    サブスクリプション管理リポジトリーを更新しています。
    #
    ```
    ※何も出力されない

- **再起動が不要** な場合
    ```bash
    # needs-restarting --services
    systemd-udevd.service
    systemd-logind.service
    virt-who.service
    named-chroot.service
    NetworkManager.service
    rpc-statd.service
    postfix.service
    rpcbind.service
    gssproxy.service
    systemd-journald.service
    firewalld.service
    vmtoolsd.service
    sshd.service
    sssd.service
    rngd.service
    httpd.service
    php-fpm.service
    auditd.service
    zabbix-agent.service
    efs.service
    tuned.service
    vgauthd.service
    ```
    ※**出力されたサービスの再起動が必要** です。
    
事前に確認することでお客様に自身をもって影響について報告できるのではないでしょうか。

それでは次回の記事でお会いしましょう。