---
title: git grep でリポジトリ内の検索をして作業効率を上げる
date: 2020-11-27
author: junya-gera
tags: [Git, その他の技術]
---

こんにちは、じゅんじゅんです。私の最初の記事（[業務未経験者が思う入社前にやっておけばよかったこと](https://mseeeen.msen.jp/inexperienced-people-should-done/)）にも記載したとおり、コマンドでの git 操作を勉強しています。

中でもよく使用しているのが**リポジトリ内を検索できる [git grep](https://git-scm.com/docs/git-grep)**というコマンドです。特にファイル数の多いシステム開発においてこのコマンドを活用することで作業効率が上がったので、今回はこちらの活用法を解説します。

## `git grep` でできること
`git grep` を行うと、現在作業中のリポジトリの中で検索することができます。私が使用するタイミングはこのようなときです。

- 修正が必要になったコードをどのファイルに記述しているか忘れたとき
- 他の方が作成したメソッドがどのような使われ方をしているか調べたいとき
- 不慣れな言語において他の方のコードを参考にしたいとき

## Linux の `grep` コマンドとの違い
`grep` と言えば Linux の方の `grep` コマンドを思い浮かべる方が多いと思います。あえて `git grep` の使う利点としては、以下が考えられます。

- 今いるリポジトリの中だけを検索するので処理速度が速い
- 特定のコミット、ブランチの時点（ようするに過去の特定の時点）での検索ができる

このように `git grep` はより Git に特化した検索と言えます。

## 基本的な `git grep` の使い方
### キーワード検索
`git grep "検索したいキーワード"`

```
$ git grep -n "container"
quiz/index.php:26:    <div id="container">
quiz/index.php:35:      <div id="container">
quiz/styles.css:6:#container {
```
`-n` オプションをつけることで、該当ファイルの何行目かも表示してくれます。
ちなみに `git config --global grep.lineNumber true` を実行して行番号を表示させる設定に変えておくことで `-n` を省略できます。

### 特定の拡張子のファイルだけ検索
`git grep "検索したいキーワード" -- "*拡張子"`

```
$ git grep -n "container" -- '*.php'
quiz/index.php:26:    <div id="container">
quiz/index.php:35:      <div id="container">
```

指定した拡張子の検索結果のみ表示させることができます。

### 特定のフォルダだけ検索
`git grep "検索したいキーワード" -- "フォルダ名"`

```
$ git grep -n "include" -- work/
work/hero.php:3:  include('_header.php');
work/hero.php:21:  include('_footer.php');
work/index.php:3:  include('_header.php');
work/index.php:28:  include('_footer.php');
```

ここでは work というフォルダの中の検索結果のみ表示させています。

### 特定のコミット、ブランチだけ検索
`git grep "検索したいキーワード" "コミット ID" 、または "ブランチ名"`

```
$ git grep -n "doubleNumber" section2
section2:index.js:66:var doubleNumber = function (num) { return num * 2; };
section2:index.ts:85:const doubleNumber: (num: number) => number = num => num * 2;
```

こちらが前述した過去の状態で検索をする方法です。**指定したコミット ID 、ブランチ名の時点のファイルの状態**で検索できます。ここでは `section2` というブランチ名の中でのみ検索を行っています。

### 拡張正規表現で検索
`git grep "検索したいキーワード" -E "正規表現"`

```
$ git grep -n -E "[0-9]{4}"
built-in/built1.php:23:$sample = '20200320Item-A  1200';
built-in/built1.php:36:$sample2 = 'Call us at 03-3001-1256 or 03-3015-3222';
built-in/built1.php:49:$d = [2020, 11, 15];
```

この例では 4桁の数字を検索しています。

## `git grep` のオプション一覧

その他、場合によって使用すれば便利そうなオプションを紹介しておきます。

- `-n`: 一致する行の前に行番号を付ける
- `-o`: 一致する行の一致する部分だけ表示させる
- `-v`: 一致しなかった行のみ表示させる
- `-i`: 大文字・小文字を区別しない
- `-l`: ファイル名のみ表示させる
- `-L`: 一致しなかったファイル名のみ表示させる
- `-c`: ファイルごとに一致箇所の個数を表示させる
- `-P`: Perl の正規表現で検索する ([perlre - Perl の正規表現](http://perldoc.jp/docs/perl/5.18.1/perlre.pod))
- `-F`: 正規表現ではない固定文字列で検索する 
- `--break`: ファイルごとに改行を入れて表示させる

## 感想
恥ずかしながら、最近まで Linux の `grep` も `git grep` も知らなかったので、たくさんのファイルの中から目的の記述を探すときはファイル一つ一つを Ctrl + F で検索して回っていました。こういう技術を知っているのと知っていないのとでは作業効率が大きく変わります。 Git のコマンドに限らず、まだまだ知らないことが圧倒的に多いはずなので、コードの書き方だけでなくショートカットなどの便利な技も逐一調べるようにして技術力を上げていきたいと思います。

## 参考
> - [Git - 検索](https://git-scm.com/book/ja/v2/Git-%E3%81%AE%E3%81%95%E3%81%BE%E3%81%96%E3%81%BE%E3%81%AA%E3%83%84%E3%83%BC%E3%83%AB-%E6%A4%9C%E7%B4%A2)
> - [git grepと普通のgrepってどう違うの？【連載】マンガでわかるGit ～コマンド編～
](https://www.r-staffing.co.jp/engineer/entry/20200605_1)

