---
title: Value-domainで取得したドメインをLinuxから自動更新する」
date: 
author: norikazum
tags: [DNS,ネットワーク]
description: 
---

こんにちは。

以前、Value-domainで取得したドメインをダイナミックDNSに対応する記事を書きました。
[Value-domain で取得したドメインでダイナミック DNS 環境を構築する](https://mseeeen.msen.jp/build-dynamic-dns-with-value-domain/)

過去記事では、 `Windows Powershell` と `VBS` で更新する方法を記載しておりましたが、Linuxで更新する機会もありましたので更新用 `bashスクリプト` を紹介しました。

## 更新用bashスクリプト
`DOMAINNAME=` , `PASSWORD=` , `HOSTNAME=` を設定します。
以下のスクリプトは過去記事に内容を合わせています。
`login.example.com` のような特定のホストを更新する場合は、`HOSTNAME=login` となります。 

**valuedomain.sh**
```bash
#/bin/bash

#VARIABLES
DOMAINNAME="example.com"
PASSWORD="password"
HOSTNAME="*"
MYIP=""

#外部IP取得
MYIP=`wget -q -O - "https://dyn.value-domain.com/cgi-bin/dyn.fcg?ip"`
#cgiがbusyにことがあるのでsleep
sleep 5
#更新処理
wget -q -O - "https://dyn.value-domain.com/cgi-bin/dyn.fcg?d=$DOMAINNAME&p=$PASSWORD&h=$HOSTNAME&i=$MYIP"
```

## 自動更新設定
前項で作成したスクリプトを`crontab -e` から、以下を追記して定期的に更新するようにします。
設定例は `30分ごと` です。
`*/30 * * * * /root/valuedomain.sh`
これで、グローバルIPアドレスが変わっても自動で更新されます。

## あとがき
Value-domainに負荷がかかりますので短すぎる設定は避けましょう。

まだまだ現役で使えていて、私の運用実績では安定しています。

それでは次回の記事でお会いしましょう。
