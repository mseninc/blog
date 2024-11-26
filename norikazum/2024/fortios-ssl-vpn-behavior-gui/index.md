---
title: "FortiGate から SSL VPN設定がGUIから消えた？FortiOS 7.4.1の仕様変更"
date: 
author: norikazum
tags: [FortiGate,VPN]
description: "FortiOS 7.4.1以降、SSL VPNのデフォルト動作とGUI設定が変更されました。本記事では、非表示となる設定やその対処方法について解説します。"
---

こんにちは。

FortiOS 7.4.1以降、SSL VPNのデフォルト動作とGUIの可視性に関する仕様変更が加えられました。

この変更により、SSL VPN設定が初期状態では非表示となり、設定方法や管理が変更されています。本記事ではその詳細と対処法について解説します。
※ **バージョン 7.4.5 build2702 で確認** しました。

## 主な変更点

1. **表示機能設定の非表示化**
   デフォルトでシステム-表示機能設定から非表示になります。   
   ![](images/2024-11-26_12h35_00.png "旧バージョンの表示機能設定")

1. **SSL VPN Webモードの非表示化**  
   デフォルトでSSL VPN Webモードの設定が無効化され、GUIおよびCLIから非表示になります。

2. **トンネルモードとメニューの非表示化**  
   トンネルモードの設定と`VPN > SSL-VPN`メニューもデフォルトでGUIから非表示となります。

3. **CLIでの設定分離**  
   VPN GUIの機能可視性設定がIPsecとSSL VPNで分離されました。
   - IPsec：`set gui-vpn` (デフォルトは有効)
   - SSL VPN：`set gui-sslvpn` (デフォルトは無効)

4. **警告メッセージの追加**  
   GUIのSSL VPN設定ページに、リモートアクセスの代替案を示す警告メッセージが追加されました。

5. **セキュリティレーティングの新しいチェック項目**  
   `Security Fabric > Security Rating`に新しいチェック「Disable SSL-VPN Settings」が追加され、SSL VPNが有効の場合にチェックが失敗します。

## 設定方法

### SSL VPNメニューの表示
GUIメニューを有効化するには、以下のCLIコマンドを使用します。

```cli
config system settings
set gui-sslvpn enable
end
```

これで、SSL-VPNのメニューが表示されます。
![](images/2024-11-26_13h26_15.png "SSL-VPNの機能が有効化")

## デバイスのアップグレード後の挙動

FortiOS 7.4.1以前のファームウェアでSSL VPN設定が有効化されていた場合、アップグレード後も設定とメニューは保持されます。一方、初期状態や設定が無効だった場合、GUIおよびCLIから非表示となります。

## 代替案：IPsec VPNとZTNA

Fortinetは、SSL VPNに代わるリモートアクセスソリューションとしてIPsec VPNやZTNAの利用を推奨しています。

## 詳細情報

さらに詳しい情報については、Fortinet公式ドキュメントをご覧ください。

[Fortinet公式ドキュメント: Update SSL VPN default behavior and visibility in the GUI 7.4.1](https://docs.fortinet.com/document/fortigate/7.4.0/new-features/233856/update-ssl-vpn-default-behavior-and-visibility-in-the-gui-7-4-1)

SSL VPN設定の変更は管理者にとって重要なポイントです。
FortiOS 7.4.1以降の挙動を確認し、適切に設定を調整しましょう。

## FortiOS 7.6.0 における注意点について

執筆時点で最新のOSバージョンは、7.6.0 ですが、メモリ2G搭載モデルを対象として、SSL-VPN機能が無効化されたようです。

メモリの確認は、`diagnose hardware sysinfo conserve` というコマンドで可能です。
![](images/2024-11-26_15h29_20.png "メモリ容量の確認コマンド")

参考ページ: 
[【FortiGate】FortiOS7.6.0における一部小型モデルの仕様変更について｜大塚商会](https://mypage.otsuka-shokai.co.jp/news/detail?linkBeforeScreenId=OMP20F0102S01P&oshiraseNo=MDAwMDAwNDc3Mg==&navi=1)

[SSL VPN removed from 2GB RAM models for tunnel and web mode | FortiGate / FortiOS 7.6.0 | Fortinet Document Library](https://docs.fortinet.com/document/fortigate/7.6.0/fortios-release-notes/877104/ssl-vpn-removed-from-2gb-ram-models-for-tunnel-and-web-mode)