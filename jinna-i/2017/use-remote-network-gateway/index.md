---
title: WindowsでVPN接続先のネットワークゲートウェイを経由してインターネットに接続する
date: 2017-09-22
author: jinna-i
tags: [VPN, ネットワーク, Windows]
---

こんにちは、じんないです。

VPN接続している先のネットワークを経由して特定のサーバーやネットワークにアクセスできればなーと思うことはありませんか。

接続元のIPアドレスを制限している環境などに接続したいときは、許可されたIPアドレスをもつ環境から接続しなければいけません。

<a href="images/use-remote-network-gateway-1.png"><img src="images/use-remote-network-gateway-1.png" alt="" width="741" height="687" class="alignnone size-full wp-image-5238" /></a>

上図のような環境があるとして、Web Serverが**IPアドレス 2.2.2.2**からのSSH接続のみを許可している場合、Client(**IPアドレス 1.1.1.1**)からダイレクトにSSH接続することはできません。

このような場合は、一旦IPアドレス 2.2.2.2の環境にVPN接続し、接続先のデフォルトゲートウェイを使用することでClientからダイレクト（見かけ上）にSSH接続できるようになります。

## リモートネットワークのゲートウェイを使用する

**コントロールパネル > ネットワークとインターネット > ネットワーク接続** を開きVPNアダプタを見つけます。
<a href="images/use-remote-network-gateway-2.png"><img src="images/use-remote-network-gateway-2.png" alt="" width="806" height="480" class="alignnone size-full wp-image-5239" /></a>

**右クリック > プロパティ** をクリックします。
<a href="images/use-remote-network-gateway-3.png"><img src="images/use-remote-network-gateway-3.png" alt="" width="806" height="480" class="alignnone size-full wp-image-5240" /></a>

**ネットワークタブ > インターネットプロトコルバージョン4(TCP/IP)** を選択し、**プロパティ** をクリックします。
<a href="images/use-remote-network-gateway-4.png"><img src="images/use-remote-network-gateway-4.png" alt="" width="421" height="540" class="alignnone size-full wp-image-5241" /></a>

**詳細設定** をクリックします。
<a href="images/use-remote-network-gateway-5.png"><img src="images/use-remote-network-gateway-5.png" alt="" width="465" height="518" class="alignnone size-full wp-image-5242" /></a>

IP設定タブより**リモートネットワークでデフォルトゲートウェイを使う**にチェックを入れます。
<a href="images/use-remote-network-gateway-6.png"><img src="images/use-remote-network-gateway-6.png" alt="" width="465" height="555" class="alignnone size-full wp-image-5243" /></a>

VPN接続中に変更した場合は以下のメッセージが表示されます。
OKをクリックして、VPNを一旦切って再接続してください。
<a href="images/use-remote-network-gateway-7.png"><img src="images/use-remote-network-gateway-7.png" alt="" width="478" height="165" class="alignnone size-full wp-image-5244" /></a>

あとはVPN接続元の端末から、接続元のIPアドレスを制限しているサーバーやネットワークにアクセスしてみてください。

ダイレクトにつながるようになっていると思います。

## 特定のホストに対して有効なルートを設定する

上述の方法だとVPN接続をしている間、外向きへの通信はすべてリモートネットワークのゲートウェイを経由してしまいます。

これでは余計なトラフィックが増えるばかりでなくセキュリティ的にもよろしくありません。

そこで`route add`コマンドを使用してWindowsのルーティングテーブルを変更し、**特定のホストへの接続だけこのルートを通りますよ**と指定してあげます。

Web Serverへのアクセスのみ2.2.2.2のゲートウェイを経由する例です。

`route add <Web ServerのIPアドレス> mask <ネットマスク> 2.2.2.2`

コマンドが成功すると`OK!`となんだかチャラいレスポンスが返ってきます。

ルーティングテーブルを確認する場合は、`route print` コマンドを使用します。

これでWeb Serverへのアクセスのみ、2.2.2.2のゲートウェイを経由することができました。

ではまた。
