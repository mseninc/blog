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

<a href="images/windows-server-2016-techical-preview-5-1.png"><img src="images/windows-server-2016-techical-preview-5-1.png" alt="2016-06-22_16h31_17" width="1020" height="767" class="alignnone size-full wp-image-1173" /></a>

今すぐインストールを選択します。ここも2012とほぼ同じですね。

<a href="images/windows-server-2016-techical-preview-5-2.png"><img src="images/windows-server-2016-techical-preview-5-2.png" alt="2016-06-22_16h32_50" width="1019" height="764" class="alignnone size-full wp-image-1174" /></a>

セットアップが始まり、

<a href="images/windows-server-2016-techical-preview-5-3.png"><img src="images/windows-server-2016-techical-preview-5-3.png" alt="2016-06-22_16h33_39" width="1018" height="767" class="alignnone size-full wp-image-1175" /></a>

お、ライセンスキーが求められた。今回は入力しないで進みます。

<a href="images/windows-server-2016-techical-preview-5-4.png"><img src="images/windows-server-2016-techical-preview-5-4.png" alt="2016-06-22_16h34_18" width="1021" height="768" class="alignnone size-full wp-image-1176" /></a>

とりあえず、今回はGUI操作をしたいので、上から2番目の**(Desktop Experience)**を選択で進みます。
**1番上の選択肢は、2012 R2 までは Server Coreと呼ばれていたもので、ログインするとコマンドプロンプトが開かれているタイプです。**

<a href="images/windows-server-2016-techical-preview-5-5.png"><img src="images/windows-server-2016-techical-preview-5-5.png" alt="2016-06-22_16h35_26" width="1023" height="760" class="alignnone size-full wp-image-1177" /></a>

お決まりのライセンスの同意があり、

<a href="images/windows-server-2016-techical-preview-5-6.png"><img src="images/windows-server-2016-techical-preview-5-6.png" alt="2016-06-22_16h36_37" width="1019" height="764" class="alignnone size-full wp-image-1178" /></a>

今回は新規なので、カスタムを選択します。

<a href="images/windows-server-2016-techical-preview-5-7.png"><img src="images/windows-server-2016-techical-preview-5-7.png" alt="2016-06-22_16h36_58" width="1019" height="764" class="alignnone size-full wp-image-1184" /></a>


新規から、全ての領域を適用して進みます。

<a href="images/windows-server-2016-techical-preview-5-8.png"><img src="images/windows-server-2016-techical-preview-5-8.png" alt="2016-06-22_16h38_15" width="1019" height="762" class="alignnone size-full wp-image-1180" /></a>

次へでインストールを開始します。

<a href="images/windows-server-2016-techical-preview-5-9.png"><img src="images/windows-server-2016-techical-preview-5-9.png" alt="2016-06-22_16h39_38" width="1019" height="760" class="alignnone size-full wp-image-1181" /></a>

完了するまで待ちます。
ここまでは、特に2012と大きな違いはないですね。
途中でライセンスが求められることぐらいでしょうか。

<a href="images/windows-server-2016-techical-preview-5-10.png"><img src="images/windows-server-2016-techical-preview-5-10.png" alt="2016-06-22_16h40_23" width="1020" height="762" class="alignnone size-full wp-image-1182" /></a>

## 初期設定

起動してきました。
パスワードを設定します。

<a href="images/windows-server-2016-techical-preview-5-11.png"><img src="images/windows-server-2016-techical-preview-5-11.png" alt="2016-06-22_17h04_58" width="1020" height="763" class="alignnone size-full wp-image-1191" /></a>

↓

<a href="images/windows-server-2016-techical-preview-5-12.png"><img src="images/windows-server-2016-techical-preview-5-12.png" alt="2016-06-22_17h05_43" width="1037" height="877" class="alignnone size-full wp-image-1192" /></a>


## 操作してみた感想

ログイン画面はこんな感じです。あまり変わってないですかね。

<a href="images/windows-server-2016-techical-preview-5-13.png"><img src="images/windows-server-2016-techical-preview-5-13.png" alt="2016-06-22_17h06_15" width="1037" height="877" class="alignnone size-full wp-image-1197" /></a>

↓

<a href="images/windows-server-2016-techical-preview-5-14.png"><img src="images/windows-server-2016-techical-preview-5-14.png" alt="2016-06-22_17h07_26" width="1017" height="759" class="alignnone size-full wp-image-1199" /></a>


ログイン直後のデスクトップ画面はWindows 10そのもの！

<a href="images/windows-server-2016-techical-preview-5-15.png"><img src="images/windows-server-2016-techical-preview-5-15.png" alt="2016-06-22_17h10_09" width="1023" height="762" class="alignnone size-full wp-image-1377" /></a>

サーバマネージャーはあまり変化はないです。

<a href="images/windows-server-2016-techical-preview-5-16.png"><img src="images/windows-server-2016-techical-preview-5-16.png" alt="2016-06-22_17h10_15" width="1017" height="723" class="alignnone size-full wp-image-1378" /></a>

スタートメニューもWindows 10そのものですね。

<a href="images/windows-server-2016-techical-preview-5-17.png"><img src="images/windows-server-2016-techical-preview-5-17.png" alt="2016-06-22_17h11_58" width="577" height="620" class="alignnone size-full wp-image-1379" /></a>

コントロールパネル。

<a href="images/windows-server-2016-techical-preview-5-18.png"><img src="images/windows-server-2016-techical-preview-5-18.png" alt="2016-06-22_17h12_23" width="787" height="591" class="alignnone size-full wp-image-1380" /></a>

管理ツール。

<a href="images/windows-server-2016-techical-preview-5-19.png"><img src="images/windows-server-2016-techical-preview-5-19.png" alt="2016-06-22_17h12_37" width="785" height="591" class="alignnone size-full wp-image-1381" /></a>

発売日は、2016年夏頃のようです。

ちなみに、Windows2012のサポートが切れるのは**2023/01/10**です。
[参照](https://support.microsoft.com/ja-jp/lifecycle?C2=1163)

Windows10に日々触れておけば特に操作感のとまどいはないと思います！
