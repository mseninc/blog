---
title: Rust + rppal で Raspberry Pi の I2C を操作する
date: 2020-07-17
author: kenzauros
tags: [Raspberry Pi, Rust]
---

今回は **Rust を使って Raspberry Pi の I2C 通信**をしてみます。

**rppal** という 非常に高機能なライブラリ (クレート) が開発されているので、これを使うことで比較的簡単に実装できます。

[golemparts/rppal: A Rust library that provides access to the Raspberry Pi's GPIO, I2C, PWM, SPI and UART peripherals.](https://github.com/golemparts/rppal)

## 事前準備

### 想定環境

想定環境は下記 2 つの先行記事にしたがって **Raspberry Pi 3 Model B V1.2 に Raspberry Pi OS (32-bit) Lite をインストールし、初期設定を完了したあと、 Rust がインストールされている状態**とします。

1. [Raspberry Pi Imager を使って Raspberry Pi OS をインストールする (ヘッドレスインストール対応 2020年6月版)](/install-raspberry-pi-os-with-raspberry-pi-imager)
2. [Raspberry Pi で Rust を試す (Raspberry Pi OS buster)](/rust-in-raspberry-pi)

また I2C モジュールとして、 [こちらの BME280 モジュール](https://www.amazon.co.jp/o/ASIN/B07LBCZZNM/) を接続した状態を想定します。

### I2C を有効化

先に **raspi-config を使って Raspberry Pi の I2C を有効化**しておきます。

```bash
$ sudo raspi-config nonint do_i2c 0
$ sudo reboot
```

※ 0で I2C有効、1で I2C無効

i2c がデバイスとして有効化されていることを確認します。

```bash
$ ls -l /dev/i2c*
crw-rw---- 1 root i2c 89, 1  6月 29 10:08 /dev/i2c-1
```

### ツールインストール

i2c-tools をインストールし、 `i2cdetect` コマンドで接続状況を確認します。

```bash
$ sudo apt install -y install i2c-tools

$ sudo i2cdetect -y 1
     0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
00:          -- -- -- -- -- -- -- -- -- -- -- -- -- 
10: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
20: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
30: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
40: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
50: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
60: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
70: -- -- -- -- -- -- 76 --   
```

今回の例では BME280 のアドレス `0x76` が表示されていれば OK です。

## Rust プロジェクトの作成と実行ファイルの生成

### プロジェクトの作成

`cargo new` で新しいプロジェクトを作成します。今回は `rpi2c` というプロジェクト名にしました。

```sh
$ cd ~
$ cargo new rp-i2c --bin
     Created binary (application) `rpi2c` package
```

### クレートの追加

**rppal** Crate をインストールします。

```sh
$ cd rpi2c
$ cargo add rppal@0.11.3
    Updating 'https://github.com/rust-lang/crates.io-index' index
      Adding rppal v0.11.3 to dependencies
```

### Hello, world!

すでに `src/main.rs` が生成されているはずなので、そのまま実行してみます。

```rust
fn main() {
    println!("Hello, world!");
}
```

`src/main.rs` には下記のソースが書かれているので、 `Hello, world!` が表示されれば OK です。

```sh
$ cargo run
    Updating crates.io index
   Compiling libc v0.2.71
   Compiling lazy_static v1.4.0
   Compiling rppal v0.11.3
   Compiling rpi2c v0.1.0 (/home/pi/rpi2c)
    Finished dev [unoptimized + debuginfo] target(s) in 39.68s
     Running `target/debug/rpi2c`
Hello, world!
```

実行ファイルは `target/debug/rpi2c` というファイル名で生成されているはずです。

```sh
$ ls -l ./target/debug/
合計 2696
drwxr-xr-x 4 pi pi    4096  7月  2 16:12 build
drwxr-xr-x 2 pi pi    4096  7月  2 16:12 deps
drwxr-xr-x 2 pi pi    4096  7月  2 16:12 examples
drwxr-xr-x 3 pi pi    4096  7月  2 16:12 incremental
-rwxr-xr-x 2 pi pi 2739404  7月  2 16:12 rpi2c
-rw-r--r-- 1 pi pi      62  7月  2 16:12 rpi2c.d
```

ちなみにリリース版の実行ファイルは `cargo build --release` で生成できます。高速化オプションが有効になるので、高速なバイナリが生成されるはずです。ファイルサイズはほとんど変わりません。

## I2C からのデータの読み取り

### 1バイトのデータを書き込んで1バイトのデータを読み取る

では早速なにかのデータを読み取ってみます。

モジュールの I2C アドレスとレジスターアドレスを調べておきます。今回はモジュールの I2C アドレスを `0x76` 、設定用のレジスターアドレスを `0xF2` 、値を読み取るレジスターアドレスを `0xF7` とします。

#### main.rs

```rust
use rppal::i2c::I2c;

const ADDR_I2C: u16 = 0x76;
const REG_CTRL_HUM: u8 = 0xF2;
const REG_ADC_VALUE: u8 = 0xF7;

fn acquire() -> Result<u8, rppal::i2c::Error> {
    let mut i2c = I2c::new()?;
    i2c.set_slave_address(ADDR_I2C)?;
    i2c.smbus_write_byte(REG_CTRL_HUM, 1u8)?;
    let data: u8 = i2c.smbus_read_byte(REG_ADC_VALUE)?;
    Ok(data)
}

fn main() {
    let result = acquire();
    match result {
        Ok(v) => println!("First byte: {}", v),
        Err(e) => println!("Error: {}", e),
    };
}
```

いろいろ端折っていますが、プログラムはこんな感じになります。

`main` がエントリポイントで `acquire` 関数を呼び出し、その結果によって出力を変化させています。成功の場合は読み取った値が表示されるはずです。

### 各行の簡単な説明

以下、それぞれの行を簡単に説明します。

```rust
use rppal::i2c::I2c;
```

`I2c` 構造体を使うために `use` しておきます。

```rust
const ADDR_I2C: u16 = 0x76;
const REG_CTRL_HUM: u8 = 0xF2;
const REG_ADC_VALUE: u8 = 0xF7;
```

モジュールのアドレスやレジスターアドレスの定数を定義しているだけです。

```rust
let mut i2c = I2c::new()?;
```

`I2c` 構造体をインスタンス化します。

ここからメソッド呼び出しに `?` がついているのは `I2c` **構造体のメソッドはすべて `Result<T, rppal::i2c::Error>` を返す**ためです。 `?` 演算子によって成功の場合は結果を取得し、逆にエラーの場合は即時中断するようにしています。

```rust
i2c.set_slave_address(ADDR_I2C)?;
```

通信先のスレーブ (モジュール) を指定するため、アドレスを設定します。

```rust
i2c.smbus_write_byte(REG_CTRL_HUM, 1u8)?;
```

指定したレジスターアドレスに 1 バイトのデータを書き込みます。ここでは `u8` (= unsigned 8-bit integer) の `1` を書き込んでいます。

```rust
let data: u8 = i2c.smbus_read_byte(REG_ADC_VALUE)?;
```

今度は逆に指定したレジスターアドレスから 1 バイトのデータを読み取ります。

```rust
Ok(data)
```

読み取ったデータを呼び出し元に成功として返します。

### 実行してみる

`cargo run` で実行してみましょう。

下記のように 1 バイトのデータが出力されれば成功です。

```sh
$ cargo run
   Compiling rpi2c v0.1.0 (/home/pi/rpi2c)
    Finished dev [unoptimized + debuginfo] target(s) in 3.42s
     Running `target/debug/rpi2c`
First byte: 128
```

あとはループでいろいろなレジスターアドレスの値を読み取ったり、読み取った値をごにょごにょすれば Rust での I2C ライフがあなたのものです。

まぁ正直これぐらいのレベルなら Python のほうがはるかに楽ですが、 Rust にはバイナリが生成できるという大きなメリットと高速性があります。がんばりましょう！
