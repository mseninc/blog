---
title: JavaScript 屋さんのための C# LINQ 入門 (3) every / All と some / Any
date: 2016-07-16
author: kenzauros
tags: [JavaScript, C#, LINQ, .NET]
---

こんにちは、 kenzauros です。連載 3 回目です。今回はまとめて一気に 2 セットお届けします！

**すべての要素が条件に一致しているかどうか**を調べる **[every 関数](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/every)** と**条件に一致している要素が一つでもあるか**を調べる **[some 関数](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/some)** です。

利用頻度は map や filter に比べると少ないかもしれませんが、意外と便利な関数です。

## 全要素が条件に一致しているかを調べる every と All

JavaScript では **every** です。各要素を調べて bool 値を返すコールバック関数を指定すると、すべての要素でコールバック関数が true を返すかを調べることができます。

```
var areAllOver18 = people.every(function (p) { return p.age > 18; });
let areAllOver18 = people.every(p => p.age > 18); // ES2015
```

たとえばこんな感じで全員が 18 歳を超えているかどうかを調べることができます。

C#(LINQ) では every の代わりに **All** を用います。

every と all ... 英語の試験で間違えそうな部分ですね(笑)。感覚的には一つずつチェックしていくので every のほうが適している気はします。

```
var areAllOver18 = people.All(p => p.age > 18);
```

ちなみにこの every と All はいずれも **false を返す要素があれば直ちに結果を返します**。そのため、コレクションの最初のほうに false の要素があれば実行時間は速くなります。

## 条件に一致する要素があるかを調べる some と Any

JavaScript で条件に一致している要素が一つでもあるかを調べるには **some** 関数を使います。コールバック関数は every と同様に、各要素を調べて bool 値を返すものを指定します。

```
var malesExist = people.some(function (p) { return p.gender === 0; });
let malesExist = people.some(p => p.gender === 0); // ES2015
```

こんな感じに書けば、男性がいるかどうかを調べることができます。

C#(LINQ) ではこの some の代わりに **Any** を用います。 また出た英語の類語問題(笑)。このネーミングは LINQ のほうが素直な感じです。

```
var malesExist = people.Any(p => p.gender == 0);
```

ちなみにこの some / Any はさきほどの every / All とは真逆で、いずれも **true を返す要素があれば直ちに結果を返します**。そのため、こちらはコレクションの最初のほうに true の要素があれば実行時間が速くなります。

## まとめ

* JavaScript の `every` ＝ C# (LINQ) の `All` !!
* JavaScript の `some` ＝ C# (LINQ) の `Any` !!

### 連載

- [(1) filter / Where (条件を満たす要素を絞り込む)](/linq-basic-for-javascript-programmers-1)
- [(2) map / Select (各要素を変換する)](/linq-basic-for-javascript-programmers-2)
- [(3) every / All と some / Any (条件に一致しているかを調べる)](/linq-basic-for-javascript-programmers-3) ← いまここ
