---
title: Raspberry Pi で Rust を試す (Raspberry Pi OS buster)
date: 2020-07-08
author: kenzauros
tags: [Raspberry Pi, Rust, その他の技術]
---

## 前提条件

先行記事 ([Raspberry Pi Imager を使って Raspberry Pi OS をインストールする](https://mseeeen.msen.jp/install-raspberry-pi-os-with-raspberry-pi-imager)) でインストールを終えた状態を想定します。

- Raspberry Pi 3 Model B V1.2
- [Raspberry Pi OS (32-bit) Lite (2020-05-27-raspios-buster-lite-armhf)](https://www.raspberrypi.org/downloads/raspberry-pi-os/)

## Rust のインストール

### rustup インストール

```sh
$ curl https://sh.rustup.rs -sSf | sh

1) Proceed with installation (default)
2) Customize installation
3) Cancel installation
>1

  stable installed - rustc 1.44.1 (c7087fe00 2020-06-17)

Rust is installed now. Great!
```

### 環境変数読み込み・バージョン確認

```sh
$ source $HOME/.cargo/env

$ rustc --version
rustc 1.44.1 (c7087fe00 2020-06-17)
$ cargo --version
cargo 1.44.1 (88ba85757 2020-06-11)
```

### libssl-dev インストール

```sh
$ sudo apt install -y libssl-dev
```

### cargo edit インストール

```sh
$ cargo install cargo-edit
```

Raspberry Pi 3 だと結構時間がかかります。

### cargo make インストール

ソースを落としてくるために git をインストールします。 (インストールされていない場合)

```sh
$ sudo apt install -y git
```

cargo make をインストールします。

```sh
$ git clone https://github.com/sagiegurari/cargo-make.git
$ cd cargo-make
$ cargo install --force cargo-make
```

こちらも Raspberry Pi 3 だと結構時間がかかります。

### rust を最新版に更新

rust を最新版に更新するときは下記のコマンドを実行します。最新版をインストールした直後は不要です。

```sh
$ rustup update
```

## Hello, world

なにはともあれ Hello, world です。

適当にフォルダを作って、適当にソースファイルを作ります。 Rust の拡張子は `.rs` です。


```sh
$ mkdir ~/hello_world
$ cd ~/hello_world
$ vim main.rs
```

`main.rs` に `main` 関数を書きましょう。

```rs
fn main() {
    // 世界よ、こんにちは
    println!("Hello, world!");
}
```

早速 `rustc` でコンパイルします。

```sh
$ rustc main.rs
$ ./main
Hello, world!
```

無事 `Hello, world!` が表示されれば成功です。お疲れ様でした。