MSEN Inc. blog content
---


## 著作権

MSEN Inc. All rights reserved.

このリポジトリの記事全体の著作権は株式会社 MSEN が保有しています。

これらの記事は https://mseeeen.msen.jp/ でお読みいただけます。

そのままお読みいただく一次利用以外の目的には利用いただけません。引用等の際は https://mseeeen.msen.jp/ にある公開記事に対してリンクをお願いいたします。

ただし記事内で紹介されているソースコードについては GitHub のリンクに限り、引用にご利用いただいて問題ありません。

よろしくお願いいたします。


## 記事の執筆ルール

TO BE WRITTEN


## 記事を書き始めるには

Linux で bash が使える環境のみですが `start.sh` を利用して記事のディレクトリ作成と `index.md` のベース作成までを行うことができます。

使い方は `start.sh` を実行し、著者 (番号) と slug を入力するだけです。著者は [author.yaml](author.yaml) から読み込まれます。

```sh
$ ./start.sh
```

### セットアップ

初回のみ事前に実行権限を与えてください。

```sh
$ chmod +x ./start.sh
```

### 実行例

```sh
$ ./start.sh 
1) norikazum           3) kenzauros          5) kosshii            7) k-so16             9) kohei-iwamoto-wa
2) kiyoshin            4) jinna-i            6) hiroki-Fukumoto    8) junya-gera        10) linkohta
name? > 3
slug? > my-first-post
-----
You are "kenzauros"
Will make
  "kenzauros/2021/my-first-post"
  "kenzauros/2021/my-first-post/images"
  "kenzauros/2021/my-first-post/index.md"
OK? [y/N] > y
```

## 文章校正 (textlint)

Pull Request で文章校正が自動で行われますが、事前にローカルで実行し、修正してください。

下記のシェルスクリプトで現在のブランチで変更している Markdown に textlint を実行できます。

```sh
$ ./textlint-changed-all.sh
```

個別の Markdown を指定して文章校正を行う場合は下記のようにします。

```sh
$ npx textlint <ファイル名>
```

### セットアップ

初回のみ事前に実行権限を与えてください。また textlint の利用のため `npm ci` を実行してください。

```sh
$ chmod +x ./textlint-changed-all.sh
$ npm ci
```

### 実行例

```sh
$ ./textlint-changed-all.sh

/home/yamada/blog/sample.md
   10:1    error    Line 10 sentence length(154) exceeds the maximum sentence length of 100.
Over 54 characters   ja-technical-writing/sentence-length
   10:33   ✓ error  ユーティリティ => ユーティリティー                                         prh
  118:30   warning  一文に二回以上利用されている助詞 "は" がみつかりました。                   ja-technical-writing/no-doubled-joshi
```
