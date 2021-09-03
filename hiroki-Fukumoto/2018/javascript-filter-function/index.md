---
title: JavaScript filter関数を使用して条件に一致する要素で配列を生成する
date: 2018-05-01
author: hiroki-Fukumoto
tags: [JavaScript, ES2015(ES6), Web]
---

こんにちは。ふっくんです。

前回は、 `javascript` の `map` 関数をご紹介しました。
[JavaScript map関数を使用して必要な要素のみで配列を生成する](/javascript-map-function/)

今回は、 `javascript` の `filter` 関数をご紹介します。
`map` 関数と `filter` 関数を使えば、javascriptで配列を扱う時にかなり楽になると思います。

## filter関数の使い方

filter関数で何ができるかというと **配列の全ての要素の中から条件に一致する要素で、新たな配列を生成することができます！**

例えば、以下のような連想配列があるとしましょう。

```javascript
const array = [
  {'id': 1, 'category': 'animal', 'kind': 'dog'},
  {'id': 2, 'category': 'fruit', 'kind': 'apple'},
  {'id': 3, 'category': 'fruit', 'kind': 'orange'},
  {'id': 4, 'category': 'animal', 'kind': 'dog'},
  {'id': 5, 'category': 'animal', 'kind': 'cat'},
  {'id': 6, 'category': 'fruit', 'kind': 'grape'},
]
```

この配列の中から `category` が `fruit` だけの要素で配列を生成したい時に `filter` 関数をします。

```javascript
const array = [
  {'id': 1, 'category': 'animal', 'kind': 'dog'},
  {'id': 2, 'category': 'fruit', 'kind': 'apple'},
  {'id': 3, 'category': 'fruit', 'kind': 'orange'},
  {'id': 4, 'category': 'animal', 'kind': 'dog'},
  {'id': 5, 'category': 'animal', 'kind': 'cat'},
  {'id': 6, 'category': 'fruit', 'kind': 'grape'},
]

const fruits = array.filter(x => x.category === 'fruit')

console.log(fruits)
```

出力結果
```
[
 {id: 2, category: "fruit", kind: "apple"},
 {id: 3, category: "fruit", kind: "orange"},
 {id: 6, category: "fruit", kind: "grape"}
]
```

`filter` 関数も `map` 関数と同様、1行で書くことができます。

**配列の全ての要素の中から必要な要素のみを取り出し、新たな配列を生成したいときは map 関数。**

**配列の全ての要素の中から条件に一致する要素で、新たな配列を生成したいときは filter 関数。**

`map` 関数と `filter` 関数、ぜひ使いこなしてみてください！

過去の記事でC#での書き方も記載しておりますので、こちらもぜひご確認ください！
[JavaScript 屋さんのための C# LINQ 入門 (1) filter / Where](/linq-basic-for-javascript-programmers-1/)

## 補足情報

この記事のJavaScriptはES6で書いています。