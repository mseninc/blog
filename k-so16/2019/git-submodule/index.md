---
title: "[Git] 外部のリポジトリをサブモジュールとして取り込む"
date: 2019-06-12
author: k-so16
tags: [Git]
---

こんにちは。最近、 [Vim Tシャツ](https://suzuri.jp/kmdsbng/539/t-shirt/s/heatherblack) を購入した k-so16 です。

外部のリポジトリを自分のプロジェクトに取り込んで開発を進めたいことがあります。たとえば、 [Laravel](https://laravel.com/) を動かすための Docker コンテナーをまとめた [Laradock](https://laradock.io/) というリポジトリを取り込むといったケースがあります。

このような時、 Git のサブモジュールが役立ちます。本記事では、 Git のサブモジュールの使い方について紹介します。

本記事で想定する読者層は以下の通りです。

- Git のごく基礎的な使い方を知っている
- Git のサブモジュールは知らない


## リポジトリにサブモジュールを取り込む
外部リポジトリをサブモジュールとして取り込むには、 `git submodule add` を実行します。たとえば、 GitHub の [laradock/laradock](https://github.com/laradock/laradock) リポジトリをサブモジュールにしたい場合、実行するコマンドは以下のようになります。

```bash:title=外部リポジトリをサブモジュールとして取り込むコマンド
git submodule add https://github.com/laradock/laradock
```


## サブモジュールの移動
サブモジュールを取り込んだは良いけれど、途中でサブモジュールの場所を移動させたくなった場合、 `git mv` で場所を変更できます。先程の `laradock` のサブモジュールを、 `vendor/laradock` に移すことを考えた場合、以下のコマンドを実行します。

```bash:title=サブモジュールの場所を変更するコマンド
git mv laradock vendor/laradock
```

サブモジュールの場所が変わっていることを、 `git status` で確認します。正しく動作していれば、以下のような実行結果になります。

```bash:title=サブモジュールの移動結果
$ git status
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

        modified:   .gitmodules
        renamed:    laradock -> vendor/laradock
```


## サブモジュールを持つリポジトリの取得
サブモジュールを含むリポジトリを取得する場合、 `git clone` だけではサブモジュールの内容物が取得されません。クローンする際に、 `--recursive` オプションが必要です。例として、 `https://example.com/my-project.git` をクローンする場合を考えます。このリモートリポジトリには、サブモジュールが含まれるものとして扱います。実行コマンドは以下の通りです。

```bash:title=サブモジュールを持つリポジトリをクローンするコマンド
git clone --recursive https://example.com/my-project.git
```

リポジトリはすでにクローン済みでサブモジュールを取得したい場合、以下のコマンドを実行します。

```bash:title=クローン済みのリポジトリでサブモジュールを取得するコマンド
git submodule update --init --recursive
```

## サブモジュールの更新
Git では、サブモジュールは追加された際のコミットによって管理されています。先ほどの Laradock の例について考えます。 `git submodule` コマンドを用いて、Laradock のコミットを確認します。実行例を以下に示します。

```bash:title=サブモジュールを更新するコマンド
$ git submodule
 9e537ee16ba90d782a9ab4614c520a5aa1118296 laradock (v7.14-31-g9e537ee)
```

サブモジュールのリポジトリのコミットを更新するためには、サブモジュールのディレクトリに移動し、 `git pull` を実行します。

```bash:title=git&nbsp;pull&nbsp;を実行してサブモジュールのリポジトリのコミットを更新
cd laradock
git pull origin master
```

コミットIDが変わったことを確認するために、プロジェクトのディレクトリに戻り、 `git diff` を実行します。

```bash:title=差分の確認
cd ..
git diff
```

コミットIDが更新されていれば、以下のような差分が出力されるので、これをコミットしておきましょう。

```:title=差分の表示例
@@ -1 +1 @@
-Subproject commit 9e537ee16ba90d782a9ab4614c520a5aa1118296
+Subproject commit 63fc1fde44cc00aacb89511a441cb83685e8010c
```

---

Git のサブモジュールの使い方について、以下のページが参考を参考にしました。

- サブモジュールの追加

    > [Gitのサブモジュール機能を使ってプロジェクトを管理してみよう](http://vdeep.net/git-submodule)

- サブモジュールの移動

    > [Gitサブモジュールを移動する一番簡単な方法は？](https://kz-works.blogspot.com/2018/06/move-the-git-submodule-location.html)

- サブモジュールの更新

    > [git - Update a submodule to the latest commit - Stack Overflow](https://stackoverflow.com/questions/8191299/update-a-submodule-to-the-latest-commit)

## 総括
本記事のまとめです。


- `git submodule add` でサブモジュールを追加
- `git mv` でサブモジュールの場所を変更
- `git clone --recursive` でサブモジュールを含むリポジトリをクローン
- `git submodule update --init --recursive` でサブモジュールの中身をクローン
- サブモジュールのディレクトリで `git pull` を実行することでコミットを更新

以上、k-so16でした。 Git って多機能で奥が深いですね。
