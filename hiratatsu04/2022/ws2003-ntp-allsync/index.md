---
title: 【備忘録】WS2003でNTP設定のTypeエントリをAllSyncにする方法
date: 
author: hiratatsu04
tags: [Windows Server,NTP]
description: Windows Server 2003のNTP設定をAllsyncにする方法です。
---

こんにちは、ひらたつです。

先日、Windows Server 2003のNTP(Network Time Protocol)設定を変更しましたが、最初はうまく設定できず苦労したので、備忘録として残しておきます。

Windows Server2003 を使っておられる方は少ないかもしれませんが、何かの役に立てば幸いです。

## 【前置き】NTPの設定項目
NTPの設定項目には以下の2つがあります。
- `Type`：どのマシンからNTPを同期するか
- `NtpServer`：TypeがNTPまたはAllSyncの時に参照されるNTPサーバはどれか

それぞれ以下の設定が可能です。

#### Type

値 | 意味
-- | --
NoSync | 同期を行わない
NTP | NtpServerレジストリ値（次の表参照）で指定したサーバから同期を行う
NT5DS | ドメイン階層により決定されたサーバから同期を行う
AllSync | ドメイン階層と外部NTPサーバの両方から同期を行う

#### NtpServer

値 | 意味
-- | --
0x1 | Symmetric   Activeモードで同期／Windowsで実装した一定間隔での同期
0x2 | Symmetric Activeモードで同期／フォールバック時に利用するNTPサーバを指定
0x4 | Symmetric Activeモードで同期／RFC1305に準拠した間隔での同期
0x8 | Clientモードで同期／RFC1305に準拠した間隔での同期

※上記の0x1～0x8はそれぞれを組み合わせて使うこともできます。  
例：0x8 + 0x2 =0xa

## WS2003では単純にAllSyncを設定できない

通常、Typeエントリの設定は以下のコマンドで行います。  
```
w32tm /config /syncfromflags:Type
```
もしくは、同時に`Ntpserver`も設定する場合は以下のコマンドになります。  
```
w32tm /config /syncfromflags:Type /manualpeerlist:Ntpserver /update
```

（より詳細な設定は[この記事](https://mseeeen.msen.jp/set-ntp-server-with-command-in-windows-server/)をご参照ください。）

この `Type` に以下を設定することで、任意の設定に変更可能です。

Typeへの指定値 | Typeの設定値
-- | --
NO | NoSync
MANUAL | NTP
DOMHIER | NT5DS
ALL | AllSync

しかし、WS2003環境では `Type` に `ALL` を指定するとエラーとなってしまいます。

## WS2003でのAllSync設定方法

ALLを指定する以外の方法を調べたが見つからず、、。

試しに以下のように2つを指定すると `AllSync` となることが分かりました。 
```
w32tm /config /syncfromflags:DOMHIER,MANUAL
```

AllSyncは、ドメイン階層と外部NTPサーバの両方から同期を行うという設定なので、それらを意味する、`DOMHIER`と`MANUAL`を設定すれば良いみたいでした。

以上です。
