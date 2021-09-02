---
title: Microsoft Azure 上で CentOS7 を構築する
date: 2017-04-28
author: norikazum
tags: [CentOS, Microsoft Azure, Linux]
---

こんにちは。

Microsoft Azure上にCentOS7を構築する方法を紹介します。
今回の紹介では、作成したCentOSにSSH接続できるところまでを記載します。

## 事前準備

1. Microsoft Azureアカウントの作成。

[https://azure.microsoft.com/ja-jp/free/](https://azure.microsoft.com/ja-jp/free/)

1. サブスクリプションの作成。
ログイン後、以下の鍵マークからサブスクリプションを作成します。
はじめて作成の場合、**無料試用版**のサブスクリプションとなると思います。

<a href="images/centos7-on-microsoft-azure-1.png"><img src="images/centos7-on-microsoft-azure-1.png" alt="" width="103" height="300" class="alignnone size-medium wp-image-4192" /></a>

1. 鍵ペアの作成
Putty Key Generator (Puttyge.exe) などを利用し、Azure上の仮想マシンにログインするための鍵ペアを生成し、手元に秘密鍵と公開鍵を保存します。
<a href="images/centos7-on-microsoft-azure-2.png"><img src="images/centos7-on-microsoft-azure-2.png" alt="" width="300" height="254" class="alignnone size-medium wp-image-4198" /></a>

## 仮想マシンを作成

1. ログイン後の画面から、**Virtual Machines** を選択します。
<a href="images/centos7-on-microsoft-azure-3.png"><img src="images/centos7-on-microsoft-azure-3.png" alt="" width="300" height="189" class="alignnone size-medium wp-image-4194" /></a>

1. 追加を選択します。
<a href="images/centos7-on-microsoft-azure-4.png"><img src="images/centos7-on-microsoft-azure-4.png" alt="" width="300" height="189" class="alignnone size-medium wp-image-4195" /></a>

1. 検索窓に、**centos**　と入力し**CentOS-based 7.3**を選択します。
<a href="images/centos7-on-microsoft-azure-5.png"><img src="images/centos7-on-microsoft-azure-5.png" alt="" width="300" height="178" class="alignnone size-medium wp-image-4226" /></a>

1. 作成を選択します。
<a href="images/centos7-on-microsoft-azure-6.png"><img src="images/centos7-on-microsoft-azure-6.png" alt="" width="300" height="178" class="alignnone size-medium wp-image-4227" /></a>

1. 各項目を入力し、進みます。**名前**は任意でOKですが、今回はJenkins用にする予定なのでこの名称にしています。**VMディスクの種類**は安価なプランを選択するため、HDDを選択します。**SSH公開キー**は事前準備で作成した鍵ペアの公開キーの内容をテキストで表示させ、コピー＆ペーストします。**リソースグループ**はわかりやすいグループ名を新規作成します。**場所**は初期設定のままとしました。無料試用版のサブスクリプションでは西日本などはプランに含まないようで選択できませんでした。
<a href="images/centos7-on-microsoft-azure-7.png"><img src="images/centos7-on-microsoft-azure-7.png" alt="" width="300" height="178" class="alignnone size-medium wp-image-4228" /></a>

1. プランの選択で、安価なプランを選択するために、**全て表示**を選択してから、今回は1つだけ上のプランの**A1 Basic**を選択しました。
<a href="images/centos7-on-microsoft-azure-8.png"><img src="images/centos7-on-microsoft-azure-8.png" alt="" width="300" height="178" class="alignnone size-medium wp-image-4229" /></a>
<a href="images/centos7-on-microsoft-azure-9.png"><img src="images/centos7-on-microsoft-azure-9.png" alt="" width="300" height="178" class="alignnone size-medium wp-image-4230" /></a>

1. 全て標準設定のまま**OK**を選択します。
<a href="images/centos7-on-microsoft-azure-10.png"><img src="images/centos7-on-microsoft-azure-10.png" alt="" width="300" height="178" class="alignnone size-medium wp-image-4231" /></a>

1. 検証に成功したことを確認し、**OK**を押します。
<a href="images/centos7-on-microsoft-azure-11.png"><img src="images/centos7-on-microsoft-azure-11.png" alt="" width="300" height="178" class="alignnone size-medium wp-image-4232" /></a>

1. 作成が完了するのを待ちます。大体5分ぐらいで完了しました。
<a href="images/centos7-on-microsoft-azure-12.png"><img src="images/centos7-on-microsoft-azure-12.png" alt="" width="300" height="178" class="alignnone size-medium wp-image-4233" /></a>

## SSH接続

1. 仮想マシンの概要から、**パブリックIPアドレス**を確認します。
<a href="images/centos7-on-microsoft-azure-13.png"><img src="images/centos7-on-microsoft-azure-13.png" alt="" width="300" height="178" class="alignnone size-medium wp-image-4235" /></a>

1. Teratermなどのターミナルソフトを利用し、前項で控えたパブリックIPを入力し、事前準備で作成した秘密鍵、仮想マシン作成時に指定したユーザー名でログインします。
<a href="images/centos7-on-microsoft-azure-14.png"><img src="images/centos7-on-microsoft-azure-14.png" alt="" width="300" height="221" class="alignnone size-medium wp-image-4236" /></a>

1. 接続できました。`sudo` はインストール直後から設定されています。
<a href="images/centos7-on-microsoft-azure-15.png"><img src="images/centos7-on-microsoft-azure-15.png" alt="" width="300" height="221" class="alignnone size-medium wp-image-4237" /></a>

## あとがき

執筆時点で、新規アカウントの場合は20,500円分の無料クレジットが付与されていました。
<a href="images/centos7-on-microsoft-azure-16.png"><img src="images/centos7-on-microsoft-azure-16.png" alt="" width="300" height="65" class="alignnone size-medium wp-image-4239" /></a>

お試しにしてはさすが太っ腹なMicrosoftですね！無料クレジット分だけでも試す価値はありではないでしょうか。

それでは次回の記事でお会いしましょう。