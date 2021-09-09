---
title: "[Linux] パッケージ更新時に再起動が必要になるサービスを確認する方法"
date: 2021-05-31
author: norikazum
tags: [その他, ライフハック]
---

こんにちは。


[第18章 システムとサブスクリプション管理 Red Hat Enterprise Linux 7 | Red Hat Customer Portal](https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/7/html/7.3_release_notes/new_features_system_and_subscription_management)


> システム管理者が yum update を実行後に、その更新内容の有効にするために再起動する必要のある systemd サービスを特定するのに役立ちます (BZ#1335587)。



```
# yum -y update openssl
読み込んだプラグイン:fastestmirror
Loading mirror speeds from cached hostfile
epel/x86_64/metalink                                                                                                                        | 6.0 kB  00:00:00     
 * base: mirrors.cat.net
 * epel: ftp.iij.ad.jp
 * extras: mirrors.cat.net
 * updates: mirrors.cat.net
base                                                                                                                                        | 3.6 kB  00:00:00     
epel                                                                                                                                        | 4.7 kB  00:00:00     
extras                                                                                                                                      | 2.9 kB  00:00:00     
updates                                                                                                                                     | 2.9 kB  00:00:00     
(1/3): epel/x86_64/group_gz                                                                                                                 |  95 kB  00:00:00     
(2/3): epel/x86_64/updateinfo                                                                                                               | 1.0 MB  00:00:00     
(3/3): epel/x86_64/primary_db                                                                                                               | 6.9 MB  00:00:00     
依存性の解決をしています
--> トランザクションの確認を実行しています。
---> パッケージ openssl.x86_64 1:1.0.2k-12.el7 を 更新
---> パッケージ openssl.x86_64 1:1.0.2k-21.el7_9 を アップデート
--> 依存性の処理をしています: openssl-libs(x86-64) = 1:1.0.2k-21.el7_9 のパッケージ: 1:openssl-1.0.2k-21.el7_9.x86_64
--> トランザクションの確認を実行しています。
---> パッケージ openssl-libs.x86_64 1:1.0.2k-12.el7 を 更新
---> パッケージ openssl-libs.x86_64 1:1.0.2k-21.el7_9 を アップデート
--> 依存性解決を終了しました。

依存性を解決しました

===================================================================================================================================================================
 Package                                 アーキテクチャー                  バージョン                                     リポジトリー                        容量
===================================================================================================================================================================
更新します:
 openssl                                 x86_64                            1:1.0.2k-21.el7_9                              updates                            493 k
依存性関連での更新をします:
 openssl-libs                            x86_64                            1:1.0.2k-21.el7_9                              updates                            1.2 M

トランザクションの要約
===================================================================================================================================================================
更新  1 パッケージ (+1 個の依存関係のパッケージ)

総ダウンロード容量: 1.7 M
Downloading packages:
Delta RPMs disabled because /usr/bin/applydeltarpm not installed.
(1/2): openssl-1.0.2k-21.el7_9.x86_64.rpm                                                                                                   | 493 kB  00:00:00     
(2/2): openssl-libs-1.0.2k-21.el7_9.x86_64.rpm                                                                                              | 1.2 MB  00:00:00     
-------------------------------------------------------------------------------------------------------------------------------------------------------------------
合計                                                                                                                               5.5 MB/s | 1.7 MB  00:00:00     
Running transaction check
Running transaction test
Transaction test succeeded
Running transaction
  更新します              : 1:openssl-libs-1.0.2k-21.el7_9.x86_64                                                                                              1/4 
  更新します              : 1:openssl-1.0.2k-21.el7_9.x86_64                                                                                                   2/4 
  整理中                  : 1:openssl-1.0.2k-12.el7.x86_64                                                                                                     3/4 
  整理中                  : 1:openssl-libs-1.0.2k-12.el7.x86_64                                                                                                4/4 
  検証中                  : 1:openssl-libs-1.0.2k-21.el7_9.x86_64                                                                                              1/4 
  検証中                  : 1:openssl-1.0.2k-21.el7_9.x86_64                                                                                                   2/4 
  検証中                  : 1:openssl-1.0.2k-12.el7.x86_64                                                                                                     3/4 
  検証中                  : 1:openssl-libs-1.0.2k-12.el7.x86_64                                                                                                4/4 

更新:
  openssl.x86_64 1:1.0.2k-21.el7_9                                                                                                                                 

依存性を更新しました:
  openssl-libs.x86_64 1:1.0.2k-21.el7_9                                                                                                                            

完了しました!
```

```
[root@syslog ~]# needs-restarting --services
NetworkManager.service
postfix.service
vmtoolsd.service
zabbix-agent.service
sshd.service
vgauthd.service
tuned.service
firewalld.service
```


