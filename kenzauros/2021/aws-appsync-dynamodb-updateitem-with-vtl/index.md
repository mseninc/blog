---
title: "[AWS AppSync] GraphQL で DynamoDB の UpdateItem をテンプレート (VTL) だけで組み立てる"
date: 2021-05-14
author: kenzauros
tags: [AWS, VTL, AppSync, DynamoDB]
---

**AWS AppSync の GraphQL で DynamoDB のアイテムを更新**する際、**リゾルバーで UpdateItem を実行**する必要があります。

GetItem の FilterExpression についてはユーティリティ関数の `$util.transform.toDynamoDBFilterExpression` ([リファレンス](https://docs.aws.amazon.com/ja_jp/appsync/latest/devguide/resolver-util-reference.html#transformation-helpers-in-utils-transform)) でうまい具合に変換してくれるのですが、残念ながら UpdateItem 向けのユーティリティ関数は用意されていません。

今回はテンプレート言語である **VTL (Apache Velocity Template Language)** でがんばって JSON を生成してみます。

## 前提条件

### 想定する読者

- AppSync や GraphQL の初心者の方
- データソースに DynamoDB を使用している方
- DynamoDB の扱い方はある程度わかっている方

### 公式情報

そもそも AppSync には頼れる情報源がほぼ公式情報しかないありませんので、このあたりを参考にします。

- **DynamoDB のリゾルバー**<br>[DynamoDB のリゾルバーのマッピングテンプレートリファレンス - AWS AppSync](https://docs.aws.amazon.com/ja_jp/appsync/latest/devguide/resolver-mapping-template-reference-dynamodb.html#aws-appsync-resolver-mapping-template-reference-dynamodb-updateitem)
- **マッピングテンプレートのプログラミング方法**<br>[リゾルバーのマッピングテンプレートプログラミングガイド - AWS AppSync](https://docs.aws.amazon.com/ja_jp/appsync/latest/devguide/resolver-mapping-template-reference-programming-guide.html)
- **DynamoDB 用のユーティリティ関数**<br>[$util.dynamodb の DynamoDB ヘルパー - リゾルバーのマッピングテンプレートのユーティリティリファレンス - AWS AppSync](https://docs.aws.amazon.com/ja_jp/appsync/latest/devguide/resolver-util-reference.html#dynamodb-helpers-in-util-dynamodb)

肝心の VTL については Apache の公式リファレンス (英語) しかないですが、がんばりましょう。

- **VTL**<br>[Apache Velocity Engine VTL Reference](https://velocity.apache.org/engine/1.7/vtl-reference.html)

### DynamoDB テーブル

こんな感じの **DynamoDB のテーブル**を想定します。 `key` 属性がパーティションキーです。

key | name | email
-- | -- | --
264c399b-aa38-46ae-919b-b99d049a26af | ほげ ほげ男 | hoge-hogeo@example.com
d6fca8ed-1339-492f-88f0-cba9a262c88d | 大阪 花子 | osaka-hanako@example.com

### GraphQL スキーマ定義

**GraphQL のスキーマ定義**は下記を想定します。

```js
type Item {
    key: ID!
    name: String
    email: String
}

input ItemInput {
    name: String
    email: String
}

type Mutation {
    updateItem(key: ID!, input: ItemInput): Item
}
```

### 更新したい内容

ここでテーブル内の **`ほげ ほげ男` さんの名前とメールアドレスを更新したい**とします。

GraphQL としてはミューテーション `updateItem` を呼び出す際に

- `key` に `264c399b-aa38-46ae-919b-b99d049a26af`
- `input` に下記のようなハッシュマップ
```json
{
    "name": "ほげ 太郎",
    "email": "hogetaro@example.com"
}
```

を渡せばいいわけです。

## リゾルバー

### テンプレートの出力結果から考える

さて、いよいよリゾルバーのお話です。

AppSync のマッピングテンプレートに使用する VTL はその名のとおりテンプレート言語ですので、最終的には **UpdateItem の JSON** が出力されるように記述しなければなりません。

要するに最終的に下記のような JSON を出力する必要があります。

```json
{
    "version" : "2018-05-29",
    "operation" : "UpdateItem",
    "key": {
        "key" : { "S": "264c399b-aa38-46ae-919b-b99d049a26af" }
    },
    "update" : {
        "expression" : "SET #name = :name, #email = :email",
        "expressionNames" : {
            "#name" : "name",
            "#email" : "email"
        },
        "expressionValues" : {
            ":name" : { "S" : "ほげ 太郎" },
            ":email" : { "S" : "hogetaro@example.com" }
        }
    }
}
```

はい、すでにややこしいですね。しかしこれは AppSync というより DynamoDB の仕様上 UpdateItem の表現がややこしいので仕方ありません。

UpdateItem の詳細についてはここでは割愛します。下記のリファレンスを参照してください。

- [UpdateItem - Amazon DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html#API_UpdateItem_Examples)

`expressionNames` は必ずしも定義する必要はありませんが、テーブルの属性名が DynamoDB の定義語のときにエラーになりますので、いっそすべて定義したほうがわかりやすいでしょう。

これぐらいの属性数であれば上記のようにベタ書きでもいけますが、属性が多い場合は修正も大変ですしバグのもとになりそうです。そこで VTL のループとユーティリティ関数を利用して、動的に生成します。

### マッピングテンプレート

今回のリクエストマッピングテンプレートの全体像です。

```js
#set($expression = "")
#set($expressionNames = {})
#set($expressionValues = {})

#foreach($key in $ctx.args.input.keySet())
    #if ($expression.length().equals(0))
    	#set($expression = "SET #$key = :$key")
    #else
    	#set($expression = "${expression}, #$key = :$key")
    #end
    $util.qr($expressionNames.put("#$key", $key))
    $util.qr($expressionValues.put(":$key", $ctx.args.input.get($key)))
#end

{
    "version" : "2018-05-29",
    "operation" : "UpdateItem",
    "key" : {
        "key": $util.dynamodb.toDynamoDBJson($ctx.args.key)
    },
    "update" : {
        "expression": "$expression",
        "expressionNames": $util.toJson($expressionNames),
        "expressionValues": $util.dynamodb.toMapValuesJson($expressionValues)
    }
}
```

後半に最終的に出力すべき UpdateItem の JSON が表れていますね。では順番に見ていきます。

#### 変数の準備

```
#set($expression = "")
#set($expressionNames = {})
#set($expressionValues = {})
```

それぞれ JSON の `update` の中に展開する `expression`, `expressionNames`, `expressionValues` を生成していくため、変数を初期化しています。

#### ループ処理

```js
#foreach($key in $ctx.args.input.keySet())
```

ItemInput で渡ってきたハッシュマップの内容をループ処理するため、キーの一覧を取得して foreach で回します。

JavaScript でいえば下記のようなイメージです。

```js
for (var $key of Object.keys($ctx.args.input))
```

このループ内で `expression`, `expressionNames`, `expressionValues` を生成します。

#### Expression の構築

まず UpdateExpression を `$expression` に生成します。最終的に `SET #name = :name, #email = :email` としたいわけです。

```
#if ($expression.length().equals(0))
    #set($expression = "SET #$key = :$key")
#else
    #set($expression = "${expression}, #$key = :$key")
#end
```

初回のみ `"SET #$key = :$key"` を代入し、2回目以降は `, #$key = :$key` を追加していくという流れです。

本当は JavaScript でいう map や join が使えればもう少しスマートに書けますが、 VTL では提供されていないようなので、この方法にしました。

#### ExpressionAttributeNames の構築

次に ExpressionAttributeNames を `$expressionNames` に構築していきます。こちらは最終的に下記のようになればよいので、キーに属性名に `#` をつけたもの、バリューにはそのまま属性名を設定します。

```json
{
    "#name" : "name",
    "#email" : "email"
}
```

空のマップに `put` でキー・バリューを追加していくだけです。

```
$util.qr($expressionNames.put("#$key", $key))
```

#### ExpressionAttributeValues の構築

次に ExpressionAttributeValues を `$expressionValues` に構築していきます。こちらは最終的に下記のようになればよいのですが、

```json
"expressionValues" : {
    ":name" : { "S" : "ほげ 太郎" },
    ":email" : { "S" : "hogetaro@example.com" }
}
```

DynamoDB の型付きの JSON 表現にはユーティリティ関数の `$util.dynamodb.toMapValuesJson` でまとめて変換できるため、キーにパラメーター表現（属性名に `:` をつけたもの）、バリューに生の値とする下記のようなマップにします。

```json
"expressionValues" : {
    ":name" : "ほげ 太郎",
    ":email" : "hogetaro@example.com"
}
```

Names と同様にマップに追加していくだけです。値自体は ItemInput のマップから `get` で取得します。

```
$util.qr($expressionValues.put(":$key", $ctx.args.input.get($key)))
```

#### JSON の出力

最後に最終型の JSON を出力します。

```js
{
    "version" : "2018-05-29",
    "operation" : "UpdateItem",
    "key" : {
        "key": $util.dynamodb.toDynamoDBJson($ctx.args.key)
    },
    "update" : {
        "expression": "$expression",
        "expressionNames": $util.toJson($expressionNames),
        "expressionValues": $util.dynamodb.toMapValuesJson($expressionValues)
    }
}
```

`key` 部分には `$util.dynamodb.toDynamoDBJson` で DynamoDB の型付き表現に変換します。

`expression` はすでに `"SET #name = :name, #email = :email"` という形式が入っていますが、そのまま展開すると下記のようになってしまいます。

```json
{
    "key": SET #name = :name, #email = :email
}
```

そのためダブルクオーテーションで括り、 `"$expression"` としています。これで下記のように展開されるはずです。

```json
{
    "key": "SET #name = :name, #email = :email"
}
```

`expressionNames` はそのまま JSON にすればよいので `$util.toJson` で変換します。

`expressionValues` は先述のとおり、 DynamoDB の型付き表現を含む JSON にする必要があるため、 `$util.dynamodb.toMapValuesJson` を使って変換します。

このあたりのユーティリティ関数は下記の公式リファレンスを参照してください。

- [DynamoDB のリゾルバーのマッピングテンプレートリファレンス - AWS AppSync](https://docs.aws.amazon.com/ja_jp/appsync/latest/devguide/resolver-mapping-template-reference-dynamodb.html#aws-appsync-resolver-mapping-template-reference-dynamodb-updateitem)

これで UpdateItem ができるはずです。エラーになった場合に原因を特定するのが非常に手間取りますが、...がんばりましょう。

## まとめ

AWS AppSync の GraphQL で DynamoDB のアイテムを更新するためにリゾルバーで UpdateItem の JSON を VTL で生成する方法を紹介しました。

複雑な変換処理であれば Lambda で書いたほうが早いかもしれませんが、せっかくなので VTL だけで書いて、シンプルな構成を維持したいところです。

もっとよい方法をご存知の方がいらっしゃればご教示いただけますと幸いです。