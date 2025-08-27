---
title: "WLX222とNETGEARスイッチでSSIDにタグVLAN、仮想コントローラーuntagを設定する方法"
date: 2025-08-27
author: norikazum
tags: [YAMAHA,NETGEAR,vlan,Wi-Fi]
description: "YAMAHA WLX222とNETGEARスイッチでSSIDごとにタグVLANを設定しつつ、仮想コントローラーはuntagで接続する構成の設定手順を解説します。"
---

こんにちは。

今回は、NETGEARのスイッチと、YAMAHA WLX222 を利用してタグVLANを構成したWi-Fi環境を作成する内容です。

NETGEAR側の設定に少し癖があり、はまりましたので記録も兼ねて記事にします。

## 環境
- スイッチ: NETGEAR S3300-28X 
- 無線AP: YAMAHA WLX222

## 概要
以下のような環境を実現したい場合です。

- ネットワークスイッチから、VLAN 1, 10 ,20 を流す
- VLAN 10,20 は SSIDとして設定し、VLAN 1 は仮想コントローラー接続用に使用する。

![](images/2025-06-07_16h45_13.png "イメージ図")

## 設定
ポイントは以下の3点です。

1. WLX222 と接続するポートでは「タグ VLAN」と「ポート VLAN（= Untag VLAN）」を併用すること
    - タグ VLAN はSSID用、ポート VLANは仮想コントローラー接続用に分けて使います。
2. タグ VLAN はSSIDとして利用する
    - たとえば VLAN 10 や VLAN 20 をSSIDに割り当ててWi-Fiネットワークを構成します。
3. ポート VLAN（Untag VLAN）は仮想コントローラー用に利用する
    - 仮想コントローラーはUntag通信のみ対応なので、接続ポートのPVIDにVLAN 1を設定する必要があります。

※ ポート VLAN = PVID

### NETGEAR S3300-28X 

管理画面にログインします。
今回は 2/g3 に設定します。

`Switching -> VLAN -> Advanced -> VLAN Membership` に進みます。

仮想コントローラーとの接続に使用する VLAN 1 を設定するポートをクリックして `U` にします。
![](images/2025-06-07_17h06_28.png "Untagポートの設定")

この設定がポイント (**仮想コントローラーは Untag VLAN しか通信できない**) です。
これが分からず、ずっと通信できなかったという結論です。

次に、`Switching -> VLAN -> Advanced -> Port PVID Configuration` に進みます。

設定するポートをチェックして、以下のように設定します。
![](images/2025-06-07_17h05_04.png "tagポートの設定")

各設定後に `Apply` ボタンをクリックして反映することを忘れないように注意します。

### YAMAHA WLX222
今回の評価では、仮想コントローラー設定はWLX222のデフォルトです。

以下のようになります。

- 仮想コントローラーの設定
  ![](images/2025-06-07_15h10_03.png "仮想コントローラー設定")

SSID の設定は、以下のとおりです。
ポイントはVLAN IDの指定部分です。

- VLAN 10 を利用したSSID
  ![](images/2025-06-07_16h56_44.png "SSID=VLAN10")

- VLAN 20 を利用したSSID
  ![](images/2025-06-07_16h57_01.png "SSID=VLAN20")

これで、仮想コントローラーアクセスができ、かつVLAN10とVLAN20をSSIDに設定できます。

VLAN10 の SSID に接続できました。
  ![](images/2025-06-07_17h14_37.png "VLAN10に接続成功")

VLAN20 の SSID に接続できました。
  ![](images/2025-06-07_17h14_45.png "VLAN20に接続成功")

NETGEAR 側の設定で、tag VLAN と untag VLAN を分けて設定する方法が分からず、かなりの時間を費やしました。

参考になれば幸いです。
それでは次回の記事でお会いしましょう。
