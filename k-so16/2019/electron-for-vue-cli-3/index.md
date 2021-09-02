---
title: "[Vue.js] Vue CLI 3 で electron-vue の環境を構築する方法"
date: 2019-06-05
author: k-so16
tags: [Vue.js, Electron, Web]
---

こんにちは。最近、 [Beat Saber](http://beatsaber.com/) というVRゲームに興味がある[^VR] k-so16 です。

[以前登壇した v-kansai meetup](https://mseeeen.msen.jp/v-kansai-meetup-6th/) では、[electron-vue](https://github.com/simulatedgreg/electron-vue) を利用したアプリケーションの作成について発表しました。作成当時はVue CLIのバージョンは2.x系で、 Vue CLI 3 が出る前でした。

久々に electron-vue で何か作ろうかなぁと思い、 Vue CLI 3 がインストールされている私の個人用の開発環境[^my-computer]で electron-vue の環境構築をしようとしたところ、環境構築が出来ませんでした。

そこで、Vue CLI 3 で electron-vue の環境構築をする方法を調べてみました。本記事では、Vue CLI 3で electron-vue の環境を構築する方法を紹介します。

本記事で想定する読者層は以下の通りです。

- Vue CLI の基礎的な使い方を知っている
- Vue CLI 3 を利用している

## electron-vue の環境構築手段

### Vue CLI 3 Plugin for Electron を導入する方法
最初に、 Vue CLI でプロジェクトを作成します。

```bash
vue create my-project
```

Vue CLI 3 Plugin for Electron を利用することで、Electron を使えるようになります。

```bash
cd my-project
vue add electron-builder
```

Electron の実行やビルドは `npm` コマンドから実行出来ます。

- 実行
```bash
npm run electron:serve
```

- ビルド
```bash
npm run electron:build
```

ビルドで出来上がった生成物は、`<rootDir>/dist_electron` に出力されます。ここで、 `<rootDir>` はプロジェクトのルートディレクトリを指します。

Vue CLI 3 Plugin for Electron については、以下の記事を参考にさせていただきました。

> [Vue Cli 3 plugin for Electronの導入](https://qiita.com/nullpo24/items/f3f299f1f8cdc82af0c3)


### 2.x 系と同じインストール方法を使用する方法
Vue CLI 3では、 `vue init` が初期状態で使えません。 `vue init` を実行すると、以下のようなメッセージが表示されます。

>  Command vue init requires a global addon to be installed.
   Please run npm install -g @vue/cli-init and try again.

`vue init` をVue CLI 3 で使うために、 `@vue/cli-init` をインストールします。

```bash
npm install @vue/cli-init -g
```

`@vue/cli-init` をインストールすると、Vue CLI 2 でプロジェクトを作成する際に利用した `vue init` と同じように electron-vue の環境構築が出来ます。

```bash
vue init simulatedgreg/electron-vue my-project
cd my-project
npm install
```


## 総括
本記事のまとめです。

- Vue CLI 3 Plugin for Electron を利用して electron-vue の環境を構築
- `@vue/cli-init` をインストールして昔ながらの方法で electron-vue の環境を構築

以上、k-so16でした。良い electron-vue ライフを(笑)

---

## 余談: Vue CLI 2.x 系での electron-vue の環境構築
Vue CLI 2.x 系を利用している方は、 `vue init` コマンドがデフォルトで使用出来ます。環境構築のためのコマンドは以下の通りです。

```bash
vue init simulatedgreg/electron-vue my-project
cd my-project
npm install
```

Vue CLI 3 に `@vue/cli-init` をインストールした後と全く同じ手順ですね。楽勝です（笑）


[^VR]: そもそもVRゴーグルすら持っていないが...
[^my-computer]: macOS か Ubuntu のどちらかだが、忘れた