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

![2016-10-25_18h01_25](images/windows-10-cannot-change-fingerprint-authentication-setting-1.png)

![2016-10-25_18h07_08](images/windows-10-cannot-change-fingerprint-authentication-setting-2.png)

![2016-10-25_18h07_27](images/windows-10-cannot-change-fingerprint-authentication-setting-3.png)

以下のように設定する部分がグレーアウトしていて、設定ができません。

![2016-10-25_18h07_43](images/windows-10-cannot-change-fingerprint-authentication-setting-4.png)

## グループポリシーを変更

左下のWindows マークをクリックし、キーボードで `gpedit.msc` と入力し、ローカルグループポリシーエディタを開きます。

![2016-10-25_18h10_29](images/windows-10-cannot-change-fingerprint-authentication-setting-5.png)

コンピューターの構成→管理者テンプレート→システム→ログオンを開き、**便利なPINを使用したサインインをオンにする**をダブルクリックで開きます。

![2016-10-25_18h13_36](images/windows-10-cannot-change-fingerprint-authentication-setting-6.png)

![2016-10-25_18h14_02](images/windows-10-cannot-change-fingerprint-authentication-setting-7.png)

![2016-10-25_18h15_48](images/windows-10-cannot-change-fingerprint-authentication-setting-8.png)

**未構成から、有効にチェックを変更**し適用を押します。

![2016-10-25_18h16_13](images/windows-10-cannot-change-fingerprint-authentication-setting-9.png)

## Windows Hello が設定できることを確認

再度設定画面まで進め、設定できるようになっていることを確認します。

![2016-10-25_18h17_23](images/windows-10-cannot-change-fingerprint-authentication-setting-10.png)

## Windows Hello を設定してみる

セットアップから開始します。

![2016-10-25_18h18_25](images/windows-10-cannot-change-fingerprint-authentication-setting-11.png)

指紋を登録します。

![2016-10-25_18h18_31](images/windows-10-cannot-change-fingerprint-authentication-setting-12.png)

別の角度から登録します。

![2016-10-25_19h23_41](images/windows-10-cannot-change-fingerprint-authentication-setting-13.png)

PINコードを登録するために、Windowsログインのパスワードを求められます。

![2016-10-25_19h24_16](images/windows-10-cannot-change-fingerprint-authentication-setting-14.png)

PINコードを登録し、設定完了です。

![2016-10-25_19h24_54](images/windows-10-cannot-change-fingerprint-authentication-setting-15.png)


## あとがき

ひと昔前に指紋認証を使おうと思うと、認証するためのデバイスを別途購入してUSBでPCに接続して、ということをしていました。

今時は指紋認証デバイスが標準でPCに付属していることも多く、Windows HelloのようにOS標準で認証ソフトウェアを提供してくれているのでよい時代になりました。

非常に便利なので是非みなさんもご利用ください。

それでは、次の記事でお会いしましょう。