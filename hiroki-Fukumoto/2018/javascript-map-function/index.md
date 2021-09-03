---
title: JavaScript map関数を使用して必要な要素のみで配列を生成する
date: 2018-04-26
author: hiroki-Fukumoto
tags: [JavaScript, ES2015(ES6), Web]
---

こんにちは。ふっくんです。

今回は、 `javascript` の `map` 関数をご紹介します。

## map関数の使い方

map関数で何ができるかというと **配列の全ての要素の中から必要な要素のみを取り出し、新たな配列を生成することができます！**

例えば、以下のような連想配列があるとしましょう。

```javascript
const animals = [
  {'id': 1, 'category': 'animal', 'kind': 'dog'},
  {'id': 2, 'category': 'animal', 'kind': 'cat'},
  {'id': 3, 'category': 'animal', 'kind': 'bird'},
]
```

この配列を使って `kind` だけの配列を生成したい時ってありませんか？
僕はよくあります。（笑）

さて、どうするか。。。。

まず、頭に思い浮かぶのは `for` 文で `key` `value` を使って、配列に追加しようとするやり方ではないでしょうか。
僕はそうでした。（笑）

実際に `for` 文を書いてみるとこんな感じでしょうか。

```javascript
const animals = [
  {'id': 1, 'category': 'animal', 'kind': 'dog'},
  {'id': 2, 'category': 'animal', 'kind': 'cat'},
  {'id': 3, 'category': 'animal', 'kind': 'bird'},
]

const kinds = []
for (const key in animals) {
  kinds.push((animals[key].kind))
}

console.log(kinds)
```

出力結果
```
[
 "dog",
 "cat",
 "bird"
]
```

`kinds` という配列を生成したいので、まず `kinds` を初期化して `for` 文で `animals` の中から `key` `value` で `kind` の値を抜き出して、配列に `push` して、、、、
**長い！！！**
説明も長いし、ソースコードも4行も書かないといけない！

はい、そこで `map` 関数の出番です！
`map` 関数を使えば以下のように書けます。

```javascript
const animals = [
  {'id': 1, 'category': 'animal', 'kind': 'dog'},
  {'id': 2, 'category': 'animal', 'kind': 'cat'},
  {'id': 3, 'category': 'animal', 'kind': 'bird'},
]

const kinds = animals.map(x => x.kind)

console.log(kinds)
```

出力結果
```
[
 "dog",
 "cat",
 "bird"
]
```

先ほどの `for` 文と同じ結果を得るのに **たった1行で書けるのです！**
私は感動しました。

説明をしておくと、 `x` に `animals` のオブジェクトが入ってきて、その中から `x.kind` で `kind` の値を取得しています。
ここでは `x` としていますが、 `y` でも `animal` でもなんでも構いません。
そして `map` 関数は **処理結果を新しい配列として返してくれます。**
だから `push` とかをする必要がないんですねー。

過去の記事でC#での書き方も記載しておりますので、こちらもぜひご確認ください！
[JavaScript 屋さんのための C# LINQ 入門 (2) map / Select](/linq-basic-for-javascript-programmers-2/)

## 補足情報

上記のコードで使用した `const` や `=> (アロー関数)` は ` ECMAScript 6 (ES6)` の新機能になります。

`const` は宣言文で定数を宣言する際に使用します。つまり、「再宣言」「再代入」はできません。
その他の宣言文として `let` があります。これは「再宣言」ができません。
`let` で宣言した変数に値を再代入しても問題ありません。

`=> (アロー関数)` は `function` を書かなくて済むため、従来よりも簡潔に関数を書くことができます。
上記の `const kinds = animals.map(x => x.kind)` をアロー関数を使用せずに書くと以下のようになります。

```javascript
const kinds = animals.map(function(x) {
   return x.kind
})
```

詳しく知りたい方は以下をご確認いただければと思います。
[アロー関数 - JavaScript | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/arrow_functions)