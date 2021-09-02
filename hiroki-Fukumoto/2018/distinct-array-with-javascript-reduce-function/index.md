---
title: JavaScript reduce関数を使用して重複なしの一覧を作成する
date: 2018-08-03
author: hiroki-Fukumoto
tags: [JavaScript, Web]
---

こんにちは。ふっくんです。

前回はjavascriptのreduce関数を使用して、合計値を求める方法を紹介しました。
[JavaScript reduce関数を使用して合計を求める](https://mseeeen.msen.jp/javascript-reduce-function/)

今回は、reduce関数を使用して配列から重複なしの一覧を作成する方法をご紹介します。

## reduce関数を使用して配列から重複なしの一覧を作成する

例えば、以下のような連想配列があるとしましょう。
アンケートで好きな動物を答えてもらった時のデータを想定します。

```javascript
const animals = [
  {'id': 1, 'kind': 'dog'},
  {'id': 2, 'kind': 'cat'},
  {'id': 3, 'kind': 'birds'},
  {'id': 4, 'kind': 'monkey'},
  {'id': 5, 'kind': 'cat'},
  {'id': 6, 'kind': 'dog'},
  {'id': 7, 'kind': 'giraffe'},
  {'id': 8, 'kind': 'birds'},
  {'id': 9, 'kind': 'dog'},
  {'id': 10, 'kind': 'dog'},
]
```

この `animals` から `kind` の一覧を作成してみます。あくまで一覧を作成したいので重複しているデータは取り除きましょう。
つまり、以下のような配列が作りたいのです。

```javascript
const list = [
  'dog',
  'cat',
  'birds',
  'monkey',
  'giraffe',
]
```

このような配列をreduce関数を使用して作成するには以下のようなコードになります。

```javascript
const animals = [
  {'id': 1, 'kind': 'dog'},
  {'id': 2, 'kind': 'cat'},
  {'id': 3, 'kind': 'birds'},
  {'id': 4, 'kind': 'monkey'},
  {'id': 5, 'kind': 'cat'},
  {'id': 6, 'kind': 'dog'},
  {'id': 7, 'kind': 'giraffe'},
  {'id': 8, 'kind': 'birds'},
  {'id': 9, 'kind': 'dog'},
  {'id': 10, 'kind': 'dog'},
]

const list = animals.reduce((p, x) => (p.indexOf(x.kind) !== -1) ? p : [ ...p, x.kind ], [])
```

出力
```
[
  'dog',
  'cat',
  'birds',
  'monkey',
  'giraffe',
]
```

ソースコードの解説をしておきます。

1. reduce関数内の `p` `x` は任意の文字で構いません。 `p` には初期値、 `x` には配列の各要素が入ります。
2. 一番後ろにある `[]` は初期値です。ここで初期値を設定します。
3. `indexOf` は対象が見つからなかった場合に `-1` を返しますので `(p.indexOf(x.kind) !== -1) ? p : [ ...p, x.kind ]` で `p` の配列の中に `x.kind` が見つかれば`p` を、見つからなければ `p` に `x.kind` を追加して返します。
4. `[ ...p, x.kind]` ここではスプレッド演算子を使用していますので、あまり知らないよって方はこちらをご確認ください。
[スプレッド構文 - JavaScript | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

他にもjavaScriptの便利な関数を紹介していますので、ぜひご覧ください！

- [JavaScript reduce関数を使用して合計を求める](https://mseeeen.msen.jp/javascript-reduce-function/)
- [JavaScript map関数を使用して必要な要素のみで配列を生成する](https://mseeeen.msen.jp/javascript-map-function/)
- [JavaScript filter関数を使用して条件に一致する要素で配列を生成する](https://mseeeen.msen.jp/javascript-filter-function/)

