---
title: Laravel 5.3 Eloquent ORM 入門 1 (モデルの作成)
date: 2016-11-25
author: kenzauros
tags: [PHP, Laravel, Eloquent, Web]
---

PHP の Web フレームワーク **Laravel で ORM (Object-Relational Mapping) をつかさどるのが Eloquent** です。

これはなかなかできのよい ORM で、慣れれば大抵のことが直感的に実装できます。今回は **Laravel 5.3** における Eloquent の使い方を紹介します。

詳細な情報は [公式ページ Eloquent: Getting Started - Laravel](https://laravel.com/docs/5.3/eloquent) を参照してください。

## 概要

Eloquent を使う上で重要なファイル構成は下記の通りです。カッコ内はファイル名の標準的な規則です。

* `app/` 下のモデルファイル 
(先頭大文字で `単数形` 例. `Hoge`)
* `database/migrations` 下のマイグレーションファイル  
(すべて小文字で `yyyy_mm_dd_hhmmss_abcdefg`のような感じ)
* `database/seeds` 下のシードファイル  
(`複数形 + TableSeeder` 例. `HogesTableSeeder`)

ほとんどのケースでモデルファイルとマイグレーションファイルは必要だと思いますが、シーディング（初期データの投入）を行わない場合シードファイルは不要です。

今回はモデルファイルとマイグレーションファイルの作成までを行います。

## モデルとマイグレーションの作成

### artisan コマンドで生成

`artisan` コマンドでモデルのスケルトンが生成できます。

`-m` (`--migration`) オプションを付加しておくと、実行時点のタイムスタンプがついたマイグレーションファイルも生成してくれます。

このとき前述の通り **モデルは先頭大文字の単数形** にしておきましょう。

```php
php artisan make:model Hoge -m
```

これで下記のような `app/Hoge.php` が生成されるはずです。

```php
<?php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Hoge extends Model
{
}
```

基本的にはこれでモデルの作成は完了です。

**Laravel のモデルは特に属性などを追加する必要がなければ、このように空の状態で問題なく動作します。**

### モデルファイル

#### テーブル名

Eloquent の標準的な規則では、テーブル名はモデル名をスネークケースにして、複数形にしたものです。たとえば `RottenApple` モデルであれば、 `rotten_apples` がデフォルトのテーブル名になります。

もし、この規則がデータベース側のテーブル名とそぐわないようなら、 `$table` 変数を宣言すれば対応できます。

```php
protected $table = 't_rotten_apple';
```

#### タイムスタンプ列

もう1点、注意したいのは Eloquent のモデルは特に指定しなければ **`created_at` と `updated_at` という 2 つのタイムスタンプ属性が定義される** ということです。

つまり、データベースのテーブルにもこの2つのタイムスタンプ列が追加されます。もしこれが不要、あるいはすでにテーブルが存在する場合などは下記のように `$timestamps` に `false` を設定しておく必要があります。

```php
public $timestamps = false;
```

### マイグレーションファイル

この部分は長くなるので、次回ご紹介します。
