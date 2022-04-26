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

方法は簡単です。

日時データを **ISO 8601 文字列**で保存することです。

ISO 8601 とは、 ISO が定めた日付および時刻に関連するデータの国際規格です。

ISO 8601 で定められたフォーマットの文字列で保存することで日時データとして扱うことができるようになります。

## なぜ文字列で日付を扱えるのか

## 参考サイト

- [命名ルールおよびデータ型 - Amazon DynamoDB](https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html)
- [ISO 8601 - Wikipedia](https://en.wikipedia.org/wiki/ISO_8601#General_principles)

## まとめ