---
title: Git や npm にプロキシ設定を適用/解除をする方法
date: 2020-09-24
author: k-so16
tags: [Git, npm, Web]
---

こんにちは。最近、コンロをしっかり掃除するために重曹と霧吹きを購入した k-so16 です。思ったようにうまく使いこなせなかったので、調査が必要そうです(笑)

**プロキシ環境下** で開発を行う機会があったのですが、  **GitHub のリポジトリを fetch** したり **npm のパッケージをインストール** しようとした際に、 **ホストが見つからない** というエラーが表示されてしまいました。 Windows のプロキシ設定はしたのですが、 **Git や npm もそれぞれプロキシ設定が必要そうだ** ということで、それぞれ手順を調べてみました。

本記事では、 **Git や npm をプロキシ環境下で使用する際の設定方法** について紹介します。また、 **プロキシ設定の解除方法** についても紹介します。

本記事で想定する読者層は以下の通りです。

- Git や npm についての基礎知識を有している
- `git` や `npm` コマンドの基本的な利用方法を知っている

## プロキシ設定の適用
### Git のプロキシ設定の適用

Git でプロキシを設定するには、 `git config` で **`http.proxy`** の値にプロキシサーバーを指定します。ローカル全体でプロキシ設定を有効にするために、 `--global` オプションを付与します。

Git に HTTP プロキシの設定をするコマンド例は以下の通りです。

```bash
git config --global http.proxy "http://${PROXY_HOST}:${PROXY_PORT}"
```

**HTTPS プロキシ** を指定する場合は、 `http.proxy` の代わりに **`https.proxy`** を `git config` で HTTP プロキシと同様に設定します。コマンド例は以下の通りです。

```bash
git config --global https.proxy "http://${PROXY_HOST}:${PROXY_PORT}"
```

### npm のプロキシ設定の適用

npm のプロキシを設定するには、 **`npm config set`** で **`proxy`** を設定します。こちらも Git 同様にローカル全体でプロキシ設定を有効化するために、 `-g` オプションまたは `--global` オプションを付与します。

npm に HTTP プロキシを設定するコマンド例は以下の通りです。

```bash
npm config -g set proxy "http://${PROXY_HOST}:${PROXY_PORT}"
```

**HTTPS プロキシ** を指定する場合は、 `proxy` の代わりに **`https-proxy`** を `npm config set` で HTTP プロキシと同様に設定します。コマンド例は以下の通りです。

```bash
npm config -g set https-proxy "http://${PROXY_HOST}:${PROXY_PORT}"
```

## プロキシ設定の解除
### Git のプロキシ設定の解除

設定していた Git のプロキシを解除するには、 `git config` で **`--unset`** オプションをつけて `http.proxy` を指定します。プロキシの設定時と同様に `--global` オプションを付与することでローカル全体の Git のプロキシ設定を解除できます。

Git の HTTP プロキシ設定を解除するコマンド例は以下の通りです。

```bash
git config --global --unset http.proxy
```

HTTPS プロキシの設定を解除する場合は、 上記のコマンドの `http.proxy` を以下のコマンド例のように `https.proxy` に置き換えるだけです。

```bash
git config --global --unset https.proxy
```

### npm のプロキシ設定の解除

npm で設定したプロキシを解除するには、 **`npm config delete`** で `proxy` を削除します。 Git 同様に `--global` または `-g` オプションを指定してローカル全体の npm のプロキシ設定を解除します。

npm の HTTP プロキシ設定を解除するコマンド例は以下の通りです。

```bash
npm config -g delete proxy
```

HTTPS プロキシの設定を解除する場合は、 上記のコマンドの `proxy` を以下のコマンド例のように `https-proxy` に置き換えるだけです。

```bash
npm config -g delete https-proxy
```

本記事を執筆する上で以下の記事を参考にしました。

> - [GitコマンドをProxy環境可で利用する。 - Qiita](https://qiita.com/ryotaro76/items/0e40ffb6173b1580e671)
> - [gitでプロキシを設定 - Qiita](https://qiita.com/hidetzu/items/c2db95613ba594a2ef25)
> - [git config --global で設定した値を削除する方法 - Qiita](https://qiita.com/hijion/items/ae2cccebf5d28ff733f3)
> - [npm でプロキシを設定／解除する - Qiita](https://qiita.com/ymaru/items/cf513ab05fe0ebac7d3b)

## まとめ

本記事のまとめは以下の通りです。

- Git と npm をプロキシ環境下で使用するには個別のプロキシ設定を適用
    - Git の場合は `git config http.proxy` で設定
    - npm の場合は `npm config set proxy` で設定
- Git と npm に適用したプロキシ設定を解除する場合は個別のプロキシ設定を解除
    - Git の場合は `git config --unset http.proxy` で解除
    - npm の場合は `npm config delete proxy` で解除

以上、 k-so16 でした。これでプロキシ環境下でも Git と npm はバッチリ使えますね(笑)