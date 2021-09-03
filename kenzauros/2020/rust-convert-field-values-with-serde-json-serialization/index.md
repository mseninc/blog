---
title: Rust で serde を使った JSON シリアライズ時にフィールドの値を変換する
date: 2020-07-31
author: kenzauros
tags: [Rust]
---

**Rust でオブジェクトから JSON にシリアライズするときは serde と serde_json を使う**のが一般的です。

今回は**シリアライズするときに特定のフィールドの値を任意に変換する方法**を紹介します。

- [serde-rs/serde: Serialization framework for Rust](https://github.com/serde-rs/serde)
- [serde_json - Rust](https://docs.serde.rs/serde_json/)

## 事前準備

### dependencies の追加

**Cargo.toml の dependencies に serde と serde_json を追加**します。

```rust
[dependencies]
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
```

### 構造体の準備

既存のシリアライズ可能な構造体を使う場合を除き、自分でシリアライズ可能な構造体を定義するときは `derive` 属性で `Serialize` Trait を継承させます。

今回は `String` 型の `topic` と `f32` 型の `value` をもつ `MyData` 構造体を想定します。

```rust
use serde::Serialize;

#[derive(Serialize)]
struct MyData {
    pub topic: String,
    pub value: f32,
}
```

## JSON へシリアライズ

### 単純なシリアライズ

**JSON へシリアライズするには `serde_json::to_string()`** を呼び出します。

```
fn main() {
    let data = MyData {
        topic: "My first topic".to_string(),
        value: 1.23456,
    };
    let content = serde_json::to_string(&data).unwrap();
    println!("{}", content);
    // will get `{"topic":"My first topic","value":1.23456}`
}
```

これで `{"topic":"My first topic","value":1.23456}` のような JSON が得られるはずです。

なお、**整形された JSON を得るには `to_string` の代わりに `to_string_pretty`** を使います。

```rust
let content = serde_json::to_string_pretty(&data).unwrap();
```

### シリアライズ関数を指定したシリアライズ

さて、本題の**シリアライズ時に特定のフィールドを変換したい**場合です。

そのときは**変換用関数を作り、構造体のフィールドに対して `serialize_with` を指定**します。たとえば `value` フィールドの変換に `format_f32_data` という関数を用いる場合は下記のように構造体を宣言します。

```rust
use serde::Serialize;

#[derive(Serialize)]
struct MyData {
    pub topic: String,
    #[serde(serialize_with="format_f32_data")]
    pub value: f32,
}
```

`#[serde(serialize_with="format_f32_data")]` がこのフィールドの変換関数の指定です。

そして変換関数自体を実装します。シグネチャは **`fn function_name<S>(x: &f32, s: S) -> Result<S::Ok, S::Error> where S: Serializer`** のようになります。少し複雑ですが、こういうものなのであまり悩まず、 `function_name` `f32` だけを必要な名前、型に変更して使いましょう。

下記は入力の浮動小数点数を小数点以下 2 桁で四捨五入する関数の例です。

```rust
fn format_f32_data<S>(x: &f32, s: S) -> Result<S::Ok, S::Error> where S: Serializer
{
    s.serialize_f32((x * 100.0).round() / 100.0)
}
```

これで同様にシリアライズすると `{"topic":"My first topic","value":1.23}` のように四捨五入された値で取得できるようになります。

ただ、変換が一方通行ならいいですが、この関数の場合は不可逆変換なので、デシリアライズすると結果が違ってきてしまいます。シリアライズ／デシリアライズ両方向の場合は、気をつけてください。

- [Rust Playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=d3a60b296ff4636e76b8be687f755d5c)

## おまけ

### serde でのデフォルト値の指定

Deserialize を行う構造体で、変換元の JSON にキーが含まれていないとき、**デフォルト値**を使いたい場合があります。

そんなときは**フィールドと同じ型を返す関数を定義し、 `#[serde(default="funcation_name")]` を指定**しましょう。

```rust
fn default_as_true() -> bool { true } // true を返す関数
fn default_as_1() -> i32 { 1 } // 1 を返す関数

#[derive(Deserialize)]
struct Config {
    #[serde(default="default_as_true")]
    pub my_boolean: bool,
    #[serde(default="default_as_1")]
    pub my_integer: i32,
}
```

これだけです。少し面倒な気もしますが、関数で書ける分、リテラルより融通が利きます。

### あとがき

ちなみに今回は JSON シリアライズを前提に書きましたが、 serde 共通なのでシリアライズ方法が JSON でなくとも大丈夫です。

今回紹介した `serialize_with` や `default` を含め、 serde のフィールド属性の種類は下記の公式ページを参照してみてください。 (あまり親切ではないですが)

- [Field attributes · Serde](https://serde.rs/field-attrs.html)
