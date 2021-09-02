---
title: Raspberry Pi 2 の Node.js で node-serialport がインストールできない
date: 2016-06-13
author: kenzauros
tags: [Node.js, Raspberry Pi, Web]
---

Raspberry Pi の Raspbian 上の Node.js でシリアル通信を行うため node-serialport をインストールする際、エラーがでてうまくいきませんので、その解決法を紹介します。

## 症状

エラー内容の一部はこんな感じ

```
node-pre-gyp ERR! cwd /home/pi/node_modules/serialport
node-pre-gyp ERR! node -v v0.12.6
node-pre-gyp ERR! node-pre-gyp -v v0.6.13
node-pre-gyp ERR! not ok
Failed to execute '/usr/local/bin/node /usr/local/lib/node_modules/npm/node_modu les/node-gyp/bin/node-gyp.js configure --fallback-to-build --module=/home/pi/nod e_modules/serialport/build/Release/node-v14-linux-arm/serialport.node --module_n ame=serialport --module_path=/home/pi/node_modules/serialport/build/Release/node -v14-linux-arm' (1)
npm ERR! Linux 4.1.13-v7+
npm ERR! argv "/usr/local/bin/node" "/usr/local/bin/npm" "install" "serialport"
npm ERR! node v0.12.6
npm ERR! npm v2.11.2
npm ERR! code ELIFECYCLE
```

とりあえずググってみるとやはり先人でも困っている人がいました。

* [failed to install node-serialport on Raspberry Pi2 · Issue #649 · EmergingTechnologyAdvisors/node-serialport](https://github.com/EmergingTechnologyAdvisors/node-serialport/issues/649)

コメントの中に

> I eventually fixed my installation problems after upgrading g++/gcc version to 4.8.

との記述を見つけました。

**gcc と g++ が古い** だけなようなので、アップデートしてみます。

## gcc と g++ のアップデート

こちらは下記のページを参考にしてコマンドをたたくだけでした。

* [Raspberry Pi 2 に Raspbian を入れた時にやっておいた方が良いことをまとめた - しばやん雑記](http://blog.shibayan.jp/entry/20150228/1425121187)

```bash
sudo apt-get install gcc-4.8 g++-4.8

sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.6 20
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.8 50

sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-4.6 20
sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-4.8 50
```

無事 `npm i serialport` が通りました。