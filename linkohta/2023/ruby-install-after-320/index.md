---
title: "Ubuntu で Ruby 3.2.0 がインストールできない時の解決法"
date: 
author: linkohta
tags: [Ruby, Linux]
description: "Ubuntu で Ruby 3.2.0 がインストールできない時の解決法について解説します。"
---

link です。

rbenv で Ruby を 3.2.0 に上げようとしたところ、`BUILD FAILED` エラーが発生してインストールできませんでした。

調べた解決法で無事インストールできたので、その解決法を残しておきます。

## 想定環境

- Ubuntu 20.04 以降
- Ruby 3.2.0 以降

## Ruby 3.2.0 で変わったこと

Ruby 3.2.0 のリリースノートを確認すると以下の文章が記述されています。

>標準添付ライブラリの互換性に関する変更
>3rd パーティライブラリのソースコード同梱廃止
>
>libyaml や libffi のような 3rd パーティのライブラリのソースコードの同梱を廃止しました
>
>Psych に同梱していた libyaml のソースコードは削除されました。ユーザーは自身で Ubuntu や Debian プラットフォームなら libyaml-dev パッケージをインストールする必要があります。このパッケージ名称はプラットフォームごとに異なります。
>
>Fiddle に同梱していた libffi のソースコードも削除されました

Ruby 3.2.0 では **libyaml** と **libffi** が同梱されなくなったため、この 2 つのインストールが必須になりました。

またパッケージとして必要なのは **libyaml-dev** と **libffi-dev** の 2 つです。

## 解決法

**libyaml-dev** と **libffi-dev** をインストールすれば Ruby 3.2.0 をインストールできるようになります。

```bash:title=インストールコマンド
$ sudo apt update
$ sudo apt install libyaml-dev libffi-dev
$ rbenv install 3.2.0
```

## 参考サイト

- [Ruby 3.2.0 リリース](https://www.ruby-lang.org/ja/news/2022/12/25/ruby-3-2-0-released/)

## まとめ

今回は Ruby 3.2.0 のインストールについての解決法を紹介しました。

少し短いですが、また、別の記事でお会いしましょう。