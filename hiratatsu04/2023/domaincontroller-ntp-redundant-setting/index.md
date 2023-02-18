---
title: Active Directory 環境における NTP サーバーの冗長化設定
date: 
author: hiratatsu04
tags: [ActiveDirectory, NTP, Windows Server, 冗長]
description: Active Directory 環境において、PDC エミュレーター以外のドメインコントローラーは PDC エミュレーターを参照して時刻同期します。しかし、この場合参照先の PDC エミュレーターの役割を持つドメインコントローラーが障害などで停止すると、時刻同期ができなくなります。この記事では、PDC エミュレーターが停止した時に、外部のドメインコントローラーを参照することで NTP サーバーを冗長構成とする方法を紹介します。
---

こんにちは、ひらたつです。

Active Directory 環境では、時刻同期は階層構造となり以下のように時刻が参照されます。

- ドメインコントローラー (FSMO, Flexible Single Master Operation)：外部の NTP サーバー
- ドメインコントローラー (FSMO 以外)：ドメインコントローラー (FSMO)
- サーバー・クライアント端末：いずれかのドメインコントローラー

※ FSMO の役割の1つに PDC (Primary Domain Controller) エミュレーターがあり、この機能を持っているドメインコントローラーがドメインの中のメインの NTP サーバーとなります。  
※以下では PDC エミュレーターの役割を持つドメインコントローラーを DC1、PDC エミュレーターの役割を持たないドメインコントローラーを DC2 と表記します。

DC1, 2 以外のサーバーや、クライアント端末はいずれかのドメインコントローラーを参照します。  
しかし、DC2 は DC1 を参照するため、DC1 が停止すると DC2 が時刻同期できなくなり、それに伴いサーバーやクライアント端末が正しい時間に同期できなくなります。

上記の解決策の1つとして、**DC2 は DC1 が停止した時に外部の NTP サーバーに同期するようにしておく**ことが考えられます。

この記事では、PDC エミュレーターが停止した時に、DC2 が外部のドメインコントローラーを参照することで NTP サーバーを冗長構成とする方法を紹介します。

## 想定環境
- 2台のドメインコントローラーで Active Directory を構成している
- FSMO のドメインコントローラーは外部 NTP サーバー `ntp.sample.jp` を参照している

## 2台目のドメインコントローラーの設定

NTP の設定項目には以下の2つがあります。

- `Type`：時刻同期を行う方法を設定する
- `NtpServer`：上記の `Type` が `NTP` または `AllSync` の時に参照される NTP サーバーを設定する

各項目の詳細については以下ご参照ください。  
[Windows Server 2003 で NTP 設定の Type エントリを AllSync にする方法 | MSeeeeN](https://mseeeen.msen.jp/windows-server-2003-ntp-allsync/#%E5%89%8D%E7%BD%AE%E3%81%8Dntp-%E3%81%AE%E8%A8%AD%E5%AE%9A%E9%A0%85%E7%9B%AE)

**この `Type` と `NtpServer` を変更することで冗長化します。**

具体的には DC2 で以下コマンドを実行ください。

```cmd
C:\Users\Administrator.DC2>w32tm /config /syncfromflags:ALL /manualpeerlist:ntp.sample.jp,0xa /update
C:\Users\Administrator.DC2>w32tm /resync
```

上記コマンドでは、以下のように設定しています。

- `Type`：`AllSync`
- `NtpServer`：`ntp.sample.jp,0xa`

`Type` を `AllSync` とすることで、`ドメイン階層と外部NTPサーバーの両方から同期を行う` 動作となり、`NtpServer` を `ntp.sample.jp,0xa` とすることで、フォールバック時に利用する NTP サーバーを `ntp.sample.jp` と設定しています。

※ `0x2 + 0x8 = 0xa` ですので、`0xa` を設定することで、`0x2` と `0x8` を設定しています。  
`0x2` を設定することで、`ntp.sample.jp` をフォールバック時に利用する NTP サーバーとして指定できます。  
`0x8` を指定することで `ntp.sample.jp` と明示的に Client/Server Mode による時刻同期ができます。

つまり、上記のように設定することで、**DC2 は通常 DC1 を時刻同期先として参照しますが、何らかの要因で DC1 を時刻同期先として参照できない場合には `NtpServer` の値に基づき外部 NTP サーバーを参照する動作となります。**

この設定で、NTP サーバーを冗長構成にできます。

ご参考になれば幸いです。

ではまた。


