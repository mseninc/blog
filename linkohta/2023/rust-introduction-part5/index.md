---
title: "はじめての Rust 入門 Part5 ～列挙型について学ぶまで～"
date: 
author: linkohta
tags: [Rust]
description: "Rust を実際に触りながら勉強していきます。その５。"
---

link です。

高速でセキュリティ的にも安全な言語として **Rust** が注目を集めています。

今回はそんな Rust の勉強をしていきます。

本記事は [Part4](/rust-introduction-part4) の続きになっています。

## 想定環境

- Windows 11
- Rust 1.72

## 列挙型

Rust の列挙型は C 言語などと同様 `enum` で宣言されます。

IP アドレスを使って、列挙型の例を記述します。

```rust:title=IPアドレスの列挙型
enum IpAddrKind {
    V4,
    V6,
}
```

IP アドレスは V4 か V6 のいずれかのバージョンです。
このように複数の値のうち、いずれか 1 つの値しか取りえない場合に列挙型は有効です。

`IpAddrKind` を例にとると、列挙子のインスタンス生成は以下のようにできます。

```rust:title=列挙子のインスタンス生成
let four = IpAddrKind::V4;
let six = IpAddrKind::V6;
```

列挙子のインスタンスは、 `列挙型名::列挙子名` で表されます。
こうすることで、`IpAddrKind::V4` と `IpAddrKind::V6` という値は両方とも同じ型 `IpAddrKind`になります。
これで、どんな `IpAddrKind` 型の引数を取る関数も定義できるようになります。

```rust:title=列挙型の引数を取る関数
fn route(ip_type: IpAddrKind) { }

route(IpAddrKind::V4);
route(IpAddrKind::V6);
```

この列挙型と前回学んだ構造体を使って、 IP アドレスのバージョンとデータを保持する方法を考えると以下のようなコードが浮かぶと思います。

```rust:title=列挙型と構造体を使ってIPアドレスを保持する
enum IpAddrKind {
    V4,
    V6,
}

struct IpAddr {
    kind: IpAddrKind,
    address: String,
}

let home = IpAddr {
    kind: IpAddrKind::V4,
    address: String::from("127.0.0.1"),
};

let loopback = IpAddr {
    kind: IpAddrKind::V6,
    address: String::from("::1"),
};
```

ここでは、`IpAddrKind` 型の `kind` フィールドと `String` 型の `address` の 2 つのフィールドを持つ `IpAddr` という構造体を定義しています。
また、この構造体のインスタンスを V4 と V6 の 2 つ定義しています。

しかし、同じことをもっと簡潔な方法で表現できます。

以下に示したコードは各列挙型の列挙子に直接データを格納して、列挙型を構造体内に使うというよりも列挙型だけを使います。
この新しい `IpAddr` の定義は、 V4 と V6 の列挙子両方に `String` 型の値が紐付けられていることを示しています。

```rust:title
enum IpAddr {
    V4(String),
    V6(String),
}

let home = IpAddr::V4(String::from("127.0.0.1"));

let loopback = IpAddr::V6(String::from("::1"));
```

各列挙子にデータを直接添付できるので、余計な構造体を作る必要はまったくありません。

また、各列挙子に紐付けるデータの型と量は、異なっても問題ありません。
たとえば、バージョン4のIPアドレスには、常に 0 から 255 の値を持つ 4 つの数値があります。
V4 のアドレスは 4 つの `u8` 型の値として格納するけれども、 V6 のアドレスは引き続き、単独の `String` 型の値で格納したい場合も列挙型は容易に対応できます。

```rust:title=各列挙子に紐付けるデータの型と量
enum IpAddr {
    V4(u8, u8, u8, u8),
    V6(String),
}

let home = IpAddr::V4(127, 0, 0, 1);

let loopback = IpAddr::V6(String::from("::1"));
```

また、列挙型に対応付ける値の型は構造体であっても問題ありません。

```rust:title=構造体を対応付ける
struct Ipv4Addr {
    // 省略
}

struct Ipv6Addr {
    // 省略
}

enum IpAddr {
    V4(Ipv4Addr),
    V6(Ipv6Addr),
}
```

列挙型はいかなる種類のデータでも格納できます。例を挙げれば、文字列、数値型、構造体などです。他の列挙型を含むことさえできます。

列挙型と構造体に似通っている点として、 `impl` を使って、 `enum` にもメソッドを定義できます。

```rust:title=列挙型でのメソッド
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

impl Message {
    fn call(&self) {
        // method body would be defined here
        // メソッド本体はここに定義される
    }
}

let m = Message::Write(String::from("hello"));
m.call();
```

### Option

Rust には `null` はありませんが、値が存在するか不在かという概念をコード化する列挙型があります。
この列挙型が `Option<T>` で以下のように標準ライブラリーに定義されています。

```rust:title=Option
enum Option<T> {
    Some(T),
    None,
}
```

`Option<T>` は初期状態で宣言されています。つまり、**明示的にスコープに導入する必要がありません。さらに、列挙子の `Some` と `None` を `Option::` の接頭辞なしに直接使えます。

`<T>` はジェネリック型引数です。これについては別の記事で学ぶことになりますが、 `<T>` は、 `Option` の `Some` 列挙子があらゆる型のデータを 1 つだけ持つことができることを意味しています。

以下のコードは `Option` を使って、数値型や文字列型を保持する例です。

```rust:title=
let some_number = Some(5);
let some_string = Some("a string");

let absent_number: Option<i32> = None;
```

`Some` ではなく、 `None` を使ったら、コンパイラに `Option<T>` の型が何になるかを教えなければいけません。
なぜなら、 `None` 値を見ただけでは、 `Some` 列挙子が保持する型をコンパイラが推論できないからです。

`Option<T>` 型の値がある時、その値を `T` 型に変換する必要があります。
どのように `Some` 列挙子から `T` 型の値を取り出せばいいのかですが、 `match` 式を使うことで`Option<T>` 型の値のデータを使用できます。

## match 制御フロー演算子

Rust には、一連のパターンに対して値を比較し、マッチしたパターンに応じてコードを実行させてくれる `match` と呼ばれる制御フロー演算子があります。

`match` 式は**値が適合する最初のパターンのコードブロック内で使用されます。**

以下のコードではどの種類のコインなのか決定し、その価値をセントで返す関数を記述しています。

```rust:title=コインの例
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value_in_cents(coin: Coin) -> u32 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
```

`value_in_cents()` 内の `match` を見ていきます。まず、 `match` に続けて値を並べています。

次は、`match` アームです。 1 本のアームにはパターンと何らかのコードがあります。
今回の最初のアームは `Coin::Penny` という値のパターンであり、パターンと動作するコードを区別する `=>` 演算子が続きます。
この場合のコードは、 `1` です。各アームはカンマで区切られています。

この `match` 式が実行されると、結果の値を各アームのパターンと順番に比較します。パターンに値がマッチしたら、そのコードに紐付けられたコードが実行されます。
パターンが値にマッチしなければ、次のアームが継続して実行されます。必要なだけパターンは存在できます。

各アームに紐付けられるコードは式であり、マッチしたアームの式の結果が `match` 全体の戻り値になります。

マッチのアームで複数行のコードを走らせたい場合、`{}` を使用できます。
たとえば、以下のコードは、メソッドが `Coin::Penny` とともに呼び出されるたびに「Lucky penny!」と表示しつつ、1 を返します。

```rust:title=複数行のコードを実行するアーム
fn value_in_cents(coin: Coin) -> u32 {
    match coin {
        Coin::Penny => {
            println!("Lucky penny!");
            1
        },
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
```

`match` のアームの別の有益な機能は、パターンにマッチした値の一部に束縛できる点です。これを利用することで、列挙型の列挙子から値を取り出すことができます。

すなわち `Option<T>` を使用する際に、 `Some` から中身の `T` の値を取得したい場合、 `match` を使って `Option<T>` から `T` を取り出すことができます。

たとえば、 `Option<i32>` を取る関数を書きたくなったとし、中に値があったら、その値に 1 を足すことにします。
中に値がなければ、関数は `None` 値を返し、何も処理を試みるべきではありません。

`match` を使うことで以下のように書けます。

```rust:title=Option<i32>から値を取り出す
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}

let five = Some(5);
let six = plus_one(five);
let none = plus_one(None);
```

また、 Rust には、すべての場合の処理を列挙したくない時に使用できるパターンもあります。
たとえば、`u8` の有効な値のうち、 1, 3, 5, 7 の値にだけ設定し、それ以外の場合の処理を `_` に記述できます。

```rust:title=_パターン
let some_u8_value = 0u8;
match some_u8_value {
    1 => println!("one"),
    3 => println!("three"),
    5 => println!("five"),
    7 => println!("seven"),
    _ => (),
}
```

`_` というパターンは、どんな値にもマッチします。他のアームの後に記述することで、 `_` はそれまでに指定されていないすべての可能性にマッチします。
`()` は、ただのユニット値ですので、 `_` の場合には何も起こりません。結果として、 `_` プレースホルダーの前に列挙していない場合すべてに対しては、何もしないようになります。

ですが、 1 つのケースにしか興味がないような場面では、`match` 式はちょっと長ったらしすぎます。このような場面用に Rustには、 `if let` が用意されています。

## if let 記法

`if let` 記法で `if` と `let` をより冗長性の少ない方法で組み合わせ、残りを無視しつつ、 1 つのパターンにマッチする値を扱うことができます。
`Option<u8>` にマッチするけれど、値が 3 の時にだけコードを実行したい場合について考えます。

```rust:title=iflet記法を使わない場合
let some_u8_value = Some(0u8);
match some_u8_value {
    Some(3) => println!("three"),
    _ => (),
}
```

`Some(3)` にマッチした時だけ何かをし、他の `Some<u8>` 値や `None` 値の時には何もしたくありません。
`match` 式を満たすためには、列挙子を 1 つだけ処理した後に `_ => ()` を追加しなければなりません。
ですが、 `if let` を使用すればもっと短く書くことができます。

```rust:title=iflet記法を使った場合
if let Some(3) = some_u8_value {
    println!("three");
}
```

`if let` 記法は等号記号で区切られたパターンと式を取り、式が `match` に与えられ、パターンが最初のアームになった `match` と同じ動作をします。

`if let` では、 `else` を含むこともできます。 `else` に入るコードブロックは `if let` と `else` に等価な `match`式の `_` の場合に入るコードブロックと同じになります。 

```rust:title=iflet記法でelseを使う
let mut count = 0;
if let Coin::Quarter(state) = coin {
    println!("State quarter from {:?}!", state);
} else {
    count += 1;
}
```

`match` を使って表現するには冗長的すぎるロジックが必要なシチュエーションに遭遇したら、 `if let` のことを思い出してください。

## 参考サイト

- [The Rust Programming Language 日本語版 - The Rust Programming Language 日本語版](https://doc.rust-jp.rs/book-ja/title-page.html)

## まとめ

今回は Rust の列挙型について学びました。

次回は Rust のコレクションについて学んでいきたいと思います。

それではまた、別の記事でお会いしましょう。