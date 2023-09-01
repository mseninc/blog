---
title: "[Node.js] Sequelize のモデルを ES6 の構文で記述する方法"
date: 2020-10-23
author: k-so16
tags: [Node.js, ES2015(ES6), Sequelize, Web]
---

こんにちは。最近、初めてグラタンづくりに挑戦した k-so16 です。今回は調理にほぼ失敗することなく、割と上手に調理できました(笑)

[前回の記事](/express-for-es6) で **Express のプログラムを ES6 の構文で記述** したので、 **[Sequelize](https://sequelize.org/)** のプログラムについても **同様に ES6 の構文で統一したい** と思いました。そこで、 Sequelize についても ES6 の構文でプログラムを記述する方法を調べてみました。

本記事では、 **Sequelize のモデルを ES6 の構文で記述する方法** を紹介します。なお、本記事では Node.js のパッケージマネージャーに **[Yarn](https://classic.yarnpkg.com/lang/en/)** を、データベースに **[MySQL](https://www.mysql.com/)** を利用することを想定しています。

本記事で想定する読者層は以下の通りです。

- Node.js の基礎知識を有している
- CommonJS と ES6 の構文について基礎的な知識を有している
- Sequelize の基礎的な使い方を知っている

## CommonJS と ES6 の文法の比較

本題に入る前に、 CommonJS と ES Module の違いを確認しておきます。

まず、 CommonJS は、 **`require()`** を用いてモジュールをインポートする、従来の Node.js の書き方です。 Node.js に慣れている方にとっては親しみ深い書き方ですね。

CommonJS のインポートとエクスポートの例を見てみましょう。以下はインポートとエクスポートそれぞれのソースコード例です。

- CommonJS のモジュールのインポート

    ```js
    const Food = require('./food');
    ```

- CommonJS のモジュールのエクスポート

    ```js
    module.exports = (name, calorie) => {
      return { name, calorie };
    };
    ```

一方で、 ES Module は **`import` 文** を用いてモジュールをインポートする、比較的新しい JavaScript の書き方です。 Vue.js では `import` 文でモジュールをインポートしているので、 ES Module の書き方を採用していることが分かります。

ES Module についてもインポートとエクスポートの例を見てみましょう。ソースコード例は以下の通りです。

- ES Module のモジュールのインポート

    ```js
    import Food from './food';
    ```

- ES Module のモジュールのエクスポート

    ```js
    export default (name, calorie) => {
      return { name, calorie };
    };
    ```

CommonJS も ES Module もどちらも同じ JavaScript なのですが、 **両者の文法が混在すると文法エラーが発生** するので、どちらの構文で書いているか意識する必要があります。特に Express などの **サーバーサイドでは Common JS** で記述し、 Vue.js などの **フロントエンドは ES Module** で記述するといった混沌とした開発環境も考えられるので、 JavaScript に慣れていない人にとっては混乱するかもしれませんね。

## パッケージのインストール

CommonJS と ES Module について確認したところで、 Sequelize を利用するための準備をします。

Sequelize と Sequelize CLI を利用するために、以下のパッケージをインストールします。

- `sequelize`: Sequelize の本体
- `mysql2`: MySQL のドライバ
- `sequelize-cli`: モデルやマイグレーションなどの雛形の作成や DB 操作を行うための CLI ツール
- `sequelize-cli-esm`: ES Module 向けの Sequelize CLI

以下はコマンドのインストール作業例です。

```bash:title=Sequelize&nbsp;とデータベースのドライバーのインストール
yarn add sequelize mysql2
yarn add sequelize-cli sequelize-cli-esm -D
```

なお、本記事執筆時点 (2020 年 10 月現在) の Node.js のバージョンは v14.13.0, `sequelize` パッケージの最新バージョンは 6.3.5, `sequelize-cli` のバージョンは 6.2.0, `sequelize-cli-esm` のバージョンは 5.0.6 です。

## Sequelize でモデルを ES6 で記述する方法

### Sequelize CLI による初期設定

Sequelize CLI を使ってモデルのディレクトリなどを作成します。 Sequelize CLI を利用すると、自動で `models`, `migations` などの ディレクトリや `models/index.js` や `config/config.js` などの雛形のファイルが自動生成されます。

```bash:title=Sequelize&nbsp;の初期化
yarn sequelize-esm init
```

### モデルの作成

例として、以下の構造を持つモデルクラス `User` を作成することを考えます。

|プロパティ名|データ型|
|:--|:--|
|`name`|`String`|
|`username`|`String`|
|`email`|`String`|
|`password`|`String`|

モデルは **ES Module 向けの Sequelize CLI** (`sequelize-cli-esm`) の **`model:generate`** コマンドを利用して作成します。 このコマンドを実行すると、 **`models` ディレクトリにモデルの雛形** が、 **`migrations` ディレクトリにマイグレーションファイルの雛形** がそれぞれ生成されます。なお、 `model:generate` コマンドの引数のうち、 `--name` はモデル名、 `--attributes` はプロパティを指定します。プロパティの指定方法は `プロパティ名:型` の形式で指定します。複数指定するにはカンマで区切ります。

以下は `User` モデルとマイグレーションファイルを自動生成するコマンド例です。 Sequelize CLI の `model:generate` の引数 `--name` はファイル名にも自動で反映されるので、 CLI では小文字で指定し、のちほどモデルファイルを修正することにします。

```bash:title=モデルファイルとマイグレーションファイルの生成
yarn sequelize-esm model:generate --name user --attributes name:string,username:string,email:string,password:string
```

上記のコマンドで `models/user.js` が生成されるのですが、モデル名が `user` と小文字になるので、 `User` に変更します。モデル名を変更するには、 **`sequelize.define()`** の第 1 引数のモデル名を変更します。

```js
const createModel = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    age: DataTypes.INTEGER
  }, {
    underscored: true,
    timestamps: false,
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
export default createModel;
```

Sequelize CLI で生成されるモデルクラスの雛形では、一旦モデルクラスを生成する関数を `createModel` という変数に格納してから関数を `export` していますが、以下のように無名関数を直接 `export` してもよいでしょう。

```js
export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    age: DataTypes.INTEGER
  }, {
    underscored: true,
    timestamps: false,
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
```

### `models/index.js` の編集

モデルクラスを作成したら、 `models` ディレクトリ内に生成された `index.js` を編集します。この `index.js` を Express などの他のプログラムから読み込むことで、 `models` ディレクトリ内に定義されたモデルクラスを利用できるようにします。

以下は `models/index.js` のコード例です。

```js
import { createRequire } from 'module';
import Sequelize from 'sequelize';
import User from './user.js';

const env = process.env.NODE_ENV || 'development';
const require = createRequire(import.meta.url);
const config = require('../config/config.json')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);
const db = {
  User: User(sequelize, Sequelize.DataTypes),
};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

Object.keys(db)
  .forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

export default db;
```

上記のコードでは、まずプロパティ名 `User` に `User` モデルのインスタンスを値として持つオブジェクトを変数 `db` に代入します。そのあと、 `db` の `sequelize` プロパティに `Sequelize` のインスタンスを、 `Sequelize` プロパティに `Sequelize` モジュールを追加します。最後に各モデルに対してリレーションの定義が存在したら、リレーションの紐付けを行います。

雛形のコードとの大きな違いとしては、以下のように `models` ディレクトリのモデルクラスを動的に読み込むのではなく、 **予め `import` 文を用いて静的にモデルを読み込んでいる** ことが挙げられます。

```js
// Sequelize CLI で自動生成される動的なモデルの読み込み処理
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });
```

Sequelize 5　系までは **`Sequelize.import()`** を利用してモデルクラスを読み込んでいたのですが、 Sequelize 6 系から **`import()` メソッドが削除** されました。Sequelize 6 以降は **CommonJS の  `require()` を利用** することを前提としているようです。筆者のように、「なぜ `Sequelize.import()` が `undefined` になってるんだろう?」とならないよう、 **ドキュメントはしっかり読みましょう** (笑)

ES6 で動的にモデルを読み込むために **`import()`** 関数を利用したいところですが `import()` は `Promise` を返すので、 **トップレベルで同期的に読み込むことができません。** また、 `module` パッケージの **`createRequire()`** で生成される `require()` 関数では困ったことに **CommonJS のモジュールしかインポートできない** ようで、 **ES6 で記述されたモデルは読み込めない** ので、動的にモデルを読み込ませることは諦めてモデルクラスを `import` 文で直接読み込ませることにしました。なお、 **JSON ファイルを読み込む** 際には `createRequire` が利用できます。

本節を記述する上で、以下の記事を参考にしました。

> - [Dynamic imports(ダイナミックインポート)](https://ja.javascript.info/modules-dynamic-imports#ref-1386)
> - [Modules: module API | Node.js v14.13.1 Documentation](https://nodejs.org/api/module.html#module_module_createrequire_filename)

## マイグレーションとシーダーについて

Sequelize CLI でモデルクラスを生成すると、 **自動的にマイグレーションファイルも生成されます。** マイグレーションファイルも `sequelize-esm` を用いることで **ES6 の構文の雛形が生成** されるのですが、マイグレーションを実行すると **以下のようなエラーが発生** します。

```
ERROR: Must use import to load ES Module: /path/to/migrations/datetime-create-user.js
require() of ES modules is not supported.
require() of /path/to/migrations/datetime-create-user.js from /path/to/node_modules/sequelize-cli-esm/lib/core/migrator.js is an ES module file as it is a .js file whose nearest parent package.json contains "type": "module" which defines all .js files in that package scope as ES modules.
Instead rename datetime-create-user.js to end in .cjs, change the requiring code to use import(), or remove "type": "module" from /path/to/package.json.
```

おそらく `sequelize-esm` の内部的に `require()` が用いられていて、 `package.json` の `"type": "module"` が設定されていると **ES6 の構文で解釈しようとする** ので、うまく動作しないようです。これは **シーダーについても同様** だったので、マイグレーションとシーダーについてはやむなく ES6 の構文で記述するのではなく、 **CommonJS の構文** で記述することにしました。

せっかくモデルまで ES6 で統一できていたので少し悔しいですが、解決方法が見つからなかったので妥協することにしました。 Babel を利用したら ES6 でマイグレーションやシーダーも記述できるか調べてみたいところです。

マイグレーションとシーダーについては `sequelize-cli-esm` ではなく、**通常の Sequelize CLI** (`sequelize-cli`) を利用すると **CommonJS の構文でコードの雛形を生成** できるので便利です。

## まとめ

本記事のまとめは以下の通りです。

- モデルを ES6 の構文で定義する方法を紹介
    - 雛形の作成には `sequelize-esm` を利用
    - Sequelize 6 系は静的にモデルを読み込む
- マイグレーションとシーダーの記述について説明
    - マイグレーションおよびシーダーは CommonJS の構文で記述する
    - ES6 の構文で記述すると Sequelize CLI が正常に動作しない

以上、 k-so16 でした。 CommonJS と ES6 が早く完全な相互互換になったら良いですね。