---
title: 【備忘録】rbenv の更新方法
date: 
author: linkohta
tags: [Ruby, Linux]
description: 
---

link です。

Ruby のバージョンを管理するのに便利な **`rbenv`** ですが、 Ubuntu などで直接リポジトリからインストールすると最新バージョンの Ruby が入っていないことが多々あります。

これは `rbenv` の Ruby のバージョンを管理するのにつかわれている **`ruby-build`** が最新版になっていないことが原因です。

今回は `rbenv` と `ruby-build` を最新版にアップデートする方法を紹介します。

## 環境

- Ubuntu 20.04 以降

## `rbenv` のアップデート手順

Ubuntu の APT パッケージマネージャー からインストールできる `rbenv` は最新のものになっていないため、 Git から最新版を pull してくる必要があります。

`rbenv` のアップデートは `~/.rbenv` フォルダに最新版を pull することで行われます。

```title=rbenvのpull
$ git clone https://github.com/sstephenson/rbenv.git .rbenv
```

もしくは `~/.rbenv` フォルダに移動して、 `git pull` で最新版に更新できます。

## `ruby-build` のアップデート手順

`ruby-build` の APT パッケージマネージャーからインストールできるバージョンも最新のものになっていないため、こちらも Git から最新版を pull してくる必要があります。

`ruby-build` のアップデートは `~/.rbenv/plugins/ruby-build` フォルダに最新版を pull することで行われます。

```title=ruby-buildのpull
$ git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
```

もしくは `~/.rbenv/plugins/ruby-build` フォルダに移動して、 `git pull` で最新版に更新できます。

## PATH の変更

これで最新の `ruby-build` に更新され、 `rbenv install --l` で最新の Ruby が表示される、はずですがそうならないことがあります。

その時は `which gem` で Ruby の PATH を確認します。

```title=RubyのPATH確認
$ which gem
$ usr/local/bin
```

上記のように `usr/local/bin` が返ってくる場合、 `rbenv` が管理している場所に Ruby の PATH が通っていません。

ですので、 `.rbenv/shims/gem` に PATH を通します。

まず、 `~/.bash_profile` を作成して、中身を以下のようにします。

```title=.bash_profile
export PATH="~/.rbenv/shims:/usr/local/bin:$PATH"
eval "$(rbenv init -)"
```

## まとめ

今回は Ubuntu で `rbenv` と `ruby-build` を最新する手順を紹介しました。

Ruby のバージョンを管理するのに便利なリポジトリですので、今後も活用していきたいと思います。

それではまた、別の記事でお会いしましょう。