---
title: Windows Server 2016 Techical Preview をインストールしてみた
date: 2016-07-02
author: norikazum
tags: [Windows]
---

今回は、2016年の夏頃にリリースされてると言われているWindows Server 2016 のPreviewバージョンをインストールしてみました。

弊社は、Microsoft BizSparkに参加しているので、MSDN上から入手しています。
インストール時点では **technical_preview_5** でした。

BizSparkは、マイクロソフトが提供するスタートアップ支援のプログラムで開発ツールやクラウド環境などを 3 年間無償で利用できるというものです。

## インストール
CDから起動すると、Windows Server 2012と同様な画面から始まりました。

![2016-06-22_16h31_17](images/windows-server-2016-techical-preview-5-1.png)

今すぐインストールを選択します。ここも2012とほぼ同じですね。

![2016-06-22_16h32_50](images/windows-server-2016-techical-preview-5-2.png)

セットアップが始まり、

![2016-06-22_16h33_39](images/windows-server-2016-techical-preview-5-3.png)

お、ライセンスキーが求められた。今回は入力しないで進みます。

![2016-06-22_16h34_18](images/windows-server-2016-techical-preview-5-4.png)

とりあえず、今回はGUI操作をしたいので、上から2番目の**(Desktop Experience)**を選択で進みます。
**1番上の選択肢は、2012 R2 までは Server Coreと呼ばれていたもので、ログインするとコマンドプロンプトが開かれているタイプです。**

![2016-06-22_16h35_26](images/windows-server-2016-techical-preview-5-5.png)

お決まりのライセンスの同意があり、

![2016-06-22_16h36_37](images/windows-server-2016-techical-preview-5-6.png)

今回は新規なので、カスタムを選択します。

![2016-06-22_16h36_58](images/windows-server-2016-techical-preview-5-7.png)


新規から、全ての領域を適用して進みます。

![2016-06-22_16h38_15](images/windows-server-2016-techical-preview-5-8.png)

次へでインストールを開始します。

![2016-06-22_16h39_38](images/windows-server-2016-techical-preview-5-9.png)

完了するまで待ちます。
ここまでは、特に2012と大きな違いはないですね。
途中でライセンスが求められることぐらいでしょうか。

![2016-06-22_16h40_23](images/windows-server-2016-techical-preview-5-10.png)

## 初期設定

起動してきました。
パスワードを設定します。

![2016-06-22_17h04_58](images/windows-server-2016-techical-preview-5-11.png)

↓

![2016-06-22_17h05_43](images/windows-server-2016-techical-preview-5-12.png)


## 操作してみた感想

ログイン画面はこんな感じです。あまり変わってないですかね。

![2016-06-22_17h06_15](images/windows-server-2016-techical-preview-5-13.png)

↓

![2016-06-22_17h07_26](images/windows-server-2016-techical-preview-5-14.png)


ログイン直後のデスクトップ画面はWindows 10そのもの！

![2016-06-22_17h10_09](images/windows-server-2016-techical-preview-5-15.png)

サーバマネージャーはあまり変化はないです。

![2016-06-22_17h10_15](images/windows-server-2016-techical-preview-5-16.png)

スタートメニューもWindows 10そのものですね。

![2016-06-22_17h11_58](images/windows-server-2016-techical-preview-5-17.png)

コントロールパネル。

![2016-06-22_17h12_23](images/windows-server-2016-techical-preview-5-18.png)

管理ツール。

![2016-06-22_17h12_37](images/windows-server-2016-techical-preview-5-19.png)

発売日は、2016年夏頃のようです。

ちなみに、Windows2012のサポートが切れるのは**2023/01/10**です。
[参照](https://support.microsoft.com/ja-jp/lifecycle?C2=1163)

Windows10に日々触れておけば特に操作感のとまどいはないと思います！
