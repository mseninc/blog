---
title: Laravel 6.0 Collection 入門 その１
date: 2019-09-22
author: kiyoshin
tags: [その他]
---

Laravel には配列データを操作するためのラッパークラス `Illuminate\Support\Collection` が存在しています。
今回は、この **Collection** クラスに実装されている各種メソッドを紹介します。
数が多いので、複数回に分けていきます。

記載内容は、[コレクション 6.0 Laravel](https://readouble.com/laravel/6.0/ja/collections.html) をもとにしております。

メソッド名に `(Ver.6)` が記載しているものは、 **Laravel 6.0** で新たに追加されたものです。

## 環境
- Laravel 6.0.2
- PHP 7.3.9

## all

コレクションの配列表現を返します。
配列に変換するわけではなく、内部的に配列が存在しており、それを返しているようです。

```php
$all = collect([1, 2, 3])->all();

$this->assertEquals([1, 2, 3], $all);
```

## average

`avg` メソッドのエイリアスなので、省略します。

## avg

平均値を返します。

```php
$all = collect([1, 2, 3])->all();

$this->assertEquals([1, 2, 3], $all);
```

## chunk
## collapse
## combine
## concat
## contains
## containsStrict
## count
## countBy
## crossJoin
## dd
## diff
## diffAssoc
## diffKeys
## dump
## duplicates
## each
## eachSpread
## every
## except