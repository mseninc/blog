---
title: git sparse checkout で clone せずに一部のサブディレクトリだけを pull/checkout する
date: 2017-01-24
author: kenzauros
tags: [Git]
---

Git は大変便利なのですが、 clone では基本的にすべてのディレクトリが同期されます。

不要なものを削除すればそれはそれで変更として追跡されてしまうので、一部のディレクトリだけを取得したい場合は `sparse-checkout` というテクニックを使います。

## 一旦 clone しない sparse checkout

* [Git 特定のフォルダのみcloneする - Qiita](http://qiita.com/icoxfog417/items/8b16681213d0fd33602c)

先人の情報によれば「とりあえず普通に clone する」という例が多いのですが、ファイル数が多い場合など、すべてを clone したくない場合もあります。

そのような場合は下記のようにして sparse checkout を有効にします。

```
git init
git config core.sparsecheckout true
git remote add origin リポジトリのURL
echo 目的のフォルダ > .git/info/sparse-checkout
git pull origin master
```

1. 空の Git リポジトリとして初期化
2. sparsecheckout を有効にする
3. リモートリポジトリの URL を origin として登録
4. チェックアウトする対象のディレクトリを `.git/info/sparse-checkout` に追加
5. 好きなブランチを pull (checkout) する

つまり最初に clone からはじめるのではなく、**空のリポジトリとしてはじめる**、というところがミソです。

## 対象ディレクトリ追加時の注意

手順の 4 の対象ディレクトリ追加で注意があります。コマンドを実行している環境によって文字コードがことなるため、特に日本語のフォルダ名などで不具合が起こることがあります。

文字コードの違いなどで一致するフォルダが見つからない場合は下記のようなエラーがでます。

> error: Sparse checkout leaves no entry on working directory

`.git/info/sparse-checkout` をエディターで直接編集して **UTF-8** で保存するのがもっとも無難です。日本語などマルチバイト文字を含む場合はこのファイルを UTF-8 で保存することを忘れないようにしてください。

## 別の手法

チェックアウトを遅らせるという意味では clone するときに `--no-checkout` オプションをつけるという手もあります。

```
git clone --no-checkout リポジトリのURL
```

こうするとオプション名の通り、チェックアウトされませんので不要なダウンロードは行われないのですが、内部的に fetch は行われた状態になるため、一番クリーンに抑えるには先に紹介したやり方がもっともよいのではないかと思います。
