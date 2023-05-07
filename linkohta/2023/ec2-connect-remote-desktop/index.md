---
title: "Amazon Linux 2 にリモートデスクトップ接続する手順"
date: 
author: linkohta
tags: [EC2, Linux]
description: "EC2 インスタンスの Amazon Linux 2 上にデスクトップ環境を構築してリモートデスクトップ接続する手順を紹介します。"
---

link です。

今回は EC2 インスタンスの Amazon Linux 2 上にデスクトップ環境を構築してリモートデスクトップ接続する手順を紹介します。

## 前提条件

- Windows 11
- Amazon Linux 2

## EC2 インスタンスの設定

リモートデスクトップ接続ができるように EC2 インスタンスのインバウンドルールを編集します。

ルールを追加してタイプを `RDP` 、ソースを `0.0.0.0/0` に設定します。

![インバウンドのルールを編集](images/2023-05-06_22h56_48.png)

## Amazon Linux 2 の環境構築

Amazon Linux 2 にデスクトップ環境と **VNCTiger** と **xrdp** を導入します。

デスクトップ環境は MATE を導入します。

```:title=MATEとVNCTigerとxrdpをインストール
$ sudo amazon-linux-extras install mate-desktop1.x
$ sudo bash -c 'echo PREFERRED=/usr/bin/mate-session > /etc/sysconfig/desktop'
$ sudo yum install tigervnc-server
$ sudo amazon-linux-extras install epel
$ sudo yum install xrdp
```

xrdp の起動と起動設定を行います。

```:title=xrdpの設定
$ sudo systemctl start xrdp
$ sudo systemctl enable xrdp
```

xrdp からログインするためのパスワードを設定します。

```:title=パスワード設定
$ sudo passwd ec2-user
```

## 日本語化

MATE の日本語化を行います。

フォントなどをインストールします。

```:title=日本語化用のパッケージインストール
$ sudo yum install ibus-kkc
$ sudo yum install google-noto-sans-japanese-fonts
```

`~/.bashrc` に以下の内容を追加します。

```:title=~/.bashrc
export GTK_IM_MODULE=ibus
export XMODIFIERS=@im=ibus
export QT_IM_MODULE=ibus
ibus-daemon -drx
```

ロケールを設定します。

```
$ sudo localectl set-locale LANG=ja_JP.UTF-8
$ sudo localectl set-keymap jp106
$ sudo localectl set-keymap jp-OADG109A
```

最後に `sudo reboot` で再起動して完了です。

## リモートデスクトップ接続する

EC2 インスタンスにリモートデスクトップ接続してみます。

接続先に Amazon Linux 2 のパブリック IPv4 アドレスを指定して接続します。

接続に成功すれば、以下のような画面が表示されると思います。

![ログイン画面](images/2023-05-06_23h21_51.png)

`username` に `ec2-user` 、 `password` に EC2 インスタンスの環境構築で設定したパスワードを入力して「OK」をクリックします。

以下のような画面が表示されればログイン成功です。

![初期画面](images/2023-05-06_23h50_10.png)

## 参考サイト

- [Amazon Linux 2 を実行している Amazon EC2 インスタンスに GUI をインストールする | AWS re:Post](https://repost.aws/ja/knowledge-center/ec2-linux-2-install-gui)
- [\[AWS\] 「Amazon Linux 2」でMATE（GUI） を日本語化する。 – .zapping](https://zapping.beccou.com/2021/06/17/aws-japaneseize-mate-on-amazon-linux-2/)

## まとめ

今回は EC2 インスタンスの Amazon Linux 2 上にデスクトップ環境を構築してリモートデスクトップ接続する手順を紹介しました。

それではまた、別の記事でお会いしましょう。