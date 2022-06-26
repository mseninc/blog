---
title: JavaScript 屋さんのための C# LINQ 入門 (1) filter / Where
date: 2016-07-07
author: kenzauros
tags: [JavaScript, C#, LINQ, .NET]
---

こんにちは、 kenzauros です。

さて今回は JavaScript という Web 系から C# という業務系に流れてきた人のために、JS でよく使う配列系関数に的を絞って「C# ではどう書けるのか」を連載形式でご紹介していきます。

## LINQ ってなんやねん

今日では C# でコレクション系の操作をするときは **LINQ** を使うのが一般的です。

LINQ は 2008 年ごろに公開された C# 3.0 で実装されたデータ操作構文で、その利便性から一気に市民権を獲得した気がします。実際コレクションに対するほとんどのループ処理は LINQ で記述可能になりました。

というわけで本連載では **JavaScript の Array** に定義されている関数と **C#(.NET) の LINQ** のメソッドを比較して見ていくことにしたいと思います。

なお、 LINQ は `from p in people select p.name` のようにクエリー式で書くこともできますが、個人的趣味により本連載では `people.Select(p => p.name)` のようなメソッド形式で紹介します。

## 条件を満たす要素を絞り込む

最初は使用頻度の高い「**条件を満たす要素を抽出する**」という操作です。SQL では**選択**と呼ばれる操作で SELECT につける WHERE に相当します。

### filter 関数は Where メソッドで置き換えるだけ

JavaScript でいうところの `filter` です。これはこれでわかりやすい名前ですね。

```
var men = people.filter(function (p) { return p.gender === 0; });
let men = people.filter(p => p.gender === 0); // ES2015
```

JavaScript は ECMAScript 2015 で使えるようになったアロー演算子での記述方法も併記しています。

対して C# (LINQ) では `Where` メソッドを使います。こちらも SQL に慣れた人ならわかりやすい名前です。

```
var men = people.Where(p => p.gender == 0);
```

ES2015 とほぼ同じだ...。

いずれの場合もコールバック関数やラムダ式は bool 値を返せばよく `true` を返した要素のみが抽出されます。

### インデックスを使った操作もできる

実は **JavaScript の filter 関数はコールバックの第 2 引数を使って配列のインデックスが取得できます**。

```
var oddPeople = people.filter(function (p, index) { return index % 2 === 1; });
let oddPeople = people.filter((p, index) => index % 2 === 1); // ES2015
```

たとえばこんな感じで奇数番目の人だけを抽出することができます。

実は LINQ にも 2 つの引数をもった Func を使ったオーバーロードが用意されており、同じように記述できます。

```
var oddPeople = people.Where((p, index) => index % 2 == 1);
```

うーん、ほぼ同じです。

言語が変わっても同じような書き方ができると言うのはありがたいですね。しかし、言語特有の比較演算子の違いや動的／静的型付けの違いなどでバグを生じないようご注意ください。

## まとめ

JavaScript の `filter` ＝ C# (LINQ) の `Where` !!

### 連載

- [(1) filter / Where (条件を満たす要素を絞り込む)](/linq-basic-for-javascript-programmers-1) ← いまここ
- [(2) map / Select (各要素を変換する)](/linq-basic-for-javascript-programmers-2)
- [(3) every / All と some / Any (条件に一致しているかを調べる)](/linq-basic-for-javascript-programmers-3)
