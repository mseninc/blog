---
title: "はじめての Rust 入門 Part2 ～関数と制御フローについて学ぶまで～"
date: 
author: linkohta
tags: [Rust]
description: "Rust を実際に触りながら勉強していきます。その２。"
---

link です。

高速でセキュリティ的にも安全な言語として **Rust** が注目を集めています。

今回はそんな Rust の勉強をしていきます。

本記事は [Part1](/rust-introduction-part1) の続きになっています。

## 想定環境

- Windows 11
- Rust 1.72

## 関数

Rust における**関数**について勉強していきます。

Rust の関数名は **スネークケース（`hello_world` のように全文字を小文字にし、単語区切りにアンダースコアを使う）** で命名するのが慣例です。

### 関数の基本

Rust において関数定義は、 `fn` で始まります。

C や Java のように関数名の後に `()` が続き、 `{}` が関数の処理内容を指定します。

```rust:title=関数例
fn main() {
    test_function();
}

fn test_function() {
    println!("テスト");
}
```

関数例では `main()` の後ろで `test_function()` を定義していますが、関数の定義場所はどこでも問題ありません。

どこかで定義されてさえいれば問題ありません。

### 関数の引数

引数付きの関数は `()` 内に型付きの変数を入れます。

```rust:title=引数付きの関数
fn main() {
    test_function(5);
}

fn test_function(x: i32) {
    println!("The value of x is: {}", x);
}
```

実行結果は以下のようになります。

```bash:title=実行結果
$ ./main.exe
The value of x is: 5
```

### 関数の式について

Rust の関数は**文**と**式**から形成されます。

文は**何らかの動作をして値を返さない命令、つまり、変数に代入できないもの**です。

式は**値が評価され、戻り値として返ってくる命令、つまり、変数に代入できるもの**です。

以下にコード例を示します。

```rust:title=文と式
fn main() {
    let x = {
        let y = 3;
        y + 2 // y + 2 (= 5) が評価され、 x に y + 2 の値が代入される
    };

    println!("The value of y is: {}", x);
}
```

Rust では `+-*/%` などの演算以外に関数呼び出し、マクロ呼び出し、新しいスコープを作る際に使用する `{}` も式です。

上の例では `x` に代入している `{}` が式です。
`println!("The value of y is: {}", x);` が文です。

`{}` の中身の文末にあるセミコロンがついていない行に注意してください。

**式は終端にセミコロンを含みません。式の終端にセミコロンを付けたら、文に変えてしまいます。**

**Rust において文は値を返しません。**

### 関数の戻り値

Rust の関数で戻り値を返す時は `->` で型を指定します。

Rust では**関数の戻り値は関数の最後の式の値と同義です。**

`return` でも値を指定できますが、多くの関数は最後の式を暗黙的に返します。

また Rust の関数で戻り値を返さない場合は関数内の処理を実行するだけの文になります。

以下に値を返す関数の例を示します。

```rust:title=戻り値
fn five() -> i32 {
    5
}

fn ex_return() -> i32 {
    return 10;
}

fn main() {
    let x = five();
    let y = ex_return();

    println!("The value of x is: {}", x);
    println!("The value of y is: {}", y);
}
```

`five()` では `let` すら使わずに戻り値の 5 だけが存在しています。

これでも Rust では問題ありません。

**セミコロンがないため、式として成立しています。**

`ex_return()` はセミコロン付きの `return` で値を返しています。

**`return` で戻り値を返す場合はセミコロンがあっても、値自体は返されるため、式になります。**

## 制御フロー

条件が真かどうかによってコードを走らせるかどうかを決定したり、 条件が真の間繰り返しコードを走らせるか決定したりする制御フローについて勉強します。

### if 文

`if` 文は条件に応じて実行するかしないかを判別します。

Rust の `if` 文は `if 条件式 {実行処理}` で書かれます。

他のプログラミング言語のように `else if` で複数の条件に応じて処理内容を変えることや `else` で条件を満たさない場合の処理の指定もできます。

以下に例を示します。

```rust:title=if文
fn main() {
    let number = 3;

    if number < 5 {
        println!("5 未満");
    } else if number <= 10 {
        println!("5 以上 10 以下");
    } else {
        println!("それ以外");
    }
}
```

`if` 文の条件は論理値であればよいため、たとえば `let bool = true` と定義された変数をそのまま条件式に利用できます。

また、 `let` 内で `if` 文を使用できます。

下記の例では `condition` の値に応じて `number` に代入される値が 5 か 6 かが変わります。

```rust:title=let内でif文を使う
fn main() {
    let condition = true;
    let number = if condition { 5 } else { 6 };

    println!("The value of number is: {}", number);
}
```

### loop 文

`loop` 文は `break` で明示的に終了させるまで処理を繰り返し実行させ続けます。

以下にコード例を示します。

```rust:title=loop文
fn main() {
    let mut i = 0;
    loop {
        i += 1;
        if i = 9 {
            break;
        }
    }
    println!("end: {}", i);
}
```

上記の例では `i` に 1 ずつ加算していき、 9 になるとループを終了するようになっています。

また、強制的に次のループに移行させる `continue` も存在します。

ループ内にループがある場合、 **`break` と `continue` は最も内側のループに適用されます。**

**ループラベルを使用することで `break` や `continue` が適用されるループを指定できます。**

以下に例を示します。

```rust:title=ループラベル
fn main() {
    let mut count = 0;
    'counting_up: loop {
        println!("count = {}", count);
        let mut remaining = 10;

        loop {
            println!("remaining = {}", remaining);
            if remaining == 9 {
                break;
            }
            if count == 2 {
                break 'counting_up;
            }
            remaining -= 1;
        }

        count += 1;
    }
    println!("End count = {}", count);
}
```

上記の例では外側のループには `'counting_up` というラベルがついていて、 0 から 2 までカウントアップします。

内側のラベルのないループは 10 から 9 までカウントダウンします。

最初のラベルのない `break` は内側のループを終了させます。

`break 'counting_up;` は外側のループを終了させます。

### while 文

`while` 文は指定した条件が真でなくなった時にループを終了します。

以下の例では 0 になるまでカウントダウンしてループを終了しています。

```rust:title=while文
fn main() {
    let mut number = 3;

    while number != 0 {
        println!("{}", number);

        number -= 1;
    }
    println!("end");
}
```

### for 文

配列を順に取得する必要がある場合、 `for` 文を使ってループさせることができます。

以下の例では配列 `a` から順に値を表示させています。

```rust:title=for文
fn main() {
    let a = [10, 20, 30, 40, 50];

    for element in a {
        println!("the value is: {}", element);
    }
}
```

## 参考サイト

- [The Rust Programming Language 日本語版 - The Rust Programming Language 日本語版](https://doc.rust-jp.rs/book-ja/title-page.html)

## まとめ

今回は関数と制御フローについて勉強しました。

次回は Rust の特徴的な概念である所有権について勉強していきます。

それではまた、別の記事でお会いしましょう。