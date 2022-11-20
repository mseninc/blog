---
title: 【2022年版】Windows と Linux の nvm で Node.js を使う
date: 
author: linkohta
tags: [nvm, Node.js]
description: Windows と Linux で nvm をインストールして Node.js を使う手順を紹介します。
---

link です。

**nvm** を使って Node.js のバージョンを変更することがあったのでその手順を残しておきます。

## nvm について

nvm は Node.js のバージョン管理ツールです。

Windows と Linux それぞれの手順を紹介します。

### Windows の場合

Windows の場合は [nvm-windows](https://github.com/coreybutler/nvm-windows/releases) をインストールするだけで使えるようになります。

### Linux の場合

Linux の場合は nvm の公式サイトに記載されているインストールスクリプトを実行することでインストールできます。

本記事執筆時のインストールスクリプトは以下の 2 通りです。

```:title=インストールスクリプト (curl)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
```

もしくは

```:title=インストールスクリプト (wget)
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
```

インストール後は、ターミナル（ bash など）を再起動するか、 `source ~/.bashrc` を実行すると nvm コマンドを実行できるようになります。

`nvm version` で nvm がインストールされていることを確認しましょう。

## nvm で Node.js をインストールしてみる

`nvm install 16.18.0` のようにバージョンを指定してインストールできます。

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

今回は Windows と Linux で nvm をインストールして Node.js を使う手順を紹介しました。

それではまた、別の記事でお会いしましょう。