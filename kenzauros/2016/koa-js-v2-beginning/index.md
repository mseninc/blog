---
title: Koa.js v2 入門 1 (async/await を使ったNode.jsの新しいWeb開発)
date: 2016-09-09
author: kenzauros
tags: [JavaScript, Node.js, Koa.js, ES2015(ES6), ES2017, Web]
---

こんにちは！最近 Express から **[Koa.js](https://github.com/koajs/koa)** に乗り換え中です。

Web にも情報が少ないので、ちょっとずつ Koa のことを紹介していきたいと思います。

## Koa.js とは

このページを見る方はすでにご存知とは思いますが、**[Koa.js](https://github.com/koajs/koa) は Node.js の軽量 Web フレームワーク**です。

かの有名な Express.js を作った [tj (TJ Holowaychuk)](https://github.com/tj) さんが開発者なので、雰囲気もよく似ています。

リリースから割と時間がたっている割には情報の多さで Express に遠く及びませんが、これからまだ広がりを見せそうなフレームワークだと思います。

## なぜ Koa.js か

ではなぜ、情報も多くいい意味で枯れている Express があるのに Koa に乗り換える必要があるのでしょうか。

ざっくり言えば、Express より新しいからです。

というのも ECMAScript 2015 (ES6) 以降、どんどんモダンで素敵な機能が策定され、もはや少し前の JavaScript とは隔世の感があります。

**ES2015 で導入された generator 、ES2017 で導入予定の async/await など、特に Node で不可欠な非同期系の機能が進化しています。**

ECMAScript の提案の採択状況については、下記を参照してください。Koa v2 のアドバンテージにつながる Async Functions は 2016 年 6 月の段階で Finished になっており、 2017 年にリリースされます。

* [proposals/finished-proposals.md at master · tc39/proposals](https://github.com/tc39/proposals/blob/master/finished-proposals.md)
* [babel-preset-es2017](https://www.npmjs.com/package/babel-preset-es2017)

Express は Node 0.10 など古いバージョンもサポートするため、今のところ普通に実装するとこれらの新機能の恩恵を受けることができません。

ということで**デフォルトで generator/async/await に対応する Koa に乗り換えたらいいんじゃね？**というわけです。

ではもう少し設計思想の観点から Koa と Express の違いを見ていきましょう。

## Koa と Express

Koa の公式ページに Koa と Express の比較があり、その設計思想について述べられています。同じ設計者だからこそできることですね、かっこいい。

以下、Koa の思想を理解するために [koa-vs-express](https://github.com/koajs/koa/blob/v2.x/docs/koa-vs-express.md) を意訳してみました。

> \# Koa vs Express
>
> Philosophically, Koa aims to "fix and replace node", whereas Express "augments node". Koa uses co to rid apps of callback hell and simplify error handling. It exposes its own this.request and this.response objects instead of node's req and res objects.

Express が "node を増強する" ものであるのに対し、 **Koa は "node を修正し、置き換える" こと**を目的としています。 Koa は co を利用して、アプリをコールバック地獄から解放し、エラーハンドリングを簡潔にします。 node の req/res オブジェクトの代わりに　this.request/this.response オブジェクトを提供します。

> Express, on the other hand, augments node's req and res objects with additional properties and methods and includes many other "framework" features, such as routing and templating, which Koa does not.
> Thus, Koa can be viewed as an abstraction of node.js's http modules, where as Express is an application framework for node.js.

一方、 Express は req/res オブジェクトを追加のプロパティやメソッドで増強し、 ルーティングやテンプレートなどの多くの "フレームワーク" としての機能を含んでいます。そのため Express が一つのアプリケーションフレームワークに見えるのに対し、 Koa は node の HTTP モジュールを抽象化したものに見えるかもしれません。

> Thus, if you'd like to be closer to node.js and traditional node.js-style coding, you probably want to stick to Connect/Express or similar frameworks. If you want to get rid of callbacks, use Koa.

もしあなたが伝統的な node.js 風のコーディングにこだわるのであれば、 Connect や Express のようなフレームワークを使い続けたいと思うでしょう。反対に、**もしコールバックからオサラバしたいと思うのであれば、 Koa を使いましょう。**

> As result of this different philosophy is that traditional node.js "middleware", i.e. functions of the form (req, res, next), are incompatible with Koa. Your application will essentially have to be rewritten from the ground, up.

この思想の違いにより、(req, res, next) 形式の伝統的なミドルウェアは Koa では使えません。**基本的には既存アプリケーションは、すべて書き直すことになるでしょう。**

### Koa は Express を置き換えるものか？
> \## Does Koa replace Express?

> It's more like Connect, but a lot of the Express goodies were moved to the middleware level in Koa to help form a stronger foundation. This makes middleware more enjoyable and less error-prone to write, for the entire stack, not just the end application code.

Koa はむしろ Connect に近いですが、 Express のおいしいところの多くはすでに Koa のミドルウェアとして移植されています。これによりアプリのコードだけでなく、すべての階層において、ミドルウェアをさらに楽しく、ミスを起こしにくく書けるようになっています。

> Typically many middleware would re-implement similar features, or even worse incorrectly implement them, when features like signed cookie secrets among others are typically application-specific, not middleware specific.

多くのミドルウェアは同様の機能を再実装し、悪くすれば正しくない実装をしています。とりわけ、署名付き Cookie のような機能はミドルウェア固有ではなく、典型的なアプリケーション固有のものです。

### なぜ Koa = Express 4.0 ではないのか？

> \## Why isn't Koa just Express 4.0?

> Koa is a pretty large departure from what people know about Express, the design is fundamentally much different, so the migration from Express 3.0 to this Express 4.0 would effectively mean rewriting the entire application, so we thought it would be more appropriate to create a new library.

Koa は Express の常識から大きく逸脱しており、その設計は根本的に大きく異なるため、 Express 3～4 から Koa の移行は、実質的にアプリのすべてを書き換えることになるでしょう。だから、むしろ Koa は新しいライブラリを一から作るのに適していると思います。

- - -

以上、なんとなくな意訳でした。

まとめると **Koa は Express とは思想が違うんだぜ！今から新しくアプリ作るなら Koa 使っちゃいなよ！** ということでしたね (?)

## Koa v2

さて Koa のインストールはもちろん npm から行いますが、 `npm i koa`でインストールされるのは v1 です。今年の 3 月に v2 がリリースされており、どうせ今からはじめるならこちらを利用したほうがいいでしょう。

v1 との最大の違いは **async/await に対応** したことです。 generator 関数を意識せずに async/await を使って非同期処理を同期処理のように直感的に書くことができます。

### v2 のインストール

v2 をインストールするには `@2` をつけてバージョンを明示してあげます。

```
npm i -S koa@2
```

### babel のインストール

しかし、肝心の Node のほうが最新の v6 でも async/await にまだ対応していないので (ES2017 のリリースが来年だから仕方ない) 実行するにはトランスパイラである **babel** を介す必要があります。

babel と必要なプラグインをまとめてインストールします。 [babel-preset-es2017](https://www.npmjs.com/package/babel-preset-es2017) は ES2016 と 2017 の機能を含んでいます。

```
npm i -S babel-preset-es2015 babel-preset-es2017
```

`.babelrc` を下記の内容で作成します。

```json
{
  "presets": [
    "es2015",
    "es2017"
  ]
}
```

実行時は `node` コマンドではなく `babel-node` コマンドで実行するようにします。

```
babel-node index.js
```

## サンプルを実行してみる

とりあえず `index.js` を作成して下記をコピペして保存します。

```js
'use strict';

import Koa from 'koa';
const app = new Koa();

// アクセスログ
app.use(async (ctx, next) => {
  const start = new Date;
  await next();
  const ms = new Date - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// エラーハンドリング
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.body = { message: err.message };
    ctx.status = err.status || 500;
    console.log(err);
  }
});

// レスポンスを返す
app.use(async (ctx, next) => {
  ctx.body = 'Hello world!';
});

app.listen(3000);
```

`babel-node index.js` を実行し、 http://localhost:3000/ にアクセスして "Hello world!" が表示されれば OK です。

`app.use` に渡す middleware はすべて async 関数になっています。最後のレスポンスを返す middleware 以外は `await next()` が記述されていています。これによって、次の middleware に制御を移しています。

レスポンスを返す middleware の処理が同期処理なのでまだ async/await のメリットがほとんど感じられませんね(笑)

次回はルーティングについて見ていきます。