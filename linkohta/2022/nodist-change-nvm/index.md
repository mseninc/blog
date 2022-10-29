---
title: 【備忘録】Nodist を nvm に置き換える手順
date: 
author: linkohta
tags: [nvm, Node.js]
description: nodist を nvm に置き換える手順を紹介します。
---

link です。

Nodist で Node.js のバージョンを変更する際に詰まって、 nvm に変更することがあったのでその手順を残しておきます。

## Nodist について

Node.js のバージョン管理ツールとして便利な Nodist ですが、最新の Node.js と npm にして npm を利用しようとすると以下のようなエラーが発生します。

```:title=npmのエラー
npm ERR! code MODULE_NOT_FOUND
npm ERR! Cannot find module '@npmcli/arborist'
```

これは Nodist がすでにメンテナンスされておらず、最新の npm が正常に展開されないために発生している模様です。

最新の Node.js まで扱うためには Nodist から別のバージョン管理ツールに移行する必要があります。

そこで今回は Nodist を **nvm** に置き換える手順について紹介します。

## nvm に置き換える

基本的な機能は Nodist と違いはありません。

Windows と Linux それぞれの手順を紹介します。

### Windows の場合

Windows の場合は [nvm-windows](https://github.com/coreybutler/nvm-windows/releases) で簡単にインストールできます。

Nodist をアンインストールして、 nvm-windows をインストールするだけで OK です。

### Linux の場合

Linux の場合は nvm の公式サイトに記載されているインストールスクリプトを実行することでインストールできます。
本記事執筆時のインストールスクリプトは以下の通りです。

```:title=インストールスクリプト
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
もしくは
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
```

インストール後は、ターミナル（ bash など）を再起動するか、 `source ~/.bashrc` を実行すると nvm コマンドを実行できるようになります。

`nvm version` で nvm がインストールされていることを確認しましょう。

## nvm で Node.js をインストールしてみる

`nvm install 16.18.0` という風にバージョンを指定することでインストールできます。

利用可能なバージョンは `nvm list available` で確認できます。

`nvm install` でインストールされるのは通常 64bit 版ですが、 `nvm install 16.18.0 32` で 32 bit 版を指定してのインストールもできます。

アンインストールする場合は `nvm uninstall 16.18.0` でバージョンを指定してアンインストールできます。

## 使用するバージョンを変更する

`nvm use 16.18.0` でインストール済みのバージョンを指定することでバージョンを変更できます。

`node -v` で Node.js のバージョンが変更されていることを確認しましょう。

## 参考サイト

- [nvm-sh/nvm: Node Version Manager - POSIX-compliant bash script to manage multiple active node.js versions](https://github.com/nvm-sh/nvm)
- [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)

## まとめ

今回は Nodist の代わりに nvm をインストールして利用する方法を紹介しました。

それではまた、別の記事でお会いしましょう。