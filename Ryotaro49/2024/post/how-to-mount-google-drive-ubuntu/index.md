---
title: "Ubuntu に Google Drive をマウントする方法"
date:
author: Ryotaro49
tags: [Ubuntu, Ubuntu 22.04, Google Drive]
description: "Ubuntu に Google Drive をマウントする方法を紹介します。"
---

Ubuntu で Google Drive を参照したい方に向けて、Ubuntu に Google Drive をマウントする方法を紹介します。

本記事では下記の環境で動作確認を行っています。

- Ubuntu 22.04.4 LTS

## Google Drive API を有効化する

Ubuntu に Google Drive をマウントするには、Google Drive API を有効化する必要があります。

[Google Cloud コンソール](https://console.cloud.google.com) にアクセスしてプロジェクトのコンソールに入ります。

プロジェクトがない方は適当な名前で問題ないので作成しましょう。

左のサイドメニューのライブラリをクリックし API ライブラリの画面を表示します。

![API ライブラリ](images/liblary.png)

そこで `google drive api` と入力し、一番上に出てきた `Google Drive API` を選択し有効にします。

## 認証情報を作成する

認証情報から新しく OAuth クライアント ID を作成します。
OAuth 同意画面の設定をされていない方は先にそちらを済ませてください。

作成した OAuth クライアント ID のクライアント ID と クライアントシークレットはのちほど使用します。

## google-drive-ocamlfuse をインストールする

google-drive-ocamlfuse は Linux に Google Drive をマウントするアプリケーションです。
まずは、Ubuntu に google-drive-ocamlfuse をインストールします。

```:title=google-drive-ocamlfuseをインストール
$ sudo add-apt-repository ppa:alessandro-strada/ppa
$ sudo apt update
$ sudo apt-get install google-drive-ocamlfuse
```

## google-drive-ocamlfuse を使って Ubuntu にマウントする

google-drive-ocamlfuse を認証します。

先ほど作成した OAuth クライアント ID のクライアント ID と クライアントシークレットを入力してください。

```:title=google-drive-ocamlfuseの認証
$ google-drive-ocamlfuse -id <クライアントID> -secret <クライアントシークレット>
```

コマンドを実行すると、コンソールに URL が表示されます。
URL をクリックして Google アカウントで認証します。

あとは以下のコマンドでお好きな場所にマウントしてください。

```:title=例としてgoogle-driveというディレクトリにマウント
$ mkdir google-drive
$ google-drive-ocamlfuse google-drive/
```

## あとがき

今回は Ubuntu に Google Drive をマウントする方法を紹介しました。

1 人でも困っている方のお役に立てれば幸いです。

それではまた！
