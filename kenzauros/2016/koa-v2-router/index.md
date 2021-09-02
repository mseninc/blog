---
title: Koa.js v2 入門 2 ルーティング (koa-route/koa-router)
date: 2016-09-13
author: kenzauros
tags: [JavaScript, Node.js, Koa.js, ES2015(ES6), ES2017, Web]
---

最近 Express.js から [Koa.js](https://github.com/koajs/koa) に乗り換えました。

前回の記事 ([Koa.js v2 入門 1 (async/await を使ったNode.jsの新しいWeb開発)](https://mseeeen.msen.jp/koa-js-v2-beginning)) では Koa v2 の思想と最初のステップを見てきました。

今回は middleware のうち、たいていのアプリに不可欠なルーティング機能です。

## ミドルウェアの一覧を確認

ルーティング用のミドルウェアの一覧は [Middleware - Routing and Mounting](https://github.com/koajs/koa/wiki#routing-and-mounting) に列挙されています。

Koa v2 に対応したもの (Supports v2 にチェックがあるもの) を見ていくと **koa-route** と **koa-router** が使えそうです。いずれも Web 上のサンプルで見たことのあるやつです。

どちらも Koa v2 に対応していて、名前がややこしいこの 2 種類のライブラリ。一体どっちを使うのがいいんだ？！と思ったので、調べました。

結論からいうと**どっちでも問題ないけど koa-router を使っとけ**って感じです。

## koa-route

[koa-route (next ブランチ Koa v2 対応版)](https://github.com/koajs/route/tree/next)

* [koajs](https://github.com/koajs) の公式ルーター。かなりシンプル。
* Koa v2 対応

### インストール

Koa v2 で使うには今のところ next ブランチのバージョンをインストールする必要があります。
`npm install` するときに `@next` を指定します。

```
npm i -S koa-route@next
```

### 簡単な使い方

koa-route のほうは公式ページで変数を _ と宣言してあるのでこれがお作法のようです。

```
import Koa from 'koa';
import _ from 'koa-route';
const app = new Koa();

app.use(_.get('/users/:id', (ctx, id) => {
  ctx.body = id;
}));
```

ルーティング部分はなんだかちょっと見にくい気がします。

## koa-router

[koa-router (master ブランチ Koa v2 対応版)](https://github.com/alexmingoia/koa-router/tree/master/)

* [alexmingoia](https://github.com/alexmingoia) さん作
* だいたいのことはできるらしい

### インストール

koa-route と同じく Koa v2 で使うには `@next` を指定してインストールします。

```
npm i -S koa-router@next
```

### 簡単な使い方

```
import Koa from 'koa';
import Router from 'koa-router';
const app = new Koa();
const router = Router();

router.get('/users/:id', function (ctx, next) {
  ctx.body = ctx.params['id'];
});

app.use(router.routes())
app.use(router.allowedMethods())
```

### koa-route との違い
* require/import したあと、関数呼び出しをしておく必要がある。
* `router.get` などで生成したルーティングを `app.use(router.routes())` でまとめて設定できる。
* URL パラメーター (サンプルの :id) は ctx.params で取得する (Express と似てる)

## まとめ

* koa-route の Readme には "フル装備のルーターが欲しければ、 koa-router をチェキラ！" と書かれているので、こちらはあくまでシンプルな実装にとどめるらしい。
* ダウンロード数は koa-router のほうが一桁多く、できることも多い。
* とりあえず koa-router を使っておけば問題なさそう。