---
title: Sequelize で文字コードや Collation を設定する方法
date: 2021-09-06
author: k-so16
tags: [その他]
---

こんにちは。最近、 k-so16 です。

データベースの検索をかける際に、大文字と小文字を区別するかや、濁点、半濁点の有無を区別するかの設定は collation によって設定できます。

本記事では、 Sequelize で collation を設定する方法を紹介します。


照合順序

ES6 前提

migration ファイルの `createTable()` メソッドの第 3 引数にオプションを指定 (`{ charset: 'utf8', collate: 'utf8_general_ci' }`)

```js
    await queryInterface.createTable('items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(50),
      },
      remarks: {
        type: Sequelize.TEXT,
      },
    }, {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
```

> [MySQLのcollationに関して - SDMILIEU](https://www.sd-milieu.net/posts/mysql-collation/)


注意: Model ではなく migration ファイルを編集すること

migration の結果が意図しない場合は設定ファイル (デフォルトでは config/config.json) で定義したテーブル情報のプロパティに `logging: true` を追加してみること