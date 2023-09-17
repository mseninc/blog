---
title: "はじめての Rust 入門 Part4 ～構造体について学ぶまで～"
date: 
author: linkohta
tags: [Rust]
description: "Rust を実際に触りながら勉強していきます。その４。"
---

link です。

高速でセキュリティ的にも安全な言語として **Rust** が注目を集めています。

今回はそんな Rust の勉強をしていきます。

本記事は [Part3](/rust-introduction-part3) の続きになっています。

## 想定環境

- Windows 11
- Rust 1.72

## Rust の構造体について

### 基本の構造体

構造体は `struct` で定義されます。

内部ではフィールドと呼ばれるデータ片の名前と型を定義します。

以下のコードはユーザーアカウントに関する情報を保持する構造体です。

```rs:title=基本の構造体
struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}
```

構造体を使用するには、各フィールドに対して具体的な値を指定した構造体のインスタンスを生成します。

インスタンスはフィールド名とそのフィールドに格納したいデータを指定することで生成できます。

フィールドは構造体で宣言した通りの順番に指定する必要はありません。

例えば、以下のコードのように特定のユーザーを宣言することができます。

```rs:title=インスタンスの生成
let user1 = User {
    email: String::from("someone@example.com"),
    username: String::from("username123"),
    active: true,
    sign_in_count: 1,
};
```

構造体からフィールドの値を取得するにはドット記法を使います。

例えば、以下のコードのインスタンスで `User` の `email`だけが欲しいなら、 `user1.email` で取得できます。

インスタンスが可変であればドット記法を使い、特定のフィールドに代入することで値を変更できます。

```rs:title=フィールドの取得・代入
let mut user1 = User {
    email: String::from("someone@example.com"),
    username: String::from("username123"),
    active: true,
    sign_in_count: 1,
};

user1.email = String::from("anotheremail@example.com");
```

インスタンス自体を可変にしているため、一部のフィールドのみを可変にすることはできません。

また、あらゆる式同様、構造体の新規インスタンスを関数本体の最後の式として生成して、そのインスタンスを返すことができます。

```rs:title=インスタンスを返す関数
fn build_user(email: String, username: String) -> User {
    User {
        email: email,
        username: username,
        active: true,
        sign_in_count: 1,
    }
}
```

### フィールド初期化省略記法

JavaScript のオブジェクト生成と同じように、関数の仮引数名と構造体のフィールド名が全く同じな場合、**フィールド初期化省略記法**が使えます。

以下のコードのように `email` と `username` を繰り返し記述する必要がなくなります。

```rs:title=フィールド初期化省略記法
fn build_user(email: String, username: String) -> User {
    User {
        email,
        username,
        active: true,
        sign_in_count: 1,
    }
}
```

### 構造体更新記法

JavaScript のオブジェクト生成と同じように、前のインスタンスの値を使用しつつ、変更する箇所もある形で新しいインスタンスを生成できます。

まず、更新記法なしの場合で新しい `User` インスタンスを生成する方法を示します。

`email` と `username` には新しい値をセットしていますが、それ以外には `user1` の値を使用しています。

```rs:title=構造体更新記法なし
let user1 = User {
    email: String::from("someone@example.com"),
    username: String::from("username123"),
    active: true,
    sign_in_count: 1,
};

let user2 = User {
    email: String::from("another@example.com"),
    username: String::from("anotherusername567"),
    active: user1.active,
    sign_in_count: user1.sign_in_count,
};
```

`..` という記法で構造体更新記法を使用すると、明示的にセットされていない残りのフィールドが、与えられたインスタンスのフィールドと同じ値になるように指定します。

```rs:title=構造体更新記法あり
let user2 = User {
    email: String::from("another@example.com"),
    username: String::from("anotherusername567"),
    ..user1
};
```

## Rust でのオブジェクト指向プログラミング

Rust には**構造体はありますが、クラスはありません。**

しかし、 Rust でのオブジェクト指向プログラミングを可能にするための機能がいくつか実装されています。

### メソッド記法

メソッドは `impl` ブロック上で構造体に対して定義されます。

最初の引数は必ず `self` になり、これはメソッドが呼び出されている構造体インスタンスを表します。

以下のコードでは `Rectangle` 構造体上に `area` メソッドを定義しています。

```rs:title=メソッド記法
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }

    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}

fn main() {
    let rect1 = Rectangle { width: 30, height: 50 };

    println!("The area of the rectangle is {} square pixels.", rect1.area());
}
```

### 関連関数

`impl` ブロック内に `self` を引数に取らない関数を定義できます。

これは構造体に関連付けられているため、関連関数と呼ばれます。

関連関数は関数であり、メソッドではありません。というのも、対象となる構造体のインスタンスが存在しないからです。これまで利用してきた `String::from` が関連関数にあたります。

関連関数は、構造体の新規インスタンスを返すコンストラクタによく使用されます。

例えば、以下のコードのように、正方形の `Rectangle` を生成できます。

```rs:title=正方形を生成する関連関数
impl Rectangle {
    fn square(size: u32) -> Rectangle {
        Rectangle { width: size, height: size }
    }
}
```

関連関数を呼び出すためには、 `String::from` のように構造体名と一緒に `::` 記法を使用します。

### 複数の impl ブロック

複数の `impl` ブロックを存在させることができます。

```rs:title=複数のimplブロック
impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

impl Rectangle {
    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}
```

複数の `impl` ブロックが有用になるケースについては後ほど学ぶトレイトで触れます。

## 参考サイト

- [The Rust Programming Language 日本語版 - The Rust Programming Language 日本語版](https://doc.rust-jp.rs/book-ja/title-page.html)

## まとめ

今回は Rust の構造体について勉強しました。

次回は Rust の列挙体について勉強していきます。

それではまた、別の記事でお会いしましょう。