---
title: JavaScript 屋さんのための C# LINQ 入門 (2) map / Select
date: 2016-07-12
author: kenzauros
tags: [JavaScript, C#, LINQ, .NET]
---

こんにちは、けんけんです。

連載 2 回目。今回は filter と同じくらい頻繁に使うであろう **map 関数**です。このような操作は数学的には「写像」とか「射影」とか呼ばれます。

## 各要素を変換する（写像・射影）

### map 関数は Select メソッドで置き換えできる

JavaScript では **map** です。別の配列にマッピングするという動作ですね。

```
var ages = people.map(function (p) { return p.age + "歳"; });
let ages = people.filter(p => p.age + "歳"); // ES2015
```

こんな感じに書けば "歳" つきの年齢リストが取得できます。

さて、C#(LINQ) では map の代わりに **Select** を用います。これも SQL と似ていますね。

```
var ages = people.Select(p => p.age.ToString() + "歳");
```

C# の場合は静的型付けですので、数値型を文字列と結合するときは ToString() が必須です。

### インデックスも取得できるタイプ

前回の filter 関数と同様、**map 関数もコールバックの第 2 引数を使って配列のインデックスが取得できます**。

```
var nameList = people.map(function (p, index) { return index + "番 = " + p.name; });
let nameList = people.map((p, index) => index + "番 = " + p.name); // ES2015
```

たとえばこんな感じでインデックスを使った操作ができます。

LINQ にも同様の実装があり、インデックスを取得することができます。

```
var nameList = people.Select((p, index) => index.ToString() + "番 = " + p.name);
```

## まとめ

JavaScript の `map` ＝ C# (LINQ) の `Select` !!

### 連載

- [(1) filter / Where (条件を満たす要素を絞り込む)](/linq-basic-for-javascript-programmers-1)
- [(2) map / Select (各要素を変換する)](/linq-basic-for-javascript-programmers-2) ← いまここ
- [(3) every / All と some / Any (条件に一致しているかを調べる)](/linq-basic-for-javascript-programmers-3)