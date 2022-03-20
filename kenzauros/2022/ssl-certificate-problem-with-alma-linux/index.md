---
title: AlmaLinux 8.4 の dnf で SSL 証明書エラー (AlmaLinux 8.4 での時刻設定と NTP インストール)
date: 
author: kenzauros
tags: [AlmaLinux, dnf, chrony]
description: AlmaLinux 8.4 の dnf で SSL 証明書エラーがでて、少し困りました。結局、時刻が合っていなかったという初歩的なミスでしたが、せっかくなので AlmaLinux での時刻設定や NTP 設定の方法をまとめました。
---

## 概要

AlmaLinux を複数台にインストールしていたところ、同じインストールメディアと手順にもかかわらず、なぜか一部の端末で *SSL 証明書のエラーが表示され、 dnf が利用できませんでした*。

振り返ってみれば何のことはなく、要するに**時刻がずれていた😂**というだけなのですが、夕方ごろの作業で頭が固まっていたのか、しばらくハマったので自戒のためメモしておきます。

なお本記事のディストロは AlmaLinux 8.4 ですが、 Red Hat 8 系ならコマンドも大きく異ならないと思います。

## エラー

インストーラーで OS をインストールしたあと、 `dnf upgrade` をしようとしたところ、お馴染みのエラー **SSL certificate problem** が発生しました。

```:title=bash
# dnf upgrade -y
AlmaLinux 8 - BaseOS                                                                    0.0  B/s |   0  B     00:04
Errors during downloading metadata for repository 'baseos':
  - Curl error (60): Peer certificate cannot be authenticated with given CA certificates for https://mirrors.almalinux.org/mirrorlist/8/baseos [SSL certificate problem: certificate is not yet valid]
エラー: repo 'baseos' のメタデータのダウンロードに失敗しました : Cannot prepare internal mirrorlist: Curl error (60): Peer certificate cannot be authenticated with given CA certificates for https://mirrors.almalinux.org/mirrorlist/8/baseos [SSL certificate problem: certificate is not yet valid]
```

真っ先に疑ったのは Let's Encrypt の中間証明書です。最近、証明書のエラーといえば、それだろう、と。ただ、証明書を入れ替えてみても解決しませんでした。

よく考えれば、他の端末では行っていなかったので、この端末だけ証明書が古いというのも、不思議な話です。

## 時刻ずれの解消と chronyd のインストール

### 過去にいました

翌日冷静に考えてみると、インストーラーでタイムゾーン設定をしたものの、肝心の時刻の確認をしていなかったことに気付きました。

おもむろに `date` コマンドを叩いてみると...。

```:title=bash
$ date
2022年  1月 30日 日曜日 08:07:50 KST
```

ちなみにこの日は2022年3月20日でした。二ヵ月もバック・トゥ・ザ・パスト。そりゃだめだ。

### 時刻設定

以下、プロンプトが `#` の場合は `sudo su -` で root ユーザーになっている想定です。

だいたい今の時間に設定します。

```:title=bash
# timedatectl set-time "2022-03-20 09:45:00"
2022年  3月 20日 日曜日 09:45:00 KST
```

`timedatectl` で確認します。

```:title=bash
# timedatectl
               Local time: 日 2022-03-20 09:45:58 KST
           Universal time: 日 2022-03-20 00:45:58 UTC
                 RTC time: 土 2022-01-29 23:11:43
                Time zone: Asia/Seoul (KST, +0900)
System clock synchronized: no
              NTP service: n/a
          RTC in local TZ: no
```

ん...？ソウル？🤔

```:title=bash
# date
2022年  3月 20日 日曜日 09:45:30 KST
```

なぜかタイムゾーンが Korea になっておりました。インストール時に選択を間違えたかもしれません😅。

エラーとは関係ないと思いますが、 **`timedatectl set-timezone` で `Asia/Tokyo` に設定**しなおします。

```:title=bash
# timedatectl set-timezone Asia/Tokyo
```

再度確認します。

```:title=bash
# timedatectl
               Local time: 日 2022-03-20 09:46:14 JST
           Universal time: 日 2022-03-20 00:46:14 UTC
                 RTC time: 土 2022-01-29 23:11:59
                Time zone: Asia/Tokyo (JST, +0900)
System clock synchronized: no
              NTP service: n/a
          RTC in local TZ: no
```

無事日本に帰ってきました🗾。

これで無事に `dnf` が実行できるようになりました👏。

### NTP 設定

ついでに **NTP (chrony)** をインストールして、今後このようなことが起きないようにしましょう。

dnf で *chrony* をインストールします。

```:title=bash
# dnf -y install chrony
```

念のため、設定ファイル `/etc/chrony.conf` をバックアップしておきます。

```:title=bash
# cp /etc/chrony.conf{,.org}
```

設定ファイル `/etc/chrony.conf` を編集します。

```:title=bash
# vi /etc/chrony.conf
# diff -U 1 /etc/chrony.conf{.org,}
```

`pool 2.cloudlinux.pool.ntp.org iburst` の部分を [NICT の NTP サーバー](https://jjy.nict.go.jp/tsp/PubNtp/index.html) `pool ntp.nict.jp iburst` に変えるだけです。

ネットワーク内に NTP サーバーがある場合はそのアドレスを指定しましょう。

```diff:title=diff(/etc/chrony.conf)
--- /etc/chrony.conf.org        2022-03-20 10:39:12.262957754 +0900
+++ /etc/chrony.conf    2022-03-20 10:39:45.820956091 +0900
@@ -2,3 +2,4 @@
 # Please consider joining the pool (http://www.pool.ntp.org/join.html).
-pool 2.cloudlinux.pool.ntp.org iburst
+#pool 2.cloudlinux.pool.ntp.org iburst
+pool ntp.nict.jp iburst 👈 NTP サーバー
```

ちなみに同じネットワークの別サーバーから参照させたい場合は下記の部分も変更しておきます。

```diff:title=diff(/etc/chrony.conf)
@@ -23,2 +24,3 @@
 #allow 192.168.0.0/16
+allow 192.168.10.0/24 👈 プライベートネットワークのアドレスとサブネット長
```

chronyd を有効化して、念のため再起動し、サービスの状況を確認しておきます。

```:title=bash
# systemctl enable --now chronyd
# systemctl restart chronyd
# systemctl status chronyd
● chronyd.service - NTP client/server
   Loaded: loaded (/usr/lib/systemd/system/chronyd.service; enabled; vendor preset: enabled)
   Active: active (running) since Sun 2022-03-20 09:59:14 JST; 4s ago
～略～
```

最後に `chronyc sources` で同期状況を確認し、設定した NTP サーバーと同期できていれば OK です。

```:title=bash
# chronyc sources
MS Name/IP address         Stratum Poll Reach LastRx Last sample
===============================================================================
^- ntp-a3.nict.go.jp             1   6    17    31   -525us[ -525us] +/- 7583us
^- ntp-a2.nict.go.jp             1   6    17    32   -649us[ -649us] +/- 7292us
^- ntp-b3.nict.go.jp             1   6    17    31   +913us[ +913us] +/-   10ms
^* ntp-k1.nict.jp                1   6    17    32   -731us[ -274us] +/- 6172us
```

## まとめ

AlmaLinux のインストール中に dnf の SSL 証明書エラーが発生したので解決策を書こうと思いましたが、原因が初歩的すぎたので AlmaLinux での時刻設定方法を紹介しました。

時刻周りの設定は `timedatectl` コマンドを使いましょう。

それにしてもなぜこの端末だけだったのかはいまだに不明です。（BIOS の時計もずれていましたが数時間程度でした）

どなたかのお役に立てれば幸いです。
