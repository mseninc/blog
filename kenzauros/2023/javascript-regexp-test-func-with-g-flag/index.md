---
title: "JavaScript 正規表現の g フラグを使ったときの test() の挙動"
date: 
author: kenzauros
tags: [JavaScript,正規表現]
description: "JavaScript でグローバルフラグをつけた正規表現を扱っているとき、予期せぬ挙動でバグを起こすことがあります。この記事ではその事例と原因・解決法を紹介します。"
---

さて、突然ですがクイズです。

JavaScript で **`const regexp = /[abc]/g` のあと `regexp.test('aa')` を何度か実行**すると戻り値はどうなるでしょうか。

```js:title=globalフラグを設定した正規表現でtestを実行
const regexp = /[abc]/g
console.log(regexp.test('aa'))
// ???
console.log(regexp.test('aa'))
// ???
console.log(regexp.test('aa'))
// ???
```

## test の想定外の挙動

正解は... *`true` が2回出力されたあと `false` が1回出力される* です。パッと正解できる人はどれだけいるでしょうか。私は無理でした😂

```js:title=globalフラグを設定した正規表現のtest実行結果
const regexp = /[abc]/g
console.log(regexp.test('aa'))
// true
console.log(regexp.test('aa'))
// true
console.log(regexp.test('aa'))
// false
// 以下繰り返し
```

## 動作を確認してみる

`test` を `exec` に変えて試してみると原因がわかります。ちなみに `test` はマッチしたかどうかをブール値で返すのに対し、 exec はマッチした場合に結果オブジェクトを返します。

```js:title=globalフラグを設定した正規表現のexec実行結果
const regexp = /[abc]/g
regexp.exec('aa')
// ['a', index: 0, input: 'aa', groups: undefined]
regexp.exec('aa')
// ['a', index: 1, input: 'aa', groups: undefined]
regexp.exec('aa')
// null
```

よく見てみると `index` が加算され、入力文字列の長さになると `null` になっています。これが `true` `true` `false` に相当するわけですね。

## この動作は仕様通り

MDN を見てみるとこの動作は仕様通りであることがわかります。

> グローバルフラグを持つ正規表現の test() の使用<br>
> 
> 正規表現にグローバルフラグが設定されている場合、 test() は正規表現が所有する lastIndex の値を加算します。
> 
> その後にさらに **test(str) を呼び出すと、 str を lastIndex から検索します**。 lastIndex プロパティは test() が true を返すたびに増え続けます。
> 
> メモ: test() が true を返す限り、 **lastIndex は別な文字列をテストした場合であっても、リセットされません**。
> 
> <cite>[RegExp.prototype.test() - JavaScript | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test#%E3%82%B0%E3%83%AD%E3%83%BC%E3%83%90%E3%83%AB%E3%83%95%E3%83%A9%E3%82%B0%E3%82%92%E6%8C%81%E3%81%A4%E6%AD%A3%E8%A6%8F%E8%A1%A8%E7%8F%BE%E3%81%AE_test_%E3%81%AE%E4%BD%BF%E7%94%A8)</cite>

```js:title=MDNのサンプル
const regex = /foo/g; // "global" フラグを設定

// regex.lastIndex は 0 です。
regex.test('foo')     // true

// regex.lastIndex は 3 です。
regex.test('foo')     // false

// regex.lastIndex は 0 です。
regex.test('barfoo')  // true

// regex.lastIndex は 6 です。
regex.test('foobar')  //false

// regex.lastIndex は 0 です。
// (...以下略)
```

呼び出しごとに **RegExp (`regexp`) オブジェクトの中で `lastIndex` が加算され、次はテスト文字列にかかわらずその位置から検索が始まる**ため、このような挙動になります。

## 事例紹介

私の場合、下記のように、文字列に特定の文字が含まれるかどうかを判断するときにループ内で `test` を呼び出していました。

```js:title=意図したとおりに動かないコード
const regexp = /[-#&]/g // 特殊文字
for (const target of values) {
    if (regexp.test(target)) {
        // 🆖 特殊文字が含まれていても通らないときがある
    }
}
```

**指定した文字が含まれていても if 文を通らないことがある**ため、バグになっていました。

## 解決策

解決策は 2 つです。

1. **`g` (global) フラグを外す**
2. `"文字列".match()` に変える

1 が最もシンプルでしょう。仕様のとおり、「グローバルフラグを持つ正規表現」の挙動なのですから、グローバルフラグを付けなければいいのです。余分なものを付けてしまったのがそもそもの間違いです😂

```js{1}:title=gフラグを除いただけ
const regexp = /[-#&]/ // 特殊文字
for (const target of values) {
    if (regexp.test(target)) {
        // 👌 特殊文字が含まれているときに通る
    }
}
```

2 は少し表現が変わりますが、これでも所望の挙動が得られます。

```js{2}:title=match関数に変更
for (const target of values) {
    if (target.match(/[-#&]/g)) { // g の有無はあまり関係ない
        // 👌 特殊文字が含まれているときに通る
    }
}
```

おそらく実行速度は 1 のほうが速いでしょう。

## まとめ

今回は JavaScript のグローバルフラグをつけた正規表現で、 `test` 関数や `exec` 関数を使ったときに予期せぬ挙動になることがあることを紹介しました。

`g` 1 つで大幅に挙動が変わってしまい、発見も難しいので、正規表現のフラグには気を付けましょう👍

どなたかのお役に立てれば幸いです。
