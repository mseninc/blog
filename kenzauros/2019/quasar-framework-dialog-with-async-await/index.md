---
title: Quasar (Vue.js) でダイアログを async/await 化する
date: 2019-06-28
author: kenzauros
tags: [Vue.js, Quasar Framework, Promise, async/await, Web]
---

**Quasar (v1)** でダイアログを表示する **Dialog Plugin** を Promise 化して **async/await** で扱えるようにする方法を紹介します。

## 前提条件

- Quasar v1.0.0
- Vue.js と Quasar をそれなりに使えて Promise と async/await がわかる読者

## モチベーション

Quasar でダイアログを表示するにはいくつか方法はありますが、ダイアログはプログラムから呼び出すほうが多いと思いますので、下記の **Dialog Plugin** が重宝です。

> [Dialog Plugin | Quasar Framework](https://quasar.dev/quasar-plugins/dialog#Dialog-API)

このプラグインを入れた状態だと下記のように書くことで、いわゆるモーダルダイアログを表示することができます。

```js
this.$q.dialog({
  message: 'ほげほげ',
}).onOk(() => {
  console.log('OK');
}).onCancel(() => {
  console.log('キャンセル');
}).onDismiss(() => {
  console.log('ダイアログ外クリックで閉じられたとき');
});
```

ところが、この書き方は Promise っぽいのに、 `dialog` が返すオブジェクトは Promise ではありません。

これのなにが嫌かというと、ダイアログの結果を受けて次のダイアログを表示するような処理の場合、下記のように**どんどんネストが深くなってしまう**ことです。

```js
this.$q.dialog({ message: 'ほげほげしますか？', cancel: true })
.onOk(() => {
  this.$q.dialog({ message: '本当に？', cancel: true })
  .onOk(() => {
    this.$q.dialog({ message: 'まじで？', cancel: true })
    .onOk(() => {
      // OK なときの処理
    });
  });
});
```

ダイアログがこういったコールバック系の実装になってしまうのは**「ユーザーの入力」という非同期的なものを扱っているから**です。

なんとかして同期的に書いてさっぱりしたいものです。

## Promise でラップしたものを boot で読み込ませる

というわけで、 async/await で同期的に書くために Promise でラップします。

```js
export default async ({ Vue }) => {
  Vue.prototype.$dialog = params => new Promise((resolve) => {
    Vue.prototype.$q.dialog({
      ...params,
    }).onOk((data) => {
      resolve(data || true);
    }).onCancel(() => {
      resolve(false);
    }).onDismiss(() => {
      resolve(false);
    });
  });
};
```

上記のような JS ファイルを作り、 **`src/boot/async-dialog.js`** に配置します。 (ファイル名はなんでもかまいません)

その上で **`quasar.conf.js` の `boot`** にこのファイル名を追加します。

```js
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
      'i18n',
      'axios',
      'async-dialog',
    ],
```

これでコンポーネントファイルからは `this.$dialog` でこのラップしたダイアログ関数が参照できます。

```js
if (!await this.$dialog({ message: 'ほげほげしますか？', cancel: true }) return;
if (!await this.$dialog({ message: '本当に？', cancel: true }) return;
if (!await this.$dialog({ message: 'まじで？', cancel: true }) return;
// OK なときの処理
```

これでだいぶすっきりしましたね。

## 今回の実装のポイント

```js
export default async ({ Vue }) => {
  Vue.prototype.$dialog = params => new Promise((resolve) => {
    Vue.prototype.$q.dialog({
      ...params,
    }).onOk((data) => {
      resolve(data || true);
    }).onCancel(() => {
      resolve(false);
    }).onDismiss(() => {
      resolve(false);
    });
  });
};
```

非常にシンプルですが、今回の実装では Promise の **`reject`** は呼んでいません。

これはダイアログが**キャンセルされたりクローズされたりすることは例外ではない**と考えたからです。これらもあくまでユーザー入力の一つであるため、戻り値として表すのが適切と考え、 Cancel/Dismiss の場合は `false` を返しています。

これにより**このダイアログ呼び出しは try-catch 句が必要ありません**。

ちなみに OK のとき `data || true` としているのは、**ダイアログが Prompt モード (文字列入力できるモード) のときに入力文字列を返す**ようにしているためです。

## v0.17 時代は Promise だった

余談ですが、実は Quasar Framework v0.17 の時代は `this.$q.dialog()` が返すのは Promise でした。

> [Dialog - Quasar Framework](https://v0-17.quasar-framework.org/components/dialog.html)

このため、公式リファレンスでも async/await を使った使用方法が紹介されています。

なぜ v1 で Promise でなくなったかは不明ですが、おそらく `Dismiss` のような第 3 の状態を表せないからでしょう。