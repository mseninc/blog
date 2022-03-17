---
title: FortiGate でアップグレードパスを調べる方法
date: 
author: norikazum
tags: [Fortigate]
description: 
---

こんにちは。

今回の記事は、FortiGate をアップデートをしようとした際、**このファームウェアバージョンへの有効なアップグレードパスが見つかりませんでした** となる件の解決方法について紹介します。

![](images/2022-03-17_16h23_04.jpg)

## 環境
- ForiGate 60E
- アップデート前ファームウェア FortiOS v6.2.4
- アップデート後ファームウェア FortiOS v6.4.8

## 方法

1. [Fortinet Documentation Library](https://docs.fortinet.com/upgrade-tool) に接続します
1. Current Product(1), Current FortiOS Version(2), Upgrade to FortiOS Version(3) を選択し、GO をクリックします
![](images/2022-03-17_17h32_11.jpg)

すると、下部にアップデートに必要なバージョンのステップが表示されます。
![](images/2022-03-17_17h33_31.jpg)

今回の場合は、`6.2.6 → 6.2.9 → 6.4.8` と 3回アップデートが必要と分かります。

サポートに確認したところ、アップグレードの所要目安時間は1ファームごとに以下となるようです。

```
スタンドアローン環境：約 15 分
HA 環境 ：約 20 分
```

今回であれば 15 分 x 3回 = 45 分 ということになりますね。

参考になれば幸いです。
それでは次回の記事でお会いしましょう。