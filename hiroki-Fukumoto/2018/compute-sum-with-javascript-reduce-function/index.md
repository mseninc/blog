---
title: JavaScript reduce関数を使用して合計を求める
date: 2018-08-13
author: hiroki-Fukumoto
tags: [JavaScript, Web]
---

こんにちは。ふっくんです。

今回は、 `javascript` の `reduce` 関数をご紹介します。

## reduce関数の使い方

reduce関数とはどのようなものかと言うと、配列の各要素に対して（左から右へ）関数を適用し、単一の値にします。
>[Array.prototype.reduce() - JavaScript | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)

例えば、以下のような連想配列があるとしましょう。

```javascript
const fruits = [
  {'id': 1, 'kind': 'apple', 'price': 100},
  {'id': 2, 'kind': 'orange', 'price': 80},
  {'id': 3, 'kind': 'grape', 'price': 200},
]
```

`fruits` の中から `price` の合計値を求めたい時に `reduce` を使用します。

```javascript
const total = fruits.reduce((p, x) => p + x.price, 0)
```

出力結果
```
380
```

ソースコードの解説をしておきます。

1. reduce関数内の `p` `x` は任意の文字で構いません。
2. 一番後ろにある `0` は初期値です。ここで初期値を設定します。
3. `p + x.price` の計算を行い、これを配列の要素の数だけ行います。
4. `p` には前回のコールバックの戻り値が入ります。また、最初の要素のみ初期値が入ります。
つまり、上記の例だと以下のように計算が行われます。
```
0 + 100
100 + 80
180 + 200

// 出力 380
```

非常に便利な関数ですので、ぜひ使用してみてください。
他にもjavaScriptの便利な関数を紹介していますので、ぜひご覧ください！

- [JavaScript 屋さんのための C# LINQ 入門 (4) reduce / Aggregate](/linq-basic-for-javascript-programmers-4/)
- [JavaScript map関数を使用して必要な要素のみで配列を生成する](/javascript-map-function/)
- [JavaScript filter関数を使用して条件に一致する要素で配列を生成する](/javascript-filter-function/)