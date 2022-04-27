---
title: Amazon DynamoDB で日時データを扱う方法
date: 
author: linkohta
tags: [Web, AWS]
description: 
---

link です。

AWS のサービス開発で DynamoDB を扱うことは多いと思います。

NoSQL な DynamoDB のデータの型は以下のようになっています。

>DynamoDB では、テーブル内の属性に対してさまざまなデータ型がサポートされています。データ型は次のように分類できます。
>
>- **スカラー型** – スカラー型は 1 つの値を表すことができます。スカラー型は、数値、文字列、バイナリ、ブール、および null です。
>- **ドキュメント型** – JSON ドキュメントで見られるように、入れ子の属性を持つ複雑な構造を表すことができます。ドキュメント型は、リストとマップです。
>- **セット型** – セット型は複数のスカラー値を表すことができます。セット型は、文字セット、数値セット、およびバイナリセットです。
>
>出典 : [命名ルールおよびデータ型 - Amazon DynamoDB](https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html)

上述の通り、 DynamoDB で扱える型に DateTime 型がありません。

今回は DynamoDB で日時データを扱う方法をご紹介します。

## データ形式

**ISO 8601 文字列**で保存すると日時データとして扱うことができます。

ISO 8601 とは、 ISO が定めた日付および時刻に関連するデータの国際規格です。

ISO 8601 で定められたフォーマットの文字列で保存することで日時データとして扱うことができるようになります。

フォーマットの表現はいくつか存在し、以下のようになっています。

```title=2022年4月25日12時12分12秒をISO 8601 文字列で表現
2022-04-25 12:12:12
2022-04-25T12:12:12Z
20220425T121212Z
```

## 具体例

上記のデータ形式を実際に DynamoDB に登録して、日時が昇順降順で表示されるかを確認してみましょう。

## 参考サイト

- [命名ルールおよびデータ型 - Amazon DynamoDB](https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html)
- [ISO 8601 - Wikipedia](https://en.wikipedia.org/wiki/ISO_8601#General_principles)

## まとめ

DynamoDB には DateTime などの日付型が存在しないため、最初は戸惑う方も多いと思います。

NoSQL の DB は処理速度が速いというメリットが存在するので、 DB ごとの特徴を理解してうまく活用していきたいと思います。

それではまた、別の記事でお会いしましょう。