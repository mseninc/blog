---
title: Windows 10で指紋認証Helloがグレーアウトして設定できないを解決
date: 2016-11-15
author: norikazum
tags: [Windows 10, その他, ライフハック]
---

こんにちは。

新たなPCをセットアップしていると、Windows 10の指紋認証であるWindows Helloがグレーアウトしていて設定できないことではありませんか。

無事解決できましたので紹介します。

Windows 10は2016年10月25日の時点で最新となっています。

## Windows Hello がグレーアウト

Windows Helloは、スタートメニューの設定から開きます。

<a href="images/windows-10-cannot-change-fingerprint-authentication-setting-1.png"><img src="images/windows-10-cannot-change-fingerprint-authentication-setting-1.png" alt="2016-10-25_18h01_25" width="304" height="408" class="alignnone size-full wp-image-3068" /></a>

<a href="images/windows-10-cannot-change-fingerprint-authentication-setting-2.png"><img src="images/windows-10-cannot-change-fingerprint-authentication-setting-2.png" alt="2016-10-25_18h07_08" width="1551" height="1039" class="alignnone size-full wp-image-3069" /></a>

<a href="images/windows-10-cannot-change-fingerprint-authentication-setting-3.png"><img src="images/windows-10-cannot-change-fingerprint-authentication-setting-3.png" alt="2016-10-25_18h07_27" width="1604" height="1106" class="alignnone size-full wp-image-3179" /></a>

以下のように設定する部分がグレーアウトしていて、設定ができません。

<a href="images/windows-10-cannot-change-fingerprint-authentication-setting-4.png"><img src="images/windows-10-cannot-change-fingerprint-authentication-setting-4.png" alt="2016-10-25_18h07_43" width="1604" height="1106" class="alignnone size-full wp-image-3203" /></a>

## グループポリシーを変更

左下のWindows マークをクリックし、キーボードで `gpedit.msc` と入力し、ローカルグループポリシーエディタを開きます。

<a href="images/windows-10-cannot-change-fingerprint-authentication-setting-5.png"><img src="images/windows-10-cannot-change-fingerprint-authentication-setting-5.png" alt="2016-10-25_18h10_29" width="692" height="1193" class="alignnone size-full wp-image-3072" /></a>

コンピューターの構成→管理者テンプレート→システム→ログオンを開き、**便利なPINを使用したサインインをオンにする**をダブルクリックで開きます。

<a href="images/windows-10-cannot-change-fingerprint-authentication-setting-6.png"><img src="images/windows-10-cannot-change-fingerprint-authentication-setting-6.png" alt="2016-10-25_18h13_36" width="1807" height="1105" class="alignnone size-full wp-image-3073" /></a>

<a href="images/windows-10-cannot-change-fingerprint-authentication-setting-7.png"><img src="images/windows-10-cannot-change-fingerprint-authentication-setting-7.png" alt="2016-10-25_18h14_02" width="1807" height="1105" class="alignnone size-full wp-image-3074" /></a>

<a href="images/windows-10-cannot-change-fingerprint-authentication-setting-8.png"><img src="images/windows-10-cannot-change-fingerprint-authentication-setting-8.png" alt="2016-10-25_18h15_48" width="1201" height="1110" class="alignnone size-full wp-image-3075" /></a>

**未構成から、有効にチェックを変更**し適用を押します。

<a href="images/windows-10-cannot-change-fingerprint-authentication-setting-9.png"><img src="images/windows-10-cannot-change-fingerprint-authentication-setting-9.png" alt="2016-10-25_18h16_13" width="1201" height="1110" class="alignnone size-full wp-image-3076" /></a>

## Windows Hello が設定できることを確認

再度設定画面まで進め、設定できるようになっていることを確認します。

<a href="images/windows-10-cannot-change-fingerprint-authentication-setting-10.png"><img src="images/windows-10-cannot-change-fingerprint-authentication-setting-10.png" alt="2016-10-25_18h17_23" width="1604" height="1106" class="alignnone size-full wp-image-3077" /></a>

## Windows Hello を設定してみる

セットアップから開始します。

<a href="images/windows-10-cannot-change-fingerprint-authentication-setting-11.png"><img src="images/windows-10-cannot-change-fingerprint-authentication-setting-11.png" alt="2016-10-25_18h18_25" width="802" height="961" class="alignnone size-full wp-image-3079" /></a>

指紋を登録します。

<a href="images/windows-10-cannot-change-fingerprint-authentication-setting-12.png"><img src="images/windows-10-cannot-change-fingerprint-authentication-setting-12.png" alt="2016-10-25_18h18_31" width="802" height="961" class="alignnone size-full wp-image-3080" /></a>

別の角度から登録します。

<a href="images/windows-10-cannot-change-fingerprint-authentication-setting-13.png"><img src="images/windows-10-cannot-change-fingerprint-authentication-setting-13.png" alt="2016-10-25_19h23_41" width="799" height="960" class="alignnone size-full wp-image-3081" /></a>

PINコードを登録するために、Windowsログインのパスワードを求められます。

<a href="images/windows-10-cannot-change-fingerprint-authentication-setting-14.png"><img src="images/windows-10-cannot-change-fingerprint-authentication-setting-14.png" alt="2016-10-25_19h24_16" width="798" height="404" class="alignnone size-full wp-image-3082" /></a>

PINコードを登録し、設定完了です。

<a href="images/windows-10-cannot-change-fingerprint-authentication-setting-15.png"><img src="images/windows-10-cannot-change-fingerprint-authentication-setting-15.png" alt="2016-10-25_19h24_54" width="798" height="530" class="alignnone size-full wp-image-3083" /></a>


## あとがき

ひと昔前に指紋認証を使おうと思うと、認証するためのデバイスを別途購入してUSBでPCに接続して、ということをしていました。

今時は指紋認証デバイスが標準でPCに付属していることも多く、Windows HelloのようにOS標準で認証ソフトウェアを提供してくれているのでよい時代になりました。

非常に便利なので是非みなさんもご利用ください。

それでは、次の記事でお会いしましょう。