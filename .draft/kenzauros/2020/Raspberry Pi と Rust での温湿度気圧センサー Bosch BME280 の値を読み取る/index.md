---
title: Raspberry Pi と Rust での温湿度気圧センサー Bosch BME280 の値を読み取る
date: 2020-07-08
author: kenzauros
tags: [その他]
---



[mseninc/rp-bme280-rust: Environmental data reader on Raspberry Pi powered by BME280](https://github.com/mseninc/rp-bme280-rust)


## 事前準備

### 想定環境

想定環境は下記 2 つの先行記事にしたがって **Raspberry Pi 3 Model B V1.2 に Raspberry Pi OS (32-bit) Lite をインストールし、初期設定を完了したあと、 Rust がインストールされている状態**とします。

1. [Raspberry Pi Imager を使って Raspberry Pi OS をインストールする (ヘッドレスインストール対応 2020年6月版)](/install-raspberry-pi-os-with-raspberry-pi-imager)
2. [Raspberry Pi で Rust を試す (Raspberry Pi OS buster)](/rust-in-raspberry-pi)

また I2C モジュールとして、 [こちらの BME280 モジュール](https://www.amazon.co.jp/o/ASIN/B07LBCZZNM/) を接続した状態を想定します。