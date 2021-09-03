---
title: Rust で小数点以下桁数指定の四捨五入・切り捨て・切り上げを行う (＋簡単なマクロ)
date: 2020-07-27
author: kenzauros
tags: [Rust]
---

業務用のプログラムを作っていると、**「小数点以下第 3 位以下を切り捨てしたい」**などというニーズは頻繁に起こります。
ただ、およそどの言語でも Excel のような桁数指定の丸め処理ができる関数が用意されていることはほとんどありません。

**Rust** も例外ではないので、簡単ではありますが実現方法と、これまた簡単なマクロを紹介します。

## 方法

Rust に限ったことはないですが、**小数点数を小数点以下 `n` 桁で丸めるには「10 の `n` 乗を掛けた値の小数点以下を丸め、10 の `n` 乗で割る」**という単純な方法が用いられることが多いでしょう。

たとえば**小数点以下 2 桁で四捨五入**であれば、 `10.0 ^ 2 = 100.0` なので **`(1.2345 * 100.0).round() / 100.0`** のようになります。

下記のようなコードで試してみましょう。

```rust
fn main() {
    let x: f32 = 3.7183;
    let rounded = (x * 100.0).round() / 100.0;
    println!("{}", rounded);
}
```

[Rust Playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=dafaeef0233d4424fdaf3626595e40f2)

`3.72` が表示されれば OK ですね。 `round` を `ceil` にすれば切り上げ、 `floor` にすれば切り捨てになります。

## マクロ化してみる

単純は単純なんですが、毎回これを書いてるとソースコードがややこしくなりますし、コードの意味もイマイチわかりにくいです。

ということで頻繁に使うものについては、マクロにしてみました。

```rust
macro_rules! round {
    ($x:expr, $scale:expr) => (($x * $scale).round() / $scale)
}
macro_rules! ceil {
    ($x:expr, $scale:expr) => (($x * $scale).ceil() / $scale)
}
macro_rules! floor {
    ($x:expr, $scale:expr) => (($x * $scale).floor() / $scale)
}

fn main() {
    let x: f32 = 3.7183;
    println!("round: {:?} -> {:?}", x, round!(x, 1000.0));
    println!("ceil: {:?} -> {:?}", x, ceil!(x, 1000.0));
    println!("floor: {:?} -> {:?}", x, floor!(x, 1000.0));
}
```

[Rust Playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=34e0e3608accdca4072163d2b4063d89)

これで `round!(1.2345, 1000.0)` のようにシンプルに書けます。まぁなんとか意味がわかります。

本当のことをいえば `round!(1.2345, 2)` のように桁数指定で書きたいところですが、これだとどうしても係数を求めるのに `pow` などでべき乗計算をしないといけなくなるため、妥協しましょう。

## あとがき

**Rust で桁数指定の丸め処理をする方法**を紹介しました。

もっといい方法をご存知の方がいらっしゃいましたら、またご教示ください。
