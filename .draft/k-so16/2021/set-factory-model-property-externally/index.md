---
title: "[Laravel] Factory で外部から値を受け取る方法"
date: 2021-09-06
author: k-so16
tags: [Laravel, Web]
---

こんにちは。最近、 k-so16 です。

Laravel でダミーデータを大量に作成する際に、 Factory を利用することで、作成したい数だけダミーデータを作成できます。

多くの場合、 Faker を使ってダミーデータを作成しますが、何番目のデータなどを登録したい場合は、外部から値を設定する必要があります。

本記事では、 Factory で外部から値を受け取ってデータとして登録する方法を紹介します。

本記事で想定する読者層は以下の通りです。

- Laravel の基本的な知識を有している
- Laravel のシーディングについて基本的な知識を有している

## Factory の使い方

### Faker について

## Factory でモデルの属性を上書きする方法

`create()` メソッドの引数に、モデルのプロパティ名をキーとする連想配列を渡すと、キーに対応する値がプロパティの値として上書きされます。

```php
public function run()
{
    for ($i = 0; $i < 100; $i++) {
        Product::factory()->create(['code' => $this->generateProductCode($i)]);
    }
}
```

本記事を執筆する上で以下の記事を参考にしました。

> https://laravel.com/docs/8.x/database-testing#persisting-models

## まとめ

本記事のまとめは以下の通りです。

以上、 k-so16 でした。