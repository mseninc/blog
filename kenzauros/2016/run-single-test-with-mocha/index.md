---
title: Mocha で指定したテストだけを選択的に実行する
date: 2016-05-31
author: kenzauros
tags: [Node.js, Mocha, ユニットテスト, Web]
---

Mocha でテストを書いているとちょっとこのテストだけ実行したい！ということがけっこうあります。

そんなときの書き方をご紹介します。すでに記事を書いてくださっている方がいらっしゃるので、参考にしました。

* [Run a Single Mocha Test - Jake Trent](http://jaketrent.com/post/run-single-mocha-test/)

## コマンドラインでの選択的実行
### 指定したテストファイルだけ実行する

これは mocha に直接ファイル名を指定すれば、そのファイルだけ実行されるので、簡単です。

```
mocha test/unit/api/api.test.js
```

### 指定した説明にマッチするテストのみ実行する

テストファイルの中でも一部だけ実行したいときには mocha のコマンドラインオプションの `--grep` もしくは `-g` を使うことができます。

このオプションに指定した文字列は正規表現として扱われるようです。

```bash
mocha test/unit/api/api.test.js -g 'get'
```

## ソースコードで実行するテストを絞り込む

### 指定したスペック (describe) だけ実行する

指定した `describe` だけ実行したい場合は、テストコード自体に指定していまいます。 `describe` に `.only` につけるだけ。超簡単です。

```js
describe(function () {
  // ここのテストはスキップされる
});
describe.only(function () {
  // ここのテストは実行される
});
```

### 指定したテスト (it) だけ実行する

これも `describe` と同様に `it` に `.only` につけるだけ。超簡単です。

```js
describe(function () {
  // ここのテストはスキップされる
});
describe.only(function () {
  // ここのテストは実行される
});
```

## 外すのを忘れないように

特に `.only` をつけた場合、ファイル内の他のテストが実行されなくなってしまいますので、注意が必要です。テストの記述が終わったら、必ず外しておきましょう。