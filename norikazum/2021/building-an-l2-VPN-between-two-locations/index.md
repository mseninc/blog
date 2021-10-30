---
title: 2拠点間でのL2TPv3/IPsecを用いたL2VPNの構築
date: 
author: norikazum
tags: [VPN,YAMAHA,ネットワーク]
description: 2つのヤマハルーター間でL2TPv3/IPsecを用いたL2VPNを構築します。
---

こんにちは。

今回は、ヤマハルーターを利用し、2拠点間でL2VPNを構築する手順を紹介します。

## 利用シーン

今回の紹介事例は、とあるシステムの更新時で本番(現地)環境と構築環境が離れている状態で、構築環境から本番環境を使うためにこのネットワークを構築しました。

イメージは以下のようになります。


## 利用した機器
- [YAMAHA RTX830](https://network.yamaha.com/products/routers/rtx830/index) x 2
    - 執筆時点で非常に品薄
- インテリジェントL2スイッチ x2
    - VLANを扱うことができればOK
