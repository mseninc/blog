---
title: ""
date: 
author: Ryotaro49
tags: []
description: ""
---

最近、iPad をもっと活用したいなと思い、iPad 用のキーボードを買いました。

![iPad+SmartKeyboardFolio]()

そこで iPad で GitHub Codespaces を使ってみました。

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

普段、git clone する時に使用する code ボタンから Codespace を作成します。

必要なコア数を選択します。

### 2. Codespace を利用する

作成すると、ブラウザ上で VSCode が立ち上がります。

普段 VScode を使用している方なら遜色なく開発できると思います。

私は普段から VSCode をしており、特に違和感なく利用できています。

このブログも iPad + Codespace の環境で執筆しています。

### Codespace で Docker を使ってみる

Codespace 上で Docker も使えるようなので、使ってみました。


Docker コンテナを起動して localhost:8000 でアプリーションを起動してみます。

すると、自動でポートフォワーディングされて、リモートアクセス用の URL が生成されました。

問題なく確認できました。

## まとめ

