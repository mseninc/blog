---
title: JavaScript 屋さんのための C# LINQ 入門 (4) reduce / Aggregate
date: 2016-08-03
author: kenzauros
tags: [JavaScript, C#, LINQ, .NET]
---

こんにちは、 kenzauros です。連載 4 回目です。今回はちょっとむずかしいやつ、 **[reduce 関数](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)** です。

MDN の定義によれば reduce 関数は **「隣り合う 2 つの配列要素に対して（左から右へ）同時に関数を適用し、単一の値にします。」** だそうです。これだけでは使い方以前に説明がさっぱりわかりませんね。

しかし、この関数を表現するのはなかなかむずかしいので、この説明はがんばっているほうだと思います(笑)

## reduce はどんな関数か

まず JavaScript における reduce 関数がどんなものかを見てみましょう。

```
var array = [ 1, 2, 3, 4, 5 ];
var value = array.reduce(function(p, x) { return p + x; });
// const value = array.reduce((p, x) => p + x); // ES2015
console.log(value);
```

このコードを見て `value` が 15 になるはずだとすぐにわかった方はこの項をとばしてください(笑)

さて、なぜこれで 15 が出力されるのでしょうか。順を追ってみていきましょう。 reduce は(この形式では) **コールバックが (要素の数 - 1) 回** 実行されます。

各呼び出しでは `p` にこれまでの結果、 `x` に要素の値が渡され、コールバックで演算結果を返すことでその値が次の呼び出しの `p` に渡されます。

つまり今回の場合、次の 4 回のコールバック呼び出しが行われます。

```
1.  1  2 ->  3
2.  3  3 ->  6
3.  6  4 -> 10
4. 10 15 -> 15
```

この結果、 reduce の戻り値として 15 が返されます。

いわゆる **畳み込み** と呼ばれる演算を行うもので、 **すべての値を蓄積する (accumulate)** ようなイメージなので、実際に C++ では accumulate という名前だったりします。

上で見たように合計 (sum) や最大値 (max) 、最小値 (min) を求めたりする関数を作成するのに使うことができます。JavaScript の配列 (Array) には sum/max/min がないので下記のように reduce を使えば比較的すっきり書くことができますね。

```
var array = [ 1, 2, 3, 4, 5 ];
// 合計 (sum)
var sum = array.reduce(function(p, x) { return p + x; });
// const sum = array.reduce((p, x) => p + x); // ES2015
// 最大値 (max)
var max = array.reduce(function(p, x) { return x > p ? x : p; });
// const max = array.reduce((p, x) => x > p ? x : p); // ES2015
// 最小値 (min)
var min = array.reduce(function(p, x) { return x < p ? x : p; });
// const min = array.reduce((p, x) => x < p ? x : p); // ES2015
// 15 5 1
console.log(sum, max, min);
```

### 初期値を指定した場合

また、第二引数として初期値を渡すこともできます。 reduce 関数の最後の `, 0` に注意してください。

```
var array = [ 1, 2, 3, 4, 5 ];
var sum = array.reduce(function(p, x) { return p + x; }, 0);
// const sum = array.reduce((p, x) => p + x, 0); // ES2015
console.log(sum);
```

この場合、コールバック関数は要素と同じ回数呼び出されます。初期値が 0 なので結果は同じですね。

```
1.  0  1 ->  1
2.  1  2 ->  3
3.  3  3 ->  6
4.  6  4 -> 10
5. 10 15 -> 15
```

### 実用的な利用方法

特に下記のように要素がオブジェクトなどただの数値でない場合に重宝します。

```
var array = [
  { name: 'A', math: 95, english: 68 },
  { name: 'B', math: 56, english: 77 },
  { name: 'C', math: 87, english: 49 },
];
// math の合計
var sum = array.reduce(function(p, x) { return p + x.math; }, 0);
// const sum = array.reduce((p, x) => p + x.math, 0); // ES2015
// 238 (0 + 95 + 56 + 87)
console.log(sum);
```

math プロパティの値を選んで合計することができています。 for 文などを使わずに実現できるので便利ですが、 **知らない人には読みにくい** というデメリットはあります。

### Promise と reduce

もう一つよく reduce が使われる事例として、 Promise の直列（シリアル）実行があります。

Promise はご存知の通り、 JavaScript で非同期関数の終了を待機するための仕組みです。並列に実行してすべての処理の終了を待機するときは Promise.all が利用できるのに対し、逐次実行するための仕組みは通常提供されていません。

そこで、 Promise の配列に対して reduce を適用することで順次、実行させることができます。

```
var promises = [ promise1, promise2, promise3 ];
var promise = promises.reduce(function(p, x) { return p.then(x); }, Promise.resolve());
```

初期値として空の Promise (Promise.resolve()) を渡し、前の Promise の then に各 Promise を渡していくだけなので Promise に慣れていれば難しくはありません。

まぁ、 Promise の説明はここではしませんが、上の処理が下記と等しいことがわかれば十分でしょう。

```
var promise =  Promise.resolve().then(promise1).then(promise2).then(promise3);
```

## C# で reduce に相当するのは Aggregate

JavaScript の reduce に相当する LINQ のメソッドは **Aggregate** です。うん、 *g が多い*ですね。

aggregate は「集める」という意味なので、 reduce (減らす) よりは accumulate (蓄積する) に近いですね。

```
var array = new [] { 1, 2, 3, 4, 5 };
var value = array.Aggregate((p, x) => p + x);
Console.WriteLine(value);
```

これまたラムダ式を使って、 ES2015 の場合とほぼ同じ記述で書けます。

ただし、 Aggregate で初期値を指定する場合は、 JavaScript と引数の順番が逆（第一引数に初期値）ですので注意してください。

```
var array = new [] { 1, 2, 3, 4, 5 };
var value = array.Aggregate(0, (p, x) => p + x);
Console.WriteLine(value);
```

引数の順番もメソッド名もなんとなく LINQ のほうが自然な感じがしますね。

このように C#(LINQ) ではこの reduce の代わりに **Aggregate** を用います。

ただ、 LINQ の場合、 Sum や Max, Min など主要な集計関数はそろっていますし、 Promise のような非同期処理の仕組みを使う必要もないので、 JavaScript の reduce ほど活躍する機会は多くないかもしれません。

## まとめ

* JavaScript の `reduce` ＝ C# (LINQ) の `Aggregate` !!

### 連載

- [(1) filter / Where (条件を満たす要素を絞り込む)](/linq-basic-for-javascript-programmers-1)
- [(2) map / Select (各要素を変換する)](/linq-basic-for-javascript-programmers-2)
- [(3) every / All と some / Any (条件に一致しているかを調べる)](/linq-basic-for-javascript-programmers-3)
- [(4) reduce / Aggregate (畳み込み演算を行う)](/linq-basic-for-javascript-programmers-4) ← いまここ
