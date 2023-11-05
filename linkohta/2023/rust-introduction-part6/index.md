---
title: "はじめての Rust 入門 Part6 ～コレクションについて学ぶまで～"
date: 
author: linkohta
tags: [Rust]
description: "Rust を実際に触りながら勉強していきます。その６。"
---

link です。

高速でセキュリティ的にも安全な言語として **Rust** が注目を集めています。

今回はそんな Rust の勉強をしていきます。

本記事は [Part5](/rust-introduction-part5) の続きになっています。

## 想定環境

- Windows 11
- Rust 1.72

## Rust のコレクション

Rust の標準ライブラリーには**コレクション**と呼ばれるデータ構造が含まれています。

コレクションのデータはヒープに確保され、データサイズがコンパイル時にわかる必要のない可変長のデータです。

本記事では、 Rust のプログラムにおいて、よく使用される以下の 3 つのコレクションについて学んでいきましょう。

- ベクター型
- 文字列型
- HashMap

## ベクター型について

ベクター型は `Vec<T>` で宣言される単一の型の値を複数保持するコレクションです。

空のベクターを新たに作るには、以下のように `Vec::new()` を呼び出します。

```rust:title=ベクター型の宣言
    let v: Vec<i32> = Vec::new();
```

ベクター型はジェネリクスで指定した型の値のリストを保存しています。

また、 Rust には `vec!` という便利なマクロが用意されています。このマクロは与えた値を保持する新しいベクターを生成します。

```rust:title=vec!マクロ
    let v = vec![1, 2, 3];
```

このマクロでは i32 型の値を与えたので、コンパイラは `v` の型が `Vec<i32>` であると推論してくれるため、型指定は不要です。

ベクターに要素を追加するには `push()` を使います。

```rust:title=push
    let mut v = Vec::new();

    v.push(5);
    v.push(6);
    v.push(7);
    v.push(8);
```

これまでの変数と同様、 `mut` で可変にする必要があります。

中に配置する数値はすべて `i32` 型になっており、 Rust はこのことをデータから推論するので、 `Vec<i32>` とする必要はありません。

また、構造体と同様に、ベクターもスコープを抜ければ解放されます。

```rust:title=ベクターのスコープ
    {
        let v = vec![1, 2, 3, 4];

        // v で作業をする
    } // <- v はここでスコープを抜け、解放される
```

### Rust の文字列型について

Rustでの文字列型は UTF-8 エンコードになっており、 Rust での「文字列」は `String` と文字列スライスの `&str` の両方まとめたものを通常意味します。

```rust:title=Stringのnew()
let mut s = String::new();
```

文字列リテラルのように、 `Display` トレイトを実装する型であれば `to_string()` メソッドでも生成できます。

あるいは `String::from()` 関数でも文字列リテラルから `String` を生成できます。

```rust:title=文字列の初期値
let data = "initial contents";

let s = data.to_string();

let s = "initial contents".to_string();

let s = String::from("initial contents");
```

文字列は UTF-8 エンコードされていれば、以下のコードのようにどんな値も扱うことができます。

```rust:title=有効なStringの値
let hello = String::from("السلام عليكم");
let hello = String::from("Dobrý den");
let hello = String::from("Hello");
let hello = String::from("שָׁלוֹם");
let hello = String::from("नमस्ते");
let hello = String::from("こんにちは");
let hello = String::from("안녕하세요");
let hello = String::from("你好");
let hello = String::from("Olá");
let hello = String::from("Здравствуйте");
let hello = String::from("Hola");
```

以下のコードのように `push_str()` メソッドや `+` 演算子で文字列を追加したり結合したりできます。

```rust:title=文字列の追加
let mut s = String::from("foo");
s.push_str("bar");

let s1 = String::from("Hello, ");
let s2 = String::from("world!");
let s3 = s1 + &s2; // s1 はムーブされ、もう使用できないことに注意
```

`s3` への代入時に `s2` の参照を使用した理由は、 `+` 演算子を使用した時に `fn add(self, s: &str) -> String` が呼ばれるようになっているためです。

### Rust の HashMap 型について

`HashMap<K, V>` 型はハッシュ関数を介して `K` 型のキーと `V` 型の値の対応関係を保持します。

HashMap はベクター型のように番号ではなく、どんな型にもなりうるキーを使ってデータを参照したいときに有用です。

これまでのコレクションと同様に `new()` で新規作成します。
また、 HashMap の要素は `insert()` で追加できます。

```rust:title=HashMapの初期化と追加
use std::collections::HashMap;

let mut scores = HashMap::new();

scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Yellow"), 50);
```

HashMap 型を利用するには `use std::collections::HashMap` を追加する必要があります。
初期化処理で自動的にスコープに導入される機能には含まれていません。

別の生成方法として、タプルのベクター型に対して `collect()` メソッドを使用するものがあります。
具体的には `zip()` メソッドを使ってタプルのベクターを作り上げ、 `collect()` メソッドを使えば変換できます。

```rust:title=タプルのベクターからHashMapを生成
use std::collections::HashMap;

let teams  = vec![String::from("Blue"), String::from("Yellow")];
let initial_scores = vec![10, 50];

let scores: HashMap<_, _> = teams.iter().zip(initial_scores.iter()).collect();
```

ここでは、 `HashMap<_, _>` という型注釈が必要になります。なぜなら、どの型なのかがわからないため、ワイルドカードを指定する必要があるからです。

`get()` メソッドでキーを指定することで、 HashMap から値を取り出すことができます。

```rust:title=get()メソッド
use std::collections::HashMap;

let mut scores = HashMap::new();

scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Yellow"), 50);

let team_name = String::from("Blue");
let score = scores.get(&team_name);
```

キーに対応する値が HashMap にない場合、 `get()` は `None` を返します。

`for` ループで HashMap のキーと値のペアの走査もできます。

```rust:title=HashMapのforループ
use std::collections::HashMap;

let mut scores = HashMap::new();

scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Yellow"), 50);

for (key, value) in &scores {
    println!("{}: {}", key, value);
}
```

キーと値を HashMap に挿入し、同じキーに対して異なる値で挿入したら、そのキーに紐づけられている値は置換されます。

以下のコードのように同じキー `Blue` に対して異なる値を挿入すると、最後に挿入された `{"Blue": 25}` が出力されます。

```rust:title=HashMapの値の置き換え
use std::collections::HashMap;

let mut scores = HashMap::new();

scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Blue"), 25);

println!("{:?}", scores);
```

特定のキーに値があるか確認する `entry()` と呼ばれる関数があり、これは、引数としてチェックしたいキーを取ります。
この `entry()` メソッドの戻り値は、 `Entry` と呼ばれる列挙体であり、これは存在したりしなかったりする可能性のある値を表します。

以下のコードを実行すると、 `{"Yellow": 50, "Blue": 10}` と出力されます。

```rust:title=entryでキーがない場合に挿入する
use std::collections::HashMap;

let mut scores = HashMap::new();
scores.insert(String::from("Blue"), 10);

scores.entry(String::from("Yellow")).or_insert(50);
scores.entry(String::from("Blue")).or_insert(50);

println!("{:?}", scores);
```

`Entry` 上の `or_insert()` メソッドは、対応する `Entry` キーが存在した時にそのキーに対する値への可変参照を返すために定義されています。
もしなければ、引数をこのキーの新しい値として挿入し、新しい値への可変参照を返します。

最初の `entry()` の呼び出しは、まだ `Yellow` に対する値がないので、値 50 で `Yellow` のキーを挿入します。 `entry` の 2 回目の呼び出しは `Blue` のキーに 10 の値が存在しているため、 HashMap を更新しません。

## 参考サイト

- [The Rust Programming Language 日本語版 - The Rust Programming Language 日本語版](https://doc.rust-jp.rs/book-ja/title-page.html)

## まとめ

今回は Rust のコレクションについて勉強しました。

次回は Rust のジェネリックについて勉強していきます。

それではまた、別の記事でお会いしましょう。