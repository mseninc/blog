---
title: "iPad で GitHub Codespaces を使ってみた"
date: 
author: Ryotaro49
tags: []
description: ""
---

最近、iPad をもっと活用したいなと思い、iPad 用のキーボードを買いました！

![iPad+SmartKeyboardFolio](./images/IMG_4475.jpg)

iPad で VSCode が使えれば、PC のような感覚で開発ができるのではないかと思い、調べてみると **GitHub Codespaces** というものを見つけました。

そこで、今回は iPad で GitHub Codespaces を使ってみた手順を紹介しようと思います。

## GitHub Codespaces とは

公式のドキュメントに書かれている通り、codespace はクラウドでホストされている開発環境です。

GitHub のリポジトリがあればすぐに開発を始められます。

リポジトリがなくても、用意されているテンプレートから開発を始められます。

>codespace は、クラウドでホストされている開発環境です。 構成ファイルをリポジトリにコミットすることで、GitHub Codespaces >のプロジェクトをカスタマイズできます (コードとしての構成とよく呼ばれます)。これにより、プロジェクトのすべてのユーザーに対して繰り返し可能な codespace 構成が作成されます。 「開発コンテナーの概要」を参照してください。
>
>作成する各 codespace は、仮想マシン上で実行されている Docker コンテナー内の GitHub によってホストされます。 仮想マシンの種類は、2 コア、8 GB RAM、32 GB ストレージから、最大 32 コア、64 GB RAM、128 GB ストレージまでの範囲から選択できます。
><cite>[GitHub Codespaces の概要](https://docs.github.com/ja/codespaces/overview)</cite> 

## GitHub Codespaces を使ってみる

実際に iPad で GitHub Codespeces を使ってみました。

その手順を紹介します。

### 1. Codespace を作成する

普段、Git clone する時に使用する Code ボタンから Codespace を作成します。

![Codespaceを作成する](./images/IMG_0013.png)

### 2. Codespace を利用する

作成すると、ブラウザ上で VSCode が立ち上がります。

![Codespaceを起動する](./images/IMG_0016.png)

これだけでセットアップ完了です！

私は普段から VSCode 使っているのですが、Codespace で特に違和感なく VSCode を使えました。

このブログも iPad + Codespace の環境で執筆しています。

なんと、拡張機能も設定の同期をオンにすることで同期できます。

### Codespace で Docker を使ってみる

Codespace 上で Docker も使えるようなので、使ってみました。

![CodespaceでDockerを使ってみる](./images/IMG_0014.png)

Docker コマンドは問題なく使えていますね。

Docker コンテナーを起動して localhost:8000 でアプリーションを起動してみます。

![Codespaceでコンテナ―を起動](./images/IMG_0015.png)

すると、自動でポートフォワーディングされ、リモートアクセス用の URL が生成されました！

無事、URL からアプリケーションが動いていることを確認できました👏

## あとがき

気になる料金についてですが、[GitHub Codespaces の請求について](https://docs.github.com/ja/billing/managing-billing-for-your-products/managing-billing-for-github-codespaces/about-billing-for-github-codespaces) に詳しく書かれていました。

私は 2コアで利用しているので、無料枠で60時間使えるみたいです。

サブとして利用するなら無料枠でも問題なさそうだと思いました！

![無料枠の説明](./images/2024-11-26_00h02_13.png)

ちなみに GitHub の 設定の [Plans and usage](https://github.com/settings/billing/summary) から利用状況を確認できます。

それではまた！