---
title: 【備忘録】 Node.js 15 以前で replaceAll をする方法
date: 
author: linkohta
tags: [JavaScript]
description: 
---

link です。

JavaScript で文字列を処理するときに使う関数の 1 つとして `replace()` と `replaceAll()` が存在します。

どちらも第一引数で指定した文字列に一致する箇所を第二引数の文字列に置き換える関数です。

`replace()` は最初に引っかかった文字列だけを置き換えますが、 `replaceAll()` は一致した文字列すべてを置き換えます。

この内、 `replaceAll()` は ECMAScript2021 で追加されたかなり新しい関数となっています。

そのため、 ECMAScript2021 を搭載していない 15 以前の Node.js では使用できません。

今回は 15 以前の Node.js で `replaceAll()` と同じことを `replace()` で行う方法を紹介します。

## 対象

- Node.js 15 以前などの ECMAScript2021 が搭載されていないもの

## replace で全置換する方法

`replace()` で全置換する方法ですが、とてもシンプルです。

置換対象の文字列を g オプション付きの正規表現で書くだけです。

g オプションは置き換えたい文字列を指定した時にその文字が複数含まれている場合に、そのすべてを置き換えるオプションです。

また、 JavaScript で正規表現を利用するときは `''`, `""` などで囲う代わりに `//` で囲います。

以下はソースコード例です。

```js
const str = 'hogehoge';
str.replace(/h/g, 'r'); // rogeroge
```

少し短い記事ですが、今回はここまで。

それではまた、別の記事でお会いしましょう。