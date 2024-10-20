---
title: "FortiClient VPN で SSL VPN 接続時にパスワードを保存する方法"
date: 2024-10-02
author: norikazum
tags: [FortiGate,VPN]
description: "FortiClientでSSL VPN接続時にパスワードを保存する方法を、FortiGateの設定変更とレジストリの変更手順を含めて詳しく解説しています。"
---

こんにちは。

今回は、FortiClient を利用して、SSL-VPN で接続する際のパスワードを保存する方法を紹介します。

標準では、以下のようにユーザー名は保存できますが、パスワードは毎回入力になります。
![](images/2024-09-24_17h52_47.png "接続画面")

このパスワード入力を、毎回面倒だ！ と思っている方、多いのではないでしょうか？

そんな方に朗報です。
以下の手順でパスワードを保存できます。

1. クライアント OS は Windows を対象とする
1. FortiGate の設定変更
1. 接続元端末のレジストリ値変更
1. これまでと同じように接続する

上記の流れで、パスワードが保存され、次回以降の入力を省くことができます。

それでは、具体的な設定を紹介します。

## 設定方法

### 前提
- 設定名称を MSEN とします
- FortiOS は、`v7.2.7 build1577` とします
- 接続元ユーザーに設定されている SSL-VPN ポータルは tunnel-access とします
- FortiClient のバージョンは `7.0.1.0083` とします

### FortiGate の設定変更
1. FortiGateに管理者でログインします
1. VPN → SSL-VPNポータル → tunnel-access に進みます
1. トンネルモードオプションの **クライアントがパスワードを保存することを許可する** を ON にします
    - この変更で **接続済みのVPNセッションは切断されません**

### 接続元端末のレジストリ値変更 

1. レジストリエディタを開き、 `HKEY_CURRENT_USER\Software\Fortinet\FortiClient\Sslvpn\Tunnels` へ進みます。デフォルトは画像のようになっています。
    ![](images/2024-09-24_22h09_42.png "デフォルト値")
1. 管理者でコマンドプロンプトを開き、以下のコマンドを実行します。MSEN の部分は設定名称です。
    ```
    reg add HKEY_CURRENT_USER\SOFTWARE\Fortinet\FortiClient\Sslvpn\Tunnels\MSEN /v show_remember_password /t REG_DWORD /d 1 /f
    ```
1. `show_remember_password` が、1 になったことが確認できます。
1. 接続設定を確認すると、**パスワードを保存** というチェックボックスが出ていることが確認できます。
    ![](images/2024-09-24_22h15_11.png "パスワード保存のチェックボックス")

以下の赤枠のレジストリ値が増えていることを確認できます。
![](images/2024-09-24_22h22_37.png "変更されたレジストリ値")

### これまでと同じように接続する 
1. **パスワードを保存にチェックを入れた状態** でこれまでどおり接続します。
1. 切断しても、パスワードが保存された状態になります。
    ![](images/2024-09-24_22h17_01.png "パスワード保存された状態")

以上で、FortiClient を利用して、SSL VPN接続する際のパスワードを保存できます。

## 参考情報
### 自動接続するには EMS (専用サーバ)が必要
SSL-VPNポータルの設定を変更する際、気になった方もいるかもしれませんが、**クライアントの自動接続を許可する** という項目があったと思います。
![](images/2024-09-24_22h19_56.png "クライアントの自動接続設定")

設定を ON にしたあと、クライアントマシンで管理者としてコマンドプロンプトを開き、以下のコマンドを実行します。MSEN の部分は設定名称です。

```
reg add HKEY_CURRENT_USER\SOFTWARE\Fortinet\FortiClient\Sslvpn\Tunnels\MSEN /v show_autoconnect /t REG_DWORD /d 1 /f
```

`show_autoconnect` が、1 になったことが確認できます。
![](images/2024-09-24_22h26_14.png "変更されたレジストリ値")

これで、**自動接続のチェックボックスが出現** しました。
![](images/2024-09-24_22h27_28.png "自動接続のチェックボックス")

しかし、チェックを入れると、以下のように表示され、**FortiClientの無料バージョンでは使用できない** ことが分かります。
![This feature is unavailableと表示](images/2024-09-24_22h29_22.png "This feature is unavailableと表示")

某代理店に確認したところ、**25endpoint 1年間ライセンス で 85,000円 (税抜)** でした。

参考記事: [【3分で分かるFortinet】【第18回】FortiClient/EMS(Fabric Agent) 機能概要｜技術ブログ｜C&S ENGINEER VOICE](https://licensecounter.jp/engineer-voice/blog/articles/20210326_forticlientems_fabric_agent.html)

### 保存したパスワードを削除
保存したパスワードを削除するためには、`SavePass` のレジストリ値を **1→0** に変更します。
![](images/2024-09-24_22h31_18.png "保存したパスワードの設定(削除前)")
![](images/2024-09-24_22h31_34.png "保存したパスワードの設定(削除後)")

設定を読み直すと、保存したパスワードが削除されています。
![](images/2024-09-24_22h33_45.png "保存したパスワードが削除")

### FortiGate側の設定を実施していない場合
FortiGateのSSL-VPNポータル設定を変えずにレジストリ値を変更しても、接続後に切断するとチェックボックスが消え、パスワード保存は反映されず、レジストリも元に戻ります。

本設定は、**セキュリティに関わるものとなりますので、設定を採用する場合にはご自身の責任で実施いただきますよう** お願いいたします。

それでは次回の記事でお会いしましょう。
