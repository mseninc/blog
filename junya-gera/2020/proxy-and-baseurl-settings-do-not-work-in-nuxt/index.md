---
title: Nuxt.js の @nuxtjs/axios で proxy と baseURL の設定ができないときの対処法
date: 2020-10-14
author: junya-gera
tags: [Nuxt.js, axios, Web]
---

こんにちは。じゅんじゅんです。9月からバックエンドに Node.js(Express)、フロントエンドに Nuxt.js を使用したシステム開発を行っています。

**Nuxt のモジュールである `@nuxtjs/axios` の `proxy` と `baseURL` の設定を行った際、 Nuxt の仕様によるエラーが発生しました。**今回はそのエラーが発生するまでの設定の流れと、エラーの解決法をご紹介します。

## proxy の設定を記述
まず `@nuxtjs/axios` を有効にするため、`nuxt.config.js` に設定を記述します。

```
modules: [
  '@nuxtjs/axios',
],
```

次に `axios` と `proxy` の設定を追加します。
```
modules: [
  '@nuxtjs/axios',
],

axios: { proxy: true },
proxy: { "/api/": { target: 'http://localhost:9001' } },
```
この記述により、`/api/**` にアクセスするときの向け先を`'http://localhost:9001'`に変更します。

## baseURL の設定を記述するとエラー発生

今回 `axios` を用いて呼び出す API はこちらです。

```
this.item = await this.$axios.$get('/api/items/${this.$route.params.id}');
```
これはアイテムの詳細情報を取得する API です。API を呼び出す度にこの URL を記述する必要があるので、共通部分を省略するために URL の '/api' の部分を省略できるようにしましょう。 `axios` に `baseURL` の設定を追加します。

```
axios: {
  proxy: true,
  baseURL: '/api',
},
proxy: { "/api/": { target: 'http://localhost:9001' } },
```

こうすることで `$axios.$get('/items/${this.$route.params.id}')` でリクエストできると思いきや、 HTML が返ってきてしまいます。
```
[Vue warn]: Invalid prop: type check failed for prop "organizations". Expected Array, got String with value "<!doctype html>
<html >
  <head >
    <title>サンプルアプリ</title><meta data-n-head="1" charset="utf-8"><meta data-n-head="1" name="viewport" content="width=device-width, initial-scale=1"><meta data-n-head="1" data-hid="description" name="description" content="## Build Setup"><link data-n-head="1" rel="icon" type="image/x-icon" href="/favicon.ico"><link rel="preload" href="/_nuxt/runtime.js" as="script"><link rel="preload" href="/_nuxt/vendors/commons.js" as="script"><link rel="preload" href="/_nuxt/vendors/app.js" as="script"><link rel="preload" href="/_nuxt/app.js" as="script">
  </head>
```

親コンポーネントの `<nuxt-child :item="data" />` から子コンポーネントの `props` にうまくアイテムのデータが送られていません。

## エラーの解決法
原因を調べた結果、 `Axios Module` の公式ドキュメントに以下のような記述がありました。

> 警告: baseURL と proxy を同時に使用することはできないため、 proxy オプションを使用している場合は、 baseURL の代わりに prefix を定義する必要があります。

> - [Options - Axios Module](https://axios.nuxtjs.org/options#baseurl)

ということなので、 `baseURL` の部分を `prefix` に書き換えてみます。

```
axios: {
  proxy: true,
  prefix: '/api',
},
proxy: { '/api/': { target: 'http://localhost:9001' } },
```

こうすることで、無事 `$axios.$get('/items/${this.$route.params.id}')` でリクエストを送信することができました。

ちなみに、この `prefix` 、そして `host` 、`port` というオプションは baseURL のデフォルト値として扱われ、 `API_PREFIX` 、 `API_HOST` 、 `API_PORT` という環境変数を利用することで設定することができます。

```
axios: {
  prefix: process.env.API_PREFIX,
  host: process.env.API_HOST,
  port: process.env.API_PORT,
}
```

## 感想
今回のエラーに限らず、このシステム開発の中であらゆるエラーと直面しましたが、どのエラーも公式ドキュメントをしっかり読めば解決することばかりでした。英語から目をそらさずに一次ソースをちゃんと読む癖をつけることができれば、エラーの解決や情報収集が効率化でき、開発スピードの向上に繋がると思いました。

