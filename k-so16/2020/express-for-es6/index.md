---
title: "[Node.js] Express のプログラムを ES6 の構文で記述する方法"
date: 2020-10-08
author: k-so16
tags: [Node.js, ES2015(ES6), Express, Web]
---

こんにちは。最近、初めてクッキーづくりに挑戦した k-so16 です。思った以上に難しくて失敗しましたが、最終的になんとか食べられるものになって一安心しました(笑)

業務で **[Express](https://expressjs.com/)** を使ってサーバーサイドのプログラムを構築しているのですが、フロントエンドでは **[Nuxt.js](https://nuxtjs.org/)** で開発を進めており、フロントエンドとサーバーサイドで構文を **[ECMAScript 2015](http://www.ecma-international.org/ecma-262/6.0/)** (以下 **ES6** と表記) で統一したいと思いました。 Express のプログラムは **[Node.js](https://nodejs.org/)** 上で動作させるので、基本的に **CommonJS** の構文で記述するのですが、 **ES6 の構文で記述する方法** がないか調べてみました。

本記事では、 **Express のプログラムを ES6 の構文で記述する方法** を紹介します。

本記事で想定する読者層は以下の通りです。

- Node.js の基礎知識を有している
- CommonJS と ES6 の構文について基礎的な知識を有している

## Babel を利用する方法

**[Babel](https://babeljs.io/)** という JavaScript の変換ライブラリには、 ES6 で記述されたプログラムを Node.js 上で動作させるためのパッケージが用意されています。 Babel のパッケージ **`@babel/node`** をインストールすることで、 **`babel-node`** コマンドが利用できるようになります。

ES6 の構文で記述された Express のプログラムを `babel-node` コマンドで実行することで実行します。

### Babel のインストール

ES6 を利用するための Babel のパッケージのインストールコマンドは以下の通りです。

- `yarn` を利用する場合

    ```bash
    yarn add @babel/core @babel/node @babel/preset-env -D
    ```

- `npm` を利用する場合

    ```bash
    npm install @baberl/core @babel/node @babel/preset-env -D
    ```

### 設定ファイルの作成

Babel をインストールしたら、 Babel の設定ファイルを記述します。 Babel の設定は **`.babelrc`** というファイルに記述します。今回は `presets` に先ほどインストールした **`@babel/preset-env`** を指定します。

設定ファイルの記述例は以下の通りです。

```
{
  "presets": [
    "@babel/preset-env"
  ]
}
```

### プログラムの実行

先ほども記述した通り、 ES6 で記述された Express のプログラムを **`babel-node`** コマンドを利用して実行します。

例えば、以下のような ES6 の構文で記述されたプログラムを `app.js` というファイル名で保存したとします。

```js
import express from 'express';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true });

app.get('/', (req, res) => {
  res.json([
    { message: 'Hello, World' },
  ]);
});

app.listen(3000, () => console.log('Hello!'));
```

このプログラムを Node.js で動かすには、以下のように `babel-node` コマンドの引数に `app.js` を指定して実行するだけです。

```bash
babel-node app.js
```

ただし、グローバルインストールをしない限り `babel-node` にパスが通っていないので、 `package.json` の `scripts` などにコマンドを指定し、 `yarn` や `npm` 経由で実行すると良いでしょう。

プログラムを実行し、ブラウザなどで `localhost:3000` にアクセスすると、以下の JSON がレスポンスとして返ってきます。

```json
[
  { "message": "Hello, World" }
]
```

## package.json で設定する方法

Node.js の v12 から `package.json` の **`type`** に **`module`** を指定すると **Babel などのライブラリをインストールせずに ES6 の構文で書かれたプログラムを Node.js で実行** できるようになります。

`package.json` への指定の例は以下の通りです。

```json
{
  "type": "module",
  以下省略
}
```

プログラムを実行する際は、通常の Node.js のプログラムと同様に `node` コマンドを利用して実行します。

```bash
node app.js
```

注意点として、執筆時点の最新バージョン (v14.11.0) では、この機能は **実験段階** のようです。ご利用は計画的に(笑)

本記事を執筆する上で、以下の記事を参考にしました。

> - [Node.js + Express で ES6を使う - Qiita](https://qiita.com/quzq/items/b7c2a20cfa3c16f4468b)
> - [Node.js v12のES Modulesと、Babel/TypeScriptの対応について - Qiita](https://qiita.com/shimataro999/items/8a63ec06f33ccd2ea9ca)

## まとめ

本記事のまとめは以下の通りです。

- ES6 の構文で記述した Express の実行方法を紹介
    - Babel を利用する方法
    - `package.json` の `type` に `module` を指定する方法

以上、 k-so16 でした。 JavaScript って難しいですね(笑)